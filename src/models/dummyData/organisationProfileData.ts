import { IOrganisationProfile } from "../organisation.profile.model";

export const dummyOrganisationProfiles: Partial<IOrganisationProfile>[] = [
  {
    // user_id will be set when users are created
    address: "Plot No. 2, Rajiv Gandhi Education City, Sonipat, Haryana 131029",
    name: "observer",
    email: "observer@example.com", // Will match the user email
    status: "active",
  },
  {
    // user_id will be set when users are created
    address: "Plot No. 2, Rajiv Gandhi Education City, Sonipat, Haryana 131029",
    name: "Ashoka University",
    email: "ashoka@university.edu", // Will match the user email
    status: "active",
  },
  {
    // user_id will be set when users are created
    address: "Powai, Mumbai, Maharashtra 400076",
    name: "Indian Institute of Technology Bombay",
    email: "iitb@iitbombay.ac.in", // Will match the user email
    status: "active",
  },
];
