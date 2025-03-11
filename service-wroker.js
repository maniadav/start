const CACHE_NAME = "start-test-cache-v1";

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll([
    "/",
    "/about",
    "/survey",
    "/content",
    "/auth/login",
    "/motor-following-task",
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

  // Log the request URL for debugging
  console.log("Fetching:", request.url);

  // Filter out unsupported schemes
  if (request.url.startsWith("chrome-extension")) {
    return fetch(request);
  }

  try {
    // Attempt to fetch the resource from the network
    console.log("Fallback to Network:", request.url);
    const response = await fetch(request);

    // Check if the response is valid
    if (!response || response.status !== 200 || response.type !== "basic") {
      console.error("invalid response", response);
      throw new Error("Invalid response");
    }

    // Cache the response
    const responseClone = response.clone();
    await cache.put(request, responseClone);
    console.log("response cached successfully");
    // Return the response
    return response;
  } catch (error) {
    console.log("Dynamic caching failed:", error);

    // Serve a fallback response from the cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log("Serving from cache:", request.url);
      return cachedResponse;
    }

    // If no cached response is available, return a fallback
    return new Response("Resource not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
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
    return caches.match("/fallback");
  }
}

// Function to cache all images & videos from the `public` folder dynamically

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  console.log("Fetching:", url.pathname); // Log the request URL

  const isImageOrVideo = url.pathname.match(
    /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
  );

  if (isImageOrVideo) {
    console.log("Image or video detected:", url.pathname); // Log if image or video is detected
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("Serving from cache:", url.pathname);
          return cachedResponse;
        }
        console.log("Fetching from network:", url.pathname);
        return fetch(request).then(async (networkResponse) => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      })
    );
  } else if (url.origin === "ifanyapicalfordata") {
    console.log("API request");
  } else if (event.request.mode === "navigate") {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(dynamicCaching(request));
  }
});
