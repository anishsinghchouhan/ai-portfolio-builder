import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import StatsCardsSection from "../../components/dashboard/StatsCardsSection";
import QuickActionsSection from "../../components/dashboard/QuickActionsSection";
import PortfolioStatusWidget from "../../components/dashboard/PortfolioStatusWidget";
import RecentActivitySection from "../../components/dashboard/RecentActivitySection";
import AISuggestionsPanel from "../../components/dashboard/AISuggestionsPanel";
import NotificationsCenterPage from "./NotificationsCenterPage";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./DashboardHomePage.css";

export const DashboardHomePage = ({ onNavigate }) => {
  const { theme } = useDashboardTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMenuSelect = (id) => {
    setActiveTab(id);
    const routeMap = {
      dashboard: "dashboard",
      portfolio: "portfolio-builder",
      resume: "upload-resume",
      templates: "templates-marketplace",
      analytics: "analytics-dashboard",
      settings: "profile-settings",
      billing: "billing-subscription",
      help: "support-feedback",
      notifications: "notification-settings",
      profile: "profile-settings",
      security: "security-settings",
    };
    const targetView = routeMap[id];
    if (targetView && targetView !== "dashboard") {
      if (onNavigate) onNavigate(targetView);
      else window.location.hash = targetView;
    }
  };

  const handleQuickAction = (actionId, title) => {
    const actionRouteMap = {
      upload_resume: "upload-resume",
      edit_portfolio: "portfolio-builder",
      change_theme: "theme-customization",
      publish_portfolio: "publish-portfolio",
      download_resume: "resume-history",
      view_analytics: "analytics-dashboard",
      ai_improve_resume: "analysis-overview",
      share_portfolio: "portfolio-preview",
      custom_domain: "publish-portfolio",
    };
    const targetView = actionRouteMap[actionId];
    if (targetView) {
      if (onNavigate) onNavigate(targetView);
      else window.location.hash = targetView;
    } else {
      window.location.hash = "#portfolio-builder";
    }
  };

  return (
    <div className={`dashboard-root ${theme}`}>
      {/* Background Mesh Glows */}
      <div className="dash-bg-mesh" />
      <div className="dash-bg-glow" />

      {/* DEDICATED DASHBOARD SIDEBAR */}
      <Sidebar
        activeItem={activeTab}
        onSelectMenuItem={handleMenuSelect}
        isMobileOpen={isMobileOpen}
        onLogout={() => {
          if (onNavigate) onNavigate("login");
          else window.location.hash = "login";
        }}
      />

      {/* MAIN LAYOUT */}
      <div className="dash-main-layout">
        {/* DEDICATED DASHBOARD TOP NAVIGATION HEADER */}
        <Header
          breadcrumbPath={["Dashboard", activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
          onThemeToggle={(newTheme) => setTheme(newTheme)}
          onLogout={() => {
            if (onNavigate) onNavigate("login");
            else window.location.hash = "login";
          }}
        />

        {/* DASHBOARD BODY CONTENT */}
        <div className="dash-content-body">
          {activeTab === "notifications" ? (
            <NotificationsCenterPage />
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="welcome-banner-row">
                <div className="welcome-text-group">
                  <h1>Good afternoon, Alex 👋</h1>
                  <p>
                    <span>Your portfolio is live at</span>
                    <strong style={{ color: "var(--color-secondary)" }}>alexmorgan.portfolio.ai</strong>
                    <span className="live-status-pill">
                      <span className="status-pulse-dot" /> Live (SSL Edge CDN)
                    </span>
                  </p>
                </div>
              </div>

              {/* DEDICATED AI SUGGESTIONS PANEL */}
              <AISuggestionsPanel
                onApplyAction={(id, title) => alert(`Applied AI Action: ${title}`)}
              />

              {/* DEDICATED PORTFOLIO READINESS STATUS WIDGET */}
              <PortfolioStatusWidget
                onPublish={() => {
                  if (onNavigate) onNavigate("publish");
                  else window.location.hash = "publish";
                }}
              />

              {/* DEDICATED 6 STATISTICS CARDS SECTION WITH SPARKLINES */}
              <StatsCardsSection />

              {/* DEDICATED 8 QUICK ACTIONS CARDS SECTION */}
              <QuickActionsSection
                onActionClick={handleQuickAction}
              />

              {/* DEDICATED RECENT ACTIVITY TIMELINE SECTION */}
              <RecentActivitySection />

              {/* DEDICATED NOTIFICATIONS CENTER PAGE INTEGRATION */}
              <NotificationsCenterPage />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
