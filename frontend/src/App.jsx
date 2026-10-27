import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import TemplatesPage from "./pages/TemplatesPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthCallback from "./pages/auth/AuthCallback";
import LegalPage from "./pages/legal/LegalPage";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Protected Dashboard Pages
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import ResumeUploadPage from "./pages/dashboard/ResumeUploadPage";
import PortfolioBuilderDashboard from "./pages/dashboard/PortfolioBuilderDashboard";
import ThemeCustomizationPage from "./pages/dashboard/ThemeCustomizationPage";
import PublishPortfolioPage from "./pages/dashboard/PublishPortfolioPage";
import AnalyticsDashboardPage from "./pages/dashboard/AnalyticsDashboardPage";
import ProfileSettingsPage from "./pages/dashboard/ProfileSettingsPage";
import TemplatesMarketplacePage from "./pages/dashboard/TemplatesMarketplacePage";

// Admin Page
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";

// Dynamic Public Portfolio (last before 404)
import PublicPortfolioView from "./pages/PublicPortfolioView";

// 404 Fallback
import NotFoundPage from "./pages/NotFoundPage";

// Theme Context Providers
import { LandingThemeProvider } from "./context/LandingThemeContext";
import { DashboardThemeProvider } from "./context/DashboardThemeContext";
import "./styles/variables.css";

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Backward compatibility: gracefully redirect old hash bookmarks (#dashboard, #login, etc.) to new path routes
  useEffect(() => {
    if (window.location.hash && location.pathname === "/") {
      const cleanHash = window.location.hash.replace(/^#\/?/, "").toLowerCase().split("?")[0];
      const HASH_REDIRECT_MAP = {
        login: ROUTES.LOGIN,
        signup: ROUTES.SIGNUP,
        dashboard: ROUTES.DASHBOARD,
        "upload-resume": ROUTES.DASHBOARD_UPLOAD,
        admin: ROUTES.ADMIN,
        "forgot-password": ROUTES.FORGOT_PASSWORD,
        "reset-password": ROUTES.RESET_PASSWORD,
      };

      if (HASH_REDIRECT_MAP[cleanHash]) {
        navigate(HASH_REDIRECT_MAP[cleanHash], { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <LandingThemeProvider>
      <DashboardThemeProvider>
        <div style={{ backgroundColor: "var(--landing-bg, var(--color-background-dark))", minHeight: "100vh" }}>
          <Routes>
            {/* 1. Public Routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PRICING} element={<PricingPage />} />
            <Route path={ROUTES.TEMPLATES} element={<TemplatesPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
            <Route path={ROUTES.PRIVACY} element={<LegalPage type="privacy" />} />
            <Route path={ROUTES.TERMS} element={<LegalPage type="terms" />} />
            <Route path={ROUTES.REFUND} element={<LegalPage type="refund" />} />
            <Route path={ROUTES.CONTACT} element={<LegalPage type="contact" />} />

            {/* 2. Private Dashboard Routes (Wrapped in ProtectedRoute and DashboardLayout) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardHomePage />} />
                <Route path={ROUTES.DASHBOARD_UPLOAD} element={<ResumeUploadPage />} />
                <Route path={ROUTES.DASHBOARD_TEMPLATES} element={<TemplatesMarketplacePage />} />
                <Route path="/dashboard/templates" element={<TemplatesMarketplacePage />} />
                <Route path={ROUTES.DASHBOARD_BUILDER} element={<PortfolioBuilderDashboard />} />
                <Route path="/dashboard/builder" element={<PortfolioBuilderDashboard />} />
                <Route path={ROUTES.DASHBOARD_THEMES} element={<ThemeCustomizationPage />} />
                <Route path="/dashboard/themes" element={<ThemeCustomizationPage />} />
                <Route path={ROUTES.DASHBOARD_PUBLISH} element={<PublishPortfolioPage />} />
                <Route path="/dashboard/publish" element={<PublishPortfolioPage />} />
                <Route path={ROUTES.DASHBOARD_ANALYTICS} element={<AnalyticsDashboardPage />} />
                <Route path={ROUTES.DASHBOARD_SETTINGS} element={<ProfileSettingsPage />} />
                <Route path={ROUTES.DASHBOARD_PROFILE} element={<ProfileSettingsPage />} />
                <Route path={ROUTES.DASHBOARD_BILLING} element={<ProfileSettingsPage />} />
              </Route>
            </Route>

            {/* 3. Admin Route (Wrapped in AdminRoute - role verified) */}
            <Route element={<AdminRoute />}>
              <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
            </Route>

            {/* 4. Dynamic Public Portfolio (Last before 404 catch-all) */}
            <Route path={ROUTES.PUBLIC_PORTFOLIO} element={<PublicPortfolioView />} />

            {/* 5. 404 Fallback for any unknown route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </DashboardThemeProvider>
    </LandingThemeProvider>
  );
}

export default App;
