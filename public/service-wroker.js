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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Define patterns for images and videos
  const isImageOrVideo = url.pathname.match(
    /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
  );

  if (isImageOrVideo) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then(async (networkResponse) => {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
          })
        );
      })
    );
  } else if (event.request.mode === "navigate") {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(dynamicCaching(request));
  }
});
