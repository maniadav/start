import path from "path";

// all the page routes are defined here
export const PAGE_ROUTES = {
  HOME: {
    label: "Home",
    path: "/",
  },
  AUTH: {
    LOGIN: { label: "Login", path: "/management/login" },
    REGISTER: { label: "Register", path: "/management/register" },
    RESET_PASSWORD: {
      label: "Reset Password",
      path: "/auth/reset-password",
    },
    VERIFY_ACCOUNT: {
      label: "Verify Account",
      path: "/auth/verify",
    },
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
      DASHBOARD: { label: "Dashboard", path: "/management/observer/dashboard" },
      SURVEY_UPLOAD: {
        label: "Upload Survey",
        path: "/management/observer/upload",
      },
      CHILD: {
        label: "CHILD",
        path: "/management/observer/child",
      },
      SURVEY: {
        label: "Survey",
        path: "/management/observer/survey",
      },
    },
  },
};

// header navigation
export const NAV_ROUTES = {
  HOME: {
    label: "Home",
    path: PAGE_ROUTES.HOME.path,
    icon: "material-symbols:home-outline",
  },
  SURVEY: {
    label: "Survey",
    path: PAGE_ROUTES.MANAGEMENT.OBSERVER.SURVEY.path,
    icon: "material-symbols:list-alt-outline",
  },
  ABOUT: {
    label: "About",
    path: PAGE_ROUTES.ABOUT.path,
    icon: "material-symbols:info-outline",
  },
  DATA: {
    label: "Data",
    path: PAGE_ROUTES.CONTENT.path,
    icon: "material-symbols:database",
  },
};
