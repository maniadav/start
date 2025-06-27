import { PrecacheEntry, Serwist, SerwistGlobalConfig } from "serwist";
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
          request.destination === "document",
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
  
  // Clean up old caches when a new service worker activates
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match current version
          if (cacheName.includes(CACHE_NAME) && !cacheName.includes(CACHE_VERSION)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle failed requests for versioned assets
self.addEventListener("fetch", (event) => {
  // If it's a request for a versioned chunk and it fails, don't cache the error
  if (event.request.url.includes("/_next/static/chunks/") && 
      event.request.url.match(/-[a-f0-9]+\.js$/)) {
    
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.log("Failed to fetch versioned chunk:", event.request.url);
        // For failed chunk requests, return a minimal response or let it fail gracefully
        // instead of serving a cached 404
        throw error;
      })
    );
  }
});
