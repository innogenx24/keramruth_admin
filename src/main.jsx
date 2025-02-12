import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Disable all console errors
console.warn = function () {};
console.error = function () {};
// console.log = function () {};

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

