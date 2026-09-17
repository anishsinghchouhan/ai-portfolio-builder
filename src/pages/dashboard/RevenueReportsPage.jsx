import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./RevenueReportsPage.css";

export const RevenueReportsPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();

  const revenueStats = [
    { label: "Monthly Recurring Revenue", val: "$142,800", trend: "+24.5%", color: "#34d399" },
    { label: "Annual Run Rate (ARR)", val: "$1.71M", trend: "+18.2%", color: "#38bdf8" },
    { label: "Free vs Paid Conversion", val: "6.8%", trend: "+1.4%", color: "#818cf8" },
    { label: "Refund Rate", val: "0.12%", trend: "🟢 Extremely Low", color: "#fbbf24" },
  ];

  const recentTransactions = [
    { user: "Sarah Jenkins", plan: "Pro Candidate ($19/mo)", status: "Completed", amount: "$19.00", date: "Just now" },
    { user: "David Chen", plan: "Pro Candidate ($19/mo)", status: "Completed", amount: "$19.00", date: "12m ago" },
    { user: "Alex Morgan", plan: "Executive Tier ($49/mo)", status: "Completed", amount: "$49.00", date: "1h ago" },
  ];

  return (
    <div className={`revenue-page-root ${theme}`}>
      <div className="revenue-header-bar">
        <div>
          <h1>Financial Summary & Revenue Reports</h1>
          <p>MRR / ARR telemetry, transaction logs, subscription renewal metrics, and Stripe financial exports.</p>
        </div>

        <button style={{ padding: "0.55rem 1.35rem", borderRadius: "999px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }} onClick={() => alert("Exporting Financial CSV...")}>
          📥 Export Financial CSV
        </button>
      </div>

      {/* 4 Revenue KPI Cards */}
      <div className="revenue-kpi-grid">
        {revenueStats.map((stat, idx) => (
          <div key={idx} className="revenue-card-box">
            <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "4px" }}>{stat.label}</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, color: stat.color, margin: "4px 0" }}>{stat.val}</div>
            <div style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 700 }}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table */}
      <div className="revenue-card-box">
        <h3 style={{ margin: "0 0 1rem 0" }}>💳 Recent Stripe Transactions</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-dark)", color: "#94a3b8" }}>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Customer</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Plan Purchased</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Amount</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Status</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--color-border-dark)" }}>
                <td style={{ padding: "0.85rem", fontWeight: 700, color: "#ffffff" }}>{tx.user}</td>
                <td style={{ padding: "0.85rem", color: "#818cf8" }}>{tx.plan}</td>
                <td style={{ padding: "0.85rem", color: "#34d399", fontWeight: 800 }}>{tx.amount}</td>
                <td style={{ padding: "0.85rem", color: "#34d399", fontWeight: 700 }}>✓ {tx.status}</td>
                <td style={{ padding: "0.85rem", color: "#94a3b8" }}>{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueReportsPage;
