import { 
  User, 
  AdminProfile, 
  OrganisationProfile, 
  ObserverProfile, 
  Child, 
  File,
  connectDB,
  type IUser,
  type IAdminProfile,
  type IOrganisationProfile,
  type IObserverProfile,
  type IChild,
  type IFile
} from '../models';

// Database helper functions
export class DatabaseHelpers {
  
  // Ensure database connection
  static async ensureConnection() {
    await connectDB();
  }

  // User helpers
  static async createUser(userData: Partial<IUser>) {
    await this.ensureConnection();
    const user = new User(userData);
    return await user.save();
  }

  static async findUserByEmail(email: string) {
    await this.ensureConnection();
    return await User.findOne({ email }).exec();
  }

  // Admin Profile helpers
  static async createAdminProfile(profileData: Partial<IAdminProfile>) {
    await this.ensureConnection();
    const profile = new AdminProfile(profileData);
    return await profile.save();
  }

  static async getAdminWithUser(adminId: string) {
    await this.ensureConnection();
    return await AdminProfile.findById(adminId).populate('user_id').exec();
  }

  // Organisation Profile helpers
  static async createOrganisationProfile(profileData: Partial<IOrganisationProfile>) {
    await this.ensureConnection();
    const profile = new OrganisationProfile(profileData);
    return await profile.save();
  }

  static async getOrganisationWithUser(orgId: string) {
    await this.ensureConnection();
    return await OrganisationProfile.findById(orgId).populate('user_id').exec();
  }

  // Observer Profile helpers
  static async createObserverProfile(profileData: Partial<IObserverProfile>) {
    await this.ensureConnection();
    const profile = new ObserverProfile(profileData);
    return await profile.save();
  }

  static async getObserverWithDetails(observerId: string) {
    await this.ensureConnection();
    return await ObserverProfile.findById(observerId)
      .populate('user_id')
      .populate('organisation_id')
      .exec();
  }

  static async getObserversByOrganisation(organisationId: string) {
    await this.ensureConnection();
    return await ObserverProfile.find({ organisation_id: organisationId })
      .populate('user_id')
      .exec();
  }

  // Child helpers
  static async createChild(childData: Partial<IChild>) {
    await this.ensureConnection();
    const child = new Child(childData);
    return await child.save();
  }

  static async getChildrenByObserver(observerId: string) {
    await this.ensureConnection();
    return await Child.find({ observer_id: observerId })
      .populate('observer_id')
      .populate('organisation_id')
      .exec();
  }

  static async getChildrenByOrganisation(organisationId: string) {
    await this.ensureConnection();
    return await Child.find({ organisation_id: organisationId })
      .populate('observer_id')
      .populate('organisation_id')
      .exec();
  }

  // File helpers
  static async createFile(fileData: Partial<IFile>) {
    await this.ensureConnection();
    const file = new File(fileData);
    return await file.save();
  }

  static async getFilesByChild(childId: string) {
    await this.ensureConnection();
    return await File.find({ child_id: childId })
      .populate('child_id')
      .populate('observer_id')
      .populate('organisation_id')
      .exec();
  }

  static async getFilesByOrganisation(organisationId: string) {
    await this.ensureConnection();
    return await File.find({ organisation_id: organisationId })
      .populate('child_id')
      .populate('observer_id')
      .populate('organisation_id')
      .exec();
  }

  static async getFilesByTask(taskId: string) {
    await this.ensureConnection();
    return await File.find({ task_id: taskId })
      .populate('child_id')
      .populate('observer_id')
      .populate('organisation_id')
      .exec();
  }

  // Statistics helpers
  static async getOrganisationStats(organisationId: string) {
    await this.ensureConnection();
    
    const [observerCount, childCount, fileCount] = await Promise.all([
      ObserverProfile.countDocuments({ organisation_id: organisationId }),
      Child.countDocuments({ organisation_id: organisationId }),
      File.countDocuments({ organisation_id: organisationId })
    ]);

    return {
      observers: observerCount,
      children: childCount,
      files: fileCount
    };
  }

  static async getSystemStats() {
    await this.ensureConnection();
    
    const [userCount, adminCount, orgCount, observerCount, childCount, fileCount] = await Promise.all([
      User.countDocuments(),
      AdminProfile.countDocuments(),
      OrganisationProfile.countDocuments(),
      ObserverProfile.countDocuments(),
      Child.countDocuments(),
      File.countDocuments()
    ]);

    return {
      users: userCount,
      admins: adminCount,
      organisations: orgCount,
      observers: observerCount,
      children: childCount,
      files: fileCount
    };
  }
}

export default DatabaseHelpers;
