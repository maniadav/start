import { IOrganisationProfile } from "../organisation.profile.model";

export const dummyOrganisationProfiles: Partial<IOrganisationProfile>[] = [
  {
    // user_id will be set when users are created
    address: "Plot No. 2, Rajiv Gandhi Education City, Sonipat, Haryana 131029",
    name: "Ashoka University",
    email: "organisation@example.com", // Will match the user email
    status: "active",
  },
];
