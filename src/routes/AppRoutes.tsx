import {
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import DashboardPage from "../pages/dasboard/DashboardPage";
import PublicPortfolioPage from "../pages/portfolio/PublicPortfolioPage";
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
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/portfolio/:slug"
          element={<PublicPortfolioPage />}
        />

        <Route
          path="/dashboard"
          element={<PrrotectedRoute><DashboardPage /></PrrotectedRoute>}
        />
      </Routes>
    
  );
}