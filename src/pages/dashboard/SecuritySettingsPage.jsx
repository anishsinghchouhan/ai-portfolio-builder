import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./SecuritySettingsPage.css";

export const SecuritySettingsPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [tfaEnabled, setTfaEnabled] = useState(true);

  const activeSessions = [
    { device: "MacBook Pro 16\" (Chrome)", ip: "192.168.1.42 • San Francisco, US", time: "Active now", isCurrent: true },
    { device: "iPhone 15 Pro (Safari App)", ip: "74.125.21.99 • San Jose, US", time: "2 hours ago", isCurrent: false },
  ];

  return (
    <div className={`security-settings-root ${theme}`}>
      <div className="security-header-bar">
        <div>
          <h1>Security & Account Credentials</h1>
          <p>Manage 2FA authentication, backup codes, active device sessions, and password security.</p>
        </div>

        <div style={{ padding: "0.5rem 1rem", borderRadius: "999px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399", fontWeight: 700 }}>
          🛡️ Security Score: 95/100 EXCELLENT
        </div>
      </div>

      <div className="security-grid-container">
        {/* Left: Change Password Form */}
        <div className="security-card-box">
          <h3 style={{ margin: "0 0 1.25rem 0" }}>🔑 Change Account Password</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Current Password</label>
              <input type="password" style={{ width: "100%", height: "42px", borderRadius: "12px", background: "#0b0f19", border: "1px solid var(--color-border-dark)", color: "#ffffff", padding: "0 12px", marginTop: "4px" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>New Password</label>
              <input type="password" style={{ width: "100%", height: "42px", borderRadius: "12px", background: "#0b0f19", border: "1px solid var(--color-border-dark)", color: "#ffffff", padding: "0 12px", marginTop: "4px" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Confirm New Password</label>
              <input type="password" style={{ width: "100%", height: "42px", borderRadius: "12px", background: "#0b0f19", border: "1px solid var(--color-border-dark)", color: "#ffffff", padding: "0 12px", marginTop: "4px" }} />
            </div>

            <button type="button" className="btn-security-action" style={{ marginTop: "0.5rem" }} onClick={() => alert("Password updated!")}>
              Update Password
            </button>
          </div>
        </div>

        {/* Right: 2FA & Active Device Sessions */}
        <div className="security-card-box">
          <h3 style={{ margin: "0 0 1rem 0" }}>📱 Two-Factor Authentication (2FA)</h3>
          <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border-dark)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#ffffff" }}>Authenticator App 2FA</div>
              <div style={{ fontSize: "0.78rem", color: "#34d399" }}>🟢 Enabled & Protected</div>
            </div>
            <button style={{ padding: "0.4rem 0.9rem", borderRadius: "999px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontSize: "0.78rem", cursor: "pointer" }}>
              Disable
            </button>
          </div>

          <h3 style={{ margin: "0 0 1rem 0" }}>💻 Active Logged-in Sessions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeSessions.map((session, idx) => (
              <div key={idx} style={{ padding: "0.85rem 1rem", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border-dark)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.88rem" }}>{session.device}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{session.ip} • {session.time}</div>
                </div>
                {session.isCurrent ? (
                  <span style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 700 }}>Current Device</span>
                ) : (
                  <button style={{ padding: "0.3rem 0.75rem", borderRadius: "999px", background: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontSize: "0.75rem", cursor: "pointer" }}>
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
