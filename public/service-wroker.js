const CACHE_NAME = "start-test-cache-v1";

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(["/", "/about", "survey"]);
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

// async function dynamicCaching(request) {
//   const cache = await caches.open(CACHE_NAME);

//   try {
//     const response = await fetch(request);
//     const responseClone = response.clone();
//     await cache.put(request, responseClone);
//     return response;
//   } catch (error) {
//     console.error("Dynamic caching failed:", error);
//     return caches.match(request);
//   }
// }

// function openDb() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(DB_NAME, DB_VERSION);
//     request.onsuccess = () => resolve(request.result);
//     request.onerror = () => reject(request.error);
//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;
//       db.createObjectStore(DB_STORE_NAME, { keyPath: "url" });
//     };
//   });
// }

// async function addData(url, jsonData) {
//   const db = await openDb();
//   const transaction = db.transaction(DB_STORE_NAME, "readwrite");
//   const store = transaction.objectStore(DB_STORE_NAME);

//   const data = {
//     url,
//     response: JSON.stringify(jsonData),
//   };

//   const request = store.put(data);
//   await new Promise((resolve, reject) => {
//     request.onsuccess = () => resolve();
//     request.onerror = () => reject(request.error);
//   });
// }

// async function getData(url) {
//   try {
//     const db = await openDb();
//     const transaction = db.transaction(DB_STORE_NAME, "readonly");
//     const store = transaction.objectStore(DB_STORE_NAME);

//     const request = store.get(url);

//     const result = await new Promise((resolve, reject) => {
//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject(request.error);
//     });

//     if (result && result.response) {
//       return JSON.parse(result.response);
//     }

//     return null;
//   } catch (error) {
//     console.error("Error retrieving from IndexedDB:", error);
//     return null;
//   }
// }

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

// async function networkFirstStrategy(request) {
//   try {
//     const networkResponse = await fetch(request);

//     if (networkResponse.ok) {
//       const responseClone = networkResponse.clone();
//       const responseData = await responseClone.json();
//       await addData(request.url, responseData);
//       return networkResponse;
//     }

//     throw new Error("Network response was not ok");
//   } catch (error) {
//     console.error("Network first strategy failed:", error);
//     const cachedResponse = await getData(request.url);

//     if (cachedResponse) {
//       console.log("Using cached response:", cachedResponse);
//       return new Response(JSON.stringify(cachedResponse), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response("[]", { status: 200 });
//   }
// }

// self.addEventListener("fetch", (event) => {
//   const { request } = event;
//   const url = new URL(request.url);

//   if (url.origin === "https://www.omdbapi.com") {
//     event.respondWith(networkFirstStrategy(request));
//   } else if (event.request.mode === "navigate") {
//     event.respondWith(cacheFirstStrategy(request));
//   } else {
//     event.respondWith(dynamicCaching(request));
//   }
// });

// Function to cache all images & videos from the `public` folder dynamically

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Define patterns for images and videos
  const isImageOrVideo = url.pathname.match(
    /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|webm|ogg|mov|avi)$/i
  );

  // Cache specific routes
  // const shouldCacheRoute = ["/about", "/survey"].includes(url.pathname);

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
  } else if (url.origin === "ifanyapicalfordata") {
    // event.respondWith(networkFirstStrategy(request));
    console.log("API request");
  } else if (event.request.mode === "navigate") {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(dynamicCaching(request));
  }
});
