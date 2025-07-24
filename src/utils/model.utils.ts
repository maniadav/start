import OrganisationProfileModel from "@models/organisation.profile.model";
import AdminProfileModel from "@models/admin.profle.model";
import ObserverProfileModel from "@models/observer.profile.model";

export type Role = "organisation" | "observer" | "admin";

export class ModelUtils {
  /**
   * Check if a profile exists for a user based on role
   * @param userId User ID to check
   * @param role User role
   * @returns The existing profile or null
   */
  static async findExistingProfile(userId: string, role: Role) {
    switch (role) {
      case "organisation":
        return await OrganisationProfileModel.findOne({ user_id: userId });
      case "observer":
        return await ObserverProfileModel.findOne({ user_id: userId });
      case "admin":
        return await AdminProfileModel.findOne({ user_id: userId });
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  }

  /**
   * Create a profile for a user based on role
   * @param userData User data for profile creation
   * @param role User role
   * @returns The created profile
   */
  static async createProfile(
    userData: {
      user_id: string;
      email: string;
      name: string;
      address: string;
    },
    role: Role
  ) {
    const profileData = {
      user_id: userData.user_id,
      email: userData.email.toLowerCase(),
      name: userData.name.trim(),
      address: userData.address.trim(),
      status: "pending",
      joined_on: null, // Will be set when approved
    };

    switch (role) {
      case "organisation": {
        const newProfile = new OrganisationProfileModel(profileData);
        return await newProfile.save();
      }
      case "observer": {
        const newProfile = new ObserverProfileModel(profileData);
        return await newProfile.save();
      }
      case "admin": {
        const newProfile = new AdminProfileModel(profileData);
        return await newProfile.save();
      }
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  }
}
