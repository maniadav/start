// any global API config are defined here
export const API_CONFIG = {
  pageSize: 10,
};

// All the API endpoints are defined here
export const API_ENDPOINT = {
  health: "/api/health", // Health check endpoint
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  organisation: {
    list: "/organisation/list",
    create: "/organisation/create",
    delete: "/organisation/delete",
    update: "/organisation/update",
  },
  observer: {
    list: "/observer/list",
    create: "/observer/create",
  },
  child: {
    list: "/child/list",
    create: "/child/create",
  },
  files: {
    list: "/files/list",
    create: "/files/create",
  },
};
