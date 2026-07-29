import {
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import HomePage from "../pages/dasboard/HomePage";
import ResumePage from "../pages/dasboard/ResumePage";
import PortfolioPage from "../pages/dasboard/PortfolioPage";
import JobsPage from "../pages/dasboard/JobsPage";
import AnalyticsPage from "../pages/dasboard/AnalyticsPage";
import MessagesPage from "../pages/dasboard/MessagesPage";
import SettingsPage from "../pages/dasboard/SettingsPage";
import AIAssistantPage from "../pages/dasboard/AIAssistantPage";
import PublicPortfolioPage from "../pages/portfolio/PublicPortfolioPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/portfolio/:slug" element={<PublicPortfolioPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/dashboard/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/dashboard/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
      <Route path="/dashboard/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
      <Route path="/dashboard/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
      <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
    </Routes>
  );
}
