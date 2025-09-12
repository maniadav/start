import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import TokenModel from "@models/token.model";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    await connectDB();

    // Find and validate the verification token
    const tokenDoc = await TokenModel.findOne({
      token,
      revoked: false,
      expiresAt: { $gt: new Date() },
      type: { $in: ["activation", "verification"] },
    });

    if (!tokenDoc) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Verify the token with JWT to get user details
    const { email } = await TokenUtils.verifyToken(token, tokenDoc.type);

    // Hash the new password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user with new hashed password and activate account
    const updateData = {
      password: hashedPassword,
      isActive: true,
    };

    const user = await UserModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Revoke the used token
    await TokenModel.findByIdAndUpdate(tokenDoc._id, {
      revoked: true,
    });

    const data = {
      email: user.email,
      message: "Account verified and password set successfully",
      isActive: user.isActive,
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
