import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./PortfolioStatusWidget.css";

const ALL_READINESS_CHECKS = [
  { key: "personal_info", label: "Candidate Profile & Bio", desc: "Full name, contact details, and location filled in profile settings." },
  { key: "skills_added", label: "Technical Skills Stack", desc: "At least 3 core engineering languages, frameworks, or tools specified." },
  { key: "projects_added", label: "Featured Projects", desc: "At least 1 showcased project with description, live demo or code repository." },
  { key: "theme_chosen", label: "Custom Theme Styling", desc: "Theme configuration customized in Theme Studio (colors, typography, presets)." },
  { key: "resume_linked", label: "Resume Attachment", desc: "A current PDF resume uploaded or attached for recruiters to download." },
  { key: "portfolio_published", label: "Live Deployment", desc: "Portfolio published live to a public URL with SSL certificate active." },
];

export const PortfolioStatusWidget = ({ readiness, portfolio, onPublish }) => {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();
  const [isHowCalculatedOpen, setIsHowCalculatedOpen] = useState(false);

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
      return <span className="readiness-pill-badge status-ready">🟢 100% Ready</span>;
    }
    if (percent > 0) {
      return <span className="readiness-pill-badge status-progress">🟡 {percent.toLocaleString()}% In Progress</span>;
    }
    return <span className="readiness-pill-badge status-setup">⚪ 0% Setup Required</span>;
  };

  const isCheckCompleted = (key) => completedSections.some((item) => (typeof item === "string" ? item === key : item?.key === key));

  return (
    <div className={`portfolio-status-widget-root ${theme}`}>
      {/* Top Bar Header */}
      <div className="status-widget-top-bar">
        <div className="status-widget-title">
          <h3>Portfolio Readiness Status</h3>
          <p>Real-time audit of candidate profile strength and deployment readiness.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {getStatusBadge()}
          <button
            type="button"
            className="btn-how-calculated-toggle"
            onClick={() => setIsHowCalculatedOpen((prev) => !prev)}
            aria-expanded={isHowCalculatedOpen}
            aria-controls="readiness-breakdown-details"
          >
            <span>{isHowCalculatedOpen ? "Hide Breakdown" : "How is this calculated?"}</span>
            <span style={{ fontSize: "0.75rem" }}>{isHowCalculatedOpen ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>

      {/* "How is this calculated?" Disclosure Accordion */}
      {isHowCalculatedOpen && (
        <div id="readiness-breakdown-details" className="readiness-breakdown-panel" role="region" aria-label="Readiness criteria calculation details">
          <div className="breakdown-header">
            <h4>Readiness Scoring Methodology</h4>
            <p>
              Your readiness score is calculated evenly across 6 core candidate criteria (approximately 16.7% per check).
            </p>
          </div>
          <div className="breakdown-checks-grid">
            {ALL_READINESS_CHECKS.map((check) => {
              const done = isCheckCompleted(check.key);
              return (
                <div key={check.key} className={`breakdown-check-card ${done ? "completed" : "pending"}`}>
                  <div className="check-card-header">
                    <span className="check-icon">{done ? "✓" : "○"}</span>
                    <strong className="check-title">{check.label}</strong>
                    <span className="check-badge">{done ? "Done (+16.7%)" : "Pending"}</span>
                  </div>
                  <p className="check-desc">{check.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Circular Progress Ring & Checklist */}
      <div className="status-widget-grid">
        {/* Left Box: SVG Circular Progress Ring with no cut-off padding */}
        <div className="progress-ring-container">
          <div className="ring-svg-wrapper">
            <svg viewBox="0 0 180 180" className="readiness-progress-svg" aria-hidden="true">
              <defs>
                <linearGradient id="statusRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>

              {/* Background Track - Center 90, 90, Radius 70 inside 180x180 box */}
              <circle className="ring-bg-track" cx="90" cy="90" r="70" />

              {/* Filled Animated Progress Stroke */}
              <circle
                className="ring-fill-progress"
                cx="90"
                cy="90"
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
              <strong>💡 Next Step:</strong>{" "}
              {missingSections.length > 0
                ? `${missingSections[0].label}. Click above to complete it.`
                : "Your portfolio is fully populated and ready for recruiter review."}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="status-widget-footer">
        <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
          Live Domain:{" "}
          {portfolio?.status === "PUBLISHED" && portfolio?.slug ? (
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

        <button type="button" className="btn-publish-main" onClick={handlePublishClick}>
          <span>{portfolio?.status === "PUBLISHED" ? "Update Publication" : "Publish Portfolio"}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PortfolioStatusWidget;
