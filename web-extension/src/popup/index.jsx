import { createRoot } from "react-dom/client";
import "../index.css";
import Popup from "./Popup";
import { Web3Provider } from "../context/Web3Context";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Web3Provider>
    <Popup />
  </Web3Provider>
);
