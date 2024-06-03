// any global API config are defined here
export const API_CONFIG = {
  pageSize: 10
};

// All the API endpoints are defined here
export const API_ENDPOINT = {
  customerReview: {
    fetchAll: "/customer-reviews-ms/reviews",
    fetchCount: "/customer-reviews-ms/reviews/count"
  },
  customerParameters: {
    fetchAll: "/customer-reviews-ms/subRating",
    create: "/customer-reviews-ms/subRating",
    fetchById: "/customer-reviews-ms/subRating",
    update: "/customer-reviews-ms/subRating"
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    resetPassword: "auth/reset-password"
  },
  utility: {
    uploadImage: "/upload/image"
  }
};