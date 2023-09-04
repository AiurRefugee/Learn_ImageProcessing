self.addEventListener('install', function(event) {
event.waitUntil(
    caches.open('v1').then(function(cache) {
    return cache.addAll([ 
        '/src/assets/imgs/element-plus-logo.svg', 
        '/src/assets/imgs/Lena.png',
        '/src/assets/imgs/line.png',
        '/src/assets/imgs/logo.svg',
        '/src/assets/imgs/milkyWay.jpg',
        '/src/assets/imgs/opencv.png',
        '/src/assets/imgs/trans.webp',
        '/src/assets/imgs/vue.png',
        '/src/assets/icons/refresh.svg',
        '/src/assets/videos/video.m4s',

    ]);
    })
);
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  

  