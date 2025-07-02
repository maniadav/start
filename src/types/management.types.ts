export type UserRole = "admin" | "organisation" | "observer" | "surveyor";
export type Status = "active" | "pending" | "deactivated";
export type Gender = "male" | "female" | "other";

// Base user table - only essential info for auth
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  password?: string; // In real app, this would be hashed
  lastLogin?: string;
}

// Separate profile tables for each role
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

// For backward compatibility - full user with profile data joined
export interface UserWithProfile extends User {
  name: string;
  organizationId?: string;
  observerId?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  profile?: AdminProfile | OrganisationProfile | ObserverProfile;
}

// Legacy interfaces for backward compatibility
export interface Organisation {
  id: string;
  name: string;
  email: string;
  address: string;
  status: Status;
  allowedStorage: number; // in MB
  createdAt: string;
  adminId: string;
}

export interface Observer {
  id: string;
  name: string;
  email: string;
  address: string;
  status: Status;
  organizationId: string;
  createdAt: string;
}

export interface Survey {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  observerId?: string;
  createdBy: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  surveyId: string;
  organizationId: string;
  observerId?: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface FilterOptions {
  search?: string;
  status?: Status[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  storageComparison?: {
    operator: "<" | "=" | ">";
    value: number;
  };
  userCountComparison?: {
    operator: "<" | "=" | ">";
    value: number;
  };
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}
