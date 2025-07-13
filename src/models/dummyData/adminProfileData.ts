import { IAdminProfile } from '../AdminProfile';

export const dummyAdminProfiles: Partial<IAdminProfile>[] = [
  {
    // user_id will be set when users are created
    unique_id: "AD001", 
    address: "123 Research Center, New Delhi, India 110001",
    name: "System Administrator",
    permission: {
      manage_users: true,
      manage_organizations: true,
      manage_system: true,
      view_all_data: true,
      export_data: true,
      manage_migrations: true
    },
    status: "active",
  }
];
