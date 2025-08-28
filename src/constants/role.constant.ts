export const ROLE = {
  ADMIN: "admin",
  ORGANISATION: "organisation",
  OBSERVER: "observer",
  CHILD: "child",
};
export type RoleAllowed =
  | typeof ROLE.ADMIN
  | typeof ROLE.ORGANISATION
  | typeof ROLE.OBSERVER;
