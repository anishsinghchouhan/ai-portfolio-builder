import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./AnalyticsDashboardPage.css";

export const AnalyticsDashboardPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [dateRange, setDateRange] = useState("30d"); // "7d" | "30d" | "90d" | "1y"

  const kpis = [
    { title: "Total Unique Visitors", value: "14,280", trend: "+24.5% vs last month", color: "cyan" },
    { title: "Portfolio Page Views", value: "38,420", trend: "+18.2%", color: "indigo" },
    { title: "Resume PDF Downloads", value: "1,840", trend: "+12.4%", color: "emerald" },
    { title: "Recruiter Click-Through CTR", value: "18.4%", trend: "+3.1%", color: "amber" },
  ];

  const trafficSources = [
    { name: "LinkedIn Profile & Posts", percentage: "45%", count: "6,426 visitors", barWidth: "45%" },
    { name: "Direct Link Search / URL", percentage: "28%", count: "3,998 visitors", barWidth: "28%" },
    { name: "GitHub Readme & Repositories", percentage: "18%", count: "2,570 visitors", barWidth: "18%" },
    { name: "Twitter / X & Tech Blogs", percentage: "9%", count: "1,286 visitors", barWidth: "9%" },
  ];

  const performanceTable = [
    { asset: "AI Portfolio Builder SaaS Project", views: "14,210 Views", ctr: "24.8% CTR", avgTime: "3m 42s" },
    { asset: "Alex_Morgan_Senior_FullStack_Resume.pdf", views: "1,840 Downloads", ctr: "12.9% CTR", avgTime: "1m 15s" },
    { asset: "Real-Time WebSocket Engine", views: "8,940 Views", ctr: "18.2% CTR", avgTime: "2m 10s" },
    { asset: "Technical Skills Stack Section", views: "19,500 Views", ctr: "32.1% CTR", avgTime: "0m 45s" },
  ];

  return (
    <div className={`analytics-page-root ${theme}`}>
      <div className="analytics-bg-mesh" />
      <div className="analytics-bg-glow" />

      {/* Header Bar */}
      <div className="analytics-header-bar">
        <div className="analytics-title-group">
          <h1>Portfolio Traffic Analytics & Metrics</h1>
          <p>Real-time telemetry tracking recruiter views, resume downloads, and click-through metrics.</p>
        </div>

        {/* Date Range Selector Pills */}
        <div className="date-range-selector">
          {[
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "90d", label: "90 Days" },
            { id: "1y", label: "1 Year" },
          ].map((range) => (
            <button
              key={range.id}
              className={`btn-range-pill ${dateRange === range.id ? "active" : ""}`}
              onClick={() => setDateRange(range.id)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards Top Grid */}
      <div className="analytics-kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card-item">
            <div className="kpi-top-row">
              <span className="kpi-title-text">{kpi.title}</span>
              <span style={{ fontSize: "1.1rem" }}>📊</span>
            </div>
            <div className={`kpi-huge-number ${kpi.color}`}>{kpi.value}</div>
            <div className="kpi-trend-pill">
              <span>↑</span>
              <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Area Chart + Traffic Sources Grid */}
      <div className="analytics-main-charts-grid">
        {/* Left: SVG Area Trend Graph Box */}
        <div className="chart-card-box">
          <div className="chart-header-row">
            <h3>📈 Portfolio Traffic & Views Trend ({dateRange.toUpperCase()})</h3>
            <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 700 }}>● Real-time Active</span>
          </div>

          <div className="svg-graph-container">
            <svg viewBox="0 0 500 200">
              <defs>
                <linearGradient id="areaGraphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 0,180 Q 80,120 150,140 T 300,70 T 450,40 L 500,60 L 500,200 L 0,200 Z"
                fill="url(#areaGraphGradient)"
              />

              {/* Stroke Line */}
              <path
                d="M 0,180 Q 80,120 150,140 T 300,70 T 450,40 L 500,60"
                fill="none"
                stroke="#818cf8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="150" cy="140" r="5" fill="#38bdf8" />
              <circle cx="300" cy="70" r="5" fill="#38bdf8" />
              <circle cx="450" cy="40" r="6" fill="#34d399" />
            </svg>
          </div>
        </div>

        {/* Right: Traffic Sources Breakdown Bar List */}
        <div className="chart-card-box">
          <div className="chart-header-row">
            <h3>🌐 Top Traffic Referrers</h3>
          </div>

          <div className="traffic-sources-list">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="source-item-row">
                <div className="source-meta-row">
                  <span className="source-name-text">{source.name}</span>
                  <span className="source-percentage-text">{source.percentage}</span>
                </div>
                <div className="source-bar-track">
                  <div className="source-bar-fill" style={{ width: source.barWidth }} />
                </div>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{source.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Portfolio Performance Table */}
      <div className="performance-table-card">
        <div className="chart-header-row">
          <h3>⚡ Top Performing Portfolio Assets & Projects</h3>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Sorted by recruiter engagement</span>
        </div>

        <table className="performance-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Views / Downloads</th>
              <th>Click-Through Rate</th>
              <th>Avg Session Time</th>
            </tr>
          </thead>
          <tbody>
            {performanceTable.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700 }}>{row.asset}</td>
                <td style={{ color: "#38bdf8" }}>{row.views}</td>
                <td style={{ color: "#34d399", fontWeight: 700 }}>{row.ctr}</td>
                <td style={{ color: "#cbd5e1" }}>{row.avgTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
