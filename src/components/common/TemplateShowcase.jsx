import React, { useState } from "react";
import TEMPLATES from "../../data/templates";
import { useAuth } from "../../hooks/useAuth";
import "./TemplateShowcase.css";

export const TemplateShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const { isAuthenticated } = useAuth();

  const categories = ["All", "Software Engineer", "UI/UX Designer", "Product Manager", "Full-Stack Developer"];

  React.useEffect(() => {
    const checkHashCategory = () => {
      const hash = window.location.hash;
      if (hash.includes("dev-templates")) {
        setActiveCategory("Software Engineer");
      } else if (hash.includes("design-templates")) {
        setActiveCategory("UI/UX Designer");
      }
    };
    checkHashCategory();
    window.addEventListener("hashchange", checkHashCategory);
    return () => window.removeEventListener("hashchange", checkHashCategory);
  }, []);

  const filteredTemplates = activeCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const handleUseTemplate = (template) => {
    if (template?.id) {
      localStorage.setItem("selected_template_id", template.id);
    }
    if (isAuthenticated) {
      window.location.hash = "#templates-marketplace";
    } else {
      window.location.hash = "#signup";
    }
  };

  return (
    <section id="templates" className="template-showcase-section">
      <div className="template-bg-glow" />

      <div className="template-showcase-container">
        {/* Header */}
        <div className="template-header">
          <div className="template-badge">
            <span>✨ PORTFOLIO THEME STUDIO</span>
          </div>
          <h2 className="template-title">
            Curated Themes Built for <br />
            <span className="template-title-gradient">World-Class Candidates</span>
          </h2>
          <p className="template-subtitle">
            Choose from 30+ Vercel, Stripe, and Framer inspired responsive templates. Easily switch themes anytime with instant live re-rendering.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="filter-tabs-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6 Template Cards Grid */}
        <div className="templates-grid">
          {filteredTemplates.map((template) => (
            <div className="template-card" key={template.id}>
              {/* Desktop Browser Preview Frame */}
              <div className="desktop-preview-frame">
                <div className="preview-mac-header">
                  <div className="mac-dots">
                    <span className="mac-dot dot-red" />
                    <span className="mac-dot dot-yellow" />
                    <span className="mac-dot dot-green" />
                  </div>
                  <div className="mac-url">portfolio.ai/theme/{template.id}</div>
                </div>

                <div className="template-img-container">
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="template-img"
                    loading="lazy"
                  />

                  {template.tag && <span className="template-tag-badge">{template.tag}</span>}

                  {/* Overlay Hover Actions */}
                  <div className="template-overlay-actions">
                    <button className="btn-preview" onClick={() => setPreviewTemplate(template)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Preview</span>
                    </button>
                    <button className="btn-use" onClick={() => handleUseTemplate(template)}>
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Card Details */}
              <div className="template-info">
                <div>
                  <span className="template-category">{template.category}</span>
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-desc">{template.description}</p>
                </div>

                {/* Card Footer Actions */}
                <div className="template-card-footer">
                  <button className="btn-preview" onClick={() => setPreviewTemplate(template)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>Preview</span>
                  </button>

                  <button className="btn-use" onClick={() => handleUseTemplate(template)}>
                    <span>Use Template</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Desktop Modal Preview */}
      {previewTemplate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(16px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            style={{
              background: "var(--color-surface-dark)",
              border: "1px solid var(--color-border-dark)",
              borderRadius: "var(--radius-xl)",
              maxWidth: "900px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "var(--shadow-modal)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "1rem 1.5rem",
                background: "var(--color-background-dark)",
                borderBottom: "1px solid var(--color-border-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>{previewTemplate.name}</h4>
                <span style={{ fontSize: "0.8rem", color: "var(--color-secondary)" }}>{previewTemplate.category}</span>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn-use" onClick={() => handleUseTemplate(previewTemplate)}>
                  Use Template
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ height: "480px", overflow: "hidden", background: "#000" }}>
              <img
                src={previewTemplate.previewUrl}
                alt={previewTemplate.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TemplateShowcase;
