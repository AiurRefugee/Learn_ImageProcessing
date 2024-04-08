const baseUrl = '/'
self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([ 
            '/imgs/element-plus-logo.svg', 
            '/imgs/Lena.png',
            '/imgs/line.png',
            '/imgs/logo.svg',
            '/imgs/milkyWay.jpg',
            '/imgs/gundam.jpeg',
            '/imgs/opencv.png',
            '/imgs/trans.webp',
            '/imgs/gang.webp',
            '/imgs/girl.jpeg',
            '/imgs/car.webp',
            '/imgs/vue.png',
            '/icons/logo.ico', 
  
            '/opencv/worker.js',
            '/opencv/opencv.js',
            '/opencv/haarcascade_frontalface_default.xml',
            '/opencv/haarcascade_eye.xml',
  
            '/serviceWorker.js',
            '/sw.js',
  
            '/assets/CameraModule-cc1b9724.css',
            '/assets/CameraModule-d5a07f2b.js',
            '/assets/ImageModule-019c4444.js',
            '/assets/ImageModule-a23667d2.css',
            '/assets/ImageProcessing-00bd7d84.css',
            '/assets/ImageProcessing-93e5f477.js',
            '/assets/index-6835fe3c.js',
            '/assets/index-32539650.css',
            '/assets/NoCamera-455afb62.js',
            '/assets/NoCamera-acbd8978.css',
            '/assets/VideoModule-540875f5.css',
            '/assets/VideoModule-664642a7.js',
            '/assets/welcome-8e2d9fb1.js',
            '/assets/welcome-694e3202.css',

           '/index.html', 
             
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
    
  
    