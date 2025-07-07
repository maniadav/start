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

const TASK_TYPE = [
  "BubblePoppingTask",
  "DelayedGratificationTask",
  "MotorFollowingTask",
  "ButtonTask",
  "SynchronyTask",
  "LanguageSamplingTask",
  "WheelTask",
  "PreferentialLookingTask",
] as const;

const taskDescriptions: Record<typeof TASK_TYPE[number], string> = {
  BubblePoppingTask: "Measure response time and accuracy in popping virtual bubbles",
  DelayedGratificationTask: "Assess impulse control and decision making",
  MotorFollowingTask: "Evaluate motor skills and pattern following ability",
  ButtonTask: "Test reaction time and sequential button pressing accuracy",
  SynchronyTask: "Measure synchronization ability with audio-visual stimuli",
  LanguageSamplingTask: "Collect and analyze speech patterns and vocabulary",
  WheelTask: "Test motor control and timing precision",
  PreferentialLookingTask: "Track visual attention and preference patterns"
};

const surveys: Survey[] = TASK_TYPE.map((taskType, index) => ({
  id: `task_${index + 1}`,
  name: taskType,
  description: taskDescriptions[taskType],
  organizationId: "org_1",
  observerId: "obs_1",
  createdBy: "user_1",
  createdAt: new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000).toISOString(),
}));

const files: UploadedFile[] = [
  {
    id: "file_1",
    name: "bubble_popping_session1.json",
    size: 1024000, // 1MB
    surveyId: "task_1",
    organizationId: "org_1",
    observerId: "obs_1",
    uploadedBy: "user_3",
    uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/data/bubble_popping_session1.json",
  },
  {
    id: "file_2",
    name: "delayed_gratification_results.json",
    size: 1536000, // 1.5MB
    surveyId: "task_2",
    organizationId: "org_1",
    observerId: "obs_1",
    uploadedBy: "user_3",
    uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/data/delayed_gratification_results.json",
  },
  {
    id: "file_3",
    name: "motor_following_data.json",
    size: 2048576, // 2MB
    surveyId: "task_3",
    organizationId: "org_1",
    observerId: "obs_1",
    uploadedBy: "user_3",
    uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/data/motor_following_data.json",
  },
  {
    id: "file_4",
    name: "language_sampling_audio.wav",
    size: 15728640, // 15MB
    surveyId: "task_6",
    organizationId: "org_1",
    observerId: "obs_1",
    uploadedBy: "user_3",
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/data/language_sampling_audio.wav",
  },
  {
    id: "file_5",
    name: "preferential_looking_session.json",
    size: 3072000, // 3MB
    surveyId: "task_8",
    organizationId: "org_1",
    observerId: "obs_1",
    uploadedBy: "user_3",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    url: "/data/preferential_looking_session.json",
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
