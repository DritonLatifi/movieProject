async function addResourcesToCache(resources) {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
}

self.addEventListener("install", async function (event) {
    event.waitUntil(
        addResourcesToCache([
            "/"
        ])
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then(async (response) => {
          return caches.open("v1").then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });