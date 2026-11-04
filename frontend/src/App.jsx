import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { isApiConfigured } from "./services/api";
import { isSupabaseConfigured } from "./lib/supabase";
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
import PortfolioPage from "./pages/dashboard/PortfolioPage";
import ResumeAIPage from "./pages/dashboard/ResumeAIPage";
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

  // Guard: In production, require API and Supabase configuration to avoid confusing silent breaks
  if (import.meta.env.PROD && (!isApiConfigured || !isSupabaseConfigured)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-background, #0D1017)",
          color: "var(--color-text, #E9ECF3)",
          padding: "2rem",
          fontFamily: "var(--font-body, 'Inter', sans-serif)",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            background: "var(--color-surface, #141925)",
            border: "1px solid var(--color-border, #252C3C)",
            borderRadius: "var(--radius-card, 16px)",
            padding: "2.5rem 2rem",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(242, 184, 75, 0.15)",
              color: "var(--color-warning, #F2B84B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading, 'Manrope', sans-serif)",
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "var(--color-text, #E9ECF3)",
            }}
          >
            Configuration Required
          </h1>
          <p
            style={{
              color: "var(--color-muted, #98A1B4)",
              fontSize: "0.925rem",
              lineHeight: 1.5,
              marginBottom: "1rem",
            }}
          >
            This production build requires backend API and Supabase environment variables to function properly.
          </p>
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              borderRadius: "8px",
              padding: "0.75rem",
              fontSize: "0.8rem",
              textAlign: "left",
              fontFamily: "monospace",
              color: "var(--color-muted, #98A1B4)",
            }}
          >
            {!isApiConfigured && <div>• VITE_API_URL is missing</div>}
            {!isSupabaseConfigured && <div>• VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing</div>}
          </div>
        </div>
      </div>
    );
  }

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
                <Route path={ROUTES.DASHBOARD_PORTFOLIO} element={<PortfolioPage />} />
                <Route path={ROUTES.DASHBOARD_RESUME} element={<ResumeAIPage />} />
                <Route path={ROUTES.DASHBOARD_UPLOAD} element={<ResumeAIPage />} />
                <Route path={ROUTES.DASHBOARD_TEMPLATES} element={<TemplatesMarketplacePage />} />
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
