// firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB0oCUD-94aeMeFljM2DCQshmFBeXrFLM",
  authDomain: "bronotify-9390b.firebaseapp.com",
  projectId: "bronotify-9390b",
  storageBucket: "bronotify-9390b.firebasestorage.app",
  messagingSenderId: "713424525395",
  appId: "1:713424525395:web:7c073ec00dda9b704ccea6",
  measurementId: "G-EWY59GVE3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request permission for notifications and get FCM token
const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "Ejss16FJXk_YViEuRCrutT5FW3En5KHgw1D__T7DGHA", // Replace with your VAPID key
      });
      console.log("FCM Token:", token); // Log the token (store this for sending notifications)
    } else {
      console.log("Notification permission denied");
    }
  } catch (error) {
    console.error("Error getting permission or token:", error);
  }
};

// Listen for incoming messages when the app is in the foreground
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  // Customize how you handle the notification (alert, in-app message, etc.)
  alert(`New notification: ${payload.notification.title}`);
});

// Run the requestPermission function to request permission and get the token
requestPermission();

export { messaging };
