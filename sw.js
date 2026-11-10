"use strict";

const CACHE_PREFIX = "mk-gateway-shell-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const SHELL_URLS = [
  "./",
  "./manifest.webmanifest",
  "./icons/mk-system.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const rootDocument = url.pathname === new URL("./", self.registration.scope).pathname ||
    url.pathname === new URL("./index.html", self.registration.scope).pathname;
  const shellAsset = rootDocument ||
    url.pathname === new URL("./manifest.webmanifest", self.registration.scope).pathname ||
    url.pathname === new URL("./icons/mk-system.svg", self.registration.scope).pathname;

  // Leave production sub-apps and all dynamic API traffic entirely untouched.
  if (!shellAsset) return;

  if (request.mode === "navigate" && rootDocument) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./", copy));
        }
        return response;
      }).catch(async () => {
        const cached = await caches.match("./");
        return cached || Response.error();
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});
