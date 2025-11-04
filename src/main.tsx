<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el contenedor principal #root");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el contenedor principal #root");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> dfff0bb (Estudiante ya puede tener mas clases)
