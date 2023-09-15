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
        '/src/assets/imgs/gang.webp',
        '/src/assets/imgs/girl.jpeg',
        '/src/assets/imgs/car.webp',
        '/src/assets/imgs/vue.png',
        '/src/assets/icons/refresh.svg',
        '/src/assets/videos/video.m4s',
        '/src/assets/icons/logo.ico'

    ]);
    })
);
});

self.addEventListener('activate', (event) => {
  console.log('activate')
  event.waitUntil(
    // 执行激活操作，例如清理旧缓存
    self.clients.claim() // 强制激活新版本，跳过等待
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch')
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  

  