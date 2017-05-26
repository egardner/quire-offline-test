const VERSION = 'v1::';
const STATIC_CACHE_NAME = 'quire-app-static';

// Hack to make this work on GH pages
const URL_PREFIX = '/quire-offline-test';
// const URL_PREFIX = '';

console.log(`installing service-worker.js`);

const CACHE_STATIC = [
  '/assets/css/application.css',
  '/assets/js/application.js',
  '/assets/img/cover_bg.jpg',

  '/',
  '/index.html',
  '/about/',
  '/about/index.html',
  '/bibliography/',
  '/bibliography/index.html',
  '/catalogue/',
  '/catalogue/1/',
  '/catalogue/1/index.html',
  '/catalogue/2/',
  '/catalogue/2/index.html',
  '/catalogue/gaul/',
  '/catalogue/gaul/index.html',
  '/catalogue/italy/',
  '/catalogue/italy/index.html',
  '/contents/',
  '/contents/index.html',
  '/foreword/',
  '/foreword/index.html',
  '/introduction/',
  '/introduction/index.html',

  '/figures/fig01.jpg',

  '/sample-geojson.json',
  '/search.json'
];

/*
  The install event fires when the service worker is first installed.
  You can use this event to prepare the service worker to be able to serve
  files while visitors are offline.
*/
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(VERSION + STATIC_CACHE_NAME)
      .then(function(cache) {
        var prefixedURLs = CACHE_STATIC.map(function(i) { return URL_PREFIX + i })
        return cache.addAll(prefixedURLs);
      })
  );
});

/*
  The activate event fires after a service worker has been successfully installed.
  It is most useful when phasing out an older version of a service worker, as at
  this point you know that the new worker was installed correctly. In this example,
  we delete old caches that don't match the version in the worker we just finished
  installing.
*/
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(
          keys.filter(function (key) {
            return !key.startsWith(VERSION);
          }).map(function (key) {
            return caches.delete(key);
          })
        );
      })
      .then(function() {
        console.log('WORKER: activate completed.');
      })
  );
});

/*
  The fetch event fires whenever a page controlled by this service worker requests
  a resource. This isn't limited to `fetch` or even XMLHttpRequest. Instead, it
  comprehends even the request for the HTML page on first load, as well as JS and
  CSS resources, fonts, any images, etc.
*/
this.addEventListener('fetch', function(event) {
    console.log('WORKER: fetch event in progress.');

  // Only handle GET requests this way
  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        // Produce an "eventually fresh" response; return cached result first,
        // then store a network response in the cache
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);

        console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || networked;

        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();
          console.log('WORKER: fetch response from network.', event.request.url);

          caches
            // Open a cache to store the response for this request.
            .open(VERSION + 'pages')
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            })
            .then(function() {
              console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

          return response;
        }

        function unableToResolve () {
          console.log('WORKER: fetch request failed in both cache and network.');
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});
