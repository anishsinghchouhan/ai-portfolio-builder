import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useAuth } from "../../hooks/useAuth";
import "./ThemeStudioPage.css";

export const ThemeStudioPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [themeMode, setThemeMode] = useState("dark");
  const [activePreset, setActivePreset] = useState("stripe-indigo");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9");
  const [fontFamily, setFontFamily] = useState("Plus Jakarta Sans");
  const [borderRadius, setBorderRadius] = useState(16);
  const [buttonShape, setButtonShape] = useState("pill");

  const presets = [
    { id: "stripe-indigo", name: "Stripe Indigo", primary: "#4f46e5", secondary: "#0ea5e9" },
    { id: "vercel-clean", name: "Vercel Clean", primary: "#6366f1", secondary: "#a855f7" },
    { id: "linear-dark", name: "Linear Dark", primary: "#5e6ad2", secondary: "#4da7ff" },
    { id: "emerald-obsidian", name: "Emerald Obsidian", primary: "#10b981", secondary: "#059669" },
    { id: "rose-cyber", name: "Rose Cyberpunk", primary: "#f43f5e", secondary: "#fb7185" },
  ];

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      window.location.hash = "#dashboard";
    } else {
      window.location.hash = "#signup";
    }
  };

  return (
    <div className="pub-theme-root">
      <Navbar
        onNavigateLogin={() => {
          if (onNavigate) onNavigate("login");
          else window.location.hash = "#login";
        }}
        onNavigateSignup={() => {
          if (onNavigate) onNavigate("signup");
          else window.location.hash = "#signup";
        }}
      />

      <main className="pub-theme-container">
        {/* Header Hero */}
        <section className="pub-theme-hero">
          <div className="pub-theme-badge">
            <span>🎨 VISUAL THEME STUDIO & DESIGN SYSTEM</span>
          </div>
          <h1 className="pub-theme-title">
            Craft Beautiful Developer Portfolios with <br />
            <span className="pub-theme-title-gradient">Zero Code Required</span>
          </h1>
          <p className="pub-theme-subtitle">
            Explore 30+ Vercel, Stripe, and Framer inspired aesthetic design presets. Customize typography, color palettes, border radius, and responsive layouts in real-time.
          </p>
        </section>

        {/* Interactive Demo Playground */}
        <section className="pub-theme-playground">
          <div className="pub-playground-card">
            {/* Left Controls */}
            <div className="pub-controls-pane">
              <h3>🎨 Theme Presets</h3>
              <div className="pub-preset-grid">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    className={`pub-preset-btn ${activePreset === p.id ? "active" : ""}`}
                    onClick={() => handleApplyPreset(p)}
                  >
                    <span className="pub-dot" style={{ background: p.primary }} />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>

              <h3>🌈 Primary Accent</h3>
              <div className="pub-color-swatches">
                {["#4f46e5", "#10b981", "#0ea5e9", "#f43f5e", "#f59e0b", "#8b5cf6"].map((c) => (
                  <button
                    key={c}
                    className={`pub-swatch ${primaryColor === c ? "selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setPrimaryColor(c)}
                  />
                ))}
              </div>

              <h3>🔤 Font Family</h3>
              <select
                className="pub-select-dropdown"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern)</option>
                <option value="Inter">Inter (Classic Clean)</option>
                <option value="Outfit">Outfit (Geometric)</option>
                <option value="Space Grotesk">Space Grotesk (Tech)</option>
              </select>

              <h3>📐 Corner Radius: {borderRadius}px</h3>
              <input
                type="range"
                min="4"
                max="32"
                step="4"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                style={{ width: "100%", accentColor: primaryColor }}
              />

              <h3>🌗 Theme Mode</h3>
              <div className="pub-mode-row">
                <button
                  className={`pub-mode-btn ${themeMode === "dark" ? "active" : ""}`}
                  onClick={() => setThemeMode("dark")}
                >
                  🌙 Dark Mode
                </button>
                <button
                  className={`pub-mode-btn ${themeMode === "light" ? "active" : ""}`}
                  onClick={() => setThemeMode("light")}
                >
                  ☀️ Light Mode
                </button>
              </div>
            </div>

            {/* Right Live Preview Canvas */}
            <div
              className="pub-canvas-pane"
              style={{
                fontFamily: fontFamily,
                borderRadius: `${borderRadius}px`,
                backgroundColor: themeMode === "dark" ? "#0f172a" : "#ffffff",
                color: themeMode === "dark" ? "#ffffff" : "#0f172a",
                border: `1px solid ${primaryColor}40`,
                boxShadow: `0 20px 60px ${primaryColor}25`,
              }}
            >
              <div className="pub-canvas-header" style={{ color: primaryColor }}>
                ✨ LIVE INTERACTIVE PREVIEW
              </div>

              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 6px 0" }}>
                Alex Rivera
              </h2>
              <p style={{ fontSize: "0.95rem", color: secondaryColor, fontWeight: 600, margin: "0 0 1.25rem 0" }}>
                Senior Full-Stack & AI Systems Architect
              </p>

              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, opacity: 0.85, margin: "0 0 1.5rem 0" }}>
                Building production-ready web applications, distributed APIs, and intelligent user interfaces using modern web technologies.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.5rem" }}>
                {["React 19", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"].map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      background: `${primaryColor}20`,
                      color: primaryColor,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "0.65rem 1.5rem",
                    borderRadius: buttonShape === "pill" ? "999px" : "8px",
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={handleCtaClick}
                >
                  {isAuthenticated ? "Go to Dashboard →" : "Customize My Portfolio →"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="pub-theme-highlights">
          <div className="highlight-card">
            <span className="hl-icon">⚡</span>
            <h3>30+ Aesthetic Presets</h3>
            <p>Switch between dark, light, cyberpunk, minimalist, and executive theme templates with 1-click.</p>
          </div>
          <div className="highlight-card">
            <span className="hl-icon">🎯</span>
            <h3>ATS-Optimized Fonts</h3>
            <p>Curated typography scale guaranteed to look crisp on desktop, mobile, and PDF exports.</p>
          </div>
          <div className="highlight-card">
            <span className="hl-icon">💎</span>
            <h3>Glassmorphism UI</h3>
            <p>Vibrant gradient glows, smooth backdrop filters, and high-contrast dark modes built in.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ThemeStudioPage;
