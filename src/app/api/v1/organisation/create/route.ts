import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import OrganisationProfileModel from "@models/organisation.profile.model";
import UserModel from "@models/user.model";
import "@models/user.model"; // Import User model to register it with Mongoose
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { sendGmail } from "@utils/gmail.utils";
import { generateVerificationEmailTemplate } from "@utils/email-templates.utils";
import TokenUtils from "@utils/token.utils";
import { AppConfig } from "../../../../../config/app.config";
import { handleApiError } from "@utils/errorHandler";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, address } = body;

    // Validate required fields
    if (!name || !email || !address) {
      return NextResponse.json(
        { error: "Name, email, and address are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
    ]);

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    let user;
    let tempPassword = null;

    if (existingUser) {
      // Check if user already has an organisation profile
      const existingOrgProfile = await OrganisationProfileModel.findOne({
        user_id: existingUser._id,
      });

      if (existingOrgProfile) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      // Use existing user
      user = existingUser;
    } else {
      const hashedPassword = await PasswordUtils.hashPassword("password");

      // Create user
      const newUser = new UserModel({
        role: "organisation", // Assuming organisation is a valid role
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      user = await newUser.save();
    }

    // Create organisation profile
    const newOrganisationProfile = new OrganisationProfileModel({
      user_id: user._id,
      email: email.toLowerCase(),
      name: name.trim(),
      address: address.trim(),
      status: "pending",
      joined_on: null, // Will be set when approved
    });

    const savedProfile = await newOrganisationProfile.save();

    // Send verification email to the newly created organisation
    try {
      const verificationToken = TokenUtils.generateToken(
        {
          role: "organisation",
          email: user.email,
        },
        "activation"
      );

      const emailTemplate = generateVerificationEmailTemplate(
        {
          email: user.email,
          role: "organisation",
          action: "organisation_creation",
          organisationName: savedProfile.name,
          adminName: "Administrator", // You can get this from the admin's profile if needed
        },
        verificationToken
      );

      await sendGmail({
        fromEmail: AppConfig.GMAIL.EMAIL_ID,
        toEmail: user.email,
        subject: emailTemplate.subject,
        textContent: emailTemplate.textContent,
        htmlContent: emailTemplate.htmlContent,
      });

      console.log(
        `Verification email sent successfully to ${user.email} for organisation creation`
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the entire request if email fails, just log it
    }

    // Return success response
    return NextResponse.json(
      {
        message:
          "Organisation created successfully and verification email sent",
        organisation: {
          user_id: user._id,
          name: savedProfile.name,
          status: savedProfile.status,
          email: user.email,
          address: savedProfile.address,
        },
        verificationEmailSent: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
