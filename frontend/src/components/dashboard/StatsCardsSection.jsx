import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./StatsCardsSection.css";

export const StatsCardsSection = ({ counts, analytics, profileStrength }) => {
  const last7Days = Array.isArray(analytics?.last7Days) ? analytics.last7Days : [];
  const hasViewsTraffic = last7Days.some((d) => Number(d.views) > 0);
  const totalViews = Number(analytics?.views || 0);
  const uniqueVisitors = Number(analytics?.uniqueVisitors || 0);
  const publishedCount = Number(counts?.published || 0);
  const portfoliosCount = Number(counts?.portfolios || 0);
  const draftCount = Math.max(0, portfoliosCount - publishedCount);

  // Profile strength data
  const score = profileStrength?.score ?? 0;
  const totalFields = profileStrength?.total ?? 9;
  const percentage = profileStrength?.percentage ?? Math.round((score / totalFields) * 100);
  const missingFields = profileStrength?.missingFields || [];
  const firstMissingField = missingFields.length > 0 ? missingFields[0] : null;

  // Dynamically compute real sparkline path when views > 0 in the last 7 days
  const maxViews = Math.max(...last7Days.map((d) => Number(d.views) || 0), 1);
  const points = last7Days.map((d, idx) => {
    const divisor = Math.max(last7Days.length - 1, 1);
    const x = Math.round((idx / divisor) * 240);
    const y = Math.round(40 - ((Number(d.views) || 0) / maxViews) * 30);
    return { x, y };
  });

  const strokePath = points.length > 0 ? `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}` : "";
  const areaPath = points.length > 0 ? `M 0,46 L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L 240,46 Z` : "";

  const isNewUser = portfoliosCount === 0 || publishedCount === 0;

  return (
    <section className="stats-section-root" aria-label="Portfolio Performance KPIs">
      <div className="stats-cards-grid-4">
        {/* CARD 1: Views (last 7 days + sparkline) */}
        <div className="stat-card-premium views">
          <div className="stat-card-top-row">
            <div className="stat-icon-wrapper indigo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
          <div className="stat-card-middle">
            <div className="stat-card-title">Views (Last 7 Days)</div>
            <h3 className="stat-card-value">{totalViews.toLocaleString()}</h3>
          </div>
          {hasViewsTraffic && strokePath ? (
            <div className="stat-mini-chart">
              <svg viewBox="0 0 240 46" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="realViewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#realViewsGrad)" />
                <path
                  d={strokePath}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <div className="stat-empty-chart-note">
              <span>{isNewUser ? "Appear after you publish" : "0 views in past 7 days"}</span>
            </div>
          )}
        </div>

        {/* CARD 2: Unique Visitors */}
        <div className="stat-card-premium visitors">
          <div className="stat-card-top-row">
            <div className="stat-icon-wrapper purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="stat-card-middle">
            <div className="stat-card-title">Unique Visitors</div>
            <h3 className="stat-card-value">{uniqueVisitors.toLocaleString()}</h3>
          </div>
          <div className="stat-card-subtext">
            {isNewUser ? "Appear after you publish" : `${uniqueVisitors} verified visitors`}
          </div>
        </div>

        {/* CARD 3: Portfolios (Published / Draft count) */}
        <div className="stat-card-premium projects">
          <div className="stat-card-top-row">
            <div className="stat-icon-wrapper emerald">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
          </div>
          <div className="stat-card-middle">
            <div className="stat-card-title">Portfolios</div>
            <h3 className="stat-card-value">{portfoliosCount}</h3>
          </div>
          <div className="stat-card-subtext">
            {publishedCount} published • {draftCount} draft
          </div>
        </div>

        {/* CARD 4: Profile Strength (Progress bar, x of 9 fields, link to missing field) */}
        <div className="stat-card-premium completion">
          <div className="stat-card-top-row">
            <div className="stat-icon-wrapper amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="stat-card-middle">
            <div className="stat-card-title">Profile Strength</div>
            <h3 className="stat-card-value">{percentage}%</h3>
          </div>
          <div className="stat-progress-bar-bg" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
            <div className="stat-progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
            <span className="stat-card-subtext">{score} of {totalFields} fields</span>
            {firstMissingField ? (
              <Link to={ROUTES.DASHBOARD_PROFILE} className="stat-missing-link" title={`Add missing ${firstMissingField.label}`}>
                + {firstMissingField.label} →
              </Link>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "var(--color-success, #52E0A3)" }}>Complete ✓</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCardsSection;
