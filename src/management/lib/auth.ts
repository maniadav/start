import type {
  User,
  UserRole,
  UserWithProfile,
  AdminProfile,
  OrganisationProfile,
  ObserverProfile,
} from "../../types/management.types";

export const STORAGE_KEYS = {
  CURRENT_USER: "survey_app_current_user",
  USERS: "survey_app_users",
  ADMIN_PROFILES: "survey_app_admin_profiles",
  ORGANISATION_PROFILES: "survey_app_organization_profiles",
  OBSERVER_PROFILES: "survey_app_observer_profiles",
  ORGANISATIONS: "survey_app_organisations",
  OBSERVERS: "survey_app_observers",
  SURVEYS: "survey_app_surveys",
  FILES: "survey_app_files",
};

export function getCurrentUser(): UserWithProfile | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function login(email: string, password: string): UserWithProfile | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  console.log("Login attempt:", { email, password, user });
  if (user && password === "password") {
    // Simple password check for demo
    const userWithProfile = getUserWithProfile(user.id);
    if (userWithProfile) {
      setCurrentUser(userWithProfile);
      // Update last login
      user.lastLogin = new Date().toISOString();
      saveUsers(users);
      return userWithProfile;
    }
  }
  return null;
}

export function getUserWithProfile(userId: string): UserWithProfile | null {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  let profile:
    | AdminProfile
    | OrganisationProfile
    | ObserverProfile
    | undefined = undefined;

  // Fetch profile based on role
  switch (user.role) {
    case "admin":
      profile = getAdminProfile(userId) || undefined;
      break;
    case "organisation":
      profile = getOrganizationProfile(userId) || undefined;
      break;
    case "observer":
      profile = getObserverProfile(userId) || undefined;
      break;
  }

  // Create UserWithProfile object
  const userWithProfile: UserWithProfile = {
    ...user,
    name: "",
    profile,
  };

  // Extract name and other details from profile
  if (profile) {
    userWithProfile.name = profile.name;
    if (profile.address) userWithProfile.address = profile.address;

    // Add role-specific properties for backward compatibility
    if (user.role === "organisation" && profile) {
      const orgProfile = profile as OrganisationProfile;
      userWithProfile.organizationId = orgProfile.id;
    }
    if (user.role === "observer" && profile) {
      const obsProfile = profile as ObserverProfile;
      userWithProfile.organizationId = obsProfile.organizationId;
      userWithProfile.observerId = obsProfile.id;
    }
  }

  return userWithProfile;
}

/**
 * Optimized: Get user with profile using either user object (with id and role) or just id.
 * If userObj is provided, avoids fetching user again.
 */
export function getUserWithProfileOptimized(
  userOrId: { id: string; role: UserRole } | string
): UserWithProfile | null {
  let user: User | undefined;
  let role: UserRole | undefined;

  if (typeof userOrId === "string") {
    // Only id provided, use existing logic
    const users = getUsers();
    user = users.find((u) => u.id === userOrId);
    if (!user) return null;
    role = user.role;
  } else {
    // user object provided
    user = userOrId as User;
    role = user.role;
  }

  let profile:
    | AdminProfile
    | OrganisationProfile
    | ObserverProfile
    | undefined = undefined;

  switch (role) {
    case "admin":
      profile = getAdminProfile(user.id) || undefined;
      break;
    case "organisation":
      profile = getOrganizationProfile(user.id) || undefined;
      break;
    case "observer":
      profile = getObserverProfile(user.id) || undefined;
      break;
  }

  const userWithProfile: UserWithProfile = {
    ...user,
    name: profile?.name || "",
    profile,
  };

  if (profile) {
    if (profile.address) userWithProfile.address = profile.address;
    if (role === "organisation" && profile) {
      const orgProfile = profile as OrganisationProfile;
      userWithProfile.organizationId = orgProfile.id;
    }
    if (role === "observer" && profile) {
      const obsProfile = profile as ObserverProfile;
      userWithProfile.organizationId = obsProfile.organizationId;
      userWithProfile.observerId = obsProfile.id;
    }
  }

  return userWithProfile;
}

export function getAdminProfile(userId: string): AdminProfile | null {
  if (typeof window === "undefined") return null;
  const profiles = localStorage.getItem(STORAGE_KEYS.ADMIN_PROFILES);
  const adminProfiles: AdminProfile[] = profiles ? JSON.parse(profiles) : [];
  return adminProfiles.find((p) => p.userId === userId) || null;
}

export function getOrganizationProfile(
  userId: string
): OrganisationProfile | null {
  if (typeof window === "undefined") return null;
  const profiles = localStorage.getItem(STORAGE_KEYS.ORGANISATION_PROFILES);
  const orgProfiles: OrganisationProfile[] = profiles
    ? JSON.parse(profiles)
    : [];
  return orgProfiles.find((p) => p.userId === userId) || null;
}

export function getObserverProfile(userId: string): ObserverProfile | null {
  if (typeof window === "undefined") return null;
  const profiles = localStorage.getItem(STORAGE_KEYS.OBSERVER_PROFILES);
  const obsProfiles: ObserverProfile[] = profiles ? JSON.parse(profiles) : [];
  return obsProfiles.find((p) => p.userId === userId) || null;
}

export function logout() {
  setCurrentUser(null);
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function saveAdminProfiles(profiles: AdminProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ADMIN_PROFILES, JSON.stringify(profiles));
}

export function saveOrganizationProfiles(profiles: OrganisationProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEYS.ORGANISATION_PROFILES,
    JSON.stringify(profiles)
  );
}

export function saveObserverProfiles(profiles: ObserverProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEYS.OBSERVER_PROFILES,
    JSON.stringify(profiles)
  );
}

export function hasRole(user: User | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false;
}
