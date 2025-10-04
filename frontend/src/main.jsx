import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CreateDeckPage from "./pages/CreateDeckPage.jsx";
import PresenterPage from "./pages/PresenterPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LandingPage />} />
          <Route path="create" element={<CreateDeckPage />} />
          <Route path="present" element={<PresenterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
