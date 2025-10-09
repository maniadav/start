export const UserRoleConst = ["admin", "organisation", "observer"] as const;
export const MemberProfile: Record<string, string> = {
  admin: "admin",
  organisation: "organisation",
  observer: "observer",
};
