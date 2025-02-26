// const CACHE_NAME = "start-cache-v1";

// async function cacheCoreAssets() {
//   const cache = await caches.open(CACHE_NAME);
//   return cache.addAll([
//     "/",
//     "/about",
//     "/auth/login",
//     "/bubble-popping-task",
//     // "/button-task",
//     // "/content",
//     // "/delayed-gratification-task",
//     // "/motor-following-task",
//     // "/offline",
//     // "/preferential-looking-task",
//     // "/survey",
//     // "/synchrony-task",
//     // "/wheel-task",
//   ]);
// }

// self.addEventListener("install", (event) => {
//   event.waitUntil(cacheCoreAssets());
//   self.skipWaiting();
// });

// // remove all old caches
// async function clearOldCaches() {
//   const cacheNames = await caches.keys();
//   return Promise.all(
//     cacheNames
//       .filter((name) => name !== CACHE_NAME)
//       .map((name) => caches.delete(name))
//   );
// }

// self.addEventListener("activate", (event) => {
//   event.waitUntil(clearOldCaches());
//   self.clients.claim();
// });

// async function cacheFirstStrategy(request) {
//   try {
//     const cache = await caches.open(CACHE_NAME);
//     const cachedResponse = await cache.match(request);

//     if (cachedResponse) {
//       return cachedResponse;
//     }

//     const networkResponse = await fetch(request);
//     const responseClone = networkResponse.clone();
//     await cache.put(request, responseClone);
//     return networkResponse;
//   } catch (error) {
//     console.error("Cache first strategy failed:", error);
//     return caches.match("/offline");
//   }
// }

// // Function to cache all images & videos from the `public` folder dynamically

// self.addEventListener("fetch", (event) => {
//   const { request } = event;
//   const url = new URL(request.url);

//   // Define patterns for images and videos
//   const isImageOrVideo = url.pathname.match(
//     /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
//   );

//   if (isImageOrVideo) {
//     event.respondWith(
//       caches.match(request).then((cachedResponse) => {
//         return (
//           cachedResponse ||
//           fetch(request).then(async (networkResponse) => {
//             const cache = await caches.open(CACHE_NAME);
//             cache.put(request, networkResponse.clone());
//             return networkResponse;
//           })
//         );
//       })
//     );
//   } else if (event.request.mode === "navigate") {
//     event.respondWith(cacheFirstStrategy(request));
//   } else {
//     event.respondWith(dynamicCaching(request));
//   }
// });

const CACHE_NAME = "start-cache-v1";
const OFFLINE_PAGE = "/offline";

// Pre-cache important static assets
async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll([
    "/",
    "/about",
    "/auth/login",
    "/bubble-popping-task",
    "/button-task",
    "/content",
    "/delayed-gratification-task",
    "/motor-following-task",
    "/preferential-looking-task",
    "/survey",
    "/synchrony-task",
    "/wheel-task",
    OFFLINE_PAGE,
  ]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

// Remove old caches
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error("Cache First failed:", error);

    if (request.mode === "navigate") return caches.match(OFFLINE_PAGE);

    return new Response("Failed to fetch resource", { status: 500 });
  }
}

// 🌐 Network First Strategy
async function networkFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error("Network First failed:", error);
    const cachedResponse = await caches.match(request);

    // 🚀 Redirect to offline page if it's a navigation request
    if (!cachedResponse && request.mode === "navigate") {
      return caches.match(OFFLINE_PAGE);
    }

    return (
      cachedResponse ||
      new Response("Failed to fetch resource", { status: 500 })
    );
  }
}

// 🔥 Fetch Event Handling
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  const isImageOrVideo = url.pathname.match(
    /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
  );

  if (isImageOrVideo || event.request.mode === "navigate") {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 🌐 Handle API Calls (Network First)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
