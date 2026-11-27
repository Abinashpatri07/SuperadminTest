import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SuperAdminRoutes from "./SuperAdminRoutes";
import Login from "../pages/superAdmin/Login";
import ForgotPassword from "../components/superAdmin/login/ForgotPassword";
import ResetPassword from "../components/superAdmin/login/ResetPassword";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Direct Dashboard */}
        <Route path="/" element={<Navigate to="/super-admin/home" replace />} />
        <Route path="/login" element={<Navigate to="/super-admin/home" replace />} />
        <Route path="/portal-login" element={<Navigate to="/super-admin/home" replace />} />

        {/* Super Admin Password Setup & Reset Routes */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/setup-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/super-admin/reset-password" element={<ResetPassword />} />

        {/* Super Admin Portal Routes */}
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/super-admin/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
