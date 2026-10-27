import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPortfolioById, updatePortfolio, publishPortfolio } from "../../services/portfolioService";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./PortfolioBuilderDashboard.css";

export const PortfolioBuilderDashboard = ({ portfolioId: propId, onPublish, onSaveDraft, onBack }) => {
  const { portfolioId: paramId } = useParams();
  const portfolioId = propId || paramId;
  const { theme } = useDashboardTheme();
  const [deviceMode, setDeviceMode] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [saveStatus, setSaveStatus] = useState("Saved"); // "Unsaved" | "Saving..." | "Saved" | "Save failed"
  const [isSaving, setIsSaving] = useState(false);

  // Loaded portfolio state
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Content state
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [sections, setSections] = useState([
    { id: "hero", name: "Hero Header", icon: "🚀", isVisible: true },
    { id: "about", name: "About & Bio", icon: "👤", isVisible: true },
    { id: "skills", name: "Technical Skills", icon: "⚡", isVisible: true },
    { id: "projects", name: "Featured Projects", icon: "💻", isVisible: true },
    { id: "experience", name: "Work Experience", icon: "💼", isVisible: true },
    { id: "testimonials", name: "Testimonials", icon: "⭐", isVisible: true },
    { id: "contact", name: "Contact & Socials", icon: "✉️", isVisible: true },
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolioData = async () => {
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
          setPortfolioTitle(fetchedPortfolio.title || "Untitled Portfolio");
          if (fetchedPortfolio.content?.sections) {
            setSections(fetchedPortfolio.content.sections);
          }
          setSaveStatus("Saved");
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 403) {
            setLoadError("You do not have permission to access or edit this private portfolio.");
          } else if (err.response?.status === 404) {
            setLoadError("The requested portfolio was not found or has been deleted.");
          } else {
            setLoadError(err.message || "Failed to load portfolio from database.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPortfolioData();

    return () => {
      isMounted = false;
    };
  }, [portfolioId]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleSectionVisibility = (id) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, isVisible: !sec.isVisible } : sec))
    );
    setSaveStatus("Unsaved");
  };

  const moveSectionUp = (idx) => {
    if (idx === 0) return;
    setSections((prev) => {
      const newSections = [...prev];
      const temp = newSections[idx - 1];
      newSections[idx - 1] = newSections[idx];
      newSections[idx] = temp;
      return newSections;
    });
    setSaveStatus("Unsaved");
  };

  const moveSectionDown = (idx) => {
    setSections((prev) => {
      if (idx === prev.length - 1) return prev;
      const newSections = [...prev];
      const temp = newSections[idx + 1];
      newSections[idx + 1] = newSections[idx];
      newSections[idx] = temp;
      return newSections;
    });
    setSaveStatus("Unsaved");
  };

  const handleSaveDraftClick = async () => {
    if (!portfolioId || isSaving) return;
    setIsSaving(true);
    setSaveStatus("Saving...");

    try {
      const updatedContent = {
        ...(portfolio?.content || {}),
        sections,
      };

      await updatePortfolio(portfolioId, {
        title: portfolioTitle,
        content: updatedContent,
      });

      setSaveStatus("Saved");
      if (onSaveDraft) onSaveDraft();
    } catch (err) {
      setSaveStatus("Save failed");
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishClick = async () => {
    if (!portfolioId || isSaving) return;
    setIsSaving(true);
    setSaveStatus("Publishing...");

    try {
      await publishPortfolio(portfolioId);
      setSaveStatus("Saved");
      if (onPublish) onPublish();
      else alert("Portfolio published live!");
    } catch (err) {
      setSaveStatus("Save failed");
      alert(`Publish failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Render Loading & Missing/Error States
  if (isLoading) {
    return (
      <div className={`builder-root ${theme}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "#94a3b8" }}>Loading portfolio builder from database...</p>
        </div>
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className={`builder-root ${theme}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 140px)", padding: "20px" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "20px", padding: "40px", maxWidth: "480px", width: "100%", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ fontSize: "1.3rem", color: "#f87171", margin: "0 0 12px 0" }}>Portfolio Error</h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            {loadError || "The portfolio could not be loaded."}
          </p>
          <button
            type="button"
            className="btn-publish-live"
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

  const personalInfo = portfolio.content?.personal || {};
  const candidateName = personalInfo.name || "Alex Morgan";
  const candidateHeadline = personalInfo.headline || "Senior Full-Stack Engineer";

  return (
    <div className={`builder-root ${theme}`}>
      {/* Top Header Toolbar */}
      <header className="builder-topbar">
        <div className="builder-brand-group">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else window.location.hash = "dashboard";
            }}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1rem", marginRight: "8px" }}
            title="Back to Dashboard"
          >
            ←
          </button>
          <div className="builder-logo-badge">⚡</div>
          <input
            type="text"
            className="builder-title-text"
            style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "6px", color: "#fff", padding: "2px 8px" }}
            value={portfolioTitle}
            onChange={(e) => {
              setPortfolioTitle(e.target.value);
              setSaveStatus("Unsaved");
            }}
          />
          <span className="builder-status-tag">🟢 {portfolio.status}</span>
        </div>

        {/* Device Viewport Switcher */}
        <div className="device-viewport-switcher">
          <button
            type="button"
            className={`btn-device-mode ${deviceMode === "desktop" ? "active" : ""}`}
            onClick={() => setDeviceMode("desktop")}
          >
            <span>💻</span>
            <span>Desktop</span>
          </button>

          <button
            type="button"
            className={`btn-device-mode ${deviceMode === "tablet" ? "active" : ""}`}
            onClick={() => setDeviceMode("tablet")}
          >
            <span>📱</span>
            <span>Tablet</span>
          </button>

          <button
            type="button"
            className={`btn-device-mode ${deviceMode === "mobile" ? "active" : ""}`}
            onClick={() => setDeviceMode("mobile")}
          >
            <span>📱</span>
            <span>Mobile</span>
          </button>
        </div>

        {/* Action Controls Group */}
        <div className="builder-actions-group">
          <button
            type="button"
            className="btn-history-icon"
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            className="btn-save-draft"
            onClick={handleSaveDraftClick}
            disabled={isSaving}
            style={{ opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? "Saving..." : saveStatus === "Unsaved" ? "Save Draft *" : "Save Draft"}
          </button>

          <button
            type="button"
            className="btn-publish-live"
            onClick={handlePublishClick}
            disabled={isSaving}
            style={{ opacity: isSaving ? 0.7 : 1 }}
          >
            <span>{isSaving ? "Publishing..." : "Publish Live"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Workspace (Sidebar + Canvas Preview) */}
      <div className="builder-main-workspace">
        {/* Sections Control Sidebar */}
        <aside className="builder-sections-sidebar">
          <div className="sidebar-title-row">
            <h3>Layout Sections</h3>
            <button
              type="button"
              className="btn-add-section"
              onClick={() => {
                if (window.location.hash.includes("id=")) {
                  window.location.hash = `#section-editor?id=${portfolioId}`;
                } else {
                  window.location.hash = "section-editor";
                }
              }}
            >
              ✏️ Content Editor
            </button>
          </div>

          {/* Re-orderable Sections List */}
          <div className="sections-reorder-list">
            {sections.map((sec, idx) => (
              <div key={sec.id} className="section-item-card">
                <div className="section-left-info">
                  <span className="drag-handle-dots">:::</span>
                  <span className="section-icon-badge">{sec.icon}</span>
                  <span className="section-name-text">{sec.name}</span>
                </div>

                <div className="section-right-controls">
                  <button
                    type="button"
                    className="btn-section-toggle"
                    onClick={() => moveSectionUp(idx)}
                    disabled={idx === 0}
                    title="Move Up"
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    className="btn-section-toggle"
                    onClick={() => moveSectionDown(idx)}
                    disabled={idx === sections.length - 1}
                    title="Move Down"
                  >
                    ▼
                  </button>

                  <button
                    type="button"
                    className="btn-section-toggle"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    title={sec.isVisible ? "Hide Section" : "Show Section"}
                  >
                    {sec.isVisible ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", fontSize: "0.78rem", color: saveStatus === "Unsaved" ? "#fbbf24" : saveStatus === "Save failed" ? "#f87171" : "#94a3b8", textAlign: "center" }}>
            Status: {saveStatus}
          </div>
        </aside>

        {/* Live Canvas Preview Panel */}
        <main className="builder-preview-viewport">
          <div className={`preview-device-frame ${deviceMode}`}>
            {/* Live Portfolio Preview Content */}
            {sections.find((s) => s.id === "hero")?.isVisible && (
              <div className="canvas-hero-block">
                <h1>{candidateName}</h1>
                <p>{candidateHeadline}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={{ padding: "0.5rem 1.25rem", borderRadius: "999px", background: "#ffffff", color: "#0f172a", border: "none", fontWeight: 700 }}>
                    View Work
                  </button>
                  <button style={{ padding: "0.5rem 1.25rem", borderRadius: "999px", background: "rgba(255,255,255,0.15)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}>
                    Contact Me
                  </button>
                </div>
              </div>
            )}

            {sections.find((s) => s.id === "about")?.isVisible && (
              <div className="canvas-section-block">
                <h3>About & Candidate Bio</h3>
                <p style={{ color: "#475569", lineHeight: 1.6 }}>
                  {personalInfo.bio || "Passionate software craftsman building scalable web applications and AI-driven user interfaces."}
                </p>
              </div>
            )}

            {sections.find((s) => s.id === "skills")?.isVisible && (
              <div className="canvas-section-block">
                <h3>Technical Skills Stack</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(portfolio.content?.skills || ["React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Express", "Docker"]).map((skill) => (
                    <span key={skill} style={{ padding: "0.3rem 0.75rem", borderRadius: "999px", background: "#f1f5f9", fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>
                      {typeof skill === "string" ? skill : skill.name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sections.find((s) => s.id === "projects")?.isVisible && (
              <div className="canvas-section-block">
                <h3>Featured Open Source Projects</h3>
                <div style={{ display: "grid", gridTemplateColumns: deviceMode === "mobile" ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                  <div style={{ border: "1px solid #cbd5e1", borderRadius: "16px", padding: "1.25rem", textAlign: "left" }}>
                    <h4 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>AI Portfolio Builder SaaS</h4>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Automated resume parser & live builder platform with Vercel edge deployment.</p>
                  </div>
                  <div style={{ border: "1px solid #cbd5e1", borderRadius: "16px", padding: "1.25rem", textAlign: "left" }}>
                    <h4 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>Real-Time WebSocket Engine</h4>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>High-throughput pub/sub telemetry service handling 250k daily events.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortfolioBuilderDashboard;
