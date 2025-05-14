self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activated');
  });
  
  // You can later add notification or push event logic here
  