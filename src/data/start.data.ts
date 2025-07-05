import type {
  User,
  Organisation,
  Survey,
  UploadedFile,
  Observer,
  AdminProfile,
  OrganisationProfile,
  ObserverProfile,
} from "types/management.types";

const users: User[] = [
  {
    id: "user_1",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    password: "password",
  },
  {
    id: "user_2",
    email: "organisation@example.com",
    role: "organisation",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    password: "password",
  },

  {
    id: "user_3",
    email: "observer@example.com",
    role: "observer",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    password: "password",
  },
];

const MemberProfile: Record<string, string> = {
  admin: "admin",
  organisation: "organisation",
  observer: "observer",
};

// Admin profiles
const adminProfiles: AdminProfile[] = [
  {
    id: "admin_1",
    userId: "user_1",
    name: "System Admin",
    address: "123 Admin St, Tech City, TC 12345",
    permissions: [
      "manage_users",
      "manage_organizations",
      "manage_system",
      "view_all_data",
    ],
    createdAt: new Date().toISOString(),
  },
];

// Organisation profiles (for organisation", role)
const organisationProfiles: OrganisationProfile[] = [
  {
    id: "org_1",
    userId: "user_2",
    name: "Org Admin 1",
    organizationName: "Healthcare Research Corp",
    email: "contact@healthcareresearch.com",
    address: "100 Medical Plaza, Healthcare City, HC 12345",
    status: "active",
    allowedStorage: 10240, // 10GB in MB
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    contactPhone: "+1-555-0123",
    website: "https://healthcareresearch.com",
  },
];

// Observer profiles (for observer and surveyor roles)
const observerProfiles: ObserverProfile[] = [
  {
    id: "obs_1",
    userId: "user_3",
    name: "Observer 1",
    email: "observer1@healthcareresearch.com",
    address: "321 Observer Lane, Watch City, WC 98765",
    status: "active",
    organizationId: "org_1",
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    specialization: "Healthcare Data Collection",
    certifications: [
      "Certified Data Observer",
      "Healthcare Research Certification",
    ],
  },
];

const surveys: Survey[] = [
  {
    id: "1",
    name: "Patient Satisfaction Survey",
    description: "Quarterly patient satisfaction data collection",
    organizationId: "1",
    observerId: "1",
    createdBy: "4",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Student Performance Analysis",
    description: "Academic performance tracking survey",
    organizationId: "2",
    observerId: "2",
    createdBy: "5",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Staff Feedback Collection",
    description: "Internal staff feedback and suggestions",
    organizationId: "1",
    observerId: "1",
    createdBy: "4",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const files: UploadedFile[] = [
  {
    id: "1",
    name: "patient_data_q1.csv",
    size: 2048576, // 2MB
    surveyId: "1",
    organizationId: "1",
    observerId: "1",
    uploadedBy: "6",
    uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/dummy-files/patient_data_q1.csv",
  },
  {
    id: "2",
    name: "student_scores_2024.csv",
    size: 1536000, // 1.5MB
    surveyId: "2",
    organizationId: "2",
    observerId: "2",
    uploadedBy: "7",
    uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/dummy-files/student_scores_2024.csv",
  },
  {
    id: "3",
    name: "staff_feedback_march.csv",
    size: 1024000, // 1MB
    surveyId: "3",
    organizationId: "1",
    observerId: "1",
    uploadedBy: "6",
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/dummy-files/staff_feedback_march.csv",
  },
  {
    id: "4",
    name: "patient_data_q2.csv",
    size: 3072000, // 3MB
    surveyId: "1",
    organizationId: "1",
    observerId: "1",
    uploadedBy: "6",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/dummy-files/patient_data_q2.csv",
  },
];

export {
  users,
  adminProfiles,
  organisationProfiles,
  observerProfiles,
  MemberProfile,
  surveys,
  files,
};
