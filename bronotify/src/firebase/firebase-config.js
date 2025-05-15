import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAB0oCUD-94aeMeFljM2DCQshmFBeXrFLM",
  authDomain: "bronotify-9390b.firebaseapp.com",
  projectId: "bronotify-9390b",
  storageBucket: "bronotify-9390b.appspot.com",
  messagingSenderId: "713424525395",
  appId: "1:713424525395:web:7c073ec00dda9b704ccea6",
  measurementId: "G-EWY59GVE3L"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
