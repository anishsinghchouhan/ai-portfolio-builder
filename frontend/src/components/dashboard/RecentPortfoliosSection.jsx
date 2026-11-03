import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { getBuilderPath, getThemesPath, getPublishPath } from "../../constants/routes";
import "./RecentPortfoliosSection.css";

export const RecentPortfoliosSection = ({
  portfolios = [],
  onCreateClick,
}) => {
  const navigate = useNavigate();

  return (
    <section className="recent-portfolios-section-root">
      <div className="recent-portfolios-header">
        <div className="recent-portfolios-title-group">
          <h2>Your Portfolios</h2>
          <p>Quick access to your active candidate profiles, drafts, and live links.</p>
        </div>
        {portfolios.length > 0 && (
          <button
            type="button"
            className="btn-create-portfolio-small"
            onClick={onCreateClick}
          >
            <span>＋</span>
            <span>New Portfolio</span>
          </button>
        )}
      </div>

      {portfolios.length === 0 ? (
        <EmptyState
          icon="📂"
          title="No Portfolios Created Yet"
          description="Build your first personalized candidate portfolio in seconds with pre-built developer sections."
          actionButton={
            <button
              type="button"
              className="btn-primary-action"
              onClick={onCreateClick}
            >
              ＋ Create First Portfolio
            </button>
          }
        />
      ) : (
        <div className="portfolios-grid-cards">
          {portfolios.map((portfolio) => {
            const isPublished = portfolio.status === "PUBLISHED";
            const updatedDate = new Date(portfolio.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

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
                    💻 {portfolio.projectsCount || 0} {portfolio.projectsCount === 1 ? "project" : "projects"}
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
                  <button
                    type="button"
                    className="btn-portfolio-action secondary"
                    onClick={() => navigate(getThemesPath(portfolio.id))}
                  >
                    🎨 Theme
                  </button>
                  <button
                    type="button"
                    className="btn-portfolio-action secondary"
                    onClick={() => navigate(getPublishPath(portfolio.id))}
                  >
                    ⚙️ Settings
                  </button>
                  {isPublished && (
                    <a
                      href={`/${portfolio.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-portfolio-action live"
                    >
                      ↗ Live
                    </a>
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
