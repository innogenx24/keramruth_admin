import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

//*** Disable all console errors ***//
// console.warn = function () {};
// console.error = function () {};
console.log = function () {};

//***This function is essential for handling background push notifications in your React web app.**///
//***It ensures users receive notifications even when the app is closed or minimized.***//
//***The file must be inside the public/ folder and registered in main.jsx.***//
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker Registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker Registration Failed:", error);
    });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

