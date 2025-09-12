import { NextRequest, NextResponse } from "next/server";
import { sendGmail } from "../../../../../utils/gmail.utils";
import TokenUtils from "../../../../../utils/token.utils";
import { AppConfig } from "../../../../../config/app.config";
import { ROLE } from "../../../../../constants/role.constant";
import {
  VerificationEmailRequest,
  generateVerificationEmailTemplate,
} from "../../../../../utils/email-templates.utils";
import { handleApiError } from "@utils/errorHandler";

/**
 * POST /api/v1/auth/send-verification-mail
 * Send verification email to user
 */
export async function POST(request: NextRequest) {
  try {
    const body: VerificationEmailRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.role) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: email, role, and action are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = Object.values(ROLE);
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = TokenUtils.generateToken(
      {
        role: body.role,
        email: body.email,
      },
      "activation"
    );

    // Generate email template using utility function
    const emailTemplate = generateVerificationEmailTemplate(
      body,
      verificationToken
    );

    // Send verification email
    await sendGmail({
      fromEmail: AppConfig.GMAIL.EMAIL_ID,
      toEmail: body.email,
      subject: emailTemplate.subject,
      textContent: emailTemplate.textContent,
      htmlContent: emailTemplate.htmlContent,
    });

    console.log(
      `Verification email sent successfully to ${body.email} for ${body.role}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent successfully",
        data: {
          email: body.email,
          role: body.role,
          tokenExpiry: "24 hours",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/v1/auth/send-verification-mail
 * Health check for verification email service
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Verification email service is running",
      endpoints: {
        POST: "Send verification email",
        GET: "Health check",
      },
    },
    { status: 200 }
  );
}
