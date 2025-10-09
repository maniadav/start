import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import OrganisationProfileModel from "@models/organisation.profile.model";
import UserModel from "@models/user.model";
import "@models/user.model"; // Import User model to register it with Mongoose
import { ProfileUtils } from "@utils/profile.utils";
import { PasswordUtils } from "@utils/password.utils";
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
        status: "inactive",
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
      joined_on: null,
    });

    const savedProfile = await newOrganisationProfile.save();

    // Send verification email to the newly created organisation
    const emailResult = await createAndSendVerificationEmail({
      user: {
        _id: user._id,
        email: user.email,
      },
      profile: {
        name: savedProfile.name,
        role: "organisation",
      },
    });

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
        verificationEmailSent: emailResult.verificationEmailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
