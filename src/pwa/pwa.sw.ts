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
import { dynamicRouteConfigs, dynamicRoutes, staticRoutes } from "./pwa.routes";

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
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },
    {
      // CacheFirst for Next.js static assets (CSS, JS, fonts)
      matcher: ({ url }: { url: URL }) =>
        url.pathname.startsWith("/_next/static/"),
      handler: "CacheFirst" as unknown as RouteHandler,
      options: {
        cacheName: `${CACHE_NAME}-next-static`,
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
              const url = new URL(request.url);
              // Remove version parameters for cache key consistency
              url.search = '';
              return url.href;
            },
            cacheWillUpdate: async ({ response }: { response: Response }) => {
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },
    {
      // CacheFirst for fonts specifically
      matcher: ({ request }: { request: Request }) =>
        request.destination === "font" || 
        request.url.includes('.woff') || 
        request.url.includes('.woff2') || 
        request.url.includes('.ttf') || 
        request.url.includes('.otf'),
      handler: "CacheFirst" as unknown as RouteHandler,
      options: {
        cacheName: `${CACHE_NAME}-fonts`,
        plugins: [
          {
            cacheWillUpdate: async ({ response }: { response: Response }) => {
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },
    {
      // CacheFirst for CSS files
      matcher: ({ request }: { request: Request }) =>
        request.destination === "style" || request.url.includes('.css'),
      handler: "CacheFirst" as unknown as RouteHandler,
      options: {
        cacheName: `${CACHE_NAME}-styles`,
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
              const url = new URL(request.url);
              // Remove version parameters for cache key consistency
              url.search = '';
              return url.href;
            },
            cacheWillUpdate: async ({ response }: { response: Response }) => {
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },
    {
      // CacheFirst for JavaScript files
      matcher: ({ request }: { request: Request }) =>
        request.destination === "script" || request.url.includes('.js'),
      handler: "CacheFirst" as unknown as RouteHandler,
      options: {
        cacheName: `${CACHE_NAME}-scripts`,
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
              const url = new URL(request.url);
              // Remove version parameters for cache key consistency
              url.search = '';
              return url.href;
            },
            cacheWillUpdate: async ({ response }: { response: Response }) => {
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },
    {
      matcher: ({ url }: { url: URL }) => {
        // Match any of the dynamic routes with or without attempt parameter
        return dynamicRouteConfigs.some(
          ({ base }) =>
            url.pathname === base || url.pathname.startsWith(`${base}/`)
        );
      },
      handler: "NetworkFirst" as unknown as RouteHandler,
      options: {
        cacheName: `${CACHE_NAME}-dynamic-routes`,
        networkTimeoutSeconds: 10,
        plugins: [
          {
            cacheWillUpdate: async ({ response }: { response: Response }) => {
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      },
    },
    // Include default cache strategies for any other assets
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
