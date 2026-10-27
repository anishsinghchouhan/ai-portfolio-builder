import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./PortfolioStatusWidget.css";

export const PortfolioStatusWidget = ({ readiness, portfolio, onPublish }) => {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();

  const percent = Number.isFinite(readiness?.percent) ? Math.max(0, Math.min(100, readiness.percent)) : 0;
  const completedSections = Array.isArray(readiness?.completed) ? readiness.completed : [];
  const missingSections = Array.isArray(readiness?.missing) ? readiness.missing : [];

  // SVG circular circumference: 2 * Math.PI * 70 = ~440
  const circumference = 440;
  const strokeDashoffset = circumference - (circumference * percent) / 100;

  // Format last updated text safely
  const formatLastUpdated = (dateVal) => {
    if (!dateVal) return "Not saved yet";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "Not saved yet";
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Saved just now";
      if (diffMins < 60) return `Saved ${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `Saved ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `Saved ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return `Updated on ${d.toLocaleDateString()}`;
    } catch {
      return "Not saved yet";
    }
  };

  const handleMissingItemClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  const handlePublishClick = () => {
    if (onPublish) onPublish();
    else navigate("/dashboard/publish");
  };

  const getStatusBadge = () => {
    if (percent === 100) {
      return <span className="readiness-pill-badge status-ready">🟢 100% Complete</span>;
    }
    if (percent > 0) {
      return <span className="readiness-pill-badge status-progress">🟡 {percent.toLocaleString()}% In Progress</span>;
    }
    return <span className="readiness-pill-badge status-setup">⚪ 0% Setup Required</span>;
  };

  return (
    <div className={`portfolio-status-widget-root ${theme}`}>
      {/* Top Bar Header */}
      <div className="status-widget-top-bar">
        <div className="status-widget-title">
          <h3>Portfolio Readiness Status</h3>
          <p>Real-time audit of candidate profile strength and SSL deployment readiness.</p>
        </div>

        {getStatusBadge()}
      </div>

      {/* Main Grid: Circular Progress Ring & Checklist */}
      <div className="status-widget-grid">
        {/* Left Box: SVG Circular Progress Ring */}
        <div className="progress-ring-container">
          <div className="ring-svg-wrapper">
            <svg viewBox="0 0 160 160">
              <defs>
                <linearGradient id="statusRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle className="ring-bg-track" cx="80" cy="80" r="70" />

              {/* Filled Animated Progress Stroke */}
              <circle
                className="ring-fill-progress"
                cx="80"
                cy="80"
                r="70"
                style={{ strokeDashoffset }}
              />
            </svg>

            {/* Inner Content */}
            <div className="ring-center-content">
              <span className="ring-percentage-num">{percent.toLocaleString()}%</span>
              <span className="ring-percentage-label">Completed</span>
            </div>
          </div>

          <div className="last-saved-time">
            <span>⏱️</span>
            <span>{formatLastUpdated(portfolio?.updatedAt)}</span>
          </div>
        </div>

        {/* Right Box: Completed vs Missing Checklists */}
        <div className="checklist-sections-group">
          <div className="checklist-sub-grid">
            {/* Completed Checklist */}
            <div className="checklist-box completed">
              <h4>
                <span>✓ Completed Sections</span>
                <span style={{ fontSize: "0.7rem", color: "#34d399" }}>
                  ({completedSections.length.toLocaleString()})
                </span>
              </h4>
              <ul className="checklist-items-list">
                {completedSections.length > 0 ? (
                  completedSections.map((item, idx) => (
                    <li key={item?.key || idx} className="checklist-item-row">
                      <span className="check-icon green">✓</span>
                      <span>{typeof item === "string" ? item : item?.label || "Completed"}</span>
                    </li>
                  ))
                ) : (
                  <li className="checklist-item-row" style={{ color: "#94a3b8", fontStyle: "italic" }}>
                    No completed sections yet
                  </li>
                )}
              </ul>
            </div>

            {/* Missing Checklist: Each missing item is a button linking to its real route */}
            <div className="checklist-box missing">
              <h4>
                <span>⚠️ Recommended Additions</span>
                <span style={{ fontSize: "0.7rem", color: "#fbbf24" }}>
                  ({missingSections.length.toLocaleString()})
                </span>
              </h4>
              <ul className="checklist-items-list">
                {missingSections.length > 0 ? (
                  missingSections.map((item, idx) => (
                    <li key={item?.key || idx} className="checklist-item-row">
                      <span className="check-icon amber">!</span>
                      <button
                        type="button"
                        className="checklist-link-btn"
                        onClick={() => handleMissingItemClick(item?.route)}
                        title={`Go to ${item?.label || "step"}`}
                      >
                        {item?.label || (typeof item === "string" ? item : "Missing step")} →
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="checklist-item-row" style={{ color: "#34d399" }}>
                    🎉 All recommended items completed!
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Dynamic Suggestion Banner inside Widget */}
          <div className="widget-ai-suggestion-box">
            <div>
              <strong>✨ Recommendation:</strong>{" "}
              {missingSections.length > 0
                ? `${missingSections[0].label}. Click above to complete it.`
                : "Your portfolio is fully populated and ready for review."}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="status-widget-footer">
        <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
          Live Domain:{" "}
          {portfolio?.isPublished && portfolio?.slug ? (
            <a
              href={`/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#38bdf8", fontWeight: "600", textDecoration: "underline", marginLeft: "4px" }}
            >
              /{portfolio.slug} ↗
            </a>
          ) : (
            <span style={{ color: "#94a3b8", marginLeft: "4px" }}>Not published yet</span>
          )}
        </div>

        {/* Hide Publish button when there is no portfolio */}
        {portfolio ? (
          <button type="button" className="btn-publish-main" onClick={handlePublishClick}>
            <span>{portfolio.isPublished ? "Update Publication" : "Publish Portfolio"}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PortfolioStatusWidget;
