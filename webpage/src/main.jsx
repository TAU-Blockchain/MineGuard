import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3Provider>
      <HashRouter>
        <App />
      </HashRouter>
    </Web3Provider>
  </StrictMode>
);
