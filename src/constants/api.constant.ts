// any global API config are defined here
export const API_CONFIG = {
  pageSize: 10,
};

// All the API endpoints are defined here
export const API_ENDPOINT = {
  utility: {
    upload_image: "/utility/upload-image",
    upload_files: "/utility/upload-files",
    download_files: "/utility/download-files",
    delete_files: "/utility/delete-files",
  },
  health: "/api/health", // Health check endpoint
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    request_password_reset: "/auth/request-password-reset",
    verify_reset_token: "/auth/verify-reset-token",
    reset_password: "/auth/reset-password",
    updateProfile: "/auth/update-profile",
    update_password: "/auth/password-update",
    send_verification_mail: "/auth/send-verification-mail",
  },
  user: {
    list: "/user/list",
    create: "/user/create",
    delete: "/user/delete",
    update: "/user/update",
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
    delete: "/observer/delete",
    update: "/observer/update",
  },
  child: {
    list: "/child/list",
    create: "/child/create",
    fetch: "/child/fetch",
    update: "/child/update",
    delete: "/child/delete",
  },
  credential: {
    create: "/credential/create",
  },
  files: {
    list: "/files/list",
    create: "/files/create",
    upload: "/files/upload",
    download: "/files/download",
  },
};
