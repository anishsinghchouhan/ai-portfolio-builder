import React from "react";
import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
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
          {portfolios.length > 5 && (
            <Link to={ROUTES.DASHBOARD_PORTFOLIO} className="btn-view-all-link">
              View all ({portfolios.length}) →
            </Link>
          )}
          <button
            type="button"
            className="btn-create-portfolio-small"
            onClick={onCreateClick}
          >
            <span>＋</span>
            <span>New Portfolio</span>
          </button>
        </div>
      </div>

      {displayPortfolios.length === 0 ? (
        <div className="portfolio-empty-dashed-card">
          <div className="empty-dashed-icon">📁</div>
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
                  <span className="portfolio-meta-item">
                    💻 {portfolio.projectsCount || portfolio._count?.projects || 0} {(portfolio.projectsCount || portfolio._count?.projects) === 1 ? "project" : "projects"}
                  </span>
                  <span className="portfolio-meta-separator">•</span>
                  <span className="portfolio-meta-item">
                    👁️ {portfolio.viewsCount || 0} views
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
                  >
                    ✏️ Edit
                  </button>
                  {isPublished ? (
                    <a
                      href={`/${portfolio.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-portfolio-action live"
                    >
                      ↗ Preview
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn-portfolio-action secondary"
                      onClick={() => navigate(getBuilderPath(portfolio.id))}
                    >
                      👁️ Preview
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
