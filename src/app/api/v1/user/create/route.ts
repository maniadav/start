import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import "@models/user.model";
import { ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { ModelUtils, Role } from "@utils/model.utils";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, address, role, password } = body;

    // Validate required fields
    if (!name || !email || !address || !role || !password) {
      return NextResponse.json(
        { error: "Name, email, address, role, and password are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const bypassKEY = authHeader?.split("-")[1];
    if (bypassKEY != "bypass") {
      return NextResponse.json(
        { error: "Bypass key is not valid for this operation" },
        { status: 403 }
      );
    }

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    let user;

    if (existingUser) {
      // Check if user already has a profile for the requested role
      const existingProfile = await ModelUtils.findExistingProfile(
        existingUser._id,
        role as Role
      );

      if (existingProfile) {
        return NextResponse.json(
          { error: "User profile with this email already exists" },
          { status: 409 }
        );
      }

      // Use existing user
      user = existingUser;
    } else {
      const hashedPassword = await PasswordUtils.hashPassword(password);

      // Create user
      const newUser = new UserModel({
        role: role,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      user = await newUser.save();
    }

    // Create profile based on role
    const savedProfile = await ModelUtils.createProfile(
      {
        user_id: user._id,
        email: email.toLowerCase(),
        name: name.trim(),
        address: address.trim(),
      },
      role as Role
    );

    return NextResponse.json(
      {
        message: "Profile created successfully",
        profile: {
          user_id: user._id,
          name: savedProfile.name,
          status: savedProfile.status,
          email: user.email,
          address: savedProfile.address,
        },
        tempPassword: password,
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
