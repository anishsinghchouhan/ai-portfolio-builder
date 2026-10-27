import React from "react";
import "./StatsCardsSection.css";

export const StatsCardsSection = ({ counts, analytics }) => {
  const last7Days = Array.isArray(analytics?.last7Days) ? analytics.last7Days : [];
  const hasViewsTraffic = last7Days.some((d) => Number(d.views) > 0);

  // Dynamically compute real sparkline path when views > 0 in the last 7 days
  const maxViews = Math.max(...last7Days.map((d) => Number(d.views) || 0), 1);
  const points = last7Days.map((d, idx) => {
    const divisor = Math.max(last7Days.length - 1, 1);
    const x = Math.round((idx / divisor) * 240);
    const y = Math.round(40 - ((Number(d.views) || 0) / maxViews) * 30);
    return { x, y };
  });

  const strokePath = points.length > 0 ? `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}` : "";
  const areaPath = points.length > 0 ? `M 0,46 L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L 240,46 Z` : "";

  const cards = [
    {
      id: "views",
      title: "Portfolio Views",
      value: Number(analytics?.views || 0).toLocaleString(),
      colorTheme: "views",
      iconColor: "indigo",
      hasChart: hasViewsTraffic,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: "downloads",
      title: "Resume Downloads",
      value: Number(analytics?.downloads || 0).toLocaleString(),
      colorTheme: "downloads",
      iconColor: "cyan",
      hasChart: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
    {
      id: "visitors",
      title: "Unique Visitors",
      value: Number(analytics?.uniqueVisitors || 0).toLocaleString(),
      colorTheme: "visitors",
      iconColor: "purple",
      hasChart: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "projects",
      title: "Showcase Projects",
      value: Number(counts?.projects || 0).toLocaleString(),
      colorTheme: "projects",
      iconColor: "emerald",
      hasChart: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "skills",
      title: "Technical Skills",
      value: Number(counts?.skills || 0).toLocaleString(),
      colorTheme: "skills",
      iconColor: "amber",
      hasChart: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="stats-section-root">
      <div className="stats-cards-grid-5">
        {cards.map((card) => (
          <div key={card.id} className={`stat-card-premium ${card.colorTheme}`}>
            {/* Top Row: Icon */}
            <div className="stat-card-top-row">
              <div className={`stat-icon-wrapper ${card.iconColor}`}>{card.icon}</div>
            </div>

            {/* Middle Row: Title & Value */}
            <div className="stat-card-middle">
              <div className="stat-card-title">{card.title}</div>
              <h3 className="stat-card-value">{card.value}</h3>
            </div>

            {/* Bottom: Only show chart if last7Days has real views > 0 */}
            {card.id === "views" && (
              card.hasChart && strokePath ? (
                <div className="stat-mini-chart">
                  <svg viewBox="0 0 240 46" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="realViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#realViewsGrad)" />
                    <path
                      d={strokePath}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : (
                <div className="stat-empty-chart-note">
                  <span>0 views past 7 days</span>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCardsSection;
