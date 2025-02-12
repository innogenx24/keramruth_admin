import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAp275MoLrazXRc35tvPtC4eE6tbH4T840",
  authDomain: "push-notification-625ed.firebaseapp.com",
  projectId: "push-notification-625ed",
  storageBucket: "push-notification-625ed.firebasestorage.app",
  messagingSenderId: "205908355450",
  appId: "1:205908355450:web:d0a7e5ec4d447461164ec3",
  measurementId: "G-F2KM9RFE8H"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

// Function to send token to the backend
const sendTokenToServer = async (token) => {
  try {
    const response = await fetch(`${API_END_POINT}/fcm/save-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    console.log("Token successfully stored:", result);
  } catch (error) {
    console.error("Error sending token to server:", error);
  }
};

// Request permission and get token
export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BEfBD1VZRFIXzBNG-dZO3wKKqjaRiAF-Kt5QjxPz2D-TEa66I7dSJQZMomVL5xXnHTpNXEKzrft_VfXUvzuhb04",
      });

      if (token) {
        console.log("FCM Token:", token);
        await sendTokenToServer(token); // Automatically store token in the database
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Listen for messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Message Received:", payload);
      resolve(payload);
    });
  });

export { messaging };
