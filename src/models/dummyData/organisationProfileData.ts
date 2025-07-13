import { IOrganisationProfile } from '../OrganisationProfile';

export const dummyOrganisationProfiles: Partial<IOrganisationProfile>[] = [
  {
    // user_id will be set when users are created
    unique_id: "OG001",
    address: "Plot No. 2, Rajiv Gandhi Education City, Sonipat, Haryana 131029",
    name: "Ashoka University",
    status: "active",
  },
  {
    // user_id will be set when users are created  
    unique_id: "OG002",
    address: "Powai, Mumbai, Maharashtra 400076",
    name: "Indian Institute of Technology Bombay",
    status: "active",
  }
];
