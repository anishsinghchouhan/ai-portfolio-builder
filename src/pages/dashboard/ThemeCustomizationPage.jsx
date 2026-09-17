import React, { useState, useEffect } from "react";
import { getPortfolioById, updatePortfolioTheme } from "../../services/portfolioService";
import "./ThemeCustomizationPage.css";

export const ThemeCustomizationPage = ({ portfolioId, onApplyTheme, onBack }) => {
  const [themeMode, setThemeMode] = useState("dark"); // "dark" | "light"
  const [activePreset, setActivePreset] = useState("stripe-indigo");
  const [isSaving, setIsSaving] = useState(false);

  // Customization Token States
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9");
  const [fontFamily, setFontFamily] = useState("Plus Jakarta Sans");
  const [borderRadius, setBorderRadius] = useState(16);
  const [shadowStyle, setShadowStyle] = useState("neon"); // "soft" | "medium" | "neon" | "flat"
  const [buttonShape, setButtonShape] = useState("pill"); // "pill" | "rounded" | "sharp" | "glass"

  // Portfolio & Database state
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const presets = [
    { id: "stripe-indigo", name: "Stripe Indigo", primary: "#4f46e5", secondary: "#0ea5e9" },
    { id: "vercel-clean", name: "Vercel Clean", primary: "#000000", secondary: "#333333" },
    { id: "linear-dark", name: "Linear Dark", primary: "#5e6ad2", secondary: "#4da7ff" },
    { id: "emerald-obsidian", name: "Emerald Obsidian", primary: "#10b981", secondary: "#059669" },
    { id: "rose-cyber", name: "Rose Cyberpunk", primary: "#f43f5e", secondary: "#fb7185" },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadPortfolioTheme = async () => {
      if (!portfolioId) {
        setIsLoading(false);
        setLoadError("No portfolio ID provided in route. Please select a portfolio from the Dashboard.");
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await getPortfolioById(portfolioId);
        const fetchedPortfolio = res.data;
        if (isMounted) {
          setPortfolio(fetchedPortfolio);
          const tc = fetchedPortfolio.content?.themeConfig || {};

          if (fetchedPortfolio.theme) {
            setActivePreset(fetchedPortfolio.theme);
          }
          if (tc.themeMode) setThemeMode(tc.themeMode);
          if (tc.primaryColor) setPrimaryColor(tc.primaryColor);
          if (tc.secondaryColor) setSecondaryColor(tc.secondaryColor);
          if (tc.fontFamily) setFontFamily(tc.fontFamily);
          if (tc.borderRadius !== undefined) setBorderRadius(tc.borderRadius);
          if (tc.shadowStyle) setShadowStyle(tc.shadowStyle);
          if (tc.buttonShape) setButtonShape(tc.buttonShape);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 403) {
            setLoadError("You do not have permission to access or edit this private portfolio.");
          } else if (err.response?.status === 404) {
            setLoadError("The requested portfolio was not found or has been deleted.");
          } else {
            setLoadError(err.message || "Failed to load portfolio theme from database.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPortfolioTheme();

    return () => {
      isMounted = false;
    };
  }, [portfolioId]);

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };

  const handleResetTheme = () => {
    setActivePreset("stripe-indigo");
    setPrimaryColor("#4f46e5");
    setSecondaryColor("#0ea5e9");
    setFontFamily("Plus Jakarta Sans");
    setBorderRadius(16);
    setShadowStyle("neon");
    setButtonShape("pill");
    setThemeMode("dark");
  };

  const handleSaveTheme = async () => {
    if (!portfolioId || isSaving) return;
    setIsSaving(true);

    try {
      const themeConfig = {
        template: activePreset,
        themeMode,
        primaryColor,
        secondaryColor,
        fontFamily,
        borderRadius,
        shadowStyle,
        buttonShape,
      };

      await updatePortfolioTheme(portfolioId, activePreset, themeConfig);

      if (onApplyTheme) onApplyTheme();
      else alert("Theme styles saved and applied to portfolio!");
    } catch (err) {
      alert(`Failed to save theme: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`theme-page-root ${themeMode}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🎨</div>
          <p style={{ color: "#94a3b8" }}>Loading theme studio from database...</p>
        </div>
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className={`theme-page-root ${themeMode}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "20px", padding: "40px", maxWidth: "480px", width: "100%", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ fontSize: "1.3rem", color: "#f87171", margin: "0 0 12px 0" }}>Portfolio Error</h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            {loadError || "The portfolio could not be loaded."}
          </p>
          <button
            type="button"
            className="btn-apply-theme"
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

  const candidateName = portfolio.content?.personal?.name || portfolio.user?.fullName || "Alex Morgan";
  const candidateRole = portfolio.content?.personal?.headline || "Senior Full-Stack Engineer";

  return (
    <div className={`theme-page-root ${themeMode}`}>
      {/* Top Header Toolbar Bar */}
      <div className="theme-header-bar">
        <div className="theme-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => {
                if (onBack) onBack();
                else window.location.hash = `portfolio-builder?id=${portfolioId}`;
              }}
              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1rem" }}
              title="Back"
            >
              ←
            </button>
            <h1>Theme Studio Customization</h1>
          </div>
          <p>Customize styles for <strong>{portfolio.title}</strong> with real-time live preview.</p>
        </div>

        <div className="theme-top-actions">
          <button type="button" className="btn-reset-theme" onClick={handleResetTheme}>
            Reset Theme
          </button>
          <button
            type="button"
            className="btn-apply-theme"
            onClick={handleSaveTheme}
            disabled={isSaving}
            style={{ opacity: isSaving ? 0.7 : 1 }}
          >
            <span>{isSaving ? "Saving..." : "Apply & Save Theme"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid (Controls + Live Canvas) */}
      <div className="theme-workspace-grid">
        {/* Left Controls Card Pane */}
        <div className="theme-controls-card">
          {/* 1. Theme Presets Gallery */}
          <div className="control-section-block">
            <h3>🎨 Pre-built Theme Gallery</h3>
            <div className="theme-gallery-grid">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`btn-preset-theme ${activePreset === p.id ? "active" : ""}`}
                  onClick={() => handleApplyPreset(p)}
                >
                  <span className="preset-dot-color" style={{ background: p.primary }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color Swatches */}
          <div className="control-section-block">
            <h3>🌈 Primary Accent Color</h3>
            <div className="color-swatch-row">
              {["#4f46e5", "#10b981", "#0ea5e9", "#f43f5e", "#f59e0b", "#8b5cf6", "#ec4899"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch-btn ${primaryColor === color ? "selected" : ""}`}
                  style={{ background: color }}
                  onClick={() => setPrimaryColor(color)}
                />
              ))}
            </div>
          </div>

          {/* 3. Typography Selector */}
          <div className="control-section-block">
            <h3>🔤 Typography Font Family</h3>
            <select
              className="theme-select-dropdown"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
              <option value="Inter">Inter (Apple / SaaS Default)</option>
              <option value="Outfit">Outfit (Trendy Geometric)</option>
              <option value="Space Grotesk">Space Grotesk (Tech Techie)</option>
              <option value="Roboto">Roboto (Classic Sans)</option>
            </select>
          </div>

          {/* 4. Border Radius Slider */}
          <div className="control-section-block">
            <h3>📐 Corner Border Radius: {borderRadius}px</h3>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              style={{ width: "100%", accentColor: primaryColor }}
            />
          </div>

          {/* 5. Button Shape Styles */}
          <div className="control-section-block">
            <h3>🔘 Button Shape Style</h3>
            <div className="button-style-options">
              {[
                { id: "pill", label: "Pill Full" },
                { id: "rounded", label: "Rounded" },
                { id: "sharp", label: "Sharp" },
                { id: "glass", label: "Glass" },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`btn-style-pill ${buttonShape === style.id ? "active" : ""}`}
                  onClick={() => setButtonShape(style.id)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Mode Switcher */}
          <div className="control-section-block">
            <h3>🌗 Base Theme Mode</h3>
            <div className="button-style-options">
              <button
                type="button"
                className={`btn-style-pill ${themeMode === "dark" ? "active" : ""}`}
                onClick={() => setThemeMode("dark")}
              >
                🌙 Dark Mode
              </button>
              <button
                type="button"
                className={`btn-style-pill ${themeMode === "light" ? "active" : ""}`}
                onClick={() => setThemeMode("light")}
              >
                ☀️ Light Mode
              </button>
            </div>
          </div>
        </div>

        {/* Right Real-time Live Preview Canvas Pane */}
        <div
          className="theme-preview-card"
          style={{
            fontFamily: fontFamily,
            borderRadius: `${borderRadius}px`,
            backgroundColor: themeMode === "dark" ? "#111827" : "#ffffff",
            color: themeMode === "dark" ? "#ffffff" : "#0f172a",
            border: `1px solid ${primaryColor}40`,
            boxShadow:
              shadowStyle === "neon"
                ? `0 20px 60px ${primaryColor}30`
                : "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: primaryColor, marginBottom: "1rem" }}>
            ✨ REAL-TIME LIVE PREVIEW
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 8px 0" }}>
            {candidateName}
          </h1>
          <p style={{ fontSize: "1rem", color: secondaryColor, fontWeight: 600, margin: "0 0 1.25rem 0" }}>
            {candidateRole}
          </p>

          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, opacity: 0.85, margin: "0 0 2rem 0" }}>
            {portfolio.content?.personal?.bio || "Building production-ready web applications, distributed APIs, and intelligent user interfaces using modern web technologies."}
          </p>

          {/* Render Button with Dynamic Shape & Color */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              style={{
                padding: "0.75rem 1.75rem",
                borderRadius:
                  buttonShape === "pill"
                    ? "999px"
                    : buttonShape === "rounded"
                    ? "12px"
                    : buttonShape === "sharp"
                    ? "4px"
                    : "999px",
                background:
                  buttonShape === "glass"
                    ? `${primaryColor}25`
                    : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: "#ffffff",
                border: buttonShape === "glass" ? `1px solid ${primaryColor}` : "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Get In Touch
            </button>

            <button
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius:
                  buttonShape === "pill"
                    ? "999px"
                    : buttonShape === "rounded"
                    ? "12px"
                    : buttonShape === "sharp"
                    ? "4px"
                    : "999px",
                background: "transparent",
                color: themeMode === "dark" ? "#ffffff" : "#0f172a",
                border: `1px solid ${themeMode === "dark" ? "rgba(255,255,255,0.2)" : "#cbd5e1"}`,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizationPage;
