import {
  PrecacheEntry,
  Serwist,
  SerwistGlobalConfig,
} from "serwist";
import { BASE_URL } from "@constants/config.constant";
import { CACHE_NAME, CACHE_VERSION } from "../pwa/pwa.config.constant";
import { dynamicRoutes, staticRoutes } from "./pwa.routes";
import { runtimeCacheConfig } from "./pwa.runtimecache";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Create precache list - combine auto-generated manifest with your custom routes
const precacheEntries = [
  ...(self.__SW_MANIFEST || []),
  ...staticRoutes,
  ...dynamicRoutes,
];

const serwist = new Serwist({
  precacheEntries: precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: runtimeCacheConfig,
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

self.addEventListener("install", (event) => {
  console.log("Service worker installed with advanced caching");
  console.log("Precache entries count:", precacheEntries.length);
});

serwist.addEventListeners();

// Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
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
