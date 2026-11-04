import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductJourneySection from "../../components/dashboard/ProductJourneySection";
import StatsCardsSection from "../../components/dashboard/StatsCardsSection";
import RecentPortfoliosSection from "../../components/dashboard/RecentPortfoliosSection";
import PortfolioStatusWidget from "../../components/dashboard/PortfolioStatusWidget";
import RecentActivitySection from "../../components/dashboard/RecentActivitySection";
import QuickActionsSection from "../../components/dashboard/QuickActionsSection";
import CreatePortfolioModal from "../../components/dashboard/CreatePortfolioModal";
import { useAuth } from "../../hooks/useAuth";
import { useSummary } from "../../hooks/useSummary";
import { ROUTES, getPublishPath } from "../../constants/routes";
import "./DashboardHomePage.css";

export const DashboardHomePage = ({ onNavigate }) => {
  const { user, appUser, syncError } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { summary, loading, error, refetch } = useSummary();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check URL query parameters: ?action=create-portfolio
  useEffect(() => {
    if (searchParams.get("action") === "create-portfolio") {
      setIsCreateModalOpen(true);
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const userName = user?.user_metadata?.full_name || appUser?.fullName || user?.email?.split("@")[0] || "User";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate next step hint from backend journey
  const currentJourneyStep = summary?.journey?.find((step) => step.status === "current");
  const nextStepHint = currentJourneyStep
    ? `Next step: ${currentJourneyStep.hint || currentJourneyStep.label}`
    : "Your portfolio is in great shape!";

  // Check for any live published portfolio
  const publishedPortfolio = summary?.recentPortfolios?.find((p) => p.status === "PUBLISHED") ||
    (summary?.primaryPortfolio?.status === "PUBLISHED" ? summary.primaryPortfolio : null);

  const handleQuickAction = (actionId) => {
    if (actionId === "create_portfolio") {
      setIsCreateModalOpen(true);
      return;
    }

    if (actionId === "edit_profile") {
      navigate(ROUTES.DASHBOARD_PROFILE);
      return;
    }

    if (actionId === "browse_templates") {
      navigate(ROUTES.DASHBOARD_TEMPLATES);
      return;
    }

    if (actionId === "upload_resume") {
      // Disabled / Coming soon
      return;
    }

    if (onNavigate) onNavigate(actionId);
    else navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="dash-home-container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 1. HEADER ROW */}
      <div className="welcome-banner-row">
        <div className="welcome-text-group">
          <div className="welcome-date-label">{formattedDate}</div>
          <h1>{getGreeting()}, {userName} 👋</h1>
          <div className="welcome-next-step-hint">
            <span style={{ color: "var(--color-accent, #8A96FF)" }}>💡</span>
            <span>{nextStepHint}</span>
          </div>
        </div>

        <div className="welcome-banner-actions">
          {publishedPortfolio && (
            <a
              href={`/${publishedPortfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view-public-page"
            >
              👁️ View public page ↗
            </a>
          )}
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
            <span>New portfolio</span>
          </button>
        </div>
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
          <div className="skeleton-pulse" style={{ height: "110px", borderRadius: "16px" }} />
          <div className="skeleton-stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-pulse" style={{ height: "120px", borderRadius: "16px" }} />
            ))}
          </div>
          <div className="skeleton-pulse" style={{ height: "240px", borderRadius: "16px" }} />
        </div>
      )}

      {/* Error State Card with Retry Button */}
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

      {/* 2. "YOUR JOURNEY" STEPPER */}
      <ProductJourneySection
        journey={summary?.journey}
        onCreatePortfolio={() => setIsCreateModalOpen(true)}
      />

      {/* 3. KPI CARDS (4) */}
      <StatsCardsSection
        counts={summary?.counts}
        analytics={summary?.analytics}
        profileStrength={summary?.profileStrength}
      />

      {/* 4. TWO-COLUMN SECTION */}
      <div className="dash-two-col-grid">
        {/* Left Column: Recent Portfolios (up to 5 or dashed new-user card) */}
        <div className="dash-col-left">
          <RecentPortfoliosSection
            portfolios={summary?.recentPortfolios}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Right Column: Portfolio Readiness (6 checks + details) & Recent Activity */}
        <div className="dash-col-right" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
          <RecentActivitySection />
        </div>
      </div>

      {/* 5. QUICK ACTIONS (4) */}
      <QuickActionsSection
        onActionClick={handleQuickAction}
      />

      {/* 6. CREATE PORTFOLIO MODAL */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default DashboardHomePage;
