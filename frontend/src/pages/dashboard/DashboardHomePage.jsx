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
    <div className="dash-home-container">
      {/* 1. HEADER ROW */}
      <div className="welcome-banner-row">
        <div className="welcome-text-group">
          <div className="welcome-date-label">{formattedDate}</div>
          <h1>{getGreeting()}, {userName}</h1>
          <div className="welcome-next-step-hint">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--color-accent, #8A96FF)", flexShrink: 0 }}>
              <path d="M12 2v1" />
              <path d="M12 21v1" />
              <path d="M4.93 4.93l.7.7" />
              <path d="M18.36 18.36l.7.7" />
              <path d="M2 12h1" />
              <path d="M21 12h1" />
              <path d="M4.93 19.07l.7-.7" />
              <path d="M18.36 5.64l.7-.7" />
              <circle cx="12" cy="12" r="5" />
            </svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              <span>View public page</span>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#f87171", flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
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

      {/* 4. RECENT PORTFOLIOS (Full width) */}
      <RecentPortfoliosSection
        portfolios={summary?.recentPortfolios}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* 5. BALANCED TWO-COLUMN ROW: READINESS WIDGET & RECENT ACTIVITY */}
      <div className="dash-two-col-balanced-grid">
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
        <RecentActivitySection
          activities={summary?.recentActivity}
          portfolios={summary?.recentPortfolios}
        />
      </div>

      {/* 6. QUICK ACTIONS (4) */}
      <QuickActionsSection
        onActionClick={handleQuickAction}
      />

      {/* 7. CREATE PORTFOLIO MODAL */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default DashboardHomePage;
