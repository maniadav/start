import UserModel from "@models/user.model";
import { TokenUtils } from "./token.utils";

// Environment-aware logger function
const logger = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[PROFILE-UTILS] ${message}`, data || "");
  }
};

export class ProfileUtilsError extends Error {
  constructor(message = "Profile verification error") {
    super(message);
    this.name = "ProfileUtilsError";
  }
}

export class ProfileUtils {
  static async verifyProfile(
    tokenHeader: string | null,
    validRoles: Array<"admin" | "organisation" | "observer">
  ) {
    try {
      const { role, email } = await TokenUtils.verifyToken(
        tokenHeader,
        "access"
      );

      if (!role || !email) {
        throw new ProfileUtilsError("Token missing role or email");
      }

      logger(`Verifying profile for role: ${role}`);

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new ProfileUtilsError("User not found");
      }

      logger(`Found user with role: ${user.role}`, {
        hasValidRole: validRoles.includes(user.role),
      });

      if (!validRoles.includes(user.role)) {
        throw new ProfileUtilsError("User does not have a valid role");
      }

      logger(`Authentication successful for user with role: ${user.role}`);

      return { role: user.role, email, user_id: user._id };
    } catch (err) {
      logger(
        `Authentication error`,
        err instanceof Error ? err.message : "Unknown error"
      );
      throw new ProfileUtilsError(
        err instanceof Error && process.env.NODE_ENV !== "production"
          ? `Profile verification failed: ${err.message}`
          : "Something went wrong during profile verification"
      );
    }
  }
}
