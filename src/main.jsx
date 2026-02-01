import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "./contexts/ConfigContext.jsx";
import NotificationContextProvider from "./contexts/NotificationContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
