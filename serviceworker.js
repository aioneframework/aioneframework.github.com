var CACHE = 'cache-v1';

this.addEventListener('install', function(event) {
  //console.log('The service worker is being installed');
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        'https://aioneframework.com/assets/images/aione-framework-logo-small.png',
        '/aioneframework/assets/css/aione.min.css',
        'https://fonts.googleapis.com/css?family=Open+Sans:100,300,400',
        '/assets/css/style.min.css',
        '/aioneframework/assets/js/vendor.min.js',
        '/aioneframework/assets/js/aione.min.js',
        //'assets/js/ga.min.js',
        '/index.html'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  //console.log('The service worker is serving the asset.');
  event.respondWith(fromCache(event.request));
  
  event.waitUntil(
    update(event.request).then(refresh)
  );
});

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: 'refresh',
        url: response.url,
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}