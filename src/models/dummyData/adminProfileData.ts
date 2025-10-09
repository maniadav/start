import { IAdminProfile } from "../admin.profle.model";

export const dummyAdminProfiles: Partial<IAdminProfile>[] = [
  {
    // user_id will be set when users are created
    address: "Sonipat, Haryana, 131029, India",
    name: "Start Web Admin",
    email: "startweb@bhismalab.org",
    permission: {
      manage_users: true,
      manage_organizations: true,
      manage_system: true,
      view_all_data: true,
      export_data: true,
      manage_migrations: true,
    },
    status: "active",
  },
];
