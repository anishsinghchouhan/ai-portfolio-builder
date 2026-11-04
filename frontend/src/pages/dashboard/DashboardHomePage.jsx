import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCardsSection from "../../components/dashboard/StatsCardsSection";
import QuickActionsSection from "../../components/dashboard/QuickActionsSection";
import PortfolioStatusWidget from "../../components/dashboard/PortfolioStatusWidget";
import RecentActivitySection from "../../components/dashboard/RecentActivitySection";
import AISuggestionsPanel from "../../components/dashboard/AISuggestionsPanel";
import CreatePortfolioModal from "../../components/dashboard/CreatePortfolioModal";
import RecentPortfoliosSection from "../../components/dashboard/RecentPortfoliosSection";
import { useAuth } from "../../hooks/useAuth";
import { useSummary } from "../../hooks/useSummary";
import { ROUTES, getBuilderPath, getThemesPath, getPublishPath } from "../../constants/routes";
import "./DashboardHomePage.css";

export const DashboardHomePage = ({ onNavigate }) => {
  const { user, appUser, syncError } = useAuth();
  const navigate = useNavigate();
  const { summary, loading, error, refetch } = useSummary();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || appUser?.fullName || user?.email?.split("@")[0] || "User";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleQuickAction = (actionId) => {
    const primaryId = summary?.primaryPortfolio?.id;

    if (actionId === "create_portfolio") {
      setIsCreateModalOpen(true);
      return;
    }

    if (actionId === "edit_portfolio") {
      if (primaryId) navigate(getBuilderPath(primaryId));
      else setIsCreateModalOpen(true);
      return;
    }

    if (actionId === "change_theme") {
      if (primaryId) navigate(getThemesPath(primaryId));
      else setIsCreateModalOpen(true);
      return;
    }

    if (
      actionId === "publish_portfolio" ||
      actionId === "share_portfolio" ||
      actionId === "custom_domain"
    ) {
      if (primaryId) navigate(getPublishPath(primaryId));
      else setIsCreateModalOpen(true);
      return;
    }

    if (
      actionId === "upload_resume" ||
      actionId === "download_resume" ||
      actionId === "ai_improve_resume"
    ) {
      navigate(ROUTES.DASHBOARD_UPLOAD);
      return;
    }

    if (actionId === "view_analytics") {
      navigate(ROUTES.DASHBOARD_ANALYTICS);
      return;
    }

    if (onNavigate) onNavigate(actionId);
    else navigate(ROUTES.DASHBOARD);
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
        <button
          type="button"
          className="btn-create-portfolio-cta"
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "0.65rem 1.25rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
          }}
        >
          <span>＋</span>
          <span>Create Portfolio</span>
        </button>
      </div>

      {/* Backend Sync Error Banner */}
      {syncError && (
        <div
          role="alert"
          style={{
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "#fbbf24",
            padding: "12px 18px",
            borderRadius: "12px",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <span>{syncError}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            style={{
              background: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fef3c7",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.825rem",
            }}
          >
            Retry
          </button>
        </div>
      )}

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
          <button type="button" className="btn-retry-dashboard" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {/* YOUR PORTFOLIOS SECTION */}
      <RecentPortfoliosSection
        portfolios={summary?.recentPortfolios}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* PORTFOLIO OPTIMIZATION COACH PANEL */}
      <AISuggestionsPanel
        profileStrength={summary?.profileStrength}
        resume={summary?.latestResume}
        onApplyAction={(target) => {
          if (target === "builder") {
            if (summary?.primaryPortfolio?.id) navigate(getBuilderPath(summary.primaryPortfolio.id));
            else setIsCreateModalOpen(true);
          } else if (target === "themes") {
            if (summary?.primaryPortfolio?.id) navigate(getThemesPath(summary.primaryPortfolio.id));
            else setIsCreateModalOpen(true);
          } else if (target === "publish") {
            if (summary?.primaryPortfolio?.id) navigate(getPublishPath(summary.primaryPortfolio.id));
            else setIsCreateModalOpen(true);
          } else {
            navigate(ROUTES.DASHBOARD_PROFILE);
          }
        }}
      />

      {/* DEDICATED PORTFOLIO READINESS STATUS WIDGET */}
      <PortfolioStatusWidget
        readiness={summary?.readiness}
        portfolio={summary?.primaryPortfolio}
        onPublish={() => {
          if (summary?.primaryPortfolio?.id) {
            navigate(getPublishPath(summary.primaryPortfolio.id));
          } else {
            setIsCreateModalOpen(true);
          }
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

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default DashboardHomePage;
