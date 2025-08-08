import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import TokenModel from "@models/token.model";
import UserModel from "@models/user.model";
import AdminProfileModel from "@models/admin.profle.model";
import OrganisationProfileModel from "@models/organisation.profile.model";
import ObserverProfileModel from "@models/observer.profile.model";
import { PasswordUtils } from "@utils/password.utils";
import TokenUtils from "@utils/token.utils";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Connect to DB and upsert refresh token (rotate)
    await connectDB();

    const user = await UserModel.findOne({ email: email });
    let isPasswordValid = false;

    if (user) {
      isPasswordValid = await PasswordUtils.verifyPassword(
        password,
        user.password
      );
    }

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user_id = user._id.toString();
    const role = user.role;
    // Generate access and refresh tokens
    const accessToken = TokenUtils.generateToken(
      { role, email: user.email },
      "access"
    );
    const refreshToken = TokenUtils.generateToken(
      { role, email: user.email },
      "refresh"
    );

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await TokenModel.findOneAndUpdate(
      { userId: user_id },
      {
        userId: user_id,
        token: refreshToken,
        type: "refresh",
        expiresAt,
        revoked: false,
      },
      { upsert: true, new: true }
    );

    // Get user profile based on role
    let profile = null;

    switch (user.role) {
      case "admin":
        profile = await AdminProfileModel.findOne({ user_id: user._id }).lean();
        break;
      case "organisation":
        profile = await OrganisationProfileModel.findOne({
          user_id: user._id,
        }).lean();
        break;
      case "observer":
        profile = await ObserverProfileModel.findOne({ user_id: user._id })
          .populate("organisation_id")
          .lean();
        break;
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const data = {
      user_id: user._id,
      email: user.email,
      role: user.role,
      profile,
      token: accessToken,
      rtoken: refreshToken,
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
