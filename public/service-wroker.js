const CACHE_NAME = "start-cache-v1";

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll([
    "/",
    "about",
    "auth/login",
    "bubble-popping-task",
    "button-task",
    "content",
    "delayed-gratification-task",
    "motor-following-task",
    "offline",
    "preferential-looking-task",
    "survey",
    "synchrony-task",
    "wheel-task",
  ]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

// remove all old caches
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

async function dynamicCaching(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    await cache.put(request, responseClone);
    return response;
  } catch (error) {
    console.error("Dynamic caching failed:", error);
    return caches.match(request);
  }
}

async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const responseClone = networkResponse.clone();
    await cache.put(request, responseClone);
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return caches.match("/offline");
  }
}

// Network-first strategy with cache fallback
async function networkFirstWithFallback(request, isNavigation) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Update cache with fresh response
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // Network failed - try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cache and it's a navigation request, show offline page
    if (isNavigation) {
      return caches.match("/offline");
    }

    // For media requests with no cache, let browser handle failure
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Detect if it's a navigation request
  const isNavigation = request.mode === "navigate";

  // Detect media files
  const isMedia = url.pathname.match(
    /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
  );

  // Apply network-first strategy to media and navigation
  if (isMedia || isNavigation) {
    event.respondWith(networkFirstWithFallback(request, isNavigation));
  } else {
    // For other requests, use default strategy (network first with cache fallback)
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache with fresh response
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});

// self.addEventListener("fetch", (event) => {
//   const { request } = event;
//   const url = new URL(request.url);

//   // Define patterns for images and videos
//   const isImageOrVideo = url.pathname.match(
//     /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
//   );

//   if (isImageOrVideo) {
//     event.respondWith(
//       caches.match(request)        .then((cachedResponse) => {
//           return (
//           cachedResponse ||
//           fetch(request).then(async (networkResponse) => {
//           const cache = await           caches.open(CACHE_NAME);
// cache.put(request, networkResponse.clone());
//           return networkResponse;
//         })
//         );
//       })
//     );
//   } else if (event.request.mode === "navigate") {
//     event.respondWith(cacheFirstStrategy(request));
//   } else {
//     event.respondWith(dynamicCaching(request)    );
//   }
// });
