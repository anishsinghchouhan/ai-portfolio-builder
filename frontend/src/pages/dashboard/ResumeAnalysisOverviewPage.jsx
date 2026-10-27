import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./ResumeAnalysisOverviewPage.css";

export const ResumeAnalysisOverviewPage = ({ onContinueAudit, onBack }) => {
  const { theme, toggleTheme } = useDashboardTheme();

  const missingInfoList = [
    {
      icon: "⚠️",
      title: "Missing Live Project Demo Link",
      description: "Adding 1 live deployed URL to your Senior Engineer role increases recruiter click-through rate by 34%.",
    },
    {
      icon: "📜",
      title: "Missing Cloud Certifications",
      description: "No AWS, GCP, or Azure credentials detected. Adding a certification boosts enterprise recruiter trust.",
    },
    {
      icon: "🔗",
      title: "LinkedIn Profile URL Unlinked",
      description: "Provide your public LinkedIn URL to enable 1-click candidate verification for talent acquisition teams.",
    },
  ];

  const suggestionsList = [
    {
      icon: "⚡",
      title: "Quantify Impact in Work Experience Bullet #2",
      description: "Rewrite 'Improved web application speed' to 'Architected edge caching that reduced LCP latency by 42%'.",
    },
    {
      icon: "🚀",
      title: "Add High-Demand Tech Stack Keywords",
      description: "Include GraphQL, Docker, and AI Prompting to match 98% of Senior Full-Stack Developer job postings.",
    },
    {
      icon: "✨",
      title: "Optimize Bio Summary Headline",
      description: "Use action-oriented title: 'Senior Full-Stack Engineer specializing in React, Node.js, and Distributed AI Systems'.",
    },
  ];

  return (
    <div className={`analysis-page-root ${theme}`}>
      <div className="analysis-bg-mesh" />
      <div className="analysis-bg-glow" />

      {/* Light / Dark Mode Toggle */}
      <button className="theme-toggle-analysis" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* Header Bar */}
      <div className="analysis-header-bar">
        <h1>AI Resume Audit Overview</h1>
        <p>
          Deep neural network analysis of <strong>Alex_Morgan_Senior_FullStack_Resume.pdf</strong> against 10,000+ top technical resumes.
        </p>
      </div>

      {/* 3 Metrics Cards Top Grid */}
      <div className="analysis-metrics-grid">
        {/* ATS Resume Score */}
        <div className="analysis-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Overall ATS Match Score</span>
            <span style={{ fontSize: "1.2rem" }}>🎯</span>
          </div>
          <div className="metric-value-huge indigo">94/100</div>
          <span className="metric-sub-label">EXCELLENT • Passes 99.4% of corporate ATS filters</span>
        </div>

        {/* Candidate Profile Strength */}
        <div className="analysis-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Profile Strength Rating</span>
            <span style={{ fontSize: "1.2rem" }}>🔥</span>
          </div>
          <div className="metric-value-huge emerald">Top 5%</div>
          <span className="metric-sub-label">High recruiter response likelihood for Senior roles</span>
        </div>

        {/* Completion Strength */}
        <div className="analysis-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Portfolio Readiness</span>
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
          </div>
          <div className="metric-value-huge cyan">88%</div>
          <span className="metric-sub-label">Ready for deployment • 2 minor additions suggested</span>
        </div>
      </div>

      {/* AI Executive Summary Card */}
      <div className="ai-summary-card">
        <div className="ai-summary-header">
          <span>✨</span>
          <h3>AI Executive Summary</h3>
        </div>
        <p className="ai-summary-text">
          Alex's resume demonstrates exceptionally strong Senior Full-Stack engineering achievements. Work history highlights leadership in microservices, React performance tuning, and CI/CD pipelines. Technical terminology aligns closely with modern SaaS company requirements (Vercel, Stripe, Linear). Addressing 2 minor skill gaps will push candidate ATS match score to 99.8%.
        </p>
      </div>

      {/* Two Column Grid: Missing Info & Improvement Suggestions */}
      <div className="analysis-two-col-grid">
        {/* Missing Information Box */}
        <div className="analysis-section-box">
          <h3>
            <span>⚠️ Identified Gaps & Missing Information</span>
          </h3>
          <div className="analysis-list-items">
            {missingInfoList.map((item, idx) => (
              <div key={idx} className="analysis-item-row">
                <span className="item-bullet-icon">{item.icon}</span>
                <div className="item-content-text">
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions Box */}
        <div className="analysis-section-box">
          <h3>
            <span>⚡ AI High-Impact Suggestions</span>
          </h3>
          <div className="analysis-list-items">
            {suggestionsList.map((item, idx) => (
              <div key={idx} className="analysis-item-row">
                <span className="item-bullet-icon">{item.icon}</span>
                <div className="item-content-text">
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA Row */}
      <div className="analysis-footer-cta">
        <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          Next step: Apply AI recommendations or launch full deep audit report.
        </div>

        <button
          type="button"
          className="btn-continue-analysis"
          onClick={onContinueAudit || (() => alert("Launching Deep AI Audit Report..."))}
        >
          <span>Continue Deep AI Audit</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalysisOverviewPage;
