import React, { useState, useEffect } from "react";
import { getPortfolioById, updatePortfolio } from "../../services/portfolioService";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./SectionEditorPage.css";

export const SectionEditorPage = ({ portfolioId, onSave, onBack }) => {
  const { theme } = useDashboardTheme();
  const [activeTab, setActiveTab] = useState("about"); // "about" | "skills" | "experience" | "projects" | "education" | "certifications" | "contact"
  const [isSaving, setIsSaving] = useState(false);

  // Portfolio & Database state
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    aboutText: "",
    skillsList: "",
    experienceTitle: "",
    experienceBullets: "",
    projectTitle: "",
    projectUrl: "",
    certName: "",
    contactEmail: "",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  });

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
        const fetchedPortfolio = res.data;
        if (isMounted) {
          setPortfolio(fetchedPortfolio);
          const c = fetchedPortfolio.content || {};
          const p = c.personal || {};

          setFormData({
            name: p.name || fetchedPortfolio.user?.fullName || "Alex Morgan",
            role: p.headline || "Senior Full-Stack Engineer & AI Systems Architect",
            location: p.location || "San Francisco, CA • Remote Available",
            aboutText: p.bio || c.about?.description || "Senior Full-Stack Engineer with 6+ years of experience designing scalable microservices.",
            skillsList: Array.isArray(c.skills) ? c.skills.join(", ") : (c.skillsList || "React, TypeScript, Node.js, Next.js, Python, PostgreSQL, Prisma"),
            experienceTitle: c.experience?.[0]?.title || "Senior Software Engineer — TechScale Inc.",
            experienceBullets: c.experience?.[0]?.description || "• Architected real-time WebSocket engine.\n• Optimized LCP performance by 42%.",
            projectTitle: c.projects?.[0]?.title || "AI Portfolio Builder SaaS Platform",
            projectUrl: c.projects?.[0]?.liveUrl || "https://portfolio.ai/alex-morgan",
            certName: c.certifications?.[0] || "AWS Certified Solutions Architect & GCP Cloud Engineer",
            contactEmail: p.email || fetchedPortfolio.user?.email || "alex.morgan@email.com",
            avatarUrl: p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          });
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

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, [portfolioId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    if (!portfolioId || isSaving) return;
    setIsSaving(true);

    try {
      const existingContent = portfolio?.content || {};

      const updatedContent = {
        ...existingContent,
        personal: {
          ...(existingContent.personal || {}),
          name: formData.name,
          headline: formData.role,
          location: formData.location,
          bio: formData.aboutText,
          email: formData.contactEmail,
          avatarUrl: formData.avatarUrl,
        },
        about: {
          title: "About Candidate",
          description: formData.aboutText,
        },
        skills: formData.skillsList.split(",").map((s) => s.trim()).filter(Boolean),
        skillsList: formData.skillsList,
        experience: [
          {
            title: formData.experienceTitle,
            description: formData.experienceBullets,
          },
        ],
        projects: [
          {
            title: formData.projectTitle,
            liveUrl: formData.projectUrl,
            description: "Featured project",
          },
        ],
        certifications: [formData.certName],
      };

      await updatePortfolio(portfolioId, {
        content: updatedContent,
      });

      if (onSave) onSave(formData);
      else alert("Section content saved successfully to database!");
    } catch (err) {
      alert(`Failed to save section content: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const characterCount = formData.aboutText.length;
  const maxCharacters = 500;

  if (isLoading) {
    return (
      <div className={`section-editor-root ${theme}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "#94a3b8" }}>Loading content editor from database...</p>
        </div>
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className={`section-editor-root ${theme}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "20px", padding: "40px", maxWidth: "480px", width: "100%", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ fontSize: "1.3rem", color: "#f87171", margin: "0 0 12px 0" }}>Portfolio Error</h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            {loadError || "The portfolio could not be loaded."}
          </p>
          <button
            type="button"
            className="btn-save-section"
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

  return (
    <div className={`section-editor-root ${theme}`}>
      {/* Top Header Bar */}
      <div className="editor-header-bar">
        <div className="editor-title-group">
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
            <h1>Portfolio Section Content Editor</h1>
          </div>
          <p>Edit text, skills, and projects for portfolio: <strong>{portfolio.title}</strong></p>
        </div>

        <button
          type="button"
          className="btn-save-section"
          onClick={handleSaveClick}
          disabled={isSaving}
          style={{ opacity: isSaving ? 0.7 : 1 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Section Selector Tabs Bar */}
      <div className="section-tabs-bar">
        {[
          { id: "about", label: "👤 Edit About" },
          { id: "skills", label: "⚡ Skills" },
          { id: "experience", label: "💼 Experience" },
          { id: "projects", label: "💻 Projects" },
          { id: "education", label: "🎓 Education" },
          { id: "certifications", label: "📜 Certifications" },
          { id: "contact", label: "✉️ Contact" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`btn-editor-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Editing Split Grid (Form + Live Preview) */}
      <div className="editor-split-grid">
        {/* Left Form Card Pane */}
        <div className="editor-form-card">
          {/* TAB 1: ABOUT & PROFILE EDIT */}
          {activeTab === "about" && (
            <>
              <div className="form-field-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="editor-input-text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Professional Headline & Role</label>
                <input
                  type="text"
                  className="editor-input-text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Location & Work Availability</label>
                <input
                  type="text"
                  className="editor-input-text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              {/* Rich Text Editor Field */}
              <div className="form-field-group">
                <label>Candidate Bio & Summary</label>
                <div className="rich-text-wrapper">
                  <textarea
                    className="rich-textarea"
                    value={formData.aboutText}
                    onChange={(e) => handleInputChange("aboutText", e.target.value)}
                    maxLength={maxCharacters}
                  />
                </div>

                <div className="field-footer-info">
                  <span>💡 Tip: Keep summary concise and keyword-optimized for recruiters.</span>
                  <span>
                    {characterCount} / {maxCharacters} characters
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === "skills" && (
            <div className="form-field-group">
              <label>Technical Skills Stack (Comma Separated)</label>
              <textarea
                className="editor-input-text"
                style={{ height: "120px", padding: "12px" }}
                value={formData.skillsList}
                onChange={(e) => handleInputChange("skillsList", e.target.value)}
              />
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === "experience" && (
            <>
              <div className="form-field-group">
                <label>Job Title & Company Name</label>
                <input
                  type="text"
                  className="editor-input-text"
                  value={formData.experienceTitle}
                  onChange={(e) => handleInputChange("experienceTitle", e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Key Accomplishment Bullets</label>
                <textarea
                  className="editor-input-text"
                  style={{ height: "140px", padding: "12px" }}
                  value={formData.experienceBullets}
                  onChange={(e) => handleInputChange("experienceBullets", e.target.value)}
                />
              </div>
            </>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <>
              <div className="form-field-group">
                <label>Featured Project Title</label>
                <input
                  type="text"
                  className="editor-input-text"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Project Live Demo URL</label>
                <input
                  type="text"
                  className="editor-input-text"
                  value={formData.projectUrl}
                  onChange={(e) => handleInputChange("projectUrl", e.target.value)}
                />
              </div>
            </>
          )}

          {/* TAB 5 & 6: EDUCATION & CERTIFICATIONS */}
          {(activeTab === "education" || activeTab === "certifications") && (
            <div className="form-field-group">
              <label>Credentials & Certifications</label>
              <input
                type="text"
                className="editor-input-text"
                value={formData.certName}
                onChange={(e) => handleInputChange("certName", e.target.value)}
              />
            </div>
          )}

          {/* TAB 7: CONTACT */}
          {activeTab === "contact" && (
            <div className="form-field-group">
              <label>Primary Email Address</label>
              <input
                type="email"
                className="editor-input-text"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right Live Preview Canvas Pane */}
        <div className="editor-preview-card">
          <span className="preview-badge-pill">✨ Real-time Live Preview</span>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "1.25rem" }}>
            <img
              src={formData.avatarUrl}
              alt="Avatar"
              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 2px 0" }}>{formData.name}</h2>
              <p style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 600, margin: 0 }}>{formData.role}</p>
              <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>{formData.location}</p>
            </div>
          </div>

          <div style={{ height: "1px", background: "#e2e8f0", margin: "0 0 1.25rem 0" }} />

          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
            About Candidate
          </h4>
          <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
            {formData.aboutText}
          </p>

          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
            Technical Stack
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {formData.skillsList.split(",").map((s, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#4338ca",
                  background: "#e0e7ff",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                }}
              >
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditorPage;
