import { LOCALSTORAGE } from "constants/storage.constant";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../utils/localStorage";

export function checkUserLoginStatus() {
  try {
    const currentUser = getLocalStorageValue(LOCALSTORAGE.START_USER, true);
    if (currentUser) {
      return currentUser?._id ? true : false;
    }
    return undefined;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export function getUserData() {
  try {
    const currentUser = getLocalStorageValue(LOCALSTORAGE.START_USER, true);
    return currentUser;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

/**Utility to get vendorcode runtime */
export function getVendorCode() {
  const params = new URLSearchParams(window?.location.search);
  const paramCountryName = params.get("countryName");
  let countryName;
  if (paramCountryName) {
    setLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME, paramCountryName);
    countryName = paramCountryName;
  } else if (getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY, true)) {
    countryName = getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME);
  } else {
    countryName = "";
  }
  let vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
  if (
    countryName &&
    countryName !== "IND" &&
    (vendorCode === "tmc" || vendorCode === "srn" || vendorCode === "orh")
  ) {
    vendorCode = (vendorCode + "-" + countryName).toLowerCase();
  }
  return vendorCode;
}

import type {
  User,
  UserRole,
  UserWithProfile,
  AdminProfile,
  OrganisationProfile,
  ObserverProfile,
} from "@type/management.types";

export const STORAGE_KEYS = {
  CURRENT_USER: "start_app_current_user",
  USERS: "start_app_users",
  ADMIN_PROFILES: "start_app_admin_profiles",
  ORGANISATION_PROFILES: "start_app_organisation_profiles",
  OBSERVER_PROFILES: "start_app_observer_profiles",
  ORGANISATIONS: "start_app_organisations",
  OBSERVERS: "start_app_observers",
  SURVEYS: "start_app_surveys",
  FILES: "start_app_files",
};

export function getCurrentUser(): User | null {
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

export function hasRole(
  user: UserWithProfile | null,
  roles: UserRole[]
): boolean {
  return user ? roles.includes(user.role) : false;
}
