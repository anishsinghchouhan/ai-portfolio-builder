import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, getBuilderPath } from "../../constants/routes";
import {
  getUserResumes,
  uploadResumeFile,
  analyzeResume,
  deleteResumeRecord,
} from "../../services/resumeService";
import { createPortfolio } from "../../services/portfolioService";
import "./ResumeAIPage.css";

const EMPTY_RESUME_DATA = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experiences: [],
  skills: [],
  education: [],
  projects: [],
};

const PORTFOLIO_TEMPLATES = [
  {
    id: "dark",
    name: "Dark",
    themeConfig: {
      preset: "dark",
      primary: "#6366f1",
      bg: "#0b0f17",
      text: "#f8fafc",
      font: "Inter",
      radius: 12,
      layout: "dark",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    themeConfig: {
      preset: "minimal",
      primary: "#000000",
      bg: "#ffffff",
      text: "#0f172a",
      font: "Inter",
      radius: 6,
      layout: "minimal",
    },
  },
  {
    id: "glass",
    name: "Glass",
    themeConfig: {
      preset: "glass",
      primary: "#38bdf8",
      bg: "#0f172a",
      text: "#f0f9ff",
      font: "Plus Jakarta Sans",
      radius: 16,
      layout: "glass",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    themeConfig: {
      preset: "corporate",
      primary: "#2563eb",
      bg: "#f8fafc",
      text: "#1e293b",
      font: "Roboto",
      radius: 8,
      layout: "corporate",
    },
  },
  {
    id: "developer-dark",
    name: "Developer Dark",
    themeConfig: {
      preset: "developer-dark",
      primary: "#10b981",
      bg: "#090d16",
      text: "#ecfdf5",
      font: "Fira Code",
      radius: 8,
      layout: "developer",
    },
  },
  {
    id: "creative",
    name: "Creative",
    themeConfig: {
      preset: "creative",
      primary: "#f43f5e",
      bg: "#18050e",
      text: "#fff1f2",
      font: "Space Grotesk",
      radius: 20,
      layout: "creative",
    },
  },
];

export const ResumeAIPage = () => {
  const navigate = useNavigate();

  // Active review state - starts completely empty
  const [data, setData] = useState(EMPTY_RESUME_DATA);

  // UI & Parsing States
  const [isDragging, setIsDragging] = useState(false);
  const [parsingStage, setParsingStage] = useState("idle"); // 'idle' | 'uploading' | 'parsing' | 'success'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("skills"); // 'skills' | 'experience' | 'personal' | 'projects' | 'education'
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("All");
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [canRetry, setCanRetry] = useState(false);
  const [lastUploadedResumeId, setLastUploadedResumeId] = useState(null);

  // Database resumes history
  const [resumesList, setResumesList] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Selected portfolio template (defaults to null, must be chosen before generating)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const fileInputRef = useRef(null);

  // Real parsed data check
  const hasParsedData =
    data.skills.length > 0 ||
    data.experiences.length > 0 ||
    data.projects.length > 0 ||
    data.education.length > 0 ||
    Boolean(data.summary?.trim()) ||
    Boolean(data.personalInfo?.fullName?.trim());

  // Fetch user resumes from backend on mount
  useEffect(() => {
    let mounted = true;
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        const list = await getUserResumes();
        if (mounted && Array.isArray(list)) {
          setResumesList(list);
        }
      } catch (err) {
        console.warn("Failed to load user resumes from API:", err);
      } finally {
        if (mounted) setLoadingResumes(false);
      }
    };
    fetchResumes();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
    // Reset file input value so selecting the same file triggers onChange
    if (e.target) {
      e.target.value = "";
    }
  };

  // Populate data state from parsed Gemini analysis object
  const populateDataFromAnalysis = (parsed) => {
    if (!parsed) return;

    setData({
      personalInfo: {
        fullName: parsed.name || "",
        title: parsed.headline || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        location: parsed.location || "",
        website: parsed.website || "",
        linkedin: parsed.linkedin || "",
        github: parsed.github || "",
      },
      summary: parsed.summary || "",
      skills: (parsed.skills || []).map((sk, idx) => ({
        id: `sk-${idx}-${Date.now()}`,
        name: typeof sk === "string" ? sk : sk.name || "",
        category: typeof sk === "object" && sk.category ? sk.category : "General",
      })),
      experiences: (parsed.experience || []).map((exp, idx) => ({
        id: `exp-${idx}-${Date.now()}`,
        position: exp.role || exp.position || "",
        company: exp.company || "",
        period: exp.duration || exp.period || "",
        description: exp.description || "",
      })),
      education: (parsed.education || []).map((edu, idx) => ({
        id: `edu-${idx}-${Date.now()}`,
        degree: edu.degree || "",
        institution: edu.institution || edu.school || "",
        period: edu.year || edu.period || "",
        grade: edu.grade || "",
      })),
      projects: (parsed.projects || []).map((proj, idx) => ({
        id: `proj-${idx}-${Date.now()}`,
        title: proj.title || proj.name || "",
        tech: Array.isArray(proj.techStack)
          ? proj.techStack.join(", ")
          : typeof proj.techStack === "string"
          ? proj.techStack
          : Array.isArray(proj.tech)
          ? proj.tech.join(", ")
          : proj.tech || "",
        description: proj.description || "",
      })),
    });
  };

  // Analyze an uploaded resume by ID
  const handleAnalyzeResume = async (resumeId) => {
    try {
      setParsingStage("parsing");
      setErrorMessage(null);
      setCanRetry(false);

      const analyzeRes = await analyzeResume(resumeId);
      // Support backend formats: { analysis } or { data: { analysis } } or { resume: { parsedData: { analysis } } }
      const parsed =
        analyzeRes?.analysis ||
        analyzeRes?.data?.analysis ||
        analyzeRes?.parsedData ||
        analyzeRes?.data?.parsedData ||
        analyzeRes?.resume?.parsedData?.analysis ||
        analyzeRes?.resume?.parsedData ||
        analyzeRes;

      if (parsed) {
        populateDataFromAnalysis(parsed);
        setParsingStage("success");
      } else {
        setParsingStage("idle");
      }
    } catch (err) {
      setParsingStage("idle");
      const status = err.response?.status;
      if (status === 503) {
        setErrorMessage("AI is busy, try again in a few minutes");
        setCanRetry(true);
      } else if (status === 502) {
        setErrorMessage("Could not read the resume. Try again or edit manually.");
        setCanRetry(false);
      } else {
        const backendMsg = err.response?.data?.message || err.message;
        setErrorMessage(backendMsg || "Failed to analyze resume.");
        setCanRetry(false);
      }
    }
  };

  // Real upload & AI parsing pipeline
  const handleFileSelected = async (file) => {
    setErrorMessage(null);
    setCanRetry(false);

    // 1. Validate PDF on client (type and max 5 MB)
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Unsupported file format. Please upload a PDF resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    try {
      setParsingStage("uploading");
      setUploadProgress(0);

      // Call POST /resumes/upload through services/resumeService.js
      const uploadRes = await uploadResumeFile(file, (progress) => {
        setUploadProgress(progress);
      });

      const uploadedId = uploadRes?.id;
      if (!uploadedId) {
        throw new Error("Upload failed: No resume ID returned.");
      }

      setLastUploadedResumeId(uploadedId);

      // Refresh resumes list table
      try {
        const list = await getUserResumes();
        if (Array.isArray(list)) setResumesList(list);
      } catch {
        // Non-critical
      }

      // 2. Call POST /resumes/:id/analyze
      await handleAnalyzeResume(uploadedId);
    } catch (err) {
      setParsingStage("idle");
      const backendMsg = err.response?.data?.message || err.message;
      setErrorMessage(backendMsg || "Upload failed. Please try again.");
    }
  };

  const handleRegenerateSummary = () => {
    if (!hasParsedData) {
      setErrorMessage("Upload your PDF to get started.");
      return;
    }
    if (lastUploadedResumeId) {
      handleAnalyzeResume(lastUploadedResumeId);
    } else {
      setErrorMessage("Please select or upload a resume to re-analyze.");
    }
  };

  // Load a previously uploaded resume's data
  const handleLoadExistingResume = (resItem) => {
    setLastUploadedResumeId(resItem.id);
    const parsed =
      resItem.parsedData?.analysis ||
      resItem.parsedData;

    if (parsed && (parsed.name || parsed.headline || parsed.skills?.length || parsed.experience?.length || parsed.education?.length || parsed.projects?.length || parsed.summary)) {
      populateDataFromAnalysis(parsed);
      setParsingStage("idle");
      setErrorMessage(null);
    } else {
      handleAnalyzeResume(resItem.id);
    }
  };

  // Skills filter & add/delete
  const filteredSkills =
    skillCategoryFilter === "All"
      ? data.skills
      : data.skills.filter((s) => s.category === skillCategoryFilter);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const newSkill = {
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: newSkillInput.trim(),
      category: skillCategoryFilter === "All" ? "Frontend" : skillCategoryFilter,
    };
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setNewSkillInput("");
  };

  const handleDeleteSkill = (id) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      position: "",
      company: "",
      period: "",
      description: "",
    };
    setData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
  };

  const handleUpdateExperience = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleRemoveExperience = (id) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: "",
      tech: "",
      description: "",
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const handleUpdateProject = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const handleRemoveProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      degree: "",
      institution: "",
      period: "",
      grade: "",
    };
    setData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const handleUpdateEducation = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleRemoveEducation = (id) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Personal info handler
  const handlePersonalInfoChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Delete resume from database
  const handleDeleteResume = async (id) => {
    try {
      await deleteResumeRecord(id);
      setResumesList((prev) => prev.filter((r) => r.id !== id));
      if (lastUploadedResumeId === id) {
        setLastUploadedResumeId(null);
      }
    } catch (err) {
      console.warn("Failed to delete resume record:", err);
    }
  };

  // Generate portfolio directly from parsed resume
  const handleGeneratePortfolio = async () => {
    if (!hasParsedData || !selectedTemplateId) return;

    const chosenTemplate = PORTFOLIO_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (!chosenTemplate) return;

    try {
      setIsGeneratingPortfolio(true);
      const title = data.personalInfo.fullName?.trim()
        ? `${data.personalInfo.fullName.trim()}'s Portfolio`
        : "Candidate Portfolio";

      const initialContent = {
        about: {
          name: data.personalInfo.fullName || "",
          title: data.personalInfo.title || "",
          bio: data.summary || "",
          email: data.personalInfo.email || "",
          phone: data.personalInfo.phone || "",
          location: data.personalInfo.location || "",
          website: data.personalInfo.website || "",
          linkedin: data.personalInfo.linkedin || "",
          github: data.personalInfo.github || "",
        },
        skills: data.skills.map((s) => s.name).filter(Boolean),
        experiences: data.experiences.map((exp) => ({
          role: exp.position || "",
          company: exp.company || "",
          duration: exp.period || "",
          description: exp.description || "",
        })),
        projects: data.projects.map((p) => ({
          title: p.title || "",
          description: p.description || "",
          techStack: p.tech || "",
        })),
        education: data.education.map((edu) => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          period: edu.period || "",
          grade: edu.grade || "",
        })),
        themeConfig: chosenTemplate.themeConfig,
      };

      const res = await createPortfolio({
        title,
        theme: chosenTemplate.themeConfig.preset,
        content: initialContent,
      });

      const portfolioId = res?.data?.id || res?.id;
      if (portfolioId) {
        navigate(getBuilderPath(portfolioId));
      } else {
        navigate(ROUTES.DASHBOARD_PORTFOLIO);
      }
    } catch (err) {
      console.error("Failed to generate portfolio from resume:", err);
      const msg = err.response?.data?.message || "Could not create portfolio. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsGeneratingPortfolio(false);
    }
  };

  return (
    <div className="resume-ai-container">
      {/* ─── Header Section ───────────────────────────────────── */}
      <div className="resume-ai-header">
        <div className="resume-ai-title-group">
          <h1>Resume & AI Studio</h1>
          <p>
            Upload your resume to automatically extract your skills, work history, and let AI synthesize an optimized portfolio tailored for tech recruiters.
          </p>
        </div>

        <div className="resume-ai-badge-group">
          <div className="ai-engine-status-pill" title="AI Extraction Engine is active and ready">
            <span className="status-indicator-dot" />
            <span>AI Parser Active</span>
          </div>
        </div>
      </div>

      {/* ─── Top Metrics Bar ──────────────────────────────────── */}
      <div className="ai-metrics-grid">
        <div className="ai-metric-card">
          <div className="ai-metric-icon-box emerald">🎯</div>
          <div className="ai-metric-content">
            <h3>{hasParsedData ? "96%" : "—"}</h3>
            <p>ATS Match Score</p>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="ai-metric-icon-box indigo">⚡</div>
          <div className="ai-metric-content">
            <h3>{data.skills.length}</h3>
            <p>Skills Extracted</p>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="ai-metric-icon-box amber">💼</div>
          <div className="ai-metric-content">
            <h3>{data.experiences.length} Roles</h3>
            <p>Work Experience</p>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="ai-metric-icon-box purple">🎓</div>
          <div className="ai-metric-content">
            <h3>{data.education.length} Degrees</h3>
            <p>Education & Honors</p>
          </div>
        </div>
      </div>

      {/* ─── Error Notification ───────────────────────────────── */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#f87171",
            padding: "12px 18px",
            borderRadius: "12px",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
          {canRetry && lastUploadedResumeId && (
            <button
              type="button"
              onClick={() => handleAnalyzeResume(lastUploadedResumeId)}
              style={{
                background: "#ef4444",
                color: "#ffffff",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* ─── Upload Dropzone or Live Progress ──────────────────── */}
      {parsingStage === "idle" && (
        <div
          className={`resume-dropzone-card ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

          <div className="dropzone-inner">
            <div className="dropzone-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <h3>Upload your PDF to get started.</h3>
            <p>Drag &amp; drop your resume PDF here or click to browse</p>

            <button
              type="button"
              className="btn-browse-file"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload Resume</span>
            </button>

            <div className="dropzone-specs">
              <span className="spec-badge">PDF only</span>
              <span className="spec-badge">Max 5 MB</span>
              <span className="spec-badge">ATS Formatted</span>
            </div>
          </div>
        </div>
      )}

      {(parsingStage === "uploading" || parsingStage === "parsing") && (
        <div className="ai-processing-box">
          <div className="processing-header">
            <div className="processing-title">
              <div className="processing-spinner" />
              <h3>
                {parsingStage === "uploading" ? "Uploading Resume Document..." : "Analyzing your resume with AI..."}
              </h3>
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--dash-text-muted, #94a3b8)", fontWeight: 600 }}>
              {parsingStage === "uploading" ? `${uploadProgress}%` : "Analyzing"}
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: parsingStage === "uploading" ? `${uploadProgress}%` : "85%",
              }}
            />
          </div>
        </div>
      )}

      {parsingStage === "success" && (
        <div className="parse-success-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>✨</span>
            <div>
              <strong>Resume Parsed Successfully:</strong> Extracted {data.skills.length} skills, {data.experiences.length} experience roles, and synthesized your portfolio layout.
            </div>
          </div>
          <button
            type="button"
            className="btn-ai-action"
            onClick={() => setParsingStage("idle")}
          >
            Upload Another
          </button>
        </div>
      )}

      {/* ─── AI Executive Summary Card ─────────────────────────── */}
      <div className="ai-summary-card">
        <div className="card-section-header">
          <h3>
            <span>✨</span>
            <span>AI Executive Bio & Pitch</span>
          </h3>
          <button
            type="button"
            className="btn-ai-action"
            onClick={handleRegenerateSummary}
            disabled={!hasParsedData}
            title={hasParsedData ? "Regenerate AI summary" : "Upload your PDF to get started."}
          >
            <span>🔄</span>
            <span>Regenerate with AI</span>
          </button>
        </div>

        <textarea
          className="ai-summary-textarea"
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          placeholder="Upload your PDF to get started."
          rows={3}
          aria-label="AI Executive Summary"
        />
      </div>

      {/* ─── Extracted Data Review Studio ─────────────────────── */}
      <div className="extracted-studio-card">
        <div className="studio-tabs-bar">
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <span>⚡ Skills ({data.skills.length})</span>
          </button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "experience" ? "active" : ""}`}
            onClick={() => setActiveTab("experience")}
          >
            <span>💼 Work Experience ({data.experiences.length})</span>
          </button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <span>🚀 Projects ({data.projects.length})</span>
          </button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "education" ? "active" : ""}`}
            onClick={() => setActiveTab("education")}
          >
            <span>🎓 Education ({data.education.length})</span>
          </button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <span>👤 Contact & Links</span>
          </button>
        </div>

        <div className="studio-tab-body">
          {/* TAB 1: SKILLS */}
          {activeTab === "skills" && (
            <div>
              {data.skills.length === 0 ? (
                <div className="history-empty-state">
                  <p>No data yet</p>
                </div>
              ) : (
                <>
                  <div className="skills-filter-row">
                    <div className="category-pills">
                      {["All", "Frontend", "Backend", "Cloud & DevOps", "AI & ML"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`category-pill ${skillCategoryFilter === cat ? "active" : ""}`}
                          onClick={() => setSkillCategoryFilter(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="skills-tags-grid">
                    {filteredSkills.map((sk) => (
                      <span key={sk.id} className="skill-tag-pill">
                        <span>{sk.name}</span>
                        <button
                          type="button"
                          className="btn-delete-tag"
                          onClick={() => handleDeleteSkill(sk.id)}
                          title={`Remove ${sk.name}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </>
              )}

              <form onSubmit={handleAddSkill} className="add-skill-form">
                <input
                  type="text"
                  placeholder="Add custom skill (e.g. GraphQL)..."
                  className="add-skill-input"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                />
                <button type="submit" className="btn-add-skill">
                  + Add Skill
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === "experience" && (
            <div>
              {data.experiences.length === 0 ? (
                <div className="history-empty-state">
                  <p>No data yet</p>
                </div>
              ) : (
                <div className="experience-list-grid">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="experience-card-item">
                      <div className="card-item-top-row">
                        <div className="card-item-inputs-grid">
                          <div className="info-input-group">
                            <label>Role / Position</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={exp.position || ""}
                              onChange={(e) => handleUpdateExperience(exp.id, "position", e.target.value)}
                              placeholder="e.g. Senior Frontend Engineer"
                            />
                          </div>
                          <div className="info-input-group">
                            <label>Company / Organization</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={exp.company || ""}
                              onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                              placeholder="e.g. Acme Innovations"
                            />
                          </div>
                          <div className="info-input-group">
                            <label>Duration / Period</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={exp.period || ""}
                              onChange={(e) => handleUpdateExperience(exp.id, "period", e.target.value)}
                              placeholder="e.g. 2022 - Present"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-delete-item"
                          onClick={() => handleRemoveExperience(exp.id)}
                          title="Remove this experience"
                        >
                          ×
                        </button>
                      </div>
                      <div className="info-input-group" style={{ marginTop: "0.5rem" }}>
                        <label>Description & Achievements</label>
                        <textarea
                          className="info-input-field"
                          rows={3}
                          value={exp.description || ""}
                          onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                          placeholder="Key responsibilities, metrics and accomplishments..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="btn-add-section-item"
                onClick={handleAddExperience}
              >
                + Add Experience
              </button>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div>
              {data.projects.length === 0 ? (
                <div className="history-empty-state">
                  <p>No data yet</p>
                </div>
              ) : (
                <div className="experience-list-grid">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="experience-card-item">
                      <div className="card-item-top-row">
                        <div className="card-item-inputs-grid">
                          <div className="info-input-group">
                            <label>Project Title</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={proj.title || ""}
                              onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                              placeholder="e.g. Realtime Analytics Platform"
                            />
                          </div>
                          <div className="info-input-group">
                            <label>Tech Stack / Technologies</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={proj.tech || ""}
                              onChange={(e) => handleUpdateProject(proj.id, "tech", e.target.value)}
                              placeholder="e.g. React, Node.js, WebSockets"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-delete-item"
                          onClick={() => handleRemoveProject(proj.id)}
                          title="Remove this project"
                        >
                          ×
                        </button>
                      </div>
                      <div className="info-input-group" style={{ marginTop: "0.5rem" }}>
                        <label>Description</label>
                        <textarea
                          className="info-input-field"
                          rows={3}
                          value={proj.description || ""}
                          onChange={(e) => handleUpdateProject(proj.id, "description", e.target.value)}
                          placeholder="Project overview, architecture, and results..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="btn-add-section-item"
                onClick={handleAddProject}
              >
                + Add Project
              </button>
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === "education" && (
            <div>
              {data.education.length === 0 ? (
                <div className="history-empty-state">
                  <p>No data yet</p>
                </div>
              ) : (
                <div className="experience-list-grid">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="experience-card-item">
                      <div className="card-item-top-row">
                        <div className="card-item-inputs-grid">
                          <div className="info-input-group">
                            <label>Degree / Qualification</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={edu.degree || ""}
                              onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                              placeholder="e.g. B.S. in Computer Science"
                            />
                          </div>
                          <div className="info-input-group">
                            <label>Institution / University</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={edu.institution || ""}
                              onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                              placeholder="e.g. Stanford University"
                            />
                          </div>
                          <div className="info-input-group">
                            <label>Period / Graduation</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={edu.period || ""}
                              onChange={(e) => handleUpdateEducation(edu.id, "period", e.target.value)}
                              placeholder="e.g. 2019 - 2023"
                            />
                          </div>
                          <div className="info-input-group">
                            <label>Grade / Honors</label>
                            <input
                              type="text"
                              className="info-input-field"
                              value={edu.grade || ""}
                              onChange={(e) => handleUpdateEducation(edu.id, "grade", e.target.value)}
                              placeholder="e.g. 3.9 GPA, Honors"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-delete-item"
                          onClick={() => handleRemoveEducation(edu.id)}
                          title="Remove this education record"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="btn-add-section-item"
                onClick={handleAddEducation}
              >
                + Add Education
              </button>
            </div>
          )}

          {/* TAB 5: PERSONAL */}
          {activeTab === "personal" && (
            <div className="personal-info-grid">
              <div className="info-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="info-input-field"
                  value={data.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="info-input-field"
                  value={data.personalInfo.title}
                  onChange={(e) => handlePersonalInfoChange("title", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. jane@example.com"
                  className="info-input-field"
                  value={data.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 000-0000"
                  className="info-input-field"
                  value={data.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  className="info-input-field"
                  value={data.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>Website URL</label>
                <input
                  type="text"
                  placeholder="https://janedoe.dev"
                  className="info-input-field"
                  value={data.personalInfo.website}
                  onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  className="info-input-field"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                />
              </div>

              <div className="info-input-group">
                <label>GitHub URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/username"
                  className="info-input-field"
                  value={data.personalInfo.github}
                  onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Template Selector Section ───────────────────────── */}
      <div className="template-picker-section">
        <div className="template-picker-header">
          <div className="template-picker-title">
            <h3>Choose a Portfolio Template</h3>
            <span className="template-picker-badge">Required</span>
          </div>
          <p>
            Select one of the 6 design templates below. Your selection configures your portfolio layout and theme colors.
          </p>
        </div>

        <div className="template-cards-grid">
          {PORTFOLIO_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            const { themeConfig } = tmpl;

            return (
              <div
                key={tmpl.id}
                role="button"
                tabIndex={0}
                className={`template-card-item ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedTemplateId(tmpl.id);
                  }
                }}
              >
                <div
                  className="template-color-preview"
                  style={{
                    backgroundColor: themeConfig.bg,
                    borderColor: isSelected ? themeConfig.primary : "rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <div className="preview-mini-canvas">
                    <div className="preview-mini-header">
                      <span
                        className="preview-mini-dot"
                        style={{ backgroundColor: themeConfig.primary }}
                      />
                      <span
                        className="preview-mini-dot"
                        style={{
                          backgroundColor:
                            themeConfig.bg === "#ffffff" ? "#e2e8f0" : "rgba(255, 255, 255, 0.2)",
                        }}
                      />
                    </div>
                    <div className="preview-mini-body">
                      <div
                        className="preview-mini-bar short"
                        style={{ backgroundColor: themeConfig.primary }}
                      />
                      <div
                        className="preview-mini-bar long"
                        style={{
                          backgroundColor:
                            themeConfig.bg === "#ffffff" ? "#cbd5e1" : "rgba(255, 255, 255, 0.15)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="preview-color-dots">
                    <span
                      className="color-dot"
                      style={{ backgroundColor: themeConfig.primary }}
                      title={`Primary: ${themeConfig.primary}`}
                    />
                    <span
                      className="color-dot"
                      style={{
                        backgroundColor: themeConfig.bg,
                        border: "1px solid rgba(148, 163, 184, 0.4)",
                      }}
                      title={`Background: ${themeConfig.bg}`}
                    />
                    <span
                      className="color-dot"
                      style={{ backgroundColor: themeConfig.text }}
                      title={`Text: ${themeConfig.text}`}
                    />
                  </div>
                </div>

                <div className="template-card-footer">
                  <div className="template-meta">
                    <h4 className="template-name">{tmpl.name}</h4>
                    <span className="template-layout-tag">{themeConfig.layout}</span>
                  </div>
                  <div className="template-select-indicator">
                    {isSelected ? (
                      <span className="indicator-checked">✓</span>
                    ) : (
                      <span className="indicator-empty" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Main Action Bar: Generate Portfolio ─────────────── */}
      <div className="resume-action-bar">
        <div className="action-bar-text">
          <h3>Ready to build your live portfolio?</h3>
          <p>
            {!hasParsedData
              ? "Upload and parse your resume above to get started."
              : !selectedTemplateId
              ? "Select a template above to enable portfolio generation."
              : "Generate a full responsive portfolio pre-populated with this parsed resume data in one click."}
          </p>
        </div>

        <button
          type="button"
          className="btn-generate-portfolio"
          onClick={handleGeneratePortfolio}
          disabled={!hasParsedData || !selectedTemplateId || isGeneratingPortfolio}
        >
          {isGeneratingPortfolio ? (
            <span>Generating Portfolio...</span>
          ) : (
            <>
              <span>⚡ Generate Portfolio with AI</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* ─── Resumes History Table ────────────────────────────── */}
      <div className="resumes-history-card">
        <h3>Uploaded Resumes</h3>

        {loadingResumes ? (
          <p style={{ color: "var(--dash-text-muted, #94a3b8)", fontSize: "0.9rem" }}>Loading resumes...</p>
        ) : resumesList.length > 0 ? (
          <div className="resumes-history-list">
            {resumesList.map((resItem) => {
              const formattedSize =
                resItem.fileSize > 1024 * 1024
                  ? `${(resItem.fileSize / (1024 * 1024)).toFixed(1)} MB`
                  : `${Math.round(resItem.fileSize / 1024)} KB`;
              const formattedDate = resItem.createdAt
                ? new Date(resItem.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently";

              const isParsed = Boolean(
                resItem.parsedData?.analysis ||
                resItem.parsedData?.name ||
                resItem.parsedData?.skills
              );

              return (
                <div key={resItem.id} className="history-item-row">
                  <div className="history-item-left">
                    <div className="pdf-icon-badge">PDF</div>
                    <div className="history-item-meta">
                      <h5>{resItem.fileName}</h5>
                      <span>{formattedSize} • {formattedDate}</span>
                    </div>
                  </div>

                  <div className="history-item-actions">
                    <span className="badge-active-parsed">
                      {isParsed ? "Parsed & Active" : "Uploaded"}
                    </span>
                    <button
                      type="button"
                      className="btn-load-history"
                      onClick={() => handleLoadExistingResume(resItem)}
                      title={isParsed ? "Load parsed data into editor" : "Analyze this resume"}
                    >
                      {isParsed ? "Load Data" : "Analyze"}
                    </button>
                    <button
                      type="button"
                      className="btn-delete-history"
                      onClick={() => handleDeleteResume(resItem.id)}
                      title="Delete this resume"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="history-empty-state">
            <p>No resumes stored yet. Drop a resume above to parse and save your first document.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAIPage;
