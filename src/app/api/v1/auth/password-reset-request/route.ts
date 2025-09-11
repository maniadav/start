import { NextResponse } from "next/server";
import UserModel from "@models/user.model";
import TokenUtils from "@utils/token.utils";
import TempTokenModel from "@models/temp-token.model";
import { BASE_URL } from "@constants/config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";
import { sendGmail } from "@utils/gmail.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

interface RequestBody {
  email?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email }: RequestBody = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Please provide an email address." },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If a matching account was found, a password reset link would have been sent to your email address.",
        },
        { status: 200 }
      );
    }

    const existingToken = await TempTokenModel.findOne({ email });
    const currentToken = existingToken?.token;
    let token: string;

    if (currentToken) {
      const { email } = await TokenUtils.verifyToken(currentToken, "reset");
      if (email) {
        // Use the existing, valid token.
        token = currentToken;
      } else {
        // Create a new token and update the existing record.
        token = TokenUtils.generateToken(
          {
            email: email,
            role: user.role,
          },
          "reset"
        );
        await TempTokenModel.findOneAndUpdate(
          { email },
          { token, createdAt: new Date() },
          { new: true, upsert: true } // `upsert` creates the doc if it doesn't exist
        );
      }
    } else {
      // No token exists, so create a new one.
      token = TokenUtils.generateToken(
        { email: user.email, role: user.role },
        "reset"
      );
      await TempTokenModel.create({
        email,
        token,
      });
    }

    const resetLink = `${BASE_URL}${
      PAGE_ROUTES.AUTH.RESET_PASSWORD.path
    }?token=${encodeURIComponent(token)}`;

    const emailHtmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">RockOakSoccer Password Reset</h2>
        <p>A password reset for your account was requested. This link is valid for <strong>2 hours</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>To reset your password, please click the link below:</p>
        <p>
          <a 
            href="${resetLink}" 
            target="_blank" 
            style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;"
          >
            Reset Your Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <hr>
        <p style="font-size: 0.9em; color: #555;">
          <strong>Username:</strong> ${user.username}<br>
          <strong>Email:</strong> ${user.email}
        </p>
        <p style="font-size: 0.8em; color: #777;">This is an automated message from RockOakSoccer.</p>
      </div>
    `;

    const res = await sendGmail({
      toEmail: email,
      fromEmail: "manish.yadav.elit@gmail.com",
      subject: "RockOakSoccer: Password Reset Request",
      htmlContent: emailHtmlContent,
    });

    return NextResponse.json({
      message: "We have sent a password reset link to your email address.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
