import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./AISuggestionsPanel.css";

export const AISuggestionsPanel = ({ profileStrength, resume, onApplyAction }) => {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();

  const percentage = Number.isFinite(profileStrength?.percentage) ? Math.min(100, Math.max(0, profileStrength.percentage)) : 0;
  const score = Number.isFinite(profileStrength?.score) ? profileStrength.score : 0;
  const total = Number.isFinite(profileStrength?.total) && profileStrength.total > 0 ? profileStrength.total : 9;
  const missingFields = Array.isArray(profileStrength?.missingFields) ? profileStrength.missingFields : [];

  const handleActionClick = (fieldKey, label) => {
    if (onApplyAction) onApplyAction(fieldKey, label);
    navigate("/dashboard/profile");
  };

  return (
    <div className={`ai-panel-root ${theme}`}>
      {/* Top Greeting Banner */}
      <div className="ai-greeting-banner">
        <div className="ai-avatar-ring">✨</div>
        <div className="ai-greeting-text">
          <h3>AI Portfolio Coach</h3>
          <p>
            {resume
              ? `Resume connected: ${resume.fileName}. Complete your profile fields for higher search visibility.`
              : "Upload your resume to receive tailored AI recommendations and automated portfolio section generation."}
          </p>
        </div>
      </div>

      {/* Scores Overview Grid (Real Data Driven) */}
      <div className="ai-scores-twin-grid">
        {/* Resume ATS Score Card */}
        <div className="score-metric-card">
          <div className="score-card-header">
            <span className="score-card-title">Resume Status</span>
            <span style={{ fontSize: "1rem" }}>📄</span>
          </div>
          <div className="score-val-big indigo">
            {resume ? "Uploaded" : "None"}
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
            {resume ? resume.fileName : "Upload a PDF resume to parse data"}
          </p>
        </div>

        {/* Profile Strength Score Card */}
        <div className="score-metric-card">
          <div className="score-card-header">
            <span className="score-card-title">Profile Strength</span>
            <span style={{ fontSize: "1rem" }}>👁️</span>
          </div>
          <div className="score-val-big cyan">
            {percentage.toLocaleString()}%
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
            {score.toLocaleString()} of {total.toLocaleString()} profile fields completed
          </p>
        </div>

        {/* Profile Readiness Meter Box */}
        <div className="strength-meter-box">
          <div className="strength-meter-header">
            <h4>Profile Completion Meter</h4>
            <span
              className="strength-status-badge"
              style={{
                background: percentage === 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(99, 102, 241, 0.15)",
                color: percentage === 100 ? "#34d399" : "#818cf8",
              }}
            >
              {percentage === 100 ? "Complete" : `${percentage.toLocaleString()}% Ready`}
            </span>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#cbd5e1", margin: "6px 0 10px 0" }}>
            {missingFields.length > 0
              ? `${missingFields.length.toLocaleString()} field${missingFields.length > 1 ? "s" : ""} left to complete your profile.`
              : "All candidate profile details are filled."}
          </div>
          <div className="score-progress-bar" style={{ height: "8px" }}>
            <div
              className="score-fill"
              style={{
                width: `${percentage}%`,
                background:
                  percentage === 100
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #4f46e5, #818cf8)",
                transition: "width 0.6s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Recommended Actions based on missing profile fields */}
      {missingFields.length > 0 ? (
        <>
          <div className="ai-recommendations-title">
            <span>⚡ Recommended Actions ({missingFields.length.toLocaleString()})</span>
          </div>

          <div className="ai-recommendations-grid">
            {missingFields.slice(0, 3).map((item) => (
              <div key={item.key} className="ai-recom-card">
                <div className="recom-card-top">
                  <span className="recom-icon">✏️</span>
                  <h5>Add {item.label}</h5>
                </div>
                <p>Add your {item.label.toLowerCase()} in account settings to improve recruiter contact options.</p>
                <button
                  type="button"
                  className="btn-recom-action"
                  onClick={() => handleActionClick(item.key, item.label)}
                >
                  Edit in Profile →
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#34d399", padding: "0.5rem 0" }}>
          ✅ Your profile information is fully filled!
        </div>
      )}
    </div>
  );
};

export default AISuggestionsPanel;
