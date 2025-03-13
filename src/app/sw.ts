// sw.ts
import { Serwist } from "serwist";
import { defaultCache } from "./_sw-default-cache";
import { BASE_URL } from "@constants/config.constant";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: Array<{ url: string; revision: string | null }>;
};

const CACHE_NAME = "api-cache-v2";

// Generate attempt URLs programmatically
const generateAttemptUrls = (basePath: string, attempts: number) =>
  Array.from({ length: attempts }, (_, i) => ({
    url: `${BASE_URL}${basePath}?attempt=${i + 1}`,
    revision: "v2",
  }));

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache.map((cache) => ({
    ...cache,
    handler: cache.strategy,
  })),
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

self.addEventListener("install", () => {
  const staticRoutes = [
    "/",
    "/survey",
    "/content",
    "/about",
    "/auth/login",
    "/motor-following-task",
    "/offline",
  ].map((path) => ({ url: `${BASE_URL}${path}`, revision: "v2" }));

  const dynamicRoutes = [
    { base: "/bubble-popping-task", attempts: 3 },
    { base: "/button-task", attempts: 3 },
    { base: "/wheel-task", attempts: 3 },
    { base: "/delayed-gratification-task", attempts: 3 },
    { base: "/synchrony-task", attempts: 3 },
    { base: "/preferential-looking-task", attempts: 3 },
  ].flatMap(({ base, attempts }) => generateAttemptUrls(base, attempts));

  serwist.addToPrecacheList([...staticRoutes, ...dynamicRoutes]);
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.delete(CACHE_NAME).then(() => {
      return caches.open(CACHE_NAME);
    })
  );
});

serwist.addEventListeners();
