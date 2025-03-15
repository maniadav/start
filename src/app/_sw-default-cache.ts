// _sw-default-cache.ts
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "serwist";

const CACHE_NAMES = {
  PAGES: "pages-v2",
  ASSETS: "assets-v2",
  IMAGES: "images-v2",
  CDN: "cdn-models-v1",
  DATA: "dynamic-data-v1",
};

const commonPlugins = [
  {
    cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      return url.href; // Maintain full URL including query params for non-page resources
    },
    cacheWillUpdate: async ({ response }: { response: Response }) => {
      return response.status === 200 ? response : null;
    },
  },
];

export const defaultCache = [
  // Network-first for HTML pages
  {
    matcher: ({ request }: { request: Request }) =>
      request.destination === "document" && request.mode === "navigate",
    strategy: new NetworkFirst({
      cacheName: CACHE_NAMES.PAGES,
      networkTimeoutSeconds: 3,
      matchOptions: { ignoreSearch: true },
      plugins: [
        {
          cacheKeyWillBeUsed: async ({ request }) => {
            const url = new URL(request.url);
            return url.pathname; // Ignore query params for page cache
          },
        },
      ],
    }),
  },
  // Cache-first for CDN resources (models, etc.)
  {
    matcher: ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      // Update this pattern to match your CDN URLs
      return (
        url.origin === "https://your-cdn-domain.com" ||
        url.pathname.includes("/models/")
      );
    },
    strategy: new CacheFirst({
      cacheName: CACHE_NAMES.CDN,
      plugins: commonPlugins,
    }),
  },
  // Stale-while-revalidate for other assets
  {
    matcher: ({ request }: { request: Request }) =>
      ["script", "style", "font"].includes(request.destination),
    strategy: new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.ASSETS,
      plugins: commonPlugins,
    }),
  },
  // Cache images
  {
    matcher: ({ request }: { request: Request }) =>
      request.destination === "image",
    strategy: new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.IMAGES,
      plugins: commonPlugins,
    }),
  },
];
