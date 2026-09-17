import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./TemplateDetailsPage.css";

export const TemplateDetailsPage = ({ onUseTemplate, onBack }) => {
  const { theme } = useDashboardTheme();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const screenshots = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
  ];

  const features = [
    { icon: "⚡", title: "100% Core Web Vitals Speed", desc: "99+ Lighthouse performance rating out-of-the-box." },
    { icon: "🎯", title: "ATS Recruiter Optimized", desc: "Scannable single-column layout approved by enterprise HR." },
    { icon: "🎨", title: "Framer Micro-Animations", desc: "Smooth scroll reveals and interactive hover states." },
    { icon: "🌗", title: "Dark & Light Mode Switcher", desc: "Seamless theme switching powered by CSS custom properties." },
    { icon: "📱", title: "Pixel-Perfect Mobile Responsive", desc: "Fully tailored touch interactions for iOS & Android devices." },
    { icon: "🌐", title: "SSL Custom Domain Ready", desc: "1-Click deployment to Vercel edge global network." },
  ];

  const reviews = [
    {
      author: "Sarah Jenkins",
      role: "Lead Product Designer @ Vercel",
      rating: "5.0 ★",
      comment: "This template got me 4 interview callbacks within 48 hours of publishing! Extremely polished UI.",
    },
    {
      author: "David Chen",
      role: "Senior Full-Stack Engineer @ Stripe",
      rating: "5.0 ★",
      comment: "The ATS layout parsing is unmatched. Seamless integration with Portfolio.ai's resume engine.",
    },
  ];

  const handleUseTemplate = () => {
    if (onUseTemplate) onUseTemplate();
    else alert("Applying 'Stripe Developer Dark' template to your portfolio!");
  };

  return (
    <div className={`template-details-root ${theme}`}>
      <div className="tpl-details-bg-mesh" />
      <div className="tpl-details-bg-glow" />

      {/* Header Bar */}
      <div className="tpl-details-header-bar">
        <button type="button" className="btn-back-link" onClick={onBack || (() => alert("Back to Marketplace"))}>
          ← Back to Templates Marketplace
        </button>

        <div className="tpl-header-actions">
          <button
            type="button"
            className="btn-live-demo-outline"
            onClick={() => window.open("https://portfolio.ai/demo/stripe-dark", "_blank")}
          >
            <span>Live Demo ↗</span>
          </button>

          <button type="button" className="btn-use-template-huge" onClick={handleUseTemplate}>
            Use Template Now
          </button>
        </div>
      </div>

      {/* Large Hero Preview Canvas Box */}
      <div className="large-hero-preview-box">
        <img src={screenshots[activeImageIdx]} alt="Large Preview" className="hero-preview-img" />
      </div>

      {/* Screenshots Lightbox Gallery Thumbnails */}
      <div className="screenshots-gallery-bar">
        {screenshots.map((img, idx) => (
          <div
            key={idx}
            className={`screenshot-thumb-item ${activeImageIdx === idx ? "active" : ""}`}
            onClick={() => setActiveImageIdx(idx)}
          >
            <img src={img} alt={`Thumb ${idx}`} className="screenshot-thumb-img" />
          </div>
        ))}
      </div>

      {/* Main Two Column Details Grid */}
      <div className="details-main-grid">
        {/* Left Column: Title, Description, & Key Features */}
        <div className="details-content-left">
          <div className="details-section-card">
            <div className="template-meta-header">
              <h1>Stripe Developer Dark Template</h1>
              <p>
                A high-contrast, developer-first portfolio theme designed for senior software engineers, tech leads, and AI system architects. Highlighting technical skills stack, GitHub repositories, and quantified work experience.
              </p>
            </div>

            <h3>✨ Included Key Features</h3>
            <div className="features-list-grid">
              {features.map((f, idx) => (
                <div key={idx} className="feature-pill-item">
                  <span style={{ fontSize: "1.1rem" }}>{f.icon}</span>
                  <div>
                    <div style={{ color: "#ffffff" }}>{f.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 400 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="details-section-card">
            <h3 style={{ margin: "0 0 1.25rem 0", color: "#ffffff" }}>⭐ Customer Reviews (4.9 ★ Average)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--color-border-dark)",
                  }}
                >
                  <div style={{ display: "flex", justify: "space-between", marginBottom: "4px" }}>
                    <strong style={{ color: "#ffffff", fontSize: "0.9rem" }}>{rev.author}</strong>
                    <span style={{ color: "#fbbf24", fontSize: "0.8rem", fontWeight: 700 }}>{rev.rating}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#818cf8", marginBottom: "8px" }}>{rev.role}</div>
                  <p style={{ fontSize: "0.85rem", color: "#cbd5e1", margin: 0, lineHeight: 1.5 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Author Details & Pricing */}
        <div className="details-sidebar-right">
          {/* Author Card */}
          <div className="author-profile-card">
            <h3>Template Author</h3>
            <div className="author-row-info">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Author"
                className="author-avatar-img"
              />
              <div>
                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>
                  Portfolio.ai Studio
                </div>
                <div style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 600 }}>
                  ✓ Verified Official Creator
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  12,500+ Active Installs
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="author-profile-card">
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>Template License</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399", marginBottom: "1.25rem" }}>
              $29 USD <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 400 }}>/ Unlimited Lifetime</span>
            </div>

            <button type="button" className="btn-use-template-huge" style={{ width: "100%" }} onClick={handleUseTemplate}>
              Use Template Now →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Similar Templates */}
      <div className="similar-templates-section">
        <h2>Explore Similar Templates</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            { name: "Linear Minimalist Pro", price: "$19", rating: "4.8 ★", image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80" },
            { name: "Cyberpunk Neon 2077", price: "FREE", rating: "4.95 ★", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80" },
            { name: "Framer Product Designer", price: "$39", rating: "4.9 ★", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                background: "rgba(17,24,39,0.85)",
                border: "1px solid var(--color-border-dark)",
                textAlign: "left",
              }}
            >
              <img src={item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
              <div style={{ padding: "1rem 1.25rem" }}>
                <h4 style={{ margin: "0 0 4px 0", color: "#ffffff", fontSize: "0.95rem" }}>{item.name}</h4>
                <div style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 700 }}>{item.price} • {item.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsPage;
