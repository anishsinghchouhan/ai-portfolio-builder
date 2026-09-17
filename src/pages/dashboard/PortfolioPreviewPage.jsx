import React, { useState, useEffect } from "react";
import { getPortfolioById, publishPortfolio } from "../../services/portfolioService";
import "./PortfolioPreviewPage.css";

export const PortfolioPreviewPage = ({ portfolioId, onPublish, onShare, onBack }) => {
  const [theme, setTheme] = useState("dark");
  const [deviceMode, setDeviceMode] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Portfolio & Database state
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolio = async () => {
      if (!portfolioId) {
        setIsLoading(false);
        setLoadError("No portfolio ID provided in route. Please select a portfolio from the Dashboard.");
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await getPortfolioById(portfolioId);
        if (isMounted) {
          setPortfolio(res.data);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 403) {
            setLoadError("You do not have permission to preview this private portfolio.");
          } else if (err.response?.status === 404) {
            setLoadError("The requested portfolio was not found or has been deleted.");
          } else {
            setLoadError(err.message || "Failed to load portfolio preview from database.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, [portfolioId]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleZoomIn = () => {
    if (zoomLevel < 140) setZoomLevel((prev) => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel((prev) => prev - 10);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleShareClick = () => {
    if (onShare) onShare();
    else if (portfolio?.slug) {
      const url = `${window.location.origin}/#public-${portfolio.slug}`;
      navigator.clipboard.writeText(url);
      alert(`Public portfolio link copied to clipboard: ${url}`);
    } else {
      alert("Public link generated!");
    }
  };

  const handlePublishClick = async () => {
    if (!portfolioId || isPublishing) return;
    setIsPublishing(true);

    try {
      await publishPortfolio(portfolioId);
      if (onPublish) onPublish();
      else alert("Portfolio published live!");
    } catch (err) {
      alert(`Publish failed: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`portfolio-preview-root ${theme}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>👁️</div>
          <p style={{ color: "#94a3b8" }}>Loading portfolio preview from database...</p>
        </div>
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className={`portfolio-preview-root ${theme}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "20px", padding: "40px", maxWidth: "480px", width: "100%", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ fontSize: "1.3rem", color: "#f87171", margin: "0 0 12px 0" }}>Portfolio Error</h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            {loadError || "The portfolio could not be loaded."}
          </p>
          <button
            type="button"
            className="btn-publish-portfolio"
            onClick={() => {
              if (onBack) onBack();
              else window.location.hash = "dashboard";
            }}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const pContent = portfolio.content || {};
  const pPersonal = pContent.personal || {};
  const tc = pContent.themeConfig || {};

  const candidateName = pPersonal.name || portfolio.user?.fullName || "Alex Morgan";
  const candidateRole = pPersonal.headline || "Senior Full-Stack Engineer";
  const candidateBio = pPersonal.bio || pContent.about?.description || "Building scalable SaaS applications & AI-driven user interfaces.";
  const skillsList = pContent.skills || ["React", "TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL"];

  const primaryColor = tc.primaryColor || "#4f46e5";
  const secondaryColor = tc.secondaryColor || "#0ea5e9";
  const fontFamily = tc.fontFamily || "Inter";
  const borderRadius = tc.borderRadius !== undefined ? tc.borderRadius : 16;

  return (
    <div className={`portfolio-preview-root ${theme}`}>
      {/* Top Navigation Bar */}
      <header className="preview-navbar-bar">
        {/* Left: Title & Live URL */}
        <div className="preview-title-left">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else window.location.hash = "dashboard";
            }}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1rem", marginRight: "8px" }}
            title="Back"
          >
            ←
          </button>
          <h2>{portfolio.title}</h2>
          <span className="live-url-pill">🌐 {portfolio.slug}.portfolio.ai</span>
        </div>

        {/* Center: Device Switcher & Zoom Controls */}
        <div className="viewport-controls-center">
          <div className="device-switcher-pills">
            <button
              type="button"
              className={`btn-device-tab ${deviceMode === "desktop" ? "active" : ""}`}
              onClick={() => setDeviceMode("desktop")}
            >
              <span>💻</span>
              <span>Desktop</span>
            </button>

            <button
              type="button"
              className={`btn-device-tab ${deviceMode === "tablet" ? "active" : ""}`}
              onClick={() => setDeviceMode("tablet")}
            >
              <span>📱</span>
              <span>Tablet</span>
            </button>

            <button
              type="button"
              className={`btn-device-tab ${deviceMode === "mobile" ? "active" : ""}`}
              onClick={() => setDeviceMode("mobile")}
            >
              <span>📱</span>
              <span>Mobile</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="zoom-controls-bar">
            <button type="button" className="btn-ctrl-icon" onClick={handleZoomOut} title="Zoom Out">
              -
            </button>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", width: "42px", textAlign: "center" }}>
              {zoomLevel}%
            </span>
            <button type="button" className="btn-ctrl-icon" onClick={handleZoomIn} title="Zoom In">
              +
            </button>
            <button
              type="button"
              className="btn-ctrl-icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              ⤢
            </button>
          </div>
        </div>

        {/* Right: Share & Publish Buttons */}
        <div className="preview-actions-right">
          <button type="button" className="btn-ctrl-icon" onClick={toggleTheme} title="Toggle Mode">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button type="button" className="btn-share-portfolio" onClick={handleShareClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>Share Link</span>
          </button>

          <button
            type="button"
            className="btn-publish-portfolio"
            onClick={handlePublishClick}
            disabled={isPublishing}
            style={{ opacity: isPublishing ? 0.7 : 1 }}
          >
            <span>{isPublishing ? "Publishing..." : "Publish Live"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Preview Viewport */}
      <main className="portfolio-preview-viewport">
        <div
          className={`device-canvas-frame ${deviceMode}`}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            fontFamily: fontFamily,
            borderRadius: `${borderRadius}px`,
          }}
        >
          {/* Rendered Portfolio Hero Section */}
          <div className="canvas-hero-view" style={{ borderBottom: `1px solid ${primaryColor}30` }}>
            <h1>{candidateName}</h1>
            <p style={{ color: secondaryColor }}>{candidateRole}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: deviceMode === "mobile" ? "center" : "flex-start" }}>
              <button style={{ padding: "0.75rem 1.75rem", borderRadius: "999px", background: primaryColor, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }}>
                View Work
              </button>
              <button style={{ padding: "0.75rem 1.75rem", borderRadius: "999px", background: "transparent", color: "#ffffff", border: `1px solid ${secondaryColor}`, fontWeight: 600, cursor: "pointer" }}>
                Contact Me
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="canvas-card-block" style={{ borderRadius: `${borderRadius}px` }}>
            <h3>About Candidate</h3>
            <p style={{ color: "#475569", lineHeight: 1.65, fontSize: "0.95rem" }}>
              {candidateBio}
            </p>
          </div>

          {/* Tech Stack Section */}
          <div className="canvas-card-block" style={{ borderRadius: `${borderRadius}px` }}>
            <h3>Technical Stack & Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    background: `${primaryColor}20`,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}40`,
                  }}
                >
                  {typeof skill === "string" ? skill : skill.name || skill}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Projects Grid */}
          <div className="canvas-card-block" style={{ borderRadius: `${borderRadius}px` }}>
            <h3>Featured Projects</h3>
            <div style={{ display: "grid", gridTemplateColumns: deviceMode === "mobile" ? "1fr" : "1fr 1fr", gap: "1.25rem" }}>
              <div style={{ border: `1px solid ${primaryColor}30`, borderRadius: `${borderRadius}px`, padding: "1.35rem" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.05rem" }}>AI Portfolio Builder SaaS</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>Automated resume parser & live builder platform with Vercel edge deployment.</p>
              </div>
              <div style={{ border: `1px solid ${primaryColor}30`, borderRadius: `${borderRadius}px`, padding: "1.35rem" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.05rem" }}>Real-Time WebSocket Engine</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>High-throughput pub/sub telemetry service handling 250k daily events.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPreviewPage;
