import { NetworkFirst, StaleWhileRevalidate } from "serwist";
import { CACHE_NAME, CACHE_VERSION } from "./pwa.config.constant";

const CACHE_NAMES = {
  PAGES: `${CACHE_NAME}-pages-${CACHE_VERSION}`,
  ASSETS: `${CACHE_NAME}-assets-${CACHE_VERSION}`,
  IMAGES: `${CACHE_NAME}-images-${CACHE_VERSION}`,
  CDN: `${CACHE_NAME}-cdn-${CACHE_VERSION}`,
  DATA: `${CACHE_NAME}-data-${CACHE_VERSION}`,
};

const commonPlugins = [
  {
    cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      return url.href; //  full URL including query params
    },
    cacheWillUpdate: async ({ response }: { response: Response }) => {
      return response.status === 200 ? response : null;
    },
  },
];

export const defaultCache = [
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
            return url.pathname;
          },
        },
      ],
    }),
  },

  {
    matcher: ({ request }: { request: Request }) =>
      ["script", "style", "font"].includes(request.destination),
    strategy: new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.ASSETS,
      plugins: commonPlugins,
    }),
  },

  {
    matcher: ({ request }: { request: Request }) =>
      request.destination === "image",
    strategy: new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.IMAGES,
      plugins: commonPlugins,
    }),
  },
];
