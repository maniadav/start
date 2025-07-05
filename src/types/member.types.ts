export type MemberRole = "admin" | "organisation" | "observer";
export type Status = "active" | "pending" | "deactivated";
export type Gender = "male" | "female" | "other";

export interface Member {
  id: string;
  email: string;
  role: MemberRole;
  createdAt: string;
  password?: string; // In real app, this would be hashed
  lastLogin?: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  name: string;
  address?: string;
  permissions: string[];
  createdAt: string;
}

export interface OrganisationProfile {
  id: string;
  userId: string;
  name: string;
  organizationName: string;
  email: string;
  address: string;
  status: Status;
  allowedStorage: number; // in MB
  createdAt: string;
  contactPhone?: string;
  website?: string;
}

export interface ObserverProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  status: Status;
  organizationId: string;
  createdAt: string;
  specialization?: string;
  certifications?: string[];
}

export interface MemberWithProfile extends Member {
  name: string;
  organizationId?: string;
  observerId?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  profile?: AdminProfile | OrganisationProfile | ObserverProfile;
}

// FE: FRONTEND TYPES

export interface AdminProfileFE {
  id: string;
  name: string;
  address?: string;
  permissions: string[];
  createdAt: string;
}

export interface OrganisationProfileFE {
  id: string;
  name: string;
  organizationName: string;
  email: string;
  address: string;
  status: Status;
  allowedStorage: number; // in MB
  createdAt: string;
  contactPhone?: string;
  website?: string;
}

export interface ObserverProfileFE {
  id: string;
  name: string;
  email: string;
  address: string;
  status: Status;
  organizationId: string;
  createdAt: string;
  specialization?: string;
  certifications?: string[];
}

export interface MemberWithProfileFE {
  email: string;
  role: MemberRole;
  userId: string;
  profile?: AdminProfileFE | OrganisationProfileFE | ObserverProfileFE;
}
