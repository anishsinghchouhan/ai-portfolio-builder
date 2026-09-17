import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./SupportFeedbackPage.css";

export const SupportFeedbackPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [activeTicketId, setActiveTicketId] = useState("T-104");

  const tickets = [
    { id: "T-104", user: "Alex Morgan", subject: "Custom CNAME Domain Propagation Delay", priority: "High", status: "Open" },
    { id: "T-103", user: "Sarah Jenkins", subject: "PDF Resume Parser ATS Skill Extraction Query", priority: "Medium", status: "Resolved" },
    { id: "T-102", user: "David Chen", subject: "Stripe Invoice VAT Receipt Request", priority: "Low", status: "Resolved" },
  ];

  return (
    <div className={`support-page-root ${theme}`}>
      <div className="support-header-bar">
        <div>
          <h1>Customer Support Desk & Feedback Tickets</h1>
          <p>Help desk ticket queues, user live messaging, reply editor, and FAQ management.</p>
        </div>

        <button style={{ padding: "0.55rem 1.35rem", borderRadius: "999px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }}>
          + New Support Ticket
        </button>
      </div>

      <div className="support-grid-container">
        {/* Left: Tickets List Sidebar */}
        <div className="support-card-box">
          <h3 style={{ margin: "0 0 1rem 0" }}>📥 Active Tickets ({tickets.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tickets.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "0.85rem",
                  borderRadius: "14px",
                  background: activeTicketId === t.id ? "rgba(129,140,248,0.2)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeTicketId === t.id ? "#818cf8" : "var(--color-border-dark)"}`,
                  cursor: "pointer",
                }}
                onClick={() => setActiveTicketId(t.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "2px" }}>
                  <span>{t.id} • {t.user}</span>
                  <span style={{ color: t.priority === "High" ? "#f87171" : "#34d399", fontWeight: 700 }}>{t.priority}</span>
                </div>
                <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.85rem" }}>{t.subject}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Ticket Chat & Reply Editor */}
        <div className="support-card-box" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.85rem", borderBottom: "1px solid var(--color-border-dark)" }}>
              <div>
                <h3 style={{ margin: 0 }}>Ticket T-104: Custom CNAME Domain Propagation Delay</h3>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Opened by Alex Morgan • Assigned to Tier-2 Support</span>
              </div>
              <span style={{ padding: "0.25rem 0.75rem", borderRadius: "999px", background: "rgba(16,185,129,0.15)", color: "#34d399", fontSize: "0.75rem", fontWeight: 700 }}>
                Open Status
              </span>
            </div>

            {/* Chat Messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
              <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border-dark)" }}>
                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.85rem", marginBottom: "4px" }}>Alex Morgan (User)</div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", margin: 0, lineHeight: 1.5 }}>
                  "Hi support team! I added the CNAME record for alexmorgan.dev 2 hours ago but the SSL certificate status still says Pending. How long does propagation take?"
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(79, 70, 229, 0.15)", border: "1px solid rgba(129,140,248,0.3)" }}>
                <div style={{ fontWeight: 700, color: "#818cf8", fontSize: "0.85rem", marginBottom: "4px" }}>Support Agent (System)</div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", margin: 0, lineHeight: 1.5 }}>
                  "Hello Alex! Global DNS propagation can take up to 24 hours. I've re-triggered an active SSL check on our Vercel Edge nodes for your domain."
                </p>
              </div>
            </div>
          </div>

          {/* Reply Textarea */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Type your support response..."
              style={{ flexGrow: 1, height: "44px", borderRadius: "999px", background: "#0b0f19", border: "1px solid var(--color-border-dark)", color: "#ffffff", padding: "0 1.25rem", fontSize: "0.88rem", outline: "none" }}
            />
            <button style={{ height: "44px", padding: "0 1.5rem", borderRadius: "999px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }} onClick={() => alert("Reply sent!")}>
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportFeedbackPage;
