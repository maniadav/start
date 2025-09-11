import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import TokenModel from "@models/token.model";
import UserModel from "@models/user.model";
import AdminProfileModel from "@models/admin.profle.model";
import OrganisationProfileModel from "@models/organisation.profile.model";
import ObserverProfileModel from "@models/observer.profile.model";
import { PasswordUtils } from "@utils/password.utils";
import TokenUtils from "@utils/token.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

export async function POST(req: Request) {
  try {
    // Parse request body safely
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const { email, password } = body;

    // Improved validation
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Connect to DB
    await connectDB();

    // Use case insensitive email search
    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    let isPasswordValid = false;

    if (user) {
      isPasswordValid = await PasswordUtils.verifyPassword(
        password,
        user.password
      );
    }

    // Don't reveal whether the email exists or password is wrong
    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Check if account is active
    if (user.status === "inactive") {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
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

    await TokenModel.updateMany(
      { userId: user_id, type: "refresh", revoked: false },
      { revoked: true }
    );

    await TokenModel.create({
      userId: user_id,
      token: refreshToken,
      type: "refresh",
      expiresAt,
      revoked: false,
    });

    // Get user profile based on role
    let profile = null;

    switch (user.role) {
      case "admin":
        profile = await AdminProfileModel.findOne({ user_id: user._id });
        break;
      case "organisation":
        profile = await OrganisationProfileModel.findOne({
          user_id: user._id,
        });
        break;
      case "observer":
        profile = await ObserverProfileModel.findOne({
          user_id: user._id,
        }).populate("organisation_id");
        break;
      default:
        return NextResponse.json(
          { error: "Invalid user role" },
          { status: HttpStatusCode.BadRequest }
        );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update last login time
    await UserModel.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    const profileData = {
      name: profile.name || null,
      organisationId: profile?.organisation_id || null,
      address: profile.address || null,
      permission: profile.permission || null,
      status: profile.status || null,
      joinedOn: profile.joined_on || null,
      updatedOn: profile.updated_on || null,
    };

    const data = {
      userId: user._id,
      email: user.email,
      role: user.role,
      profile: profileData,
      token: accessToken,
      rtoken: refreshToken,
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
