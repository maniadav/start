// Export all models
export { User, type IUser } from './User';
export { AdminProfile, type IAdminProfile } from './AdminProfile';
export { OrganisationProfile, type IOrganisationProfile } from './OrganisationProfile';
export { ObserverProfile, type IObserverProfile } from './ObserverProfile';
export { Child, type IChild } from './Child';
export { File, type IFile } from './File';

// Export database connection
export { default as connectDB } from '../lib/mongodb';
