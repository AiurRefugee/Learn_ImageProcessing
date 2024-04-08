const baseUrl = '/'
self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([  
            '/imgs/Lena.png',
            '/imgs/line.png', 
            '/imgs/milkyWay.jpg',
            '/imgs/gundam.jpeg', 
            '/imgs/trans.webp',
            '/imgs/gang.webp',
            '/imgs/girl.jpeg',
            '/imgs/car.webp',  
  
            '/opencv/worker.js',
            '/opencv/opencv.js',
            '/opencv/haarcascade_frontalface_default.xml',
            '/opencv/haarcascade_eye.xml',
             
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
      if(event.request.url === self.origin + '/' ||
        event.request.url === self.origin + '/imageProcessing/image' ||
        event.request.url === self.origin + '/imageProcessing/video' ||
        event.request.url === self.origin + '/imageProcessing/camera') { 
        event.respondWith(
          caches.match('/index.html').then(function(response) {
            return response || fetch(event.request);
          })
          
        );
      } else {
        event.respondWith(
          caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
          })
        );
      }
    });
    
  
    