import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import ObserverProfileModel from "@models/observer.profile.model";
import OrganisationProfileModel from "@models/organisation.profile.model";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { sendGmail } from "@utils/gmail.utils";
import { generateVerificationEmailTemplate } from "@utils/email-templates.utils";
import TokenUtils from "@utils/token.utils";
import { AppConfig } from "../../../../../config/app.config";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, address } = body;

    // Validate required fields
    if (!name || !email || !address) {
      return NextResponse.json(
        { error: "Name, email, address, and password are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "organisation",
    ]);

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    let user;

    if (existingUser) {
      // Check if user already has an organisation profile
      const existingOrgProfile = await ObserverProfileModel.findOne({
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
        role: "observer",
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      user = await newUser.save();
    }
    // Create observer profile
    const newObserverProfile = new ObserverProfileModel({
      user_id: user._id,
      email: email.toLowerCase(),
      name: name.trim(),
      address: address.trim(),
      status: "pending",
      joined_on: null,
      organisation_id: user_id, // Assuming organisation_id is the same as user_id
    });

    const savedProfile = await newObserverProfile.save();

    // Get organisation details for the email
    let organisationName = "Organisation";
    try {
      const organisationProfile = await OrganisationProfileModel.findOne({ user_id });
      if (organisationProfile) {
        organisationName = organisationProfile.name;
      }
    } catch (error) {
      console.error("Failed to fetch organisation details:", error);
    }

    // Send verification email to the newly created observer
    try {
      const verificationToken = TokenUtils.generateToken(
        { 
          role: "observer", 
          email: user.email 
        },
        "activation"
      );

      const emailTemplate = generateVerificationEmailTemplate(
        {
          email: user.email,
          role: "observer",
          action: "observer_creation",
          organisationName: organisationName,
          observerName: savedProfile.name
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

      console.log(`Verification email sent successfully to ${user.email} for observer creation`);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the entire request if email fails, just log it
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Observer created successfully and verification email sent",
        observer: {
          user_id: user._id,
          name: savedProfile.name,
          status: savedProfile.status,
          email: user.email,
          address: savedProfile.address,
          organisation_id: user_id,
        },
        verificationEmailSent: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating observer:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to create observer" },
      { status: 500 }
    );
  }
}
