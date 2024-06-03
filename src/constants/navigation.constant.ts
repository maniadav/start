export const sidebarMenu = [
  { name: "Home", icon: "solar:home-linear", routerLink: "/" },
  {
    name: "In Patient",
    icon: "medical-icon:i-inpatient",
    routerLink: "/in-patient",
  },
  {
    name: "Out Patient",
    icon: "material-symbols:outpatient-med-outline",
    routerLink: "/out-patient",
  },

  {
    name: "Referral",
    icon: "octicon:cross-reference-24",
    nestedMenu: [
      {
        name: "Send Referral",
        routerLink: "/referral-send",
      },
      {
        name: "PAC Referral",
        routerLink: "/referral-pac",
      },
      {
        name: "View/Cancel Referral",
        routerLink: "/referral-update",
      },
    ],
  },
  {
    name: "Previous Admission",
    icon: "material-symbols:other-admission-outline",
    routerLink: "/previous-admission",
  },
  {
    name: "Previous Complaints",
    icon: "ic:outline-view-day",
    routerLink: "/previous-complaint",
  },
  {
    name: "Communication",
    icon: "icon-park-outline:communication",
    routerLink: "/communication",
  },
  {
    name: "Follow Up Patients",
    icon: "simple-line-icons:user-follow",
    routerLink: "/followup-patient",
  },
  {
    name: "Patients Info",
    icon: "fluent:person-info-20-regular",
    routerLink: "/patient-info",
  },
  {
    name: "Tele Medicine",
    icon: "solar:call-medicine-rounded-outline",
    routerLink: "/telemedicine",
  },
  {
    name: "Specific Updates",
    icon: "teenyicons:user-outline",
    routerLink: "/specific-updates",
  },
  {
    name: "Health Statistic",
    icon: "healthicons:health-data-sync",
    routerLink: "/health-statistic",
  },
];
