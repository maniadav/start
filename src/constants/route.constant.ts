// header navigation
export const NAV_ROUTES = {
  HOME: {
    label: "Home",
    path: "/",
  },
  SURVEY: {
    label: "Survey",
    path: "/survey",
  },
  ABOUT: {
    label: "About",
    path: "/about",
  },
  DATA: {
    label: "Data",
    path: "/content",
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
      DASHBOARD: { label: "Dashboard", path: "/management/org/dashboard" },
      OBSERVER: { label: "Organisation", path: "/management/org/obs" },
    },
    OBSERVER: {
      DASHBOARD: { label: "Dashboard", path: "/management/admin/dashboard" },
    },
  },
};
