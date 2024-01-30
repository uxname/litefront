import React from "react";
import ReactDOM from "react-dom/client";

import "./index.scss";

import App from "./App.tsx";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
