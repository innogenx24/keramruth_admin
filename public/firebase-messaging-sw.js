importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyAu0NPso8TzG3YqV26hLm-pQr9Cp078cPk",
  authDomain: "keramruth-de041.firebaseapp.com",
  projectId: "keramruth-de041",
  storageBucket: "keramruth-de041.firebasestorage.app",
  messagingSenderId: "280064178508",
  appId: "1:280064178508:web:03ad0fbdad60bec1b9f7e9",
  measurementId: "G-06460TYWF8"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


//** Properly working onBackgroundMessage */
// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message: ", payload);

//   if (!payload.notification) {
//     return;
//   }

//   // Prevent duplicate notifications by using a unique "tag"
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//     tag: `notif-${payload.data.user_id}`, // Ensures only one notification per user
//     renotify: false,
//   };

//   self.registration.showNotification(payload.notification.title, notificationOptions);
// });

messaging.onBackgroundMessage(async (payload) => {
  console.log("Received background message: ", payload);

  if (!payload.notification) return;

  // Check existing notifications to prevent duplicates
  const existingNotifications = await self.registration.getNotifications();
  if (existingNotifications.some((n) => n.title === payload.notification.title)) {
    console.log("Duplicate notification prevented.");
    return;
  }

  // Show notification only if not already present
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
    tag: `notif-${payload.data.user_id}`, // Unique tag to prevent stacking
    renotify: false,
  });
});


// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  console.log("Notification Clicked:", event.notification);
});




















// //** These Link allow the service worker to communicate with Firebase Cloud Messaging (FCM).
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");


// const firebaseConfig = {
//   apiKey: "AIzaSyAp275MoLrazXRc35tvPtC4eE6tbH4T840",
//   authDomain: "push-notification-625ed.firebaseapp.com",
//   projectId: "push-notification-625ed",
//   storageBucket: "push-notification-625ed.firebasestorage.app",
//   messagingSenderId: "205908355450",
//   appId: "1:205908355450:web:d0a7e5ec4d447461164ec3",
//   measurementId: "G-F2KM9RFE8H"
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message: ", payload);

//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   });
// });

// //*****Service Worker for Background Notifications******///
// //--> Purpose: This file handles background push notifications when the web app is closed or in the background.

