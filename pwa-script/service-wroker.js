const CACHE_NAME = "start-cache-v1";
const OFFLINE_PAGE = "/offline";

// Pre-cache important static assets
async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll([
    "/",
    "/manifest.json",
    "/video/",
    "/about",
    "/auth/login",
    "/bubble-popping-task",
    // "/button-task",
    "/content",
    // "/delayed-gratification-task",
    // "/motor-following-task",
    // "/preferential-looking-task",
    "/survey",
    // "/synchrony-task",
    // "/wheel-task",
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
    console.error("Network cache response:", networkResponse);
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
    /\.(?:png|jpg|ico|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
  );

  if (isImageOrVideo) {
    event.respondWith(cacheFirst(request));
    return;
  } else if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (request.url.includes("/_next/")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached asset or fetch and cache
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            const cacheCopy = fetchResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, cacheCopy));
            return fetchResponse;
          })
        );
      })
    );
  }

  event.respondWith(networkFirst(request));
});
