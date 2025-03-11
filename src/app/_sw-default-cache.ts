import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "serwist";

// export const cacheKeyWillBeUsed = ({ request }: any) => {
//   const url = new URL(request.url);
//   return url.pathname; // Treat /abc?attempt=1 as /abc
// };

export const defaultCache = [
  {
    matcher: ({ request }: any) => request.destination === "document",
    // strategy: new NetworkFirst({
    //   cacheName: "pages",
    // }),
    strategy: new NetworkFirst({
      cacheName: "pages",
      matchOptions: {
        ignoreSearch: true, // Ignores query parameters when checking the cache
      },
      plugins: [
        {
          cacheKeyWillBeUsed: async ({ request }) => {
            const url = new URL(request.url);
            return url.pathname; // Treats `/delayed-gratification-task?attempt=1` as `/delayed-gratification-task`
          },
          cacheWillUpdate: async ({ response }) => {
            return response.status === 200 ? response : null;
          },
        },
      ],
    }),
  },
  {
    matcher: ({ request }: any) =>
      request.destination === "script" || request.destination === "style",
    strategy: new CacheFirst({
      cacheName: "assets",
    }),
  },
  {
    matcher({ request }: any) {
      return request.destination === "image";
    },
    strategy: new StaleWhileRevalidate({
      cacheName: "images",
    }),
  },
];
