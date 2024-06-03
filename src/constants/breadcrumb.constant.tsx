interface BreadcrumbProps {
  name: string;
  routerLink?: string | [string];
}

const HOME = {
  name: "Home",
  routerLink: "/",
};

// follow up patient
export const FollowUpPatientBreadcrumb = [
  HOME,
  {
    name: "Follow Up Patient",
    routerLink: ["/followup-patient"],
  },
];

export const PatientInfoBreadcrumb = [
  HOME,
  {
    name: "Patient Info",
    routerLink: ["/patient-info"],
  },
];
export const TelemedicineBreadcrumb = [
  HOME,
  {
    name: "Tele Medicine",
    routerLink: ["/telemedicine"],
  },
];

export const InPatientBreadcrumb = [
  HOME,
  {
    name: "In Patient",
    routerLink: ["/in-patient"],
  },
];
