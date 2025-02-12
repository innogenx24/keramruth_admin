import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import RoutesConfig from "./routes";
import { requestForToken, onMessageListener } from "../firebase-config";

const App = () => {
  useEffect(() => {
    requestForToken();

    onMessageListener()
      .then((payload) => {
        console.log("Message received in foreground:", payload);
        alert(`Notification: ${payload.notification.title}`);
      })
      .catch((err) => console.log("FCM Listener Error: ", err));
  }, []);

  return (
    <Provider store={store}>
      <RoutesConfig />
    </Provider>
  );
};

export default App;
