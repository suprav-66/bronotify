// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAB0oCUD-94aeMeFljM2DCQshmFBeXrFLM",
  authDomain: "bronotify-9390b.firebaseapp.com",
  projectId: "bronotify-9390b",
  storageBucket: "bronotify-9390b.firebasestorage.app",
  messagingSenderId: "713424525395",
  appId: "1:713424525395:web:7c073ec00dda9b704ccea6",
  measurementId: "G-EWY59GVE3L"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg', // your icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
