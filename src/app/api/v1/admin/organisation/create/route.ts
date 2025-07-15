import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { OrganisationProfile } from "@models/OrganisationProfile";
import { User } from "@models/User";
import "@models/User"; // Import User model to register it with Mongoose
import bcrypt from "bcryptjs";

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

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    let user;
    let tempPassword = null;

    if (existingUser) {
      // Check if user already has an organisation profile
      const existingOrgProfile = await OrganisationProfile.findOne({
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
      // Generate a temporary password (you might want to send this via email)
      tempPassword = "Password@123";
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      // Create user
      const newUser = new User({
        role: "organisation", // Assuming organisation is a valid role
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      user = await newUser.save();
    }

    // Create organisation profile
    const newOrganisationProfile = new OrganisationProfile({
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

    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create organisation" },
      { status: 500 }
    );
  }
}
