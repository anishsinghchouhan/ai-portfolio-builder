import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./NotificationSettingsPage.css";

export const NotificationSettingsPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();

  const [settings, setSettings] = useState({
    emailVisitorAlerts: true,
    pushVisitorAlerts: true,
    smsSecurityAlerts: false,
    aiSuggestions: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert("Notification preferences saved!");
  };

  return (
    <div className={`notif-settings-root ${theme}`}>
      <div className="notif-header-bar">
        <div>
          <h1>Notification & Alert Preferences</h1>
          <p>Choose when and how Portfolio.ai notifies you about recruiter visits, ATS scores, and security alerts.</p>
        </div>

        <button type="button" className="btn-save-notif" onClick={handleSave}>
          Save Preferences
        </button>
      </div>

      <div className="notif-card-box">
        <h3 style={{ margin: "0 0 1rem 0" }}>🔔 Real-time Visitor & Candidate Alerts</h3>

        <div className="toggle-item-row">
          <div>
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>Portfolio Visitor Email Alerts</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Get instant email notifications when a recruiter views your portfolio.</div>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${settings.emailVisitorAlerts ? "active" : ""}`}
            onClick={() => toggleSetting("emailVisitorAlerts")}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>

        <div className="toggle-item-row">
          <div>
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>Push Notifications</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Browser push alerts for resume downloads and live chat inquiries.</div>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${settings.pushVisitorAlerts ? "active" : ""}`}
            onClick={() => toggleSetting("pushVisitorAlerts")}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>

        <div className="toggle-item-row">
          <div>
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>AI Career Recommendations</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Weekly AI audit suggestions for resume ATS optimization.</div>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${settings.aiSuggestions ? "active" : ""}`}
            onClick={() => toggleSetting("aiSuggestions")}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>

        <div className="toggle-item-row">
          <div>
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>Weekly Executive Analytics Summary</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Weekly PDF analytics email with total recruiter views and geographic maps.</div>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${settings.weeklyReports ? "active" : ""}`}
            onClick={() => toggleSetting("weeklyReports")}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
