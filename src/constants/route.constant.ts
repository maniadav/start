// header navigation
export const NAV_ROUTES = {
  HOME: {
    label: "Home",
    path: "/",
    icon: "material-symbols:home-outline",
  },
  SURVEY: {
    label: "Survey",
    path: "/survey",
    icon: "material-symbols:list-alt-outline",
  },
  ABOUT: {
    label: "About",
    path: "/about",
    icon: "material-symbols:info-outline",
  },
  DATA: {
    label: "Data",
    path: "/content",
    icon: "material-symbols:database",
  },
};

// all the page routes are defined here
export const PAGE_ROUTES = {
  HOME: {
    label: "Home",
    path: "/",
  },

  ABOUT: {
    label: "About",
    path: "/about",
  },
  CONTENT: {
    label: "CONTENT",
    path: "/content",
  },
  SETTING: {
    label: "Setting",
    path: "/setting",
  },
  LOGIN: {
    label: "Login",
    path: "/management/login",
  },
  SURVEY: {
    label: "Survey",
    path: "/survey",
  },
  UPLOAD: {
    label: "Upload",
    path: "/survey/upload",
  },
  MANAGEMENT: {
    USER: { label: "Upload", path: "/management/upload" },
    ADMIN: {
      DASHBOARD: { label: "Dashboard", path: "/management/admin/dashboard" },
      ORGANISATION: { label: "Organisation", path: "/management/admin/org" },
    },
    ORGANISATION: {
      DASHBOARD: {
        label: "Dashboard",
        path: "/management/organisation/dashboard",
      },
      OBSERVER: { label: "Organisation", path: "/management/org/obs" },
    },
    OBSERVER: {
      DASHBOARD: { label: "Dashboard", path: "/management/admin/dashboard" },
    },
  },
};
