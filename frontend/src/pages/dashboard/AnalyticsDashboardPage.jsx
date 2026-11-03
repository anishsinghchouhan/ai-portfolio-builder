import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { useSummary } from "../../hooks/useSummary";
import { ROUTES } from "../../constants/routes";
import "./AnalyticsDashboardPage.css";

export const AnalyticsDashboardPage = () => {
  const { theme } = useDashboardTheme();
  const { summary, loading } = useSummary();
  const [selectedRange, setSelectedRange] = useState("7d");

  const analytics = summary?.analytics || { views: 0, uniqueVisitors: 0, last7Days: [] };
  const counts = summary?.counts || { portfolios: 0, published: 0, projects: 0 };
  const last7Days = analytics.last7Days || [];

  const totalViews = analytics.views || 0;
  const uniqueVisitors = analytics.uniqueVisitors || 0;
  const publishedCount = counts.published || 0;
  const maxDailyViews = Math.max(...last7Days.map((d) => d.views || 0), 1);

  const kpis = [
    {
      title: "Total Portfolio Views",
      value: totalViews.toLocaleString(),
      subtitle: "Lifetime visits across all portfolios",
      color: "cyan",
      icon: "👁️",
    },
    {
      title: "Unique Visitors",
      value: uniqueVisitors.toLocaleString(),
      subtitle: "Hashed unique recruiter devices",
      color: "indigo",
      icon: "👤",
    },
    {
      title: "Live Published Portfolios",
      value: publishedCount.toLocaleString(),
      subtitle: `${counts.portfolios || 0} total created`,
      color: "emerald",
      icon: "🚀",
    },
    {
      title: "Showcased Projects",
      value: (counts.projects || 0).toLocaleString(),
      subtitle: "Across active portfolio sections",
      color: "amber",
      icon: "💻",
    },
  ];

  return (
    <div className={`analytics-page-root ${theme}`}>
      <div className="analytics-bg-mesh" />
      <div className="analytics-bg-glow" />

      {/* Header Bar */}
      <div className="analytics-header-bar">
        <div className="analytics-title-group">
          <h1>Portfolio Traffic Analytics</h1>
          <p>Real telemetry tracking unique recruiter visits and daily traffic.</p>
        </div>

        {/* Range Selector */}
        <div className="date-range-selector">
          <button
            type="button"
            className={`btn-range-pill ${selectedRange === "7d" ? "active" : ""}`}
            onClick={() => setSelectedRange("7d")}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            className="btn-range-pill"
            style={{ opacity: 0.5, cursor: "not-allowed" }}
            title="30-day historical reporting is coming in Round 2"
            disabled
          >
            30 Days (Preview)
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Top Grid */}
      <div className="analytics-kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card-item">
            <div className="kpi-top-row">
              <span className="kpi-title-text">{kpi.title}</span>
              <span style={{ fontSize: "1.1rem" }}>{kpi.icon}</span>
            </div>
            <div className={`kpi-huge-number ${kpi.color}`}>
              {loading ? "..." : kpi.value}
            </div>
            <div className="kpi-trend-pill" style={{ color: "#94a3b8" }}>
              <span>{kpi.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main 7-day Activity Chart */}
      <div className="analytics-main-charts-grid">
        <div className="chart-card-box" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-header-row">
            <div>
              <h3 style={{ margin: 0 }}>📈 Daily Views Trend (Last 7 Days)</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.825rem", color: "#94a3b8" }}>
                Visits recorded when external visitors view your published public portfolio link.
              </p>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 700 }}>
              ● Live Telemetry
            </span>
          </div>

          {totalViews === 0 ? (
            <div
              style={{
                padding: "3.5rem 1.5rem",
                textAlign: "center",
                color: "#94a3b8",
                background: "rgba(15, 23, 42, 0.4)",
                borderRadius: "12px",
                margin: "1.5rem 0",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📊</div>
              <h4 style={{ color: "#f8fafc", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                No Visitor Telemetry Recorded Yet
              </h4>
              <p style={{ maxWidth: "450px", margin: "0 auto 1.5rem auto", fontSize: "0.875rem", lineHeight: 1.5 }}>
                Publish your portfolio and share your live link with recruiters to begin tracking real view activity.
              </p>
              {summary?.primaryPortfolio?.id ? (
                <Link
                  to={`/dashboard/publish/${summary.primaryPortfolio.id}`}
                  style={{
                    display: "inline-block",
                    padding: "0.6rem 1.25rem",
                    background: "#6366f1",
                    color: "#ffffff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  🚀 Publish Portfolio
                </Link>
              ) : (
                <Link
                  to={ROUTES.DASHBOARD}
                  style={{
                    display: "inline-block",
                    padding: "0.6rem 1.25rem",
                    background: "#6366f1",
                    color: "#ffffff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Create Your First Portfolio
                </Link>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "12px",
                height: "200px",
                padding: "2rem 1rem 1rem 1rem",
                margin: "1rem 0",
              }}
            >
              {last7Days.map((item, idx) => {
                const heightPercent = Math.max(
                  Math.round((item.views / maxDailyViews) * 100),
                  item.views > 0 ? 8 : 2
                );
                const dayLabel = new Date(item.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "numeric",
                  day: "numeric",
                });

                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", color: item.views > 0 ? "#818cf8" : "#64748b", fontWeight: 600 }}>
                      {item.views}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "42px",
                        height: `${heightPercent}%`,
                        background:
                          item.views > 0
                            ? "linear-gradient(180deg, #6366f1 0%, #4338ca 100%)"
                            : "rgba(255, 255, 255, 0.05)",
                        borderRadius: "6px 6px 2px 2px",
                        transition: "height 0.3s ease",
                      }}
                      title={`${dayLabel}: ${item.views} views`}
                    />
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Traffic Sources Preview Banner */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px dashed rgba(148, 163, 184, 0.25)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 600, color: "#f8fafc", fontSize: "0.95rem" }}>
              🌐 Advanced Traffic Sources & Geo Analytics
            </span>
            <span style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", borderRadius: "6px" }}>
              Preview — Coming soon
            </span>
          </div>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.825rem", color: "#94a3b8" }}>
            Referrer breakdown (LinkedIn, GitHub, Direct) and geographic country telemetry will be available in Round 2.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
