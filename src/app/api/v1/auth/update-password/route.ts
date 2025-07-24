import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import { TokenUtils, TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");

    const { role, email } = await TokenUtils.verifyToken(authHeader, "access");

    await connectDB();

    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user with new hashed password
    const user = await UserModel.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = {
      user_id: user._id,
      email: user.email,
      role: user.role,
      message: "Password updated successfully",
      password_updated: password,
    };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);

    if (error instanceof TokenUtilsError) {
      return NextResponse.json(
        { error: (error as TokenUtilsError).message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
