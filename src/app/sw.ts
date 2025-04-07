import { PrecacheEntry, Serwist, SerwistGlobalConfig } from "serwist";
import { BASE_URL } from "@constants/config.constant";
import { CACHE_NAME, CACHE_VERSION } from "./pwa.config.constant";
// import { defaultCache } from "./_sw-default-cache";
import { defaultCache } from "@serwist/next/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// static routes
const staticRoutesConfig = [
  "/",
  "/survey",
  "/content",
  "/about",
  "/auth/login",
  "/offline",
  "testing",
];

// dynamic routes
const dynamicRouteConfigs = [
  { base: "/bubble-popping-task", attempts: 3 },
  { base: "/motor-following-task", attempts: 3 },
  { base: "/button-task", attempts: 3 },
  { base: "/wheel-task", attempts: 3 },
  { base: "/delayed-gratification-task", attempts: 3 },
  { base: "/synchrony-task", attempts: 3 },
  { base: "/preferential-looking-task", attempts: 3 },
];

// Generate all URLs to precache before Serwist initialization
const staticRoutes = staticRoutesConfig.map((path) => ({
  url: `${BASE_URL}${path}`,
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

// create precache list
console.log({ staticRoutes, dynamicRoutes });
const precacheEntries = [
  ...(self.__SW_MANIFEST || []),
  ...staticRoutes,
  ...dynamicRoutes,
];

const serwist = new Serwist({
  precacheEntries: precacheEntries, //self.__SW_MANIFEST
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
  // runtimeCaching: defaultCache.map((cache) => ({
  //   ...cache,
  //   handler: cache.strategy,
  // })),

  fallbacks: {
    entries: [
      {
        url: `${BASE_URL}/offline`,
        matcher: ({ request }: { request: Request }) =>
          request.destination === "document" && request.mode === "navigate",
      },
    ],
  },
});

// No need to add to precache list in the install event as we've already included everything
self.addEventListener("install", (event) => {
  // You could add additional install logic here if needed
  console.log("Service worker installed");
});

serwist.addEventListeners();
// delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith(CACHE_NAME) && !name.includes(CACHE_VERSION)
          )
          .map((name) => {
            console.log("Deleting old cache:", name);
            return caches.delete(name);
          })
      )
    )
  );
});
