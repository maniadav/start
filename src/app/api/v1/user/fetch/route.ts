import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import ObserverProfileModel from "@models/observer.profile.model";
import OrganisationProfileModel from "@models/organisation.profile.model";
import { ModelUtils, Role } from "@utils/model.utils";
import { handleApiError } from "@utils/errorHandler";

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { email, role } = await TokenUtils.verifyToken(authHeader, "access");

    console.log("Retrieved email:", email);

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userProfile = await ModelUtils.findExistingProfile(
      existingUser._id,
      role as Role
    );

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Profile retrieved successfully",
        userProfile,
        email: existingUser.email,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
