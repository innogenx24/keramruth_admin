import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp275MoLrazXRc35tvPtC4eE6tbH4T840",
  authDomain: "push-notification-625ed.firebaseapp.com",
  projectId: "push-notification-625ed",
  storageBucket: "push-notification-625ed.firebasestorage.app",
  messagingSenderId: "205908355450",
  appId: "1:205908355450:web:d0a7e5ec4d447461164ec3",
  measurementId: "G-F2KM9RFE8H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

/**
 * Sends FCM token to the backend server
 * @param {string} token - FCM token
 * @param {string} userId - User ID
 * @param {string} role - User role
 */
const sendTokenToServer = async (token, userId, role) => {
  try {
    const response = await fetch(`${API_END_POINT}/fcm/save-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, userId, role }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send token: ${response.statusText}`);
    }

    console.log("FCM token successfully sent to the server.");
  } catch (error) {
    console.error("Error storing FCM token:", error);
  }
};

/**
 * Requests notification permission and retrieves FCM token
 * @param {string} userId - User ID
 * @param {string} role - User role
 */
export const requestForToken = async (userId, role) => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BEfBD1VZRFIXzBNG-dZO3wKKqjaRiAF-Kt5QjxPz2D-TEa66I7dSJQZMomVL5xXnHTpNXEKzrft_VfXUvzuhb04",
      });

      if (token) {
        console.log("FCM Token:", token);
        await sendTokenToServer(token, userId, role);
      } else {
        console.warn("No FCM token available.");
      }
    } else {
      console.warn("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error retrieving FCM token:", error);
  }
};

/**
 * Listens for incoming foreground push notifications
 * @returns {Promise} Resolves with the notification payload
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Message Received:", payload);
      resolve(payload);
    });
  });

// Export messaging instance
export { messaging };
