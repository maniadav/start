/**
 * Example Auth Flow Implementation
 *
 * This demonstrates how the auth flow works similar to your backend SQL queries:
 * 1. Query users table by email to get basic user info and role
 * 2. Based on role, query the respective profile table
 * 3. Return combined user data with profile information
 */

import type {
  User,
  UserWithProfile,
  AdminProfile,
  OrganisationProfile,
  ObserverProfile,
} from "../../types/management.types";
import { STORAGE_KEYS } from "./auth";

/**
 * Step 1: Query users table - equivalent to:
 * SELECT id, email, role FROM users WHERE email = ?;
 */
export function getUserByEmail(email: string): User | null {
  if (typeof window === "undefined") return null;

  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  const userList: User[] = users ? JSON.parse(users) : [];

  // Simulate SQL query: SELECT id, email, role FROM users WHERE email = ?
  return userList.find((user) => user.email === email) || null;
}

/**
 * Step 2a: Query admin profiles - equivalent to:
 * SELECT * FROM admin_profiles WHERE user_id = ?;
 */
export function getAdminProfileByUserId(userId: string): AdminProfile | null {
  if (typeof window === "undefined") return null;

  const profiles = localStorage.getItem(STORAGE_KEYS.ADMIN_PROFILES);
  const adminProfiles: AdminProfile[] = profiles ? JSON.parse(profiles) : [];

  return adminProfiles.find((profile) => profile.userId === userId) || null;
}

/**
 * Step 2b: Query organization profiles - equivalent to:
 * SELECT * FROM organization_profiles WHERE user_id = ?;
 */
export function getOrganizationProfileByUserId(
  userId: string
): OrganisationProfile | null {
  if (typeof window === "undefined") return null;

  const profiles = localStorage.getItem(STORAGE_KEYS.ORGANISATION_PROFILES);
  const orgProfiles: OrganisationProfile[] = profiles
    ? JSON.parse(profiles)
    : [];

  return orgProfiles.find((profile) => profile.userId === userId) || null;
}

/**
 * Step 2c: Query observer profiles - equivalent to:
 * SELECT * FROM observer_profiles WHERE user_id = ?;
 */
export function getObserverProfileByUserId(
  userId: string
): ObserverProfile | null {
  if (typeof window === "undefined") return null;

  const profiles = localStorage.getItem(STORAGE_KEYS.OBSERVER_PROFILES);
  const obsProfiles: ObserverProfile[] = profiles ? JSON.parse(profiles) : [];

  return obsProfiles.find((profile) => profile.userId === userId) || null;
}

/**
 * Complete Auth Flow - combines all steps
 */
export function authenticateUser(
  email: string,
  password: string
): UserWithProfile | null {
  // Step 1: Query users table
  const user = getUserByEmail(email);

  if (!user || password !== "password") {
    // In real app, verify hashed password
    return null;
  }

  // Step 2: Based on role, fetch from respective profile table
  let profile: AdminProfile | OrganisationProfile | ObserverProfile | undefined;

  switch (user.role) {
    case "admin":
      profile = getAdminProfileByUserId(user.id) || undefined;
      break;

    case "organisation":
      profile = getOrganizationProfileByUserId(user.id) || undefined;
      break;

    case "observer":
    case "surveyor":
      profile = getObserverProfileByUserId(user.id) || undefined;
      break;
  }

  // Step 3: Combine user and profile data
  const userWithProfile: UserWithProfile = {
    ...user,
    name: profile?.name || "",
    profile,
  };

  // Add backward compatibility fields
  if (user.role === "organisation" && profile) {
    const orgProfile = profile as OrganisationProfile;
    userWithProfile.organizationId = orgProfile.id;
  }

  if ((user.role === "observer" || user.role === "surveyor") && profile) {
    const obsProfile = profile as ObserverProfile;
    userWithProfile.organizationId = obsProfile.organizationId;
    userWithProfile.observerId = obsProfile.id;
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  return userWithProfile;
}

/**
 * Example usage:
 *
 * const user = authenticateUser("admin@example.com", "password")
 * if (user) {
 *   console.log("User authenticated:", user.name)
 *   console.log("Role:", user.role)
 *   console.log("Profile data:", user.profile)
 * }
 */
