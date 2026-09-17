import React from "react";
import "./StatsCardsSection.css";

export const StatsCardsSection = () => {
  const cardsData = [
    {
      id: "views",
      title: "Portfolio Views",
      value: "2,840",
      change: "+24.5%",
      isPositive: true,
      colorTheme: "views",
      iconColor: "indigo",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      sparklineColor: "#818cf8",
      sparklineGradientId: "viewsGrad",
      pathPoints: "M0,35 Q30,10 60,25 T120,8 T180,28 T240,5 L240,46 L0,46 Z",
      strokePath: "M0,35 Q30,10 60,25 T120,8 T180,28 T240,5",
    },
    {
      id: "downloads",
      title: "Resume Downloads",
      value: "142",
      change: "+18.2%",
      isPositive: true,
      colorTheme: "downloads",
      iconColor: "cyan",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      sparklineColor: "#38bdf8",
      sparklineGradientId: "downloadsGrad",
      pathPoints: "M0,38 Q30,28 60,18 T120,30 T180,12 T240,2 L240,46 L0,46 Z",
      strokePath: "M0,38 Q30,28 60,18 T120,30 T180,12 T240,2",
    },
    {
      id: "visitors",
      title: "Unique Visitors",
      value: "1,280",
      change: "+32.0%",
      isPositive: true,
      colorTheme: "visitors",
      iconColor: "purple",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      sparklineColor: "#c084fc",
      sparklineGradientId: "visitorsGrad",
      pathPoints: "M0,40 Q30,20 60,32 T120,10 T180,22 T240,8 L240,46 L0,46 Z",
      strokePath: "M0,40 Q30,20 60,32 T120,10 T180,22 T240,8",
    },
    {
      id: "projects",
      title: "Showcase Projects",
      value: "18",
      change: "+3 New",
      isPositive: true,
      colorTheme: "projects",
      iconColor: "emerald",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      sparklineColor: "#34d399",
      sparklineGradientId: "projectsGrad",
      pathPoints: "M0,32 Q30,35 60,20 T120,28 T180,10 T240,4 L240,46 L0,46 Z",
      strokePath: "M0,32 Q30,35 60,20 T120,28 T180,10 T240,4",
    },
    {
      id: "skills",
      title: "Technical Skills",
      value: "32",
      change: "+5 Added",
      isPositive: true,
      colorTheme: "skills",
      iconColor: "amber",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      sparklineColor: "#fbbf24",
      sparklineGradientId: "skillsGrad",
      pathPoints: "M0,36 Q30,22 60,28 T120,14 T180,20 T240,6 L240,46 L0,46 Z",
      strokePath: "M0,36 Q30,22 60,28 T120,14 T180,20 T240,6",
    },
    {
      id: "completion",
      title: "Completion Strength",
      value: "85%",
      change: "+10% Goal",
      isPositive: true,
      colorTheme: "completion",
      iconColor: "pink",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      sparklineColor: "#f472b6",
      sparklineGradientId: "completionGrad",
      pathPoints: "M0,42 Q30,30 60,35 T120,18 T180,24 T240,3 L240,46 L0,46 Z",
      strokePath: "M0,42 Q30,30 60,35 T120,18 T180,24 T240,3",
    },
  ];

  return (
    <section className="stats-section-root">
      <div className="stats-cards-grid-6">
        {cardsData.map((card) => (
          <div key={card.id} className={`stat-card-premium ${card.colorTheme}`}>
            {/* Top Row: Icon & Change Pill */}
            <div className="stat-card-top-row">
              <div className={`stat-icon-wrapper ${card.iconColor}`}>
                {card.icon}
              </div>
              <span className={`stat-change-pill ${card.isPositive ? "up" : "neutral"}`}>
                {card.change}
              </span>
            </div>

            {/* Middle Row: Title & Value */}
            <div className="stat-card-middle">
              <div className="stat-card-title">{card.title}</div>
              <h3 className="stat-card-value">{card.value}</h3>
            </div>

            {/* Bottom Mini Sparkline Area Chart */}
            <div className="stat-mini-chart">
              <svg viewBox="0 0 240 46" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={card.sparklineGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.sparklineColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={card.sparklineColor} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Filled Area */}
                <path d={card.pathPoints} fill={`url(#${card.sparklineGradientId})`} />

                {/* Line Curve */}
                <path
                  d={card.strokePath}
                  fill="none"
                  stroke={card.sparklineColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCardsSection;
