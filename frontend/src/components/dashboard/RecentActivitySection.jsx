import React from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./RecentActivitySection.css";

export const RecentActivitySection = ({ activities = [], portfolios = [] }) => {
  const { theme } = useDashboardTheme();

  // If activities not passed directly from backend, derive from real portfolio timestamps
  const displayActivities = React.useMemo(() => {
    if (Array.isArray(activities) && activities.length > 0) {
      return activities;
    }

    if (!Array.isArray(portfolios) || portfolios.length === 0) {
      return [];
    }

    const events = [];
    for (const p of portfolios) {
      if (p.createdAt) {
        events.push({
          id: `create_${p.id}`,
          type: "create",
          title: `Created portfolio "${p.title}"`,
          description: `Draft started with /${p.slug}`,
          timestamp: p.createdAt,
          tag: "Portfolio",
        });
      }

      if (p.publishedAt && p.status === "PUBLISHED") {
        events.push({
          id: `publish_${p.id}`,
          type: "publish",
          title: `Published portfolio "${p.title}"`,
          description: `Live at /${p.slug}`,
          timestamp: p.publishedAt,
          tag: "Deployment",
        });
      } else if (p.updatedAt && p.createdAt) {
        const cTime = new Date(p.createdAt).getTime();
        const uTime = new Date(p.updatedAt).getTime();
        if (uTime - cTime > 120_000) {
          events.push({
            id: `update_${p.id}`,
            type: "update",
            title: `Updated portfolio "${p.title}"`,
            description: `Saved latest content changes`,
            timestamp: p.updatedAt,
            tag: "Edit",
          });
        }
      }
    }

    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return events;
  }, [activities, portfolios]);

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return "";
      const now = new Date();
      const diffMs = now - d;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      if (diffDays === 1) {
        return "Yesterday";
      }
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const getNodeIcon = (type) => {
    if (type === "publish") {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    if (type === "update") {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  };

  const getNodeColor = (type) => {
    if (type === "publish") return "emerald";
    if (type === "update") return "cyan";
    return "purple";
  };

  return (
    <section className={`activity-section-root ${theme}`} aria-label="Recent Activity Timeline">
      {/* Header */}
      <div className="activity-section-header">
        <div className="activity-section-title">
          <h3>Recent Activity Timeline</h3>
          <p>Chronological feed of your portfolio updates, visits, and milestones.</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="timeline-container">
        {displayActivities.length > 0 ? (
          displayActivities.map((item) => (
            <div key={item.id} className="timeline-item-card">
              {/* Node Bullet Icon */}
              <div className={`timeline-node-bullet ${getNodeColor(item.type)}`}>
                {getNodeIcon(item.type)}
              </div>

              {/* Left Details */}
              <div className="timeline-content-left">
                <div className="timeline-event-text">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span className="event-details-tag">{item.tag}</span>
                </div>
              </div>

              {/* Right Timestamp Badge */}
              <span className="timeline-time-badge">{formatTimestamp(item.timestamp)}</span>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              color: "var(--color-muted, #98a1b4)",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: "1px dashed var(--color-border, #252C3C)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              style={{ margin: "0 auto 8px", display: "block", color: "var(--color-muted, #98A1B4)" }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h4 style={{ color: "var(--color-text, #e9ecf3)", margin: "0 0 6px", fontSize: "0.95rem" }}>
              No activity yet
            </h4>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              Your updates and portfolio creations will be displayed here as you build.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentActivitySection;
