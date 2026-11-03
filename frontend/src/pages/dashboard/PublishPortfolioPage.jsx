import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { getPortfolioById, publishPortfolio, getUserPortfolios } from "../../services/portfolioService";
import { useSummary } from "../../hooks/useSummary";
import { ROUTES } from "../../constants/routes";
import "./PublishPortfolioPage.css";

export const PublishPortfolioPage = () => {
  const { theme } = useDashboardTheme();
  const { portfolioId: paramId } = useParams();
  const { summary } = useSummary();

  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  useEffect(() => {
    let isMounted = true;

    const resolveAndLoadPortfolio = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        let targetId = paramId;

        // If no portfolio ID in route params, resolve to primary portfolio
        if (!targetId) {
          if (summary?.primaryPortfolio?.id) {
            targetId = summary.primaryPortfolio.id;
          } else {
            const listRes = await getUserPortfolios();
            const list = listRes?.data || listRes || [];
            if (list.length > 0) {
              targetId = list[0].id;
            }
          }
        }

        if (!targetId) {
          if (isMounted) {
            setIsLoading(false);
            setLoadError("No portfolio found. Please create a portfolio first.");
          }
          return;
        }

        const res = await getPortfolioById(targetId);
        const fetched = res.data || res;
        if (isMounted) {
          setPortfolio(fetched);
          const p = fetched.content?.personal || {};
          setMetaTitle(
            fetched.content?.seo?.title ||
              `${fetched.title || p.name || "Candidate"} — Professional Portfolio`
          );
          setMetaDescription(
            fetched.content?.seo?.description ||
              p.bio ||
              p.headline ||
              "Explore projects, work history, and skills."
          );
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err.response?.data?.error?.message ||
              err.message ||
              "Failed to load portfolio details."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    resolveAndLoadPortfolio();

    return () => {
      isMounted = false;
    };
  }, [paramId, summary]);

  const handlePublishClick = async () => {
    if (!portfolio?.id || isPublishing) return;
    setIsPublishing(true);
    setPublishError(null);

    try {
      const res = await publishPortfolio(portfolio.id);
      const updated = res?.data || res;
      setPortfolio((prev) => ({
        ...prev,
        status: "PUBLISHED",
        publishedAt: updated?.publishedAt || new Date().toISOString(),
      }));
      setShowSuccessModal(true);
    } catch (err) {
      setPublishError(
        err.response?.data?.error?.message ||
          err.message ||
          "Failed to publish portfolio. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const publishedFullUrl = portfolio?.slug
    ? `${window.location.origin}/${portfolio.slug}`
    : "";

  if (isLoading) {
    return (
      <div className={`publish-page-root ${theme}`} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
        <p>Loading portfolio deployment settings...</p>
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className={`publish-page-root ${theme}`} style={{ padding: "2rem" }}>
        <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center", background: "rgba(17, 24, 39, 0.8)", border: "1px solid #334155", borderRadius: "16px", padding: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📁</div>
          <h2 style={{ color: "#f87171", margin: "0 0 0.75rem 0" }}>Portfolio Required</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 1.5rem 0" }}>
            {loadError || "You don't have an active portfolio to publish yet."}
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            style={{
              display: "inline-block",
              padding: "0.65rem 1.5rem",
              background: "#6366f1",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadyPublished = portfolio.status === "PUBLISHED";

  return (
    <div className={`publish-page-root ${theme}`}>
      <div className="publish-bg-mesh" />
      <div className="publish-bg-glow" />

      {/* Header Bar */}
      <div className="publish-header-bar">
        <div>
          <h1>Publish & Domain Deployment Settings</h1>
          <p>
            Deploy <strong>{portfolio.title}</strong> to public access with instant SSL and SEO previews.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: isAlreadyPublished ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
              color: isAlreadyPublished ? "#34d399" : "#fbbf24",
              border: `1px solid ${isAlreadyPublished ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            }}
          >
            {isAlreadyPublished ? "● Live / Published" : "○ Draft Mode"}
          </span>
        </div>
      </div>

      {publishError && (
        <div
          role="alert"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "12px 18px",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.9rem",
          }}
        >
          <span>⚠️</span>
          <span>{publishError}</span>
        </div>
      )}

      {/* Main Two Column Form Grid */}
      <div className="publish-grid-container">
        {/* LEFT COLUMN: URL & Domain Settings */}
        <div className="publish-card-box">
          <h3>🔗 Domain & Subdomain Configuration</h3>

          {/* Public Slug Display */}
          <div className="field-group-publish">
            <label>Portfolio URL Slug</label>
            <div className="slug-input-wrapper">
              <span className="slug-prefix-text">{window.location.host}/</span>
              <input
                type="text"
                className="input-slug-field"
                value={portfolio.slug}
                readOnly
                disabled
                title="Portfolio slug is assigned on creation"
              />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px", display: "block" }}>
              Public portfolio link:{" "}
              <a
                href={publishedFullUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600 }}
              >
                {publishedFullUrl} ↗
              </a>
            </span>
          </div>

          {/* Custom Domain Connection - Coming soon */}
          <div className="field-group-publish" style={{ marginTop: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Connect Custom Domain</span>
              <span style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", borderRadius: "6px" }}>
                Coming soon
              </span>
            </label>
            <input
              type="text"
              className="input-text-publish"
              placeholder="e.g. yourname.dev"
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Custom apex domains and automatic DNS verification will be available in Round 2.
            </span>
          </div>

          {/* DNS CNAME Guidance Box */}
          <div className="dns-records-box" style={{ opacity: 0.75 }}>
            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#ffffff", fontSize: "0.85rem" }}>
              📡 SSL & Hosting Architecture
            </div>
            <div className="dns-row-item">
              <span>Hosting: <strong>Production Cloudflare / Vercel Edge</strong></span>
            </div>
            <div className="dns-row-item">
              <span>SSL Encryption: <strong>Automatic HTTPS</strong></span>
              <span style={{ color: "#34d399" }}>🟢 Active</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEO Settings & Meta Preview */}
        <div className="publish-card-box">
          <h3>🔍 Search Engine Optimization (SEO)</h3>

          {/* Meta Title */}
          <div className="field-group-publish">
            <label>SEO Meta Title</label>
            <input
              type="text"
              className="input-text-publish"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Meta Description */}
          <div className="field-group-publish">
            <label>SEO Meta Description</label>
            <textarea
              className="textarea-publish"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={300}
              rows={3}
            />
          </div>

          {/* Google Search Result Preview Snippet */}
          <div className="dns-records-box">
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>
              Google Search Result Snippet Preview:
            </div>
            <div style={{ color: "#818cf8", fontSize: "0.95rem", fontWeight: 700, marginBottom: "2px" }}>
              {metaTitle || portfolio.title}
            </div>
            <div style={{ color: "#34d399", fontSize: "0.78rem", marginBottom: "4px" }}>
              {publishedFullUrl}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.45 }}>
              {metaDescription || "Professional portfolio profile."}
            </div>
          </div>
        </div>
      </div>

      {/* Main Publish CTA Footer Bar */}
      <div className="publish-cta-bar">
        <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          {isAlreadyPublished
            ? "Your portfolio is live. Click below to republish with latest updates."
            : "Ready to deploy? Your changes will be published instantly with public access."}
        </div>

        <button
          type="button"
          className="btn-publish-now-huge"
          onClick={handlePublishClick}
          disabled={isPublishing}
        >
          <span>
            {isPublishing
              ? "Publishing..."
              : isAlreadyPublished
              ? "🚀 Update Published Live"
              : "🚀 Publish Portfolio Now"}
          </span>
        </button>
      </div>

      {/* SUCCESS MODAL DIALOG */}
      {showSuccessModal && (
        <div
          className="publish-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuccessModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="publish-modal-card">
            <div className="modal-confetti-icon">🎉</div>
            <h2>Portfolio Published Live!</h2>
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: 0 }}>
              Your portfolio is now live. Share your link with recruiters, engineering managers, and hiring teams!
            </p>

            <div className="published-url-box">{publishedFullUrl}</div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={publishedFullUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-publish-now-huge"
                style={{
                  height: "44px",
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Open Live Site ↗
              </a>

              <button
                type="button"
                style={{
                  height: "44px",
                  padding: "0 1.25rem",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#ffffff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => setShowSuccessModal(false)}
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishPortfolioPage;
