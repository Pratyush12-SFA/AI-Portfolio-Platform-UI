import {
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dasboard/DashboardPage";
import PrrotectedRoute from "./ProtectedRoute";


export default function AppRoutes() {
  return (
    
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={<PrrotectedRoute><DashboardPage /></PrrotectedRoute>}
        />
      </Routes>
    
  );
}