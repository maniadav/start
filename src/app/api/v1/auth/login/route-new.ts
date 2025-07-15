import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  User,
  AdminProfile,
  ObserverProfile,
  OrganisationProfile,
  connectDB,
} from "@models/index";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get user profile based on role
    let profile = null;

    switch (user.role) {
      case "admin":
        profile = await AdminProfile.findOne({ user_id: user._id }).lean();
        break;
      case "organisation":
        profile = await OrganisationProfile.findOne({
          user_id: user._id,
        }).lean();
        break;
      case "observer":
        profile = await ObserverProfile.findOne({ user_id: user._id })
          .populate("organisation_id")
          .lean();
        break;
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    const responseData = {
      userId: user._id,
      email: user.email,
      role: user.role,
      profile,
      token,
    };

    return NextResponse.json({ data: responseData }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
