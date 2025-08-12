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
  `${BASE_URL}/task/bubble-popping-task`,
  `${BASE_URL}/task/motor-following-task`,
  `${BASE_URL}/task/button-task`,
  `${BASE_URL}/task/wheel-task`,
  `${BASE_URL}/task/delayed-gratification-task`,
  `${BASE_URL}/task/synchrony-task`,
  `${BASE_URL}/task/preferential-looking-task`,
  `${BASE_URL}/task/language-sampling-task`,
];

// Generate all URLs to precache before Serwist initialization
const staticRoutes = staticRoutesConfig.map((path) => ({
  url: path,
  revision: CACHE_VERSION,
}));

export { staticRoutes };
