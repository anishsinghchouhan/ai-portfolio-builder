import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./VisitorAnalyticsPage.css";

export const VisitorAnalyticsPage = ({ onExport, onBack }) => {
  const { theme } = useDashboardTheme();
  const [countryFilter, setCountryFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");

  const countries = [
    { flag: "🇺🇸", name: "United States", percent: "42%" },
    { flag: "🇬🇧", name: "United Kingdom", percent: "18%" },
    { flag: "🇩🇪", name: "Germany", percent: "14%" },
    { flag: "🇨🇦", name: "Canada", percent: "12%" },
    { flag: "🇯🇵", name: "Japan", percent: "8%" },
    { flag: "🌐", name: "Others", percent: "6%" },
  ];

  const devices = [
    { icon: "📱", name: "Mobile", percent: "54%" },
    { icon: "💻", name: "Desktop", percent: "42%" },
    { icon: "📱", name: "Tablet", percent: "4%" },
  ];

  const browsers = [
    { icon: "🌐", name: "Google Chrome", percent: "62%" },
    { icon: "🧭", name: "Apple Safari", percent: "22%" },
    { icon: "🦊", name: "Mozilla Firefox", percent: "10%" },
    { icon: "🌀", name: "Microsoft Edge", percent: "6%" },
  ];

  const operatingSystems = [
    { icon: "🍎", name: "macOS", percent: "48%" },
    { icon: "🪟", name: "Windows", percent: "34%" },
    { icon: "📱", name: "iOS", percent: "12%" },
    { icon: "🤖", name: "Android", percent: "6%" },
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleExportClick = () => {
    if (onExport) onExport();
    else alert("Exporting Visitor Analytics Report (PDF & CSV)...");
  };

  return (
    <div className={`visitor-analytics-root ${theme}`}>
      <div className="visitor-bg-mesh" />
      <div className="visitor-bg-glow" />

      {/* Header Bar */}
      <div className="visitor-header-bar">
        <div className="visitor-title-group">
          <h1>Visitor Telemetry & Demographics</h1>
          <p>Detailed breakdown of geographic locations, devices, browser software, and peak visit activity heatmaps.</p>
        </div>

        <button type="button" className="btn-export-report" onClick={handleExportClick}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export Report PDF</span>
        </button>
      </div>

      {/* Filters Toolbar Bar */}
      <div className="visitor-filters-bar">
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Filter Analytics:</span>
        <select
          className="filter-select-input"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="all">All Countries</option>
          <option value="us">United States (🇺🇸)</option>
          <option value="uk">United Kingdom (🇬🇧)</option>
          <option value="de">Germany (🇩🇪)</option>
        </select>

        <select
          className="filter-select-input"
          value={deviceFilter}
          onChange={(e) => setDeviceFilter(e.target.value)}
        >
          <option value="all">All Devices</option>
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
        </select>
      </div>

      {/* Timeline Graph & Heatmap 2-Column Grid */}
      <div className="visitor-timeline-grid">
        {/* Timeline Volume Graph */}
        <div className="visitor-card-box">
          <h3>📈 24-Hour Traffic Volume Timeline</h3>
          <div style={{ height: "200px", width: "100%", marginTop: "1rem" }}>
            <svg viewBox="0 0 400 160" style={{ width: "100%", height: "100%" }}>
              <path
                d="M 0,140 Q 60,60 120,90 T 240,40 T 360,20 L 400,50 L 400,160 L 0,160 Z"
                fill="rgba(56, 189, 248, 0.15)"
              />
              <path
                d="M 0,140 Q 60,60 120,90 T 240,40 T 360,20 L 400,50"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Heat Map Activity Grid */}
        <div className="visitor-card-box">
          <h3>🔥 Peak Recruiter Activity Heatmap</h3>
          <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "8px" }}>
            Day vs Hour peak recruiter browsing density:
          </div>
          <div className="heatmap-matrix-grid">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className={`heatmap-cell cell-lvl-${(idx % 5)}`}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics 4-Column Bottom Grid */}
      <div className="visitor-demographics-grid">
        {/* 1. Countries */}
        <div className="visitor-card-box">
          <h3>🌍 Top Countries</h3>
          <div className="demo-list-items">
            {countries.map((c, idx) => (
              <div key={idx} className="demo-item-row">
                <span className="demo-left-name">{c.flag} {c.name}</span>
                <span className="demo-val-percent">{c.percent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Devices */}
        <div className="visitor-card-box">
          <h3>📱 Device Types</h3>
          <div className="demo-list-items">
            {devices.map((d, idx) => (
              <div key={idx} className="demo-item-row">
                <span className="demo-left-name">{d.icon} {d.name}</span>
                <span className="demo-val-percent">{d.percent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Browsers */}
        <div className="visitor-card-box">
          <h3>🌐 Browsers</h3>
          <div className="demo-list-items">
            {browsers.map((b, idx) => (
              <div key={idx} className="demo-item-row">
                <span className="demo-left-name">{b.icon} {b.name}</span>
                <span className="demo-val-percent">{b.percent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Operating Systems */}
        <div className="visitor-card-box">
          <h3>💻 Operating Systems</h3>
          <div className="demo-list-items">
            {operatingSystems.map((os, idx) => (
              <div key={idx} className="demo-item-row">
                <span className="demo-left-name">{os.icon} {os.name}</span>
                <span className="demo-val-percent">{os.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalyticsPage;
