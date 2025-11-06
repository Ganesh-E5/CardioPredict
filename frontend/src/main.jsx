import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./AppLayout.jsx";
import PredictPage from "./pages/PredictPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import "./index.css";

// Define your routes
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <PredictPage /> },
      { path: "/result", element: <ResultPage /> },
    ],
  },
]);
// Render the router provider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
