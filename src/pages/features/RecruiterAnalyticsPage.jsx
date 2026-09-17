import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useAuth } from "../../hooks/useAuth";
import "./RecruiterAnalyticsPage.css";

export const RecruiterAnalyticsPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      window.location.hash = "#analytics-dashboard";
    } else {
      window.location.hash = "#signup";
    }
  };

  return (
    <div className="pub-analytics-root">
      <Navbar
        onNavigateLogin={() => {
          if (onNavigate) onNavigate("login");
          else window.location.hash = "#login";
        }}
        onNavigateSignup={() => {
          if (onNavigate) onNavigate("signup");
          else window.location.hash = "#signup";
        }}
      />

      <main className="pub-analytics-container">
        {/* Header Hero */}
        <section className="pub-analytics-hero">
          <div className="pub-analytics-badge">
            <span>📊 RECRUITER ANALYTICS & VISITOR INSIGHTS</span>
          </div>
          <h1 className="pub-analytics-title">
            Track When Recruiters & Hiring Managers <br />
            <span className="pub-analytics-title-gradient">View Your Portfolio</span>
          </h1>
          <p className="pub-analytics-subtitle">
            Get privacy-first real-time telemetry on recruiter pageviews, project clicks, resume downloads, and traffic sources without invasive third-party tracking cookies.
          </p>
        </section>

        {/* Interactive Analytics Dashboard Demo Preview */}
        <section className="pub-analytics-demo-box">
          <div className="analytics-demo-card">
            <div className="demo-header">
              <h3>📈 Candidate Analytics Dashboard (Demo Preview)</h3>
              <span className="live-pulse-pill">● Live Activity Telemetry</span>
            </div>

            {/* KPI Cards Grid */}
            <div className="kpi-cards-grid">
              <div className="kpi-item">
                <span className="kpi-label">TOTAL PORTFOLIO VIEWS</span>
                <strong className="kpi-val">2,840</strong>
                <span className="kpi-trend green">+42% this month</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">RECRUITER CLICKS</span>
                <strong className="kpi-val">148</strong>
                <span className="kpi-trend green">+18% high intent</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">RESUME DOWNLOADS</span>
                <strong className="kpi-val">64</strong>
                <span className="kpi-trend purple">PDF exports</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">AVG TIME ON PAGE</span>
                <strong className="kpi-val">2m 45s</strong>
                <span className="kpi-trend green">+35s engagement</span>
              </div>
            </div>

            {/* Simulated Activity Stream */}
            <div className="sim-activity-box">
              <h4>⚡ Recent Visitor Events</h4>
              <div className="activity-row">
                <span className="act-icon">💼</span>
                <div className="act-info">
                  <strong>Stripe Talent Acquisition</strong> viewed Projects section from San Francisco, CA
                </div>
                <span className="act-time">2 mins ago</span>
              </div>
              <div className="activity-row">
                <span className="act-icon">📥</span>
                <div className="act-info">
                  <strong>Senior Engineering Manager</strong> downloaded PDF Resume from New York, NY
                </div>
                <span className="act-time">14 mins ago</span>
              </div>
              <div className="activity-row">
                <span className="act-icon">🌐</span>
                <div className="act-info">
                  Direct visitor accessed <strong>https://portfolio.ai/alex-rivera</strong>
                </div>
                <span className="act-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="pub-analytics-features">
          <div className="af-card">
            <span className="af-icon">🛡️</span>
            <h3>Privacy-First Measurement</h3>
            <p>GDPR and CCPA compliant analytics engine. No invasive cookies, ad tracking, or cross-site fingerprinting.</p>
          </div>
          <div className="af-card">
            <span className="af-icon">🎯</span>
            <h3>Project Click Heatmaps</h3>
            <p>Discover which GitHub repositories, case studies, and live links capture recruiter attention most.</p>
          </div>
          <div className="af-card">
            <span className="af-icon">🔔</span>
            <h3>Instant View Notifications</h3>
            <p>Receive real-time email alerts when a recruiter spends over 2 minutes viewing your portfolio.</p>
          </div>
        </section>

        {/* Action CTA Box */}
        <section className="pub-analytics-cta-box">
          <h2>Start Tracking Your Candidate Portfolio Views</h2>
          <p>Create your portfolio today and unlock real-time recruiter analytics.</p>
          <button className="btn-analytics-cta" onClick={handleCtaClick}>
            {isAuthenticated ? "Open My Analytics Dashboard →" : "Get Started Free →"}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RecruiterAnalyticsPage;
