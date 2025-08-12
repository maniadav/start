// Export all dummy data
export { dummyUsers, hashUserPasswords } from './userData';
export { dummyAdminProfiles } from './adminProfileData';
export { dummyOrganisationProfiles } from './organisationProfileData';
export { dummyObserverProfiles } from './observerProfileData';
export { dummyChildren } from './childData';

// Data validation utility
export function validateDummyDataConsistency() {
  const { dummyUsers } = require('./userData');
  const { dummyAdminProfiles } = require('./adminProfileData');
  const { dummyOrganisationProfiles } = require('./organisationProfileData');
  const { dummyObserverProfiles } = require('./observerProfileData');

  const userCounts = {
    admin: dummyUsers.filter((u: any) => u.role === 'admin').length,
    organisation: dummyUsers.filter((u: any) => u.role === 'organisation').length,
    observer: dummyUsers.filter((u: any) => u.role === 'observer').length,
  };

  const profileCounts = {
    admin: dummyAdminProfiles.length,
    organisation: dummyOrganisationProfiles.length,
    observer: dummyObserverProfiles.length,
  };

  const totalUsers = userCounts.admin + userCounts.organisation + userCounts.observer;
  const totalProfiles = profileCounts.admin + profileCounts.organisation + profileCounts.observer;

  console.log('📊 Dummy Data Validation:');
  console.log(`Users: ${totalUsers} (${userCounts.admin} admin + ${userCounts.organisation} org + ${userCounts.observer} observer)`);
  console.log(`Profiles: ${totalProfiles} (${profileCounts.admin} admin + ${profileCounts.organisation} org + ${profileCounts.observer} observer)`);

  // Validate counts match
  const isValid = 
    userCounts.admin === profileCounts.admin &&
    userCounts.organisation === profileCounts.organisation &&
    userCounts.observer === profileCounts.observer &&
    totalUsers === totalProfiles;

  if (isValid) {
    console.log('✅ Data consistency validation passed!');
  } else {
    console.error('❌ Data consistency validation failed!');
    console.error('User counts and profile counts do not match');
  }

  return isValid;
}
