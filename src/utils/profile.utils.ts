import UserModel from "@models/user.model";
import { TokenUtils } from "./token.utils";

export class ProfileUtilsError extends Error {
  constructor(message = "Profile verification error") {
    super(message);
    this.name = "ProfileUtilsError";
  }
}

export class ProfileUtils {
  static async verifyProfile(
    tokenHeader: string,
    validRoles: Array<"admin" | "organisation">
  ) {
    const token = tokenHeader?.split(" ")[1] || "";

    try {
      const { role, email } = await TokenUtils.verifyToken(token, "access");

      if (!role || !email) {
        throw new ProfileUtilsError("Token missing role or email");
      }

      console.log("[PROFILE-UTILS] Verifying profile for role:", role);

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new ProfileUtilsError("User not found");
      }

      console.log("[PROFILE-UTILS] Found user", validRoles.includes(user.role));

      if (!validRoles.includes(user.role)) {
        throw new ProfileUtilsError("User does not have a valid role");
      }

      console.log("[PROFILE-UTILS] User has a valid role:", user.role);

      return { role: user.role, verified: true, email, user_id: user._id };
    } catch (err) {
      throw new ProfileUtilsError(
        "Something went wrong during profile verification"
      );
    }
  }
}
