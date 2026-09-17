import React from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./AISuggestionsPanel.css";

export const AISuggestionsPanel = ({ onApplyAction }) => {
  const { theme } = useDashboardTheme();

  const recommendations = [
    {
      id: "suggested_skills",
      icon: "⚡",
      title: "Suggested Skills Gap",
      description: "Add GraphQL, Docker, and AI Prompting to match 98% of Senior Full-Stack candidate profiles.",
      actionText: "Add 3 AI Skills",
    },
    {
      id: "missing_projects",
      icon: "💻",
      title: "Missing Open Source Repo",
      description: "Sync 1 additional Full-Stack SaaS repository from GitHub with a live demo link.",
      actionText: "Sync GitHub Repo",
    },
    {
      id: "missing_certificates",
      icon: "📜",
      title: "Missing Cloud Certification",
      description: "Add AWS Certified Solutions Architect credential to boost recruiter trust by +28%.",
      actionText: "Add Certification",
    },
    {
      id: "summary_seo",
      icon: "🔍",
      title: "Improve Summary & SEO",
      description: "Rewrite candidate bio with ATS action verbs & add meta keywords for 'Senior Developer'.",
      actionText: "Apply AI Summary",
    },
  ];

  const handleApply = (id, title) => {
    if (onApplyAction) onApplyAction(id, title);
    else alert(`Applied AI Suggestion: "${title}"! Profile score updated.`);
  };

  return (
    <div className={`ai-panel-root ${theme}`}>
      {/* Top Greeting Banner */}
      <div className="ai-greeting-banner">
        <div className="ai-avatar-ring">✨</div>
        <div className="ai-greeting-text">
          <h3>Hello Alex 👋 I'm your AI Portfolio Coach</h3>
          <p>
            I benchmarked your candidate profile against 10,000+ top Senior Full-Stack Engineers hired at Stripe, Vercel, and Linear.
          </p>
        </div>
      </div>

      {/* Scores Overview & Profile Strength Meter Grid */}
      <div className="ai-scores-twin-grid">
        {/* Resume ATS Score Card */}
        <div className="score-metric-card">
          <div className="score-card-header">
            <span className="score-card-title">Resume ATS Score</span>
            <span style={{ fontSize: "1rem" }}>📄</span>
          </div>
          <div className="score-val-big indigo">92/100</div>
          <div className="score-progress-bar">
            <div className="score-fill indigo" style={{ width: "92%" }} />
          </div>
        </div>

        {/* Portfolio Appeal Score Card */}
        <div className="score-metric-card">
          <div className="score-card-header">
            <span className="score-card-title">Recruiter Appeal</span>
            <span style={{ fontSize: "1rem" }}>👁️</span>
          </div>
          <div className="score-val-big cyan">88/100</div>
          <div className="score-progress-bar">
            <div className="score-fill cyan" style={{ width: "88%" }} />
          </div>
        </div>

        {/* Profile Strength Meter Box */}
        <div className="strength-meter-box">
          <div className="strength-meter-header">
            <h4>Profile Strength Rating</h4>
            <span className="strength-status-badge">🔥 Top 5% Candidate</span>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#cbd5e1", margin: "4px 0 10px 0" }}>
            High recruiter response likelihood for Senior Developer roles.
          </div>
          <div className="score-progress-bar" style={{ height: "8px" }}>
            <div
              className="score-fill"
              style={{
                width: "88%",
                background: "linear-gradient(90deg, #4f46e5, #818cf8, #0ea5e9, #34d399)",
              }}
            />
          </div>
        </div>
      </div>

      {/* 4 AI Recommendations Grid */}
      <div className="ai-recommendations-title">
        <span>⚡ 4 High-Impact Recommendations</span>
      </div>

      <div className="ai-recommendations-grid">
        {recommendations.map((item) => (
          <div key={item.id} className="ai-recommendation-tile">
            <div>
              <div className="tile-header-group">
                <div className="tile-icon-box">{item.icon}</div>
                <h5>{item.title}</h5>
              </div>
              <p className="tile-body-text">{item.description}</p>
            </div>

            <button
              type="button"
              className="btn-apply-suggestion"
              onClick={() => handleApply(item.id, item.title)}
            >
              <span>{item.actionText}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
