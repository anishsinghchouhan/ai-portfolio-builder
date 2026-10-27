import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./TemplateManagementPage.css";

export const TemplateManagementPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();

  const templatesList = [
    { id: "tpl_1", name: "Stripe Developer Dark", downloads: "12,450", rating: "4.9 ★", isPro: true, price: "$29" },
    { id: "tpl_2", name: "Linear Minimalist Pro", downloads: "8,920", rating: "4.8 ★", isPro: true, price: "$19" },
    { id: "tpl_3", name: "Cyberpunk Neon 2077", downloads: "19,800", rating: "4.95 ★", isPro: false, price: "FREE" },
  ];

  return (
    <div className={`tpl-mgmt-root ${theme}`}>
      <div className="tpl-mgmt-header-bar">
        <div>
          <h1>Template Inventory & Marketplace Management</h1>
          <p>Upload new JSX themes, configure pricing tiers, edit category tags, and inspect download telemetry.</p>
        </div>

        <button style={{ padding: "0.55rem 1.35rem", borderRadius: "999px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }} onClick={() => alert("Upload Template Modal...")}>
          + Upload New Template
        </button>
      </div>

      <div className="admin-tpl-grid">
        {templatesList.map((tpl) => (
          <div key={tpl.id} className="tpl-mgmt-card-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{tpl.name}</h3>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: tpl.isPro ? "#fbbf24" : "#34d399" }}>
                {tpl.isPro ? `👑 ${tpl.price}` : "✨ FREE"}
              </span>
            </div>

            <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "1rem" }}>
              Downloads: <strong style={{ color: "#38bdf8" }}>{tpl.downloads}</strong> • Rating: <strong style={{ color: "#fbbf24" }}>{tpl.rating}</strong>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ flex: 1, padding: "0.4rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontSize: "0.78rem", cursor: "pointer" }}>
                Edit Settings
              </button>
              <button style={{ padding: "0.4rem 0.85rem", borderRadius: "999px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontSize: "0.78rem", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateManagementPage;
