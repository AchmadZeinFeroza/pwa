var CACHE_NAME = 'my-site-cache-v2'
var urlsToCache = [
  '/',
  '/css/bootstrap.min.css',
  '/js/jquery-3.5.0.min.js',
  '/js/main.js',
  '/fallback.json',
  '/manifest.json',
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {

  var request = event.request
  var url = new URL(request.url)

  // memisahkan API dan Internal cache

  if (url.origin === location.origin) {

    event.respondWith(

      caches.match(url).then(function (response) {
        return response.json()

      })
    )
  } else {
    caches.open('products-api').then(function (cache) {
      return fetch(request).then(function (LiveResponse) {
        cache.put(request, LiveResponse.clone())
        return LiveResponse
      })
    }).catch(function () {
      caches.match(request).then(function (response) {
        if (response) {
          return response
        } else {
          return caches.match('/fallback.json')
        }
      })
    })
  }
});


self.addEventListener('activate', function (event) {

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName = !CACHE_NAME
        }).map(function (cacheName) {
          return caches.delete(cacheName)
        })
      );
    })
  );
});