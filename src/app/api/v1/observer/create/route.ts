import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import ObserverProfileModel from "@models/observer.profile.model";
import OrganisationProfileModel from "@models/organisation.profile.model";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, address, organisation_id, password } = body;

    // Validate required fields
    if (!name || !email || !address || !password) {
      return NextResponse.json(
        { error: "Name, email, address, and password are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
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
      const hashedPassword = await PasswordUtils.hashPassword(password);

      // Create user
      const newUser = new UserModel({
        role: "observer",
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      user = await newUser.save();
    }

    if (!user_id) {
      const org = await OrganisationProfileModel.findOne({
        user_id: organisation_id,
      });
      if (!org) {
        return NextResponse.json(
          { error: "Organisation not found" },
          { status: 404 }
        );
      }
    }
    // Create observer profile
    const newObserverProfile = new ObserverProfileModel({
      user_id: user._id,
      email: email.toLowerCase(),
      name: name.trim(),
      address: address.trim(),
      status: "pending",
      joined_on: null, // Will be set when approved
      organisation_id: organisation_id || user_id, // Assuming organisation_id is the same as user_id
    });

    const savedProfile = await newObserverProfile.save();

    // Return success response with temporary password (in production, send via email)
    return NextResponse.json(
      {
        message: "Observer created successfully",
        observer: {
          user_id: user._id,
          name: savedProfile.name,
          status: savedProfile.status,
          email: user.email,
          address: savedProfile.address,
          organisation_id: organisation_id || user_id,
        },
        tempPassword: password,
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
      { error: "Failed to create organisation" },
      { status: 500 }
    );
  }
}
