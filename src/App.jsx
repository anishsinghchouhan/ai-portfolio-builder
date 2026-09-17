import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import TrustedBy from "./components/common/TrustedBy";
import HowItWorks from "./components/common/HowItWorks";
import FeaturesSection from "./components/features/FeaturesSection";
import TemplateShowcase from "./components/common/TemplateShowcase";
import TestimonialsSection from "./components/testimonials/TestimonialsSection";
import FAQSection from "./components/faq/FAQSection";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import TwoFactorPage from "./pages/auth/TwoFactorPage";
import WelcomePage from "./pages/onboarding/WelcomePage";
import ProfileSetupPage from "./pages/onboarding/ProfileSetupPage";
import SkillsSelectionPage from "./pages/onboarding/SkillsSelectionPage";
import OnboardingWizardPage from "./pages/onboarding/OnboardingWizardPage";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import ResumeUploadPage from "./pages/dashboard/ResumeUploadPage";
import ResumeUploadProgressPage from "./pages/dashboard/ResumeUploadProgressPage";
import ResumePreviewPage from "./pages/dashboard/ResumePreviewPage";
import ResumeHistoryPage from "./pages/dashboard/ResumeHistoryPage";
import ResumeAnalysisOverviewPage from "./pages/dashboard/ResumeAnalysisOverviewPage";
import PortfolioBuilderDashboard from "./pages/dashboard/PortfolioBuilderDashboard";
import SectionEditorPage from "./pages/dashboard/SectionEditorPage";
import ThemeCustomizationPage from "./pages/dashboard/ThemeCustomizationPage";
import PortfolioPreviewPage from "./pages/dashboard/PortfolioPreviewPage";
import PublishPortfolioPage from "./pages/dashboard/PublishPortfolioPage";
import TemplatesMarketplacePage from "./pages/dashboard/TemplatesMarketplacePage";
import TemplateDetailsPage from "./pages/dashboard/TemplateDetailsPage";
import AnalyticsDashboardPage from "./pages/dashboard/AnalyticsDashboardPage";
import VisitorAnalyticsPage from "./pages/dashboard/VisitorAnalyticsPage";
import SeoPerformancePage from "./pages/dashboard/SeoPerformancePage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import ProfileSettingsPage from "./pages/dashboard/ProfileSettingsPage";
import SecuritySettingsPage from "./pages/dashboard/SecuritySettingsPage";
import NotificationSettingsPage from "./pages/dashboard/NotificationSettingsPage";
import BillingSubscriptionPage from "./pages/dashboard/BillingSubscriptionPage";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";
import UserManagementPage from "./pages/dashboard/UserManagementPage";
import TemplateManagementPage from "./pages/dashboard/TemplateManagementPage";
import SupportFeedbackPage from "./pages/dashboard/SupportFeedbackPage";
import RevenueReportsPage from "./pages/dashboard/RevenueReportsPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthCallback from "./pages/auth/AuthCallback";
import AIResumeParserPage from "./pages/parser/AIResumeParserPage";
import ThemeStudioPage from "./pages/features/ThemeStudioPage";
import CustomDomainsPage from "./pages/features/CustomDomainsPage";
import RecruiterAnalyticsPage from "./pages/features/RecruiterAnalyticsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PricingSection from "./components/pricing/PricingSection";
import BlogSection from "./components/blog/BlogSection";
import BlogListPage from "./pages/blog/BlogListPage";
import BlogArticlePage from "./pages/blog/BlogArticlePage";
import LegalPage from "./pages/legal/LegalPage";
import { useAuth } from "./hooks/useAuth";
import { LandingThemeProvider } from "./context/LandingThemeContext";
import { DashboardThemeProvider } from "./context/DashboardThemeContext";
import "./styles/variables.css";

const HASH_MAP = {
  "": "landing",
  "#home": "landing",
  "home": "landing",
  "#login": "login",
  "login": "login",
  "#signup": "signup",
  "signup": "signup",
  "#verify": "verify",
  "verify": "verify",
  "#2fa": "twofa",
  "#twofa": "twofa",
  "twofa": "twofa",
  "#forgot": "forgot-password",
  "#forgot-password": "forgot-password",
  "forgot": "forgot-password",
  "#reset-password": "reset-password",
  "#welcome": "welcome",
  "#profile-setup": "profile-setup",
  "#skills": "skills-selection",
  "#skills-selection": "skills-selection",
  "#dashboard": "dashboard",
  "#upload-resume": "upload-resume",
  "#upload-progress": "upload-progress",
  "#resume-preview": "resume-preview",
  "#preview": "resume-preview",
  "#resume-history": "resume-history",
  "#history": "resume-history",
  "#analysis": "analysis-overview",
  "#analysis-overview": "analysis-overview",
  "#builder": "portfolio-builder",
  "#portfolio-builder": "portfolio-builder",
  "#editor": "section-editor",
  "#section-editor": "section-editor",
  "#theme": "theme-customization",
  "#theme-customization": "theme-customization",
  "#theme-studio": "theme-studio",
  "#portfolio-preview": "portfolio-preview",
  "#publish": "publish-portfolio",
  "#publish-portfolio": "publish-portfolio",
  "#custom-domains": "custom-domains",
  "#custom-domain": "custom-domains",
  "#recruiter-analytics": "recruiter-analytics",
  "#templates": "landing",
  "#templates-marketplace": "templates-marketplace",
  "#dev-templates": "templates-marketplace",
  "#design-templates": "templates-marketplace",
  "#template-details": "template-details",
  "#details": "template-details",
  "#analytics": "analytics-dashboard",
  "#analytics-dashboard": "analytics-dashboard",
  "#visitors": "visitor-analytics",
  "#visitor-analytics": "visitor-analytics",
  "#seo": "seo-performance",
  "#reports": "reports",
  "#profile-settings": "profile-settings",
  "#security": "security-settings",
  "#notifications": "notification-settings",
  "#billing": "billing-subscription",
  "#admin": "admin-dashboard",
  "#user-management": "user-management",
  "#template-management": "template-management",
  "#support": "support-feedback",
  "#revenue": "revenue-reports",
  "#ai-resume-parser": "ai-resume-parser",
  "#ai-parser": "ai-resume-parser",
  "#onboarding": "onboarding",
  "#setup": "onboarding",
  "#wizard": "onboarding",
  "#pricing": "landing",
  "#blog": "landing",
  "#blog-list": "blog",
  "#blog-article": "blog-article",
  "#features": "landing",
  "#how-it-works": "landing",
  "#about": "legal-about",
  "#careers": "legal-careers",
  "#privacy": "legal-privacy",
  "#terms": "legal-terms",
  "#cookies": "legal-privacy",
  "#gdpr": "legal-privacy",
  "#press": "legal-about",
  "#affiliates": "legal-about",
  "#contact": "legal-about",
};

const PUBLIC_VIEWS = [
  "landing",
  "login",
  "signup",
  "verify",
  "twofa",
  "forgot-password",
  "reset-password",
  "ai-resume-parser",
  "theme-studio",
  "custom-domains",
  "recruiter-analytics",
  "templates-marketplace",
  "template-details",
  "theme-customization",
  "publish-portfolio",
  "analytics-dashboard",
  "portfolio-preview",
  "blog",
  "blog-article",
  "legal-privacy",
  "legal-terms",
  "legal-security",
  "legal-careers",
  "legal-about",
  "not-found",
];
const ONBOARDING_VIEWS = ["onboarding", "welcome", "profile-setup", "skills-selection"];

const getViewFromHash = (rawHash) => {
  if (!rawHash) return "landing";
  const clean = rawHash
    .split("?")[0]
    .replace(/^[\/#]+/, "")
    .replace(/[\/#]+$/, "")
    .trim();

  if (!clean || clean === "home") return "landing";
  if (HASH_MAP[clean]) return HASH_MAP[clean];
  if (HASH_MAP[`#${clean}`]) return HASH_MAP[`#${clean}`];
  return "not-found";
};

export function App() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState(() => getViewFromHash(window.location.hash));

  // Check if we're on the /auth/callback path (for Supabase email verification redirects)
  const isAuthCallback = window.location.pathname === "/auth/callback";

  useEffect(() => {
    // Skip hash-based routing when on /auth/callback or while restoring auth session
    if (isAuthCallback || isLoading) return;

    const handleHashChange = () => {
      const targetView = getViewFromHash(window.location.hash);

      // 1. Redirect unauthenticated users trying to access protected views to login
      if (!PUBLIC_VIEWS.includes(targetView) && !isAuthenticated) {
        window.location.hash = "#login";
        setCurrentView("login");
        return;
      }

      // 2. Redirect authenticated users who haven't completed onboarding to setup wizard
      if (isAuthenticated && !hasCompletedOnboarding && !PUBLIC_VIEWS.includes(targetView) && !ONBOARDING_VIEWS.includes(targetView)) {
        window.location.hash = "#onboarding";
        setCurrentView("onboarding");
        return;
      }

      setCurrentView(targetView);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, isAuthCallback]);

  // Smooth scroll to landing section anchors
  useEffect(() => {
    if (currentView === "landing" && window.location.hash) {
      const targetId = window.location.hash.replace(/^#/, "").split("?")[0];
      if (targetId && targetId !== "home" && targetId !== "landing") {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [currentView]);

  const navigateTo = (viewName) => {
    // Redirect unauthenticated users
    if (!PUBLIC_VIEWS.includes(viewName) && !isAuthenticated) {
      setCurrentView("login");
      window.location.hash = "#login";
      return;
    }

    // Redirect authenticated users without onboarding completion
    if (isAuthenticated && !hasCompletedOnboarding && !PUBLIC_VIEWS.includes(viewName) && !ONBOARDING_VIEWS.includes(viewName)) {
      setCurrentView("onboarding");
      window.location.hash = "#onboarding";
      return;
    }

    setCurrentView(viewName);
    const targetHash = Object.keys(HASH_MAP).find((key) => HASH_MAP[key] === viewName && key.startsWith("#"));
    window.location.hash = targetHash || `#${viewName}`;
  };

  // Handle /auth/callback path for Supabase email verification redirects
  if (isAuthCallback) {
    return <AuthCallback />;
  }

  // Show loading screen while auth session is being restored
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "var(--color-background-dark, #0b0f17)",
        color: "#fff",
        flexDirection: "column",
        gap: "16px",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(99, 102, 241, 0.3)",
          borderTopColor: "#818cf8",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <LandingThemeProvider>
      <DashboardThemeProvider>
        <div style={{ backgroundColor: "var(--landing-bg, var(--color-background-dark))", minHeight: "100vh", transition: "background-color 0.3s ease" }}>
          {currentView === "not-found" && <NotFoundPage onGoHome={() => navigateTo("landing")} />}
          {currentView === "revenue-reports" && <RevenueReportsPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "support-feedback" && <SupportFeedbackPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "blog" && <BlogListPage onSelectArticle={() => navigateTo("blog-article")} onNavigate={(v) => navigateTo(v)} />}
          {currentView === "blog-article" && <BlogArticlePage onBack={() => navigateTo("blog")} onNavigate={(v) => navigateTo(v)} />}
          {currentView === "legal-privacy" && <LegalPage type="privacy" onNavigate={(v) => navigateTo(v)} />}
          {currentView === "legal-terms" && <LegalPage type="terms" onNavigate={(v) => navigateTo(v)} />}
          {currentView === "legal-security" && <LegalPage type="security" onNavigate={(v) => navigateTo(v)} />}
          {currentView === "legal-careers" && <LegalPage type="careers" onNavigate={(v) => navigateTo(v)} />}
          {currentView === "legal-about" && <LegalPage type="about" onNavigate={(v) => navigateTo(v)} />}
          {currentView === "template-management" && <TemplateManagementPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "user-management" && <UserManagementPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "admin-dashboard" && <AdminDashboardPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "billing-subscription" && <BillingSubscriptionPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "notification-settings" && <NotificationSettingsPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "security-settings" && <SecuritySettingsPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "profile-settings" && <ProfileSettingsPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "reports" && <ReportsPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "seo-performance" && <SeoPerformancePage onBack={() => navigateTo("dashboard")} />}
          {currentView === "visitor-analytics" && <VisitorAnalyticsPage onExport={() => alert("Exporting...")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "analytics-dashboard" && <AnalyticsDashboardPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "template-details" && <TemplateDetailsPage onUseTemplate={() => navigateTo("portfolio-builder")} onBack={() => navigateTo("templates-marketplace")} />}
          {currentView === "templates-marketplace" && <TemplatesMarketplacePage onUseTemplate={() => navigateTo("portfolio-builder")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "publish-portfolio" && <PublishPortfolioPage onBack={() => navigateTo("dashboard")} />}
          {currentView === "portfolio-preview" && <PortfolioPreviewPage onPublish={() => navigateTo("dashboard")} onShare={() => alert("Shared!")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "theme-customization" && <ThemeCustomizationPage onApplyTheme={() => navigateTo("dashboard")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "section-editor" && <SectionEditorPage onSave={() => navigateTo("dashboard")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "portfolio-builder" && <PortfolioBuilderDashboard onPublish={() => navigateTo("dashboard")} onSaveDraft={() => alert("Saved Draft")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "analysis-overview" && <ResumeAnalysisOverviewPage onContinueAudit={() => navigateTo("dashboard")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "resume-history" && <ResumeHistoryPage onUploadNewVersion={() => navigateTo("upload-resume")} onDownload={(v) => alert(`Downloading ${v.fileName}...`)} onMakeActive={() => navigateTo("dashboard")} />}
          {currentView === "resume-preview" && <ResumePreviewPage onReplace={() => navigateTo("upload-resume")} onDelete={() => navigateTo("dashboard")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "upload-progress" && <ResumeUploadProgressPage onComplete={() => navigateTo("dashboard")} onCancel={() => navigateTo("upload-resume")} />}
          {currentView === "ai-resume-parser" && <AIResumeParserPage onNavigate={(view) => navigateTo(view)} />}
          {currentView === "theme-studio" && <ThemeStudioPage onNavigate={(view) => navigateTo(view)} />}
          {currentView === "custom-domains" && <CustomDomainsPage onNavigate={(view) => navigateTo(view)} />}
          {currentView === "recruiter-analytics" && <RecruiterAnalyticsPage onNavigate={(view) => navigateTo(view)} />}
          {currentView === "upload-resume" && <ResumeUploadPage onUploadSuccess={() => navigateTo("upload-progress")} onBack={() => navigateTo("dashboard")} />}
          {currentView === "dashboard" && <DashboardHomePage onNavigate={(view) => navigateTo(view)} />}
          {currentView === "skills-selection" && <SkillsSelectionPage onSaveAndContinue={() => navigateTo("dashboard")} onPrevious={() => navigateTo("profile-setup")} />}
          {currentView === "profile-setup" && <ProfileSetupPage onSaveAndContinue={() => navigateTo("skills-selection")} onPrevious={() => navigateTo("welcome")} />}
          {currentView === "onboarding" && <OnboardingWizardPage onCompleteSetup={() => navigateTo("dashboard")} onNavigate={(v) => navigateTo(v)} />}
          {currentView === "welcome" && <WelcomePage userName="Alex" onContinue={() => navigateTo("profile-setup")} onSkip={() => navigateTo("landing")} />}
          {currentView === "twofa" && <TwoFactorPage onVerifySuccess={() => navigateTo("welcome")} onCancel={() => navigateTo("login")} />}
          {currentView === "verify" && <VerifyEmailPage onBackToLogin={() => navigateTo("login")} />}
          {currentView === "forgot-password" && <ForgotPasswordPage />}
          {currentView === "reset-password" && <ResetPasswordPage />}
          {currentView === "login" && <LoginPage onSwitchToSignup={() => navigateTo("signup")} onSwitchToHome={() => navigateTo("landing")} />}
          {currentView === "signup" && <SignupPage onSwitchToLogin={() => navigateTo("login")} onSwitchToHome={() => navigateTo("landing")} />}
          {currentView === "landing" && (
            <>
              <Navbar onNavigateLogin={() => navigateTo("login")} onNavigateSignup={() => navigateTo("signup")} />
              <main>
                <Hero />
                <TrustedBy />
                <HowItWorks />
                <FeaturesSection />
                <TemplateShowcase />
                <PricingSection />
                <BlogSection />
                <TestimonialsSection />
                <FAQSection />
              </main>
              <Footer />
            </>
          )}
        </div>
      </DashboardThemeProvider>
    </LandingThemeProvider>
  );
}

export default App;

