// src/app/sw.ts
import { Serwist } from "serwist";
import { defaultCache } from "./_sw-default-cache";
import { BASE_URL } from "@constants/config.constant";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: Array<{
    url: string;

    revision: string | null;
  }>;
};

// Initialize Serwist with auto-precaching
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST, // From next.config.js
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache.map((cache) => ({
    ...cache,
    handler: cache.strategy,
  })),
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return (
            request.destination === "document" && request.mode === "navigate"
          );
        },
      },
    ],
  },
});

// Add manual entries using Serwist's built-in methods
self.addEventListener("install", () => {
  serwist.addToPrecacheList([
    { url: `${BASE_URL}/about`, revision: "v1" },
    { url: `${BASE_URL}/auth/login`, revision: "v1" },
    { url: `${BASE_URL}/bubble-popping-task?attempt=1`, revision: "v1" },
    { url: `${BASE_URL}/bubble-popping-task?attempt=2`, revision: "v1" },
    { url: `${BASE_URL}/bubble-popping-task?attempt=3`, revision: "v1" },
    { url: `${BASE_URL}/button-task`, revision: "v1" },
    { url: `${BASE_URL}/content`, revision: "v1" },
    { url: `${BASE_URL}/delayed-gratification-task`, revision: "v1" },
    { url: `${BASE_URL}/motor-following-task`, revision: "v1" },
    { url: `${BASE_URL}/offline`, revision: "v1" },
    { url: `${BASE_URL}/`, revision: "v1" },
    { url: `${BASE_URL}/survey`, revision: "v1" },
  ]);
});

serwist.addEventListeners();
