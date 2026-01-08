// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import MainLayout from "../layout/MainLayout";

const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
    </Routes>
  </MainLayout>
);

export default AppRoutes;