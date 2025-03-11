// src/app/sw.ts
import { Serwist } from "serwist";
import { defaultCache } from "./_sw-default-cache";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: Array<{ url: string; revision: string | null }>;
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
    { url: "/about", revision: "v1" },
    { url: "/auth/login", revision: "v1" },
    { url: "/bubble-popping-task?attempt=1", revision: "v1" },
    { url: "/bubble-popping-task?attempt=2", revision: "v1" },
    { url: "/bubble-popping-task?attempt=3", revision: "v1" },
    { url: "/button-task", revision: "v1" },
    { url: "/content", revision: "v1" },
    { url: "/delayed-gratification-task", revision: "v1" },
    { url: "/motor-following-task", revision: "v1" },
    { url: "/offline", revision: "v1" },
    { url: "/", revision: "v1" },
    { url: "/survey", revision: "v1" },
  ]);
});

serwist.addEventListeners();
