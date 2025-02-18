import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import RoutesConfig from "./routes";
import { requestForToken, onMessageListener } from "../firebase-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {


  useEffect(() => {
    requestForToken(); 
    onMessageListener()
      .then((payload) => {
        console.log("Message received in foreground:", payload);
        // alert(`Notification: ${payload.notification.title}`);
        toast.info(payload.notification.title, {
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => console.log("FCM Listener Error: ", err));
  }, []);

  return (
    <Provider store={store}>
      <RoutesConfig />
      <ToastContainer />
    </Provider>
  );
};

export default App;