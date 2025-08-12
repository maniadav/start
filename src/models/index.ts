// Central export for all models
import UserModel from "./user.model";
import AdminProfileModel from "./admin.profle.model";
import OrganisationProfileModel from "./organisation.profile.model";
import ObserverProfileModel from "./observer.profile.model";
import ChildModel from "./child.model";
import FileModel from "./file.model";

import type { IUser } from "./user.model";
import type { IAdminProfile } from "./admin.profle.model";
import type { IOrganisationProfile } from "./organisation.profile.model";
import type { IObserverProfile } from "./observer.profile.model";
import type { IChild } from "./child.model";
import type { IFile } from "./file.model";

export {
  UserModel,
  AdminProfileModel,
  OrganisationProfileModel,
  ObserverProfileModel,
  ChildModel,
  FileModel,
  IUser,
  IAdminProfile,
  IOrganisationProfile,
  IObserverProfile,
  IChild,
  IFile,
};
