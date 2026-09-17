import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./AdminDashboardPage.css";

export const AdminDashboardPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();

  const kpis = [
    { title: "Total Registered Users", val: "128,450", trend: "+14.2% MoM", color: "#38bdf8" },
    { title: "Active Monthly Revenue (MRR)", val: "$142,800", trend: "+22.5% Growth", color: "#34d399" },
    { title: "Active Paid Subscriptions", val: "7,520", trend: "+18.9%", color: "#818cf8" },
    { title: "Total AI Audit Requests", val: "1.42M", trend: "⚡ 99.9% Uptime", color: "#fbbf24" },
  ];

  return (
    <div className={`admin-dashboard-root ${theme}`}>
      <div className="admin-header-bar">
        <div>
          <h1>System Admin Master Control Panel</h1>
          <p>Global platform analytics, user signups growth, platform MRR, and template management.</p>
        </div>

        <div style={{ padding: "0.5rem 1.25rem", borderRadius: "999px", background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.4)", color: "#818cf8", fontWeight: 700 }}>
          👑 Super Admin Privileges Active
        </div>
      </div>

      {/* 4 Admin KPI Cards */}
      <div className="admin-kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="admin-card-box">
            <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "4px" }}>{kpi.title}</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, color: kpi.color, margin: "4px 0" }}>{kpi.val}</div>
            <div style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 700 }}>{kpi.trend}</div>
          </div>
        ))}
      </div>

      {/* Admin Revenue & Growth Chart Box */}
      <div className="admin-card-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>📈 Platform Revenue Growth & User Signups</h3>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Last 12 Months (2026)</span>
        </div>

        <div style={{ height: "220px", width: "100%" }}>
          <svg viewBox="0 0 500 160" style={{ width: "100%", height: "100%" }}>
            <path d="M 0,140 Q 100,80 200,100 T 350,30 L 500,10 L 500,160 L 0,160 Z" fill="rgba(52, 211, 153, 0.15)" />
            <path d="M 0,140 Q 100,80 200,100 T 350,30 L 500,10" fill="none" stroke="#34d399" strokeWidth="3.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
