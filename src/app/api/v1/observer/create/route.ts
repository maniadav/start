import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import { ProfileUtils } from "@utils/profile.utils";
import { PasswordUtils } from "@utils/password.utils";
import ObserverProfileModel from "@models/observer.profile.model";
import OrganisationProfileModel from "@models/organisation.profile.model";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { createAndSendVerificationEmail } from "@utils/backend.utils";
import { handleApiError } from "@utils/errorHandler";

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
        status: "inactive",
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
      const organisationProfile = await OrganisationProfileModel.findOne({
        user_id,
      });
      if (organisationProfile) {
        organisationName = organisationProfile.name;
      }
    } catch (error) {
      console.error("Failed to fetch organisation details:", error);
    }

    // Send verification email to the newly created observer
    const emailResult = await createAndSendVerificationEmail({
      user: {
        _id: user._id,
        email: user.email,
      },
      profile: {
        name: savedProfile.name,
        role: "observer",
      },
      organisationName,
    });

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
        verificationEmailSent: emailResult.verificationEmailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
