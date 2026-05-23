import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ToastProvider } from "./components/ToastProvider";

import { Toaster } from "react-hot-toast";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ToastProvider>
      <App />

      {/* GLOBAL TOASTER */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            background: "#111827",
            color: "#ffffff",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "14px",
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </ToastProvider>
  </React.StrictMode>
);