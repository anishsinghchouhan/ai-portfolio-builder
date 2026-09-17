import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./PublishPortfolioPage.css";

export const PublishPortfolioPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [customSlug, setCustomSlug] = useState("alex-morgan-tech");
  const [customDomain, setCustomDomain] = useState("alexmorgan.dev");
  const [metaTitle, setMetaTitle] = useState("Alex Morgan — Senior Full-Stack Engineer Portfolio");
  const [metaDescription, setMetaDescription] = useState(
    "Senior Full-Stack Engineer specializing in React, Node.js, and Distributed AI Systems. Explore portfolio projects and resume."
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handlePublishClick = () => {
    setShowSuccessModal(true);
  };

  const publishedFullUrl = `https://portfolio.ai/${customSlug}`;

  return (
    <div className={`publish-page-root ${theme}`}>
      <div className="publish-bg-mesh" />
      <div className="publish-bg-glow" />

      {/* Header Bar */}
      <div className="publish-header-bar">
        <h1>Publish & Domain Deployment Settings</h1>
        <p>Configure custom URL slugs, connect your domain, and set up Google SEO meta tags.</p>
      </div>

      {/* Main Two Column Form Grid */}
      <div className="publish-grid-container">
        {/* LEFT COLUMN: URL & Domain Settings */}
        <div className="publish-card-box">
          <h3>🔗 Domain & Subdomain Configuration</h3>

          {/* Custom Slug Input */}
          <div className="field-group-publish">
            <label>Portfolio Subdomain URL Slug</label>
            <div className="slug-input-wrapper">
              <span className="slug-prefix-text">portfolio.ai/</span>
              <input
                type="text"
                className="input-slug-field"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Your default portfolio link: <strong style={{ color: "#38bdf8" }}>{publishedFullUrl}</strong>
            </span>
          </div>

          {/* Custom Domain Connection */}
          <div className="field-group-publish">
            <label>Connect Custom Domain (Optional)</label>
            <input
              type="text"
              className="input-text-publish"
              placeholder="e.g. alexmorgan.dev"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </div>

          {/* DNS CNAME Guidance Box */}
          <div className="dns-records-box">
            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#ffffff" }}>
              📡 DNS CNAME Record Setup Instructions
            </div>
            <div className="dns-row-item">
              <span>Type: <strong>CNAME</strong></span>
              <span>Name: <strong>@ / www</strong></span>
              <span>Value: <strong style={{ color: "#34d399" }}>cname.portfolio.ai</strong></span>
            </div>
            <div className="dns-row-item">
              <span>SSL Certificate: <strong>Automatic Let's Encrypt SSL</strong></span>
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
            />
          </div>

          {/* Meta Description */}
          <div className="field-group-publish">
            <label>SEO Meta Description</label>
            <textarea
              className="textarea-publish"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>

          {/* Google Search Result Preview Snippet */}
          <div className="dns-records-box">
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>
              Google Search Result Snippet Preview:
            </div>
            <div style={{ color: "#818cf8", fontSize: "0.95rem", fontWeight: 700, marginBottom: "2px" }}>
              {metaTitle}
            </div>
            <div style={{ color: "#34d399", fontSize: "0.78rem", marginBottom: "4px" }}>
              {publishedFullUrl}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.45 }}>
              {metaDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Main Publish CTA Footer Bar */}
      <div className="publish-cta-bar">
        <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          Ready to deploy? Your changes will be published instantly to global Vercel SSL Edge nodes.
        </div>

        <button type="button" className="btn-publish-now-huge" onClick={handlePublishClick}>
          <span>🚀 Publish Portfolio Now</span>
        </button>
      </div>

      {/* SUCCESS MODAL DIALOG */}
      {showSuccessModal && (
        <div className="publish-modal-overlay">
          <div className="publish-modal-card">
            <div className="modal-confetti-icon">🎉</div>
            <h2>Portfolio Published Live!</h2>
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: 0 }}>
              Your AI Portfolio is now live on global SSL Edge CDN servers. Share your link with recruiters and hire managers!
            </p>

            <div className="published-url-box">{publishedFullUrl}</div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                className="btn-publish-now-huge"
                style={{ height: "44px", fontSize: "0.88rem" }}
                onClick={() => window.open(publishedFullUrl, "_blank")}
              >
                Open Live Site ↗
              </button>

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
