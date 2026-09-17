import React from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./PortfolioStatusWidget.css";

export const PortfolioStatusWidget = ({ onPublish }) => {
  const { theme } = useDashboardTheme();
  const completionPercentage = 85;
  const lastUpdatedText = "Saved 12 minutes ago";

  const completedSections = [
    "Profile Bio & Candidate Contact",
    "5 Core Technical Skills Tagged",
    "PDF Resume Uploaded & Parsed",
    "Vercel Modern Dark Theme Chosen",
  ];

  const missingSections = [
    "Connect Custom Domain (DNS)",
    "Sync 2 GitHub Repositories",
  ];

  const handlePublishClick = () => {
    if (onPublish) onPublish();
    else alert("Publishing live updates to alexmorgan.portfolio.ai...");
  };

  return (
    <div className={`portfolio-status-widget-root ${theme}`}>
      {/* Top Bar Header */}
      <div className="status-widget-top-bar">
        <div className="status-widget-title">
          <h3>Portfolio Readiness Status</h3>
          <p>Real-time audit of candidate profile strength and SSL deployment readiness.</p>
        </div>

        <span className="readiness-pill-badge">
          🟢 85% Production Ready
        </span>
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
              <circle className="ring-fill-progress" cx="80" cy="80" r="70" />
            </svg>

            {/* Inner Content */}
            <div className="ring-center-content">
              <span className="ring-percentage-num">{completionPercentage}%</span>
              <span className="ring-percentage-label">Completed</span>
            </div>
          </div>

          <div className="last-saved-time">
            <span>⏱️</span>
            <span>{lastUpdatedText}</span>
          </div>
        </div>

        {/* Right Box: Completed vs Missing Checklists */}
        <div className="checklist-sections-group">
          <div className="checklist-sub-grid">
            {/* Completed Checklist */}
            <div className="checklist-box completed">
              <h4>
                <span>✓ Completed Sections</span>
                <span style={{ fontSize: "0.7rem", color: "#34d399" }}>({completedSections.length})</span>
              </h4>
              <ul className="checklist-items-list">
                {completedSections.map((item, idx) => (
                  <li key={idx} className="checklist-item-row">
                    <span className="check-icon green">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Checklist */}
            <div className="checklist-box missing">
              <h4>
                <span>⚠️ Recommended Additions</span>
                <span style={{ fontSize: "0.7rem", color: "#fbbf24" }}>({missingSections.length})</span>
              </h4>
              <ul className="checklist-items-list">
                {missingSections.map((item, idx) => (
                  <li key={idx} className="checklist-item-row">
                    <span className="check-icon amber">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Suggestion Banner inside Widget */}
          <div className="widget-ai-suggestion-box">
            <div>
              <strong>✨ AI Suggestion:</strong> Add a 30-second loom video demo to increase recruiter response rate by <strong>+25%</strong>.
            </div>
            <button
              type="button"
              className="btn-ai-action-sm"
              onClick={() => alert("Opening Video Demo Upload Modal...")}
            >
              Add Video Demo
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="status-widget-footer">
        <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
          Live Domain: <strong style={{ color: "#38bdf8" }}>alexmorgan.portfolio.ai</strong>
        </div>

        <button type="button" className="btn-publish-main" onClick={handlePublishClick}>
          <span>Publish Updates</span>
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
