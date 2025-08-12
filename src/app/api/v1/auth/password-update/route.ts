import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { ValidatorUtils } from "@helper/validator";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(req: Request) {
  try {
    const { oldPassword, password } = await req.json();
    if (!oldPassword || !password) {
      return NextResponse.json(
        { error: "Both old password and new password are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const validatorMessage = ValidatorUtils.validatePassword(password);

    if (validatorMessage) {
      return NextResponse.json(
        { error: validatorMessage },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = req.headers.get("authorization");

    const { email } = await TokenUtils.verifyToken(authHeader, "access");

    await connectDB();

    // First, get the user to verify old password
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify old password
    const isOldPasswordValid = await PasswordUtils.verifyPassword(
      oldPassword,
      user.password
    );

    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: "Invalid old password" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user with new hashed password
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    const data = {
      user_id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      message: "Password updated successfully",
    };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
