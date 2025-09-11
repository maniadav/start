// Export all dummy data
export { dummyUsers, hashUserPasswords } from "./userData";
export { dummyAdminProfiles } from "./adminProfileData";
export { dummyOrganisationProfiles } from "./organisationProfileData";

// Data validation utility
export function validateDummyDataConsistency() {
  const { dummyUsers } = require("./userData");
  const { dummyAdminProfiles } = require("./adminProfileData");
  const { dummyOrganisationProfiles } = require("./organisationProfileData");

  const userCounts = {
    admin: dummyUsers.filter((u: any) => u.role === "admin").length,
    organisation: dummyUsers.filter((u: any) => u.role === "organisation")
      .length,
  };

  const profileCounts = {
    admin: dummyAdminProfiles.length,
    organisation: dummyOrganisationProfiles.length,
  };

  const totalUsers = userCounts.admin + userCounts.organisation;
  const totalProfiles = profileCounts.admin + profileCounts.organisation;

  console.log("📊 Dummy Data Validation:");
  console.log(
    `Users: ${totalUsers} (${userCounts.admin} admin + ${userCounts.organisation} org)`
  );
  console.log(
    `Profiles: ${totalProfiles} (${profileCounts.admin} admin + ${profileCounts.organisation} org)`
  );

  // Validate counts match
  const isValid =
    userCounts.admin === profileCounts.admin &&
    userCounts.organisation === profileCounts.organisation &&
    totalUsers === totalProfiles;

  if (isValid) {
    console.log("✅ Data consistency validation passed!");
  } else {
    console.error("❌ Data consistency validation failed!");
    console.error("User counts and profile counts do not match");
  }

  return isValid;
}
