import React from "react";
import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { getBuilderPath, ROUTES } from "../../constants/routes";
import "./RecentPortfoliosSection.css";

export const RecentPortfoliosSection = ({
  portfolios = [],
  onCreateClick,
}) => {
  const navigate = useNavigate();
  const displayPortfolios = portfolios.slice(0, 5);

  return (
    <section className="recent-portfolios-section-root" aria-label="Recent Portfolios">
      <div className="recent-portfolios-header">
        <div className="recent-portfolios-title-group">
          <h2>Recent Portfolios</h2>
          <p>Your active candidate profiles, drafts, and live links.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link to={ROUTES.DASHBOARD_PORTFOLIO} className="btn-view-all-link">
            View all ({portfolios.length}) →
          </Link>
        </div>
      </div>

      {displayPortfolios.length === 0 ? (
        <div className="portfolio-empty-dashed-card">
          <div className="empty-dashed-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>You don't have a portfolio yet</h3>
          <p>Create your first portfolio to showcase your engineering projects, skills, and resume.</p>
          <div className="empty-dashed-actions">
            <button
              type="button"
              className="btn-primary-action"
              onClick={onCreateClick}
            >
              ＋ Create your first portfolio
            </button>
            <Link to={ROUTES.DASHBOARD_TEMPLATES} className="btn-secondary-link">
              Browse templates →
            </Link>
          </div>
        </div>
      ) : (
        <div className="portfolios-grid-cards">
          {displayPortfolios.map((portfolio) => {
            const isPublished = portfolio.status === "PUBLISHED";
            const updatedDate = portfolio.updatedAt
              ? new Date(portfolio.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently";

            return (
              <div key={portfolio.id} className="portfolio-card-item">
                <div className="portfolio-card-top">
                  <div className="portfolio-card-heading">
                    <h3 className="portfolio-card-title">{portfolio.title}</h3>
                    <span className="portfolio-slug-tag">/{portfolio.slug}</span>
                  </div>
                  <StatusBadge status={portfolio.status} />
                </div>

                <div className="portfolio-meta-row">
                  <span className="portfolio-meta-item" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <span>{portfolio.projectsCount || portfolio._count?.projects || 0} {(portfolio.projectsCount || portfolio._count?.projects) === 1 ? "project" : "projects"}</span>
                  </span>
                  <span className="portfolio-meta-separator">•</span>
                  <span className="portfolio-meta-item" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>{portfolio.viewsCount || 0} views</span>
                  </span>
                  <span className="portfolio-meta-separator">•</span>
                  <span className="portfolio-meta-item">
                    Updated {updatedDate}
                  </span>
                </div>

                <div className="portfolio-card-actions">
                  <button
                    type="button"
                    className="btn-portfolio-action primary"
                    onClick={() => navigate(getBuilderPath(portfolio.id))}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  {isPublished ? (
                    <a
                      href={`/${portfolio.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-portfolio-action live"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                      <span>Live view</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn-portfolio-action secondary"
                      onClick={() => navigate(getBuilderPath(portfolio.id))}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentPortfoliosSection;
