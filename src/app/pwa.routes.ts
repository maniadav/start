import { BASE_URL } from "@constants/config.constant";
import { CACHE_VERSION } from "./pwa.config.constant";

const staticRoutesConfig = [
  `${BASE_URL}/`,
  `${BASE_URL}/survey`,
  `${BASE_URL}/content`,
  `${BASE_URL}/about`,
  `${BASE_URL}/auth/login`,
  `${BASE_URL}/offline`,
  `${BASE_URL}/testing`,
];

// dynamic routes
const dynamicRouteConfigs = [
  { base: `${BASE_URL}/bubble-popping-task`, attempts: 3 },
  { base: `${BASE_URL}/motor-following-task`, attempts: 3 },
  { base: `${BASE_URL}/button-task`, attempts: 3 },
  { base: `${BASE_URL}/wheel-task`, attempts: 3 },
  { base: `${BASE_URL}/delayed-gratification-task`, attempts: 3 },
  { base: `${BASE_URL}/synchrony-task`, attempts: 3 },
  { base: `${BASE_URL}/preferential-looking-task`, attempts: 3 },
  { base: `${BASE_URL}/language-sampling-task`, attempts: 3 },
];

// Generate all URLs to precache before Serwist initialization
const staticRoutes = staticRoutesConfig.map((path) => ({
  url: path,
  revision: CACHE_VERSION,
}));

// For dynamic routes, we can either:
// 1. Precache the base route and handle the query params with runtime caching
// 2. Or precache each variation if they're different
const dynamicRoutes = dynamicRouteConfigs.flatMap(({ base, attempts }) => {
  const routes = [];
  // Add the base route
  routes.push({
    url: `${BASE_URL}${base}`,
    revision: CACHE_VERSION,
  });

  // Add variations with attempt numbers if needed
  for (let i = 1; i <= attempts; i++) {
    routes.push({
      url: `${BASE_URL}${base}?attempt=${i}`,
      revision: CACHE_VERSION,
    });
  }

  return routes;
});

export { dynamicRouteConfigs, staticRoutesConfig, staticRoutes, dynamicRoutes };
