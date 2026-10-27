import React from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./RecentActivitySection.css";

export const RecentActivitySection = () => {
  const { theme } = useDashboardTheme();
  const activities = [];

  return (
    <section className={`activity-section-root ${theme}`}>
      {/* Header */}
      <div className="activity-section-header">
        <div className="activity-section-title">
          <h3>Recent Activity Timeline</h3>
          <p>Chronological feed of your portfolio updates, visits, and AI optimization events.</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="timeline-container">
        {activities.length > 0 ? (
          activities.map((item) => (
            <div key={item.id} className="timeline-item-card">
              {/* Node Bullet Icon */}
              <div className={`timeline-node-bullet ${item.colorTheme}`}>
                {item.icon}
              </div>

              {/* Left Avatar & Details */}
              <div className="timeline-content-left">
                <img src={item.avatar} alt={item.title} className="timeline-user-avatar" />
                <div className="timeline-event-text">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span className="event-details-tag">🏷️ {item.tag}</span>
                </div>
              </div>

              {/* Right Timestamp Badge */}
              <span className="timeline-time-badge">{item.time}</span>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              color: "var(--color-text-muted, #94a3b8)",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: "1px dashed rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
            <h4 style={{ color: "var(--color-text-primary, #f8fafc)", margin: "0 0 6px", fontSize: "0.95rem" }}>
              No activity yet
            </h4>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              Your updates, portfolio changes, and resume uploads will be displayed here as you build.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentActivitySection;
