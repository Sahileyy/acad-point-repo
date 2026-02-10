import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginRegister from "./components/LoginRegister";
import StudentDashboard from "./components/StudentDashboard";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
    </Routes>
  </BrowserRouter>
);
