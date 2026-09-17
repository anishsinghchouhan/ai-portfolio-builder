import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./ReportsPage.css";

export const ReportsPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [dateRange, setDateRange] = useState("oct-2026");

  const downloadHistory = [
    { title: "Monthly Recruiter Traffic Report", date: "Oct 28, 2026", format: "PDF • 2.4 MB" },
    { title: "Quarterly ATS Parsing Analytics", date: "Sep 30, 2026", format: "CSV • 820 KB" },
    { title: "Annual Candidate Telemetry Summary", date: "Aug 15, 2026", format: "PDF • 4.1 MB" },
  ];

  return (
    <div className={`reports-page-root ${theme}`}>
      <div className="reports-header-bar">
        <div>
          <h1>Analytics & PDF Reports Generator</h1>
          <p>Export scheduled PDF/CSV traffic summaries, recruiter engagement statistics, and ATS audit reports.</p>
        </div>

        <button type="button" className="btn-report-export" onClick={() => alert("Generating PDF Report...")}>
          📥 Export PDF Report
        </button>
      </div>

      <div className="reports-grid-container">
        {/* Left: Scheduled & Export Controls */}
        <div className="reports-card-box">
          <h3 style={{ margin: "0 0 1rem 0" }}>⚙️ Report Parameters</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Select Date Range</label>
            <select
              style={{ width: "100%", height: "42px", borderRadius: "12px", background: "#0b0f19", border: "1px solid var(--color-border-dark)", color: "#ffffff", padding: "0 12px", marginTop: "4px" }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="oct-2026">October 2026 (Current Month)</option>
              <option value="q3-2026">Q3 2026 (Jul - Sep)</option>
              <option value="ytd">Year to Date 2026</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "1.25rem" }}>
            <button style={{ flex: 1, padding: "0.6rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontWeight: 600 }}>
              Email Report
            </button>
            <button style={{ flex: 1, padding: "0.6rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontWeight: 600 }}>
              Export CSV
            </button>
          </div>
        </div>

        {/* Right: Download History & Report Preview */}
        <div className="reports-card-box">
          <h3 style={{ margin: "0 0 1rem 0" }}>📄 Recent Generated Reports</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {downloadHistory.map((item, idx) => (
              <div key={idx} style={{ padding: "0.85rem 1rem", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border-dark)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>{item.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{item.date} • {item.format}</div>
                </div>
                <button style={{ padding: "0.35rem 0.85rem", borderRadius: "999px", background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.4)", color: "#ffffff", fontSize: "0.78rem", cursor: "pointer" }}>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
