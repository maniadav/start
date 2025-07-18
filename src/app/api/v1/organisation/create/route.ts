import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import OrganisationProfileModel from "@models/organisation.profile.model";
import UserModel from "@models/user.model";
import "@models/user.model"; // Import User model to register it with Mongoose
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, address } = body;

    // Validate required fields
    if (!name || !email || !address) {
      return NextResponse.json(
        { error: "Name, email, and address are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { verified } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
    ]);

    if (!verified) {
      return NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 403 }
      );
    }

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
      const hashedPassword = PasswordUtils.hashPassword("password");

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

    // Return success response with temporary password (in production, send via email)
    return NextResponse.json(
      {
        message: "Organisation created successfully",
        organisation: {
          user_id: user._id,
          name: savedProfile.name,
          status: savedProfile.status,
          email: user.email,
          address: savedProfile.address,
        },
        tempPassword: tempPassword, // Remove this in production and send via email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating organisation:", error);

    if (error instanceof TokenUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to create organisation" },
      { status: 500 }
    );
  }
}
