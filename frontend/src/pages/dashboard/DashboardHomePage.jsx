import React from "react";
import { useNavigate } from "react-router-dom";
import StatsCardsSection from "../../components/dashboard/StatsCardsSection";
import QuickActionsSection from "../../components/dashboard/QuickActionsSection";
import PortfolioStatusWidget from "../../components/dashboard/PortfolioStatusWidget";
import RecentActivitySection from "../../components/dashboard/RecentActivitySection";
import AISuggestionsPanel from "../../components/dashboard/AISuggestionsPanel";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { ROUTES } from "../../constants/routes";
import "./DashboardHomePage.css";

export const DashboardHomePage = ({ onNavigate }) => {
  const { user, appUser } = useAuth();
  const navigate = useNavigate();
  const { summary, loading, error, refetch } = useDashboardSummary();

  const userName = user?.user_metadata?.full_name || appUser?.name || user?.email?.split("@")[0] || "User";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleQuickAction = (actionId) => {
    const actionRouteMap = {
      upload_resume: ROUTES.DASHBOARD_UPLOAD,
      edit_portfolio: ROUTES.DASHBOARD,
      change_theme: ROUTES.DASHBOARD_THEMES,
      publish_portfolio: ROUTES.DASHBOARD_PUBLISH,
      download_resume: ROUTES.DASHBOARD_UPLOAD,
      view_analytics: ROUTES.DASHBOARD_ANALYTICS,
      ai_improve_resume: ROUTES.DASHBOARD_UPLOAD,
      share_portfolio: ROUTES.DASHBOARD_PUBLISH,
      custom_domain: ROUTES.DASHBOARD_PUBLISH,
    };
    const targetRoute = actionRouteMap[actionId] || ROUTES.DASHBOARD;
    if (onNavigate) onNavigate(actionId);
    else navigate(targetRoute);
  };

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner-row">
        <div className="welcome-text-group">
          <h1>{getGreeting()}, {userName} 👋</h1>
          <p style={{ color: "var(--color-text-muted, #94a3b8)", fontSize: "0.95rem", margin: "6px 0 0" }}>
            Welcome to your portfolio workspace. Manage, build, and publish your candidate profile.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && !summary && (
        <div className="dashboard-skeleton-wrapper" aria-label="Loading dashboard...">
          <div className="skeleton-pulse" style={{ height: "130px" }} />
          <div className="skeleton-pulse" style={{ height: "220px" }} />
          <div className="skeleton-stats-grid">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-pulse" style={{ height: "110px" }} />
            ))}
          </div>
        </div>
      )}

      {/* Error State Card with Try Again Retry Button */}
      {error && !loading && (
        <div className="dashboard-error-card">
          <div className="dashboard-error-info">
            <span className="dashboard-error-icon">⚠️</span>
            <div className="dashboard-error-text">
              <h3>Unable to load dashboard data</h3>
              <p>{error}</p>
            </div>
          </div>
          <button type="button" className="btn-retry-dashboard" onClick={refetch}>
            Try again
          </button>
        </div>
      )}

      {/* DEDICATED AI SUGGESTIONS PANEL */}
      <AISuggestionsPanel
        profileStrength={summary?.profileStrength}
        resume={summary?.latestResume}
        onApplyAction={(id, title) => {
          if (onNavigate) onNavigate(id);
          else navigate(ROUTES.DASHBOARD_PROFILE);
        }}
      />

      {/* DEDICATED PORTFOLIO READINESS STATUS WIDGET */}
      <PortfolioStatusWidget
        readiness={summary?.readiness}
        portfolio={summary?.primaryPortfolio}
        onPublish={() => {
          if (onNavigate) onNavigate("publish");
          else navigate(ROUTES.DASHBOARD_PUBLISH);
        }}
      />

      {/* DEDICATED STATISTICS CARDS SECTION */}
      <StatsCardsSection
        counts={summary?.counts}
        analytics={summary?.analytics}
      />

      {/* DEDICATED 8 QUICK ACTIONS CARDS SECTION */}
      <QuickActionsSection
        onActionClick={handleQuickAction}
      />

      {/* DEDICATED RECENT ACTIVITY TIMELINE SECTION */}
      <RecentActivitySection />
    </>
  );
};

export default DashboardHomePage;
