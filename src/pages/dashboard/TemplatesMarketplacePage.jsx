import React, { useState } from "react";
import { createPortfolio } from "../../services/portfolioService";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./TemplatesMarketplacePage.css";

export const TemplatesMarketplacePage = ({ onUseTemplate, onBack }) => {
  const { theme } = useDashboardTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => {
    const hash = window.location.hash;
    if (hash.includes("dev-templates")) return "developer";
    if (hash.includes("design-templates")) return "designer";
    return "all";
  });
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState(null);
  const [creatingTemplateId, setCreatingTemplateId] = useState(null);

  React.useEffect(() => {
    const syncCategoryFromHash = () => {
      const hash = window.location.hash;
      if (hash.includes("dev-templates")) {
        setActiveCategory("developer");
      } else if (hash.includes("design-templates")) {
        setActiveCategory("designer");
      }
    };
    syncCategoryFromHash();
    window.addEventListener("hashchange", syncCategoryFromHash);
    return () => window.removeEventListener("hashchange", syncCategoryFromHash);
  }, []);

  const [templates] = useState([
    {
      id: "tpl_1",
      name: "Stripe Developer Dark",
      category: "developer",
      rating: "4.9 ★ (340 reviews)",
      isPro: true,
      price: "$29",
      author: "By Portfolio.ai Studio",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
      description: "High-contrast developer layout optimized for code repositories and tech stack showcases.",
    },
    {
      id: "tpl_2",
      name: "Linear Minimalist Pro",
      category: "minimalist",
      rating: "4.8 ★ (210 reviews)",
      isPro: true,
      price: "$19",
      author: "By Linear Design Team",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
      description: "Sleek monochromatic grid layout with subtle micro-animations and typography.",
    },
    {
      id: "tpl_3",
      name: "Cyberpunk Neon 2077",
      category: "cyberpunk",
      rating: "4.95 ★ (520 reviews)",
      isPro: false,
      price: "FREE",
      author: "By Community Creator",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      description: "Vibrant neon glassmorphism layout designed for game developers & AI researchers.",
    },
    {
      id: "tpl_4",
      name: "Framer Product Designer",
      category: "designer",
      rating: "4.9 ★ (195 reviews)",
      isPro: true,
      price: "$39",
      author: "By DesignMasters",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
      description: "Visual portfolio with large image showcases, video embeds, and interactive case study grids.",
    },
    {
      id: "tpl_5",
      name: "Executive Leadership",
      category: "executive",
      rating: "4.85 ★ (110 reviews)",
      isPro: true,
      price: "$49",
      author: "By ExecutiveSuite",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
      description: "Clean, authoritative layout tailored for CTOs, VPs of Engineering, and Tech Directors.",
    },
    {
      id: "tpl_6",
      name: "Clean Slate Basic",
      category: "free",
      rating: "4.7 ★ (890 reviews)",
      isPro: false,
      price: "FREE",
      author: "By Portfolio.ai Studio",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
      description: "Simple single-page resume layout with fast load speeds and mobile optimization.",
    },
  ]);

  const handleUseTemplateClick = async (tpl) => {
    if (!tpl || creatingTemplateId) return; // Prevent duplicate submission
    setCreatingTemplateId(tpl.id);

    try {
      const res = await createPortfolio({
        title: `${tpl.name} Portfolio`,
        theme: tpl.id,
        content: {
          template: tpl.id,
          personal: {
            name: "Candidate Name",
            headline: tpl.name,
            bio: tpl.description,
          },
        },
      });

      const newId = res.data?.id;
      if (newId) {
        if (onUseTemplate) onUseTemplate(newId);
        else window.location.hash = `#portfolio-builder?id=${newId}`;
      }
    } catch (err) {
      alert(`Failed to create portfolio from template: ${err.message}`);
    } finally {
      setCreatingTemplateId(null);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "free" && !t.isPro) ||
      (activeCategory === "pro" && t.isPro) ||
      t.category === activeCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`marketplace-page-root ${theme}`}>
      {/* Header Bar */}
      <div className="marketplace-header-bar">
        <h1>Portfolio Templates Marketplace</h1>
        <p>Choose from dozens of high-converting, ATS-friendly portfolio templates crafted by world-class designers.</p>
      </div>

      {/* Controls Bar: Search & Categories */}
      <div className="marketplace-controls-bar">
        <div className="marketplace-search-box">
          <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search templates or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-tabs-group">
          {[
            { id: "all", label: "All Templates" },
            { id: "developer", label: "Developer" },
            { id: "designer", label: "Designer" },
            { id: "minimalist", label: "Minimalist" },
            { id: "cyberpunk", label: "Cyberpunk" },
            { id: "executive", label: "Executive" },
            { id: "free", label: "Free" },
            { id: "pro", label: "PRO 👑" },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`btn-category-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Cards Grid */}
      <div className="templates-cards-grid">
        {filteredTemplates.map((tpl) => (
          <div key={tpl.id} className="template-card-item">
            {/* Thumbnail Box */}
            <div className="template-thumbnail-box">
              <img src={tpl.image} alt={tpl.name} className="template-thumbnail-img" />

              <span className={`premium-badge-tag ${!tpl.isPro ? "free" : ""}`}>
                {tpl.isPro ? `👑 ${tpl.price}` : "✨ FREE"}
              </span>

              {/* Hover Action Overlay */}
              <div className="thumbnail-overlay-actions">
                <button
                  type="button"
                  className="btn-card-overlay preview"
                  onClick={() => setSelectedPreviewTemplate(tpl)}
                >
                  Live Preview
                </button>
                <button
                  type="button"
                  className="btn-card-overlay use"
                  onClick={() => handleUseTemplateClick(tpl)}
                  disabled={creatingTemplateId === tpl.id}
                >
                  {creatingTemplateId === tpl.id ? "Creating..." : "Use Template"}
                </button>
              </div>
            </div>

            {/* Card Body Details */}
            <div className="template-card-body">
              <div className="template-title-row">
                <h4>{tpl.name}</h4>
                <span className="template-rating-text">{tpl.rating}</span>
              </div>
              <p className="template-desc-text">{tpl.description}</p>
            </div>

            {/* Card Footer */}
            <div className="template-card-footer">
              <span className="author-tag-text">{tpl.author}</span>
              <button
                type="button"
                className="btn-use-template-primary"
                onClick={() => handleUseTemplateClick(tpl)}
                disabled={creatingTemplateId === tpl.id}
                style={{ opacity: creatingTemplateId === tpl.id ? 0.6 : 1 }}
              >
                {creatingTemplateId === tpl.id ? "Creating..." : "Use Template →"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN PREVIEW MODAL DIALOG */}
      {selectedPreviewTemplate && (
        <div className="modal-preview-overlay">
          <div className="modal-preview-card">
            <div className="modal-preview-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>
                  {selectedPreviewTemplate.name}
                </span>
                <span className={`premium-badge-tag ${!selectedPreviewTemplate.isPro ? "free" : ""}`}>
                  {selectedPreviewTemplate.isPro ? `👑 ${selectedPreviewTemplate.price}` : "✨ FREE"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="btn-use-template-primary"
                  onClick={() => {
                    handleUseTemplateClick(selectedPreviewTemplate);
                    setSelectedPreviewTemplate(null);
                  }}
                  disabled={creatingTemplateId === selectedPreviewTemplate.id}
                >
                  {creatingTemplateId === selectedPreviewTemplate.id ? "Creating..." : "Use This Template Now"}
                </button>
                <button
                  type="button"
                  style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "1.2rem", cursor: "pointer" }}
                  onClick={() => setSelectedPreviewTemplate(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Preview Image Sheet */}
            <div style={{ flexGrow: 1, overflowY: "auto", padding: "1.5rem", background: "#080b11" }}>
              <img
                src={selectedPreviewTemplate.image}
                alt="Preview"
                style={{ width: "100%", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesMarketplacePage;
