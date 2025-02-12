importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyAp275MoLrazXRc35tvPtC4eE6tbH4T840",
  authDomain: "push-notification-625ed.firebaseapp.com",
  projectId: "push-notification-625ed",
  storageBucket: "push-notification-625ed.firebasestorage.app",
  messagingSenderId: "205908355450",
  appId: "1:205908355450:web:d0a7e5ec4d447461164ec3",
  measurementId: "G-F2KM9RFE8H"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});

