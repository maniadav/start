import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import TokenModel from "@models/token.model";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError, createSuccessResponse } from "@utils/errorHandler";
import OrganisationProfileModel from "@models/organisation.profile.model";
import ObserverProfileModel from "@models/observer.profile.model";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    await connectDB();

    // Find and validate the verification token
    const tokenDoc = await TokenModel.findOne({
      token,
      revoked: false,
      type: "activation",
    });

    if (!tokenDoc) {
      return NextResponse.json(
        { error: "invalid token" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Check if token has expired
    if (tokenDoc.expiresAt && new Date() > tokenDoc.expiresAt) {
      // Mark token as revoked
      await TokenModel.findByIdAndUpdate(tokenDoc._id, { revoked: true });
      return NextResponse.json(
        { error: "Token has expired" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Verify the token with JWT to get user details
    const { email, role } = await TokenUtils.verifyToken(token, "activation");

    if (!email) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Hash the new password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user password
    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        status: "active", // Also activate the user account
      },
      {
        new: true,
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Update user profile status based on role
    const user_profile =
      role === "observer"
        ? await ObserverProfileModel.findOneAndUpdate(
            { email },
            {
              status: "active",
              joined_on: new Date(),
            },
            {
              new: true,
            }
          )
        : await OrganisationProfileModel.findOneAndUpdate(
            { email },
            {
              status: "active",
              joined_on: new Date(),
            },
            {
              new: true,
            }
          );

    if (!user_profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Revoke the used token by marking it as revoked
    await TokenModel.findByIdAndUpdate(tokenDoc._id, {
      revoked: true,
    });

    const data = {
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return createSuccessResponse(
      data,
      HttpStatusCode.Ok,
      "Account verified and password set successfully"
    );
  } catch (error) {
    // Handle TokenUtilsError specifically
    if (error instanceof TokenUtilsError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return handleApiError(error);
  }
}
