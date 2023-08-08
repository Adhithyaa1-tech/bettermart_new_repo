import React from "react";
import ReactDOM from "react-dom/client";


import App from "./App";
import { Provider } from "react-redux";
import store, {persistor} from "./store";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { PersistGate } from "redux-persist/integration/react";
// import persistStore from 'redux-persist/es/persistStore';
import { ToastProvider } from "react-toast-notifications";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const root = ReactDOM.createRoot(document.getElementById("root"));
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

// const stripePromise = loadStripe("your_stripe_publishable_key");

root.render(
  <Provider store={store}>
    {/* <AlertProvider template={AlertTemplate} {...options}> */}
    <PersistGate loading={null} persistor={persistor}>
      {/* <ToastProvider autoDismiss autoDismissTimeout={5000} placement="top-left"> */}
      {/* <Provider store={store}> */}
        <App />
      {/* </Provider> */}
      
      {/* </ToastProvider> */}
    </PersistGate>

    {/* </AlertProvider> */}
  </Provider>
);
