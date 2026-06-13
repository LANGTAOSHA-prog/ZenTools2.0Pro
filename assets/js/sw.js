const CACHE_NAME = "zentools-ultra-v1";

const FILES = [
  "/",
  "/index.html",
  "/assets/css/style.css",
  "/assets/js/core.js"
];

self.addEventListener("install", e => {

  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
  );

});

self.addEventListener("fetch", e => {

  e.respondWith(

    caches.match(e.request)
      .then(res =>
        res || fetch(e.request)
      )

  );

});
