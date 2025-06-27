import { RuntimeCaching } from "serwist";
import { CACHE_NAME } from "./pwa.config.constant";
import { dynamicRouteConfigs } from "./pwa.routes";
import { defaultCache } from "@serwist/next/worker";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "serwist";

export const runtimeCacheConfig = [
  {
    // NetworkFirst for all navigation/document requests (HTML pages)
    matcher: ({ request }: { request: Request }) =>
      request.destination === "document" && request.mode === "navigate",
    handler: new NetworkFirst({
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
    }),
  },
  {
    // CacheFirst for Next.js static assets (CSS, JS, fonts)
    matcher: ({ url }: { url: URL }) =>
      url.pathname.startsWith("/_next/static/"),
    handler: new CacheFirst({
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
    }),
  },
  {
    // CacheFirst for fonts specifically
    matcher: ({ request }: { request: Request }) =>
      request.destination === "font" || 
      request.url.includes('.woff') || 
      request.url.includes('.woff2') || 
      request.url.includes('.ttf') || 
      request.url.includes('.otf'),
    handler: new CacheFirst({
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
    }),
  },
  {
    // CacheFirst for CSS files
    matcher: ({ request }: { request: Request }) =>
      request.destination === "style" || request.url.includes('.css'),
    handler: new CacheFirst({
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
    }),
  },
  {
    // CacheFirst for JavaScript files
    matcher: ({ request }: { request: Request }) =>
      request.destination === "script" || request.url.includes('.js'),
    handler: new CacheFirst({
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
    }),
  },
  {
    // CacheFirst for images
    matcher: ({ request }: { request: Request }) =>
      request.destination === "image",
    handler: new CacheFirst({
      cacheName: `${CACHE_NAME}-images`,
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
    }),
  },
  {
    // NetworkFirst for dynamic routes
    matcher: ({ url }: { url: URL }) => {
      // Match any of the dynamic routes with or without attempt parameter
      return dynamicRouteConfigs.some(
        ({ base }) =>
          url.pathname === base || url.pathname.startsWith(`${base}/`)
      );
    },
    handler: new NetworkFirst({
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
    }),
  },
  // Include default cache strategies for any other assets
  ...defaultCache,
] as RuntimeCaching[];
