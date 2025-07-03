import {
  PrecacheEntry,
  Serwist,
  SerwistGlobalConfig,
  RouteHandler,
  RuntimeCaching,
} from "serwist";
import { BASE_URL } from "@constants/config.constant";
import { CACHE_NAME, CACHE_VERSION } from "../pwa/pwa.config.constant";
import { defaultCache } from "@serwist/next/worker";
import { staticRoutes } from "./pwa.routes";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// create precache list
// console.log({ staticRoutes, dynamicRoutes });

const precacheEntries = [...(self.__SW_MANIFEST || []), ...staticRoutes];

const serwist = new Serwist({
  precacheEntries: precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      // NetworkFirst for all navigation/document requests (HTML pages)
      matcher: ({ request }: { request: Request }) =>
        request.destination === "document" && request.mode === "navigate",
      handler: "NetworkFirst" as unknown as RouteHandler,
      options: {
        cacheName: `${CACHE_NAME}-pages`,
        networkTimeoutSeconds: 10,
        plugins: [
          {
            cacheWillUpdate: async ({ response }: { response: Response }) => {
              // Only cache successful responses
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },

    ...defaultCache,
  ] as RuntimeCaching[],
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
