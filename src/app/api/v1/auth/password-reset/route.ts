import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import TokenModel from "@models/token.model";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    await connectDB();

    // Find and validate the reset/activation token
    const tokenDoc = await TokenModel.findOne({
      token,
      revoked: false,
      expiresAt: { $gt: new Date() },
      type: { $in: ["reset", "activation"] },
    });

    if (!tokenDoc) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Verify the token with JWT to get user details
    const { email } = await TokenUtils.verifyToken(token, tokenDoc.type);

    // Hash the new password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user with new hashed password and activate if needed
    // Update user and handle activation if needed
    const updateData: any = {
      password: hashedPassword,
    };

    if (tokenDoc.type === "activation") {
      updateData.isActive = true;
    }

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
      message:
        tokenDoc.type === "activation"
          ? "Account activated and password set successfully"
          : "Password reset successfully",
      isActive: user.isActive,
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in password reset:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 }
    );
  }
}
