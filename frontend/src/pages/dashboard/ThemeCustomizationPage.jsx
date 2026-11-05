import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPortfolioById, updatePortfolioTheme } from "../../services/portfolioService";
import { ROUTES, getBuilderPath } from "../../constants/routes";
import "./ThemeCustomizationPage.css";

export const ThemeCustomizationPage = ({ portfolioId: propId, onApplyTheme, onBack }) => {
  const navigate = useNavigate();
  const { portfolioId: paramId } = useParams();
  const portfolioId = propId || paramId;
  const [themeMode, setThemeMode] = useState("dark"); // "dark" | "light"
  const [activePreset, setActivePreset] = useState("dark");
  const [isSaving, setIsSaving] = useState(false);

  // Customization Token States matching { preset, primary, bg, text, font, radius, layout }
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9");
  const [bgColor, setBgColor] = useState("#0b0f17");
  const [textColor, setTextColor] = useState("#f8fafc");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState(12);
  const [layoutStyle, setLayoutStyle] = useState("default");
  const [shadowStyle, setShadowStyle] = useState("neon"); // "soft" | "medium" | "neon" | "flat"
  const [buttonShape, setButtonShape] = useState("pill"); // "pill" | "rounded" | "sharp" | "glass"

  // Portfolio & Database state
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const presets = [
    {
      id: "dark",
      name: "Modern Dark",
      primary: "#6366f1",
      bg: "#0b0f17",
      text: "#f8fafc",
      font: "Inter",
      radius: 12,
      layout: "default",
    },
    {
      id: "stripe-indigo",
      name: "Stripe Indigo",
      primary: "#4f46e5",
      bg: "#0f172a",
      text: "#f8fafc",
      font: "Plus Jakarta Sans",
      radius: 16,
      layout: "default",
    },
    {
      id: "vercel-clean",
      name: "Vercel Clean",
      primary: "#000000",
      bg: "#ffffff",
      text: "#0f172a",
      font: "Inter",
      radius: 8,
      layout: "default",
    },
    {
      id: "linear-dark",
      name: "Linear Dark",
      primary: "#5e6ad2",
      bg: "#08090a",
      text: "#f7f8f8",
      font: "Inter",
      radius: 12,
      layout: "default",
    },
    {
      id: "emerald-obsidian",
      name: "Emerald Obsidian",
      primary: "#10b981",
      bg: "#061a14",
      text: "#ecfdf5",
      font: "Plus Jakarta Sans",
      radius: 16,
      layout: "default",
    },
    {
      id: "rose-cyber",
      name: "Rose Cyberpunk",
      primary: "#f43f5e",
      bg: "#18050e",
      text: "#fff1f2",
      font: "Space Grotesk",
      radius: 16,
      layout: "default",
    },
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

          if (tc.preset || fetchedPortfolio.theme) {
            setActivePreset(tc.preset || fetchedPortfolio.theme);
          }
          if (tc.primary || tc.primaryColor) setPrimaryColor(tc.primary || tc.primaryColor);
          if (tc.secondaryColor) setSecondaryColor(tc.secondaryColor);
          if (tc.bg) setBgColor(tc.bg);
          if (tc.text) setTextColor(tc.text);
          if (tc.font || tc.fontFamily) setFontFamily(tc.font || tc.fontFamily);
          if (tc.radius !== undefined || tc.borderRadius !== undefined) {
            setBorderRadius(tc.radius !== undefined ? tc.radius : tc.borderRadius);
          }
          if (tc.layout) setLayoutStyle(tc.layout);
          if (tc.themeMode) setThemeMode(tc.themeMode);
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
    setBgColor(preset.bg);
    setTextColor(preset.text);
    setFontFamily(preset.font);
    setBorderRadius(preset.radius);
    setLayoutStyle(preset.layout || "default");
  };

  const handleResetTheme = () => {
    setActivePreset("dark");
    setPrimaryColor("#6366f1");
    setSecondaryColor("#0ea5e9");
    setBgColor("#0b0f17");
    setTextColor("#f8fafc");
    setFontFamily("Inter");
    setBorderRadius(12);
    setLayoutStyle("default");
    setShadowStyle("neon");
    setButtonShape("pill");
    setThemeMode("dark");
  };

  const handleSaveTheme = async () => {
    if (!portfolioId || isSaving) return;
    setIsSaving(true);

    try {
      const themeConfig = {
        preset: activePreset,
        primary: primaryColor,
        bg: bgColor,
        text: textColor,
        font: fontFamily,
        radius: Number(borderRadius),
        layout: layoutStyle || "default",
      };

      await updatePortfolioTheme(portfolioId, themeConfig);

      if (onApplyTheme) {
        onApplyTheme();
      } else {
        setFeedback({ type: "success", text: "Theme styles saved and applied to portfolio!" });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      setFeedback({ type: "error", text: `Failed to save theme: ${err.message}` });
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
              else navigate(ROUTES.DASHBOARD);
            }}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const content = portfolio.content || {};
  const about = content.about || {};
  const personal = content.personal || {};
  const hero = content.hero || {};

  const candidateName =
    about.name?.trim() ||
    personal.name?.trim() ||
    hero.name?.trim() ||
    (typeof content.name === "string" ? content.name.trim() : "") ||
    portfolio.user?.fullName ||
    portfolio.title ||
    "Candidate Portfolio";

  const candidateRole =
    about.title?.trim() ||
    about.headline?.trim() ||
    personal.headline?.trim() ||
    personal.title?.trim() ||
    hero.headline?.trim() ||
    hero.title?.trim() ||
    (typeof content.headline === "string" ? content.headline.trim() : "") ||
    portfolio.user?.headline ||
    "";

  const candidateBio =
    about.bio?.trim() ||
    about.description?.trim() ||
    personal.bio?.trim() ||
    personal.description?.trim() ||
    (typeof content.bio === "string" ? content.bio.trim() : "") ||
    portfolio.user?.bio ||
    "";

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
                else navigate(getBuilderPath(portfolioId));
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

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            marginBottom: "1.25rem",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: feedback.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(82, 224, 163, 0.15)",
            border: `1px solid ${feedback.type === "error" ? "rgba(239, 68, 68, 0.35)" : "rgba(82, 224, 163, 0.35)"}`,
            color: feedback.type === "error" ? "#fca5a5" : "var(--color-success, #52E0A3)",
          }}
        >
          <span>{feedback.type === "error" ? "⚠️" : "✓"}</span>
          <span>{feedback.text}</span>
        </div>
      )}

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
            backgroundColor: bgColor,
            color: textColor,
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
          {candidateRole && (
            <p style={{ fontSize: "1rem", color: secondaryColor, fontWeight: 600, margin: "0 0 1.25rem 0" }}>
              {candidateRole}
            </p>
          )}

          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, opacity: 0.85, margin: "0 0 2rem 0" }}>
            {candidateBio || "Add your summary in Profile settings."}
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
