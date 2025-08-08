import { PAGE_ROUTES } from "@constants/route.constant";
import { MemberProfile } from "@data/start.data";
import { getLocalStorageValue, removeLocalStorageValue } from "./localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { UserRole, UserWithProfile } from "@type/management.types";

export function redirectToDashboard(role: string, router: any) {
  if (role === MemberProfile.admin) {
    router.push(PAGE_ROUTES.MANAGEMENT.ADMIN.DASHBOARD.path);
  } else if (role === MemberProfile.organisation) {
    router.push(PAGE_ROUTES.MANAGEMENT.ORGANISATION.DASHBOARD.path);
  } else {
    router.push(PAGE_ROUTES.SURVEY.path);
  }
}

export function getCurrentMember(): any | null {
  const member = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true);
  return member;
}

export function getCurrentUser(): any | null {
  const user = getLocalStorageValue(LOCALSTORAGE.START_USER, true);
  return user;
}

export function logOut(): any | null {
  removeLocalStorageValue(LOCALSTORAGE.START_MEMBER);
  removeLocalStorageValue(LOCALSTORAGE.START_USER);
  return null;
}

export function hasValidRole(
  user: UserWithProfile | null,
  roles: UserRole[]
): boolean {
  return user ? roles.includes(user.role) : false;
}
