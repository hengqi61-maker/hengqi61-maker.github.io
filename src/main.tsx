import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { HomeApp } from "./home/HomeApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HomeApp />
  </StrictMode>,
);
