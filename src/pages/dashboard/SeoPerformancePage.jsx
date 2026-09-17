import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./SeoPerformancePage.css";

export const SeoPerformancePage = ({ onBack }) => {
  const { theme } = useDashboardTheme();

  const scores = [
    { title: "SEO Score", score: 98, status: "Excellent", color: "#34d399" },
    { title: "Performance Score", score: 99, status: "Lightning Fast", color: "#38bdf8" },
    { title: "Accessibility Score", score: 100, status: "Perfect (WCAG AA)", color: "#818cf8" },
    { title: "Best Practices", score: 96, status: "Top 1% Compliance", color: "#fbbf24" },
  ];

  return (
    <div className={`seo-page-root ${theme}`}>
      <div className="seo-header-bar">
        <div className="seo-title-group">
          <h1>SEO & Core Web Vitals Performance Audit</h1>
          <p>Automated page speed diagnostics, search engine meta tags, and AI optimization recommendations.</p>
        </div>

        <button type="button" className="btn-ai-improve" onClick={() => alert("Running AI SEO Enhancement Engine...")}>
          ✨ Improve with AI Engine
        </button>
      </div>

      {/* 4 Score Gauges */}
      <div className="seo-scores-grid">
        {scores.map((s, idx) => (
          <div key={idx} className="seo-score-card">
            <div className="score-num-text" style={{ color: s.color }}>{s.score}%</div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: "4px" }}>{s.title}</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>{s.status}</div>
          </div>
        ))}
      </div>

      {/* 2 Column Details Grid */}
      <div className="seo-two-col-grid">
        {/* Left: Open Graph Preview & Meta Tags */}
        <div className="seo-card-box">
          <h3 style={{ margin: "0 0 1rem 0" }}>🔍 Open Graph Social Preview</h3>
          <div style={{ border: "1px solid var(--color-border-dark)", borderRadius: "16px", overflow: "hidden", background: "#0f172a" }}>
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80" alt="OG Preview" style={{ width: "100%", height: "160px", objectFit: "cover" }} />
            <div style={{ padding: "1rem" }}>
              <div style={{ color: "#38bdf8", fontSize: "0.75rem", marginBottom: "4px" }}>portfolio.ai/alex-morgan</div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.95rem" }}>Alex Morgan — Senior Full-Stack Engineer</div>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "4px" }}>Senior Full-Stack Engineer specializing in React, Node.js, and Distributed AI Systems.</div>
            </div>
          </div>
        </div>

        {/* Right: AI Keyword & Speed Recommendations */}
        <div className="seo-card-box">
          <h3 style={{ margin: "0 0 1rem 0" }}>⚡ AI Speed & Keyword Recommendations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <div style={{ fontWeight: 700, color: "#34d399", fontSize: "0.88rem" }}>✓ WebP Image Format Compression Applied</div>
              <div style={{ fontSize: "0.78rem", color: "#cbd5e1" }}>Saved 1.2 MB on initial hero asset load.</div>
            </div>
            <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.3)" }}>
              <div style={{ fontWeight: 700, color: "#818cf8", fontSize: "0.88rem" }}>💡 Add Target Keyword "AI Architecture"</div>
              <div style={{ fontSize: "0.78rem", color: "#cbd5e1" }}>Increases recruiter search visibility for Senior AI Lead positions.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoPerformancePage;
