import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, getBuilderPath } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import {
  getUserResumes,
  createResumeRecord,
  deleteResumeRecord,
} from "../../services/resumeService";
import { createPortfolio } from "../../services/portfolioService";
import "./ResumeAIPage.css";

const AI_SUMMARY_PRESETS = [
  "Results-driven Senior Full-Stack & AI Engineer with 5+ years of experience architecting high-performance web applications with React 19, Node.js, and modern cloud services. Proven record of optimizing web vitals and delivering scalable digital products.",
  "Engineering Leader & Architect dedicated to crafting elegant user experiences and reliable distributed architectures. Passionate about AI-augmented workflows, design systems, and driving high-velocity engineering teams.",
  "Product-minded Software Engineer with deep expertise across modern frontend frameworks, TypeScript, and full-stack API design. Committed to clean code, accessibility standards, and intuitive digital experiences.",
];

const INITIAL_RESUME_DATA = {
  personalInfo: {
    fullName: "Anish Singh",
    title: "Senior Full Stack & AI Engineer",
    email: "anish.singh@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    website: "https://anishsingh.dev",
    linkedin: "https://linkedin.com/in/anishsingh",
    github: "https://github.com/anishsingh0477",
  },
  summary: AI_SUMMARY_PRESETS[0],
  experiences: [
    {
      id: "exp-1",
      position: "Senior Frontend Engineer",
      company: "Vercel Partner Labs",
      period: "2024 - Present",
      description: "Led frontend architecture for modern developer analytics dashboard. Improved Core Web Vitals LCP by 42% across 40k+ active users.",
    },
    {
      id: "exp-2",
      position: "Software Engineer",
      company: "InnovateX Solutions",
      period: "2022 - 2024",
      description: "Built responsive component libraries using React, TypeScript, and Tailwind. Developed REST endpoints and managed CI/CD deployment pipelines.",
    },
  ],
  skills: [
    { id: "sk-1", name: "React 19", category: "Frontend" },
    { id: "sk-2", name: "TypeScript", category: "Frontend" },
    { id: "sk-3", name: "Next.js", category: "Frontend" },
    { id: "sk-4", name: "Node.js", category: "Backend" },
    { id: "sk-5", name: "Express", category: "Backend" },
    { id: "sk-6", name: "PostgreSQL", category: "Backend" },
    { id: "sk-7", name: "Prisma ORM", category: "Backend" },
    { id: "sk-8", name: "Tailwind CSS", category: "Frontend" },
    { id: "sk-9", name: "Docker", category: "Cloud & DevOps" },
    { id: "sk-10", name: "Supabase", category: "Cloud & DevOps" },
    { id: "sk-11", name: "LLM Orchestration", category: "AI & ML" },
    { id: "sk-12", name: "REST APIs", category: "Backend" },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      period: "2019 - 2023",
      grade: "3.85 GPA",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Realtime Analytics Dashboard",
      tech: "React, TypeScript, WebSocket",
      description: "High-throughput live metrics visualizer with real-time streaming charts.",
    },
    {
      id: "proj-2",
      title: "AI Resume & Portfolio Generator",
      tech: "React 19, Node.js, Prisma, PostgreSQL",
      description: "Autonomous portfolio building platform with instant ATS resume parsing.",
    },
  ],
};

const AI_PARSING_STEPS = [
  "Reading file structure & optical text layout...",
  "Parsing work experience, timelines & achievements...",
  "Extracting technical skills & proficiencies...",
  "Synthesizing AI executive summary & portfolio layout...",
];

export const ResumeAIPage = () => {
  const { user, appUser } = useAuth();
  const navigate = useNavigate();

  // Active review state
  const [data, setData] = useState(() => {
    const copy = { ...INITIAL_RESUME_DATA };
    if (appUser?.fullName || user?.user_metadata?.full_name) {
      copy.personalInfo = {
        ...copy.personalInfo,
        fullName: appUser?.fullName || user?.user_metadata?.full_name || copy.personalInfo.fullName,
        email: user?.email || copy.personalInfo.email,
      };
    }
    return copy;
  });

  // UI & Parsing States
  const [isDragging, setIsDragging] = useState(false);
  const [parsingStage, setParsingStage] = useState("idle"); // 'idle' | 'uploading' | 'parsing' | 'success'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("skills"); // 'skills' | 'experience' | 'personal' | 'projects' | 'education'
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("All");
  const [newSkillInput, setNewSkillInput] = useState("");
  const [summaryToneIndex, setSummaryToneIndex] = useState(0);
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Database resumes history
  const [resumesList, setResumesList] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const fileInputRef = useRef(null);

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
  };

  // Start upload & simulated AI parsing pipeline
  const handleFileSelected = (file) => {
    setErrorMessage(null);

    // Validate size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`);
      return;
    }

    // Validate type (.pdf, .doc, .docx)
    const validExtensions = [".pdf", ".doc", ".docx"];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage("Unsupported file format. Please upload a PDF, DOC, or DOCX resume.");
      return;
    }

    // Start upload simulation
    setParsingStage("uploading");
    setUploadProgress(15);

    let progress = 15;
    const uploadTimer = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(uploadTimer);
        setUploadProgress(100);
        // Transition to AI parsing stage
        startAIParsing(file);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
  };

  // Step-by-step AI parsing simulation
  const startAIParsing = (file) => {
    setParsingStage("parsing");
    setCurrentStepIndex(0);

    let step = 0;
    const stepTimer = setInterval(async () => {
      step += 1;
      if (step < AI_PARSING_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(stepTimer);

        // Record parsed resume into backend
        try {
          const newResume = await createResumeRecord({
            fileName: file.name,
            fileSize: file.size,
            fileUrl: `/uploads/${file.name}`,
            parsedData: data,
          });
          setResumesList((prev) => [newResume, ...prev]);
        } catch (apiErr) {
          console.warn("Could not persist resume to server:", apiErr);
        }

        setParsingStage("success");
      }
    }, 600);
  };

  // Cycle through AI summary tones
  const handleRegenerateSummary = () => {
    const nextIndex = (summaryToneIndex + 1) % AI_SUMMARY_PRESETS.length;
    setSummaryToneIndex(nextIndex);
    setData((prev) => ({
      ...prev,
      summary: AI_SUMMARY_PRESETS[nextIndex],
    }));
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
      id: `sk-${Date.now()}`,
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

  // Delete resume from database
  const handleDeleteResume = async (id) => {
    try {
      await deleteResumeRecord(id);
      setResumesList((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.warn("Failed to delete resume record:", err);
    }
  };

  // Generate portfolio directly from parsed resume
  const handleGeneratePortfolio = async () => {
    try {
      setIsGeneratingPortfolio(true);
      const title = `${data.personalInfo.fullName || "Developer"}'s AI Portfolio`;
      const initialContent = {
        about: {
          name: data.personalInfo.fullName,
          title: data.personalInfo.title,
          bio: data.summary,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          location: data.personalInfo.location,
        },
        skills: data.skills.map((s) => s.name),
        experiences: data.experiences.map((exp) => ({
          role: exp.position,
          company: exp.company,
          duration: exp.period,
          description: exp.description,
        })),
        projects: data.projects.map((p) => ({
          title: p.title,
          description: p.description,
          techStack: p.tech,
        })),
        themeConfig: {
          template: "modern-minimal",
          primaryColor: "#6366f1",
          fontFamily: "Inter",
        },
      };

      const res = await createPortfolio({
        title,
        theme: "dark-glass",
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
      setErrorMessage("Could not create portfolio. Please try again.");
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
            <h3>96%</h3>
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
            gap: "10px",
          }}
        >
          <span>⚠️</span>
          <span>{errorMessage}</span>
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
            accept=".pdf,.doc,.docx,application/pdf"
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

            <h3>Drag & drop your resume PDF here</h3>
            <p>or click to browse your computer files</p>

            <button type="button" className="btn-browse-file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload Resume</span>
            </button>

            <div className="dropzone-specs">
              <span className="spec-badge">PDF, DOC, DOCX</span>
              <span className="spec-badge">Max 10 MB</span>
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
                {parsingStage === "uploading" ? "Uploading Resume Document..." : "AI Parsing & Layout Synthesis..."}
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
                width: parsingStage === "uploading" ? `${uploadProgress}%` : `${((currentStepIndex + 1) / AI_PARSING_STEPS.length) * 100}%`,
              }}
            />
          </div>

          <div className="processing-steps-list">
            {AI_PARSING_STEPS.map((stepDesc, idx) => {
              const isDone = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              return (
                <div key={idx} className={`step-item ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                  <span className="step-icon-indicator">{isDone ? "✓" : idx + 1}</span>
                  <span>{stepDesc}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {parsingStage === "success" && (
        <div className="parse-success-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>✨</span>
            <div>
              <strong>Resume Parsed Successfully:</strong> Extracted {data.skills.length} skills, {data.experiences.length} experience roles, and synthesized an AI portfolio layout.
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
            title="Cycle AI summary tone"
          >
            <span>🔄</span>
            <span>Regenerate with AI</span>
          </button>
        </div>

        <textarea
          className="ai-summary-textarea"
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
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

              <form onSubmit={handleAddSkill} className="add-skill-form">
                <input
                  type="text"
                  placeholder="Add custom skill (e.g. GraphQL)..."
                  className="add-skill-input"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                />
                <button type="submit" className="btn-add-skill">
                  + Add
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="experience-list-grid">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="experience-card-item">
                  <div className="experience-card-header">
                    <div>
                      <h4 className="experience-role-title">{exp.position}</h4>
                      <div className="experience-company">{exp.company}</div>
                    </div>
                    <span className="experience-period-badge">{exp.period}</span>
                  </div>
                  <p className="experience-desc">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="experience-list-grid">
              {data.projects.map((proj) => (
                <div key={proj.id} className="experience-card-item">
                  <div className="experience-card-header">
                    <div>
                      <h4 className="experience-role-title">{proj.title}</h4>
                      <div className="experience-company">{proj.tech}</div>
                    </div>
                  </div>
                  <p className="experience-desc">{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === "education" && (
            <div className="experience-list-grid">
              {data.education.map((edu) => (
                <div key={edu.id} className="experience-card-item">
                  <div className="experience-card-header">
                    <div>
                      <h4 className="experience-role-title">{edu.degree}</h4>
                      <div className="experience-company">{edu.institution}</div>
                    </div>
                    <span className="experience-period-badge">{edu.period}</span>
                  </div>
                  <p className="experience-desc">{edu.grade}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PERSONAL */}
          {activeTab === "personal" && (
            <div className="personal-info-grid">
              <div className="info-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="info-input-field"
                  value={data.personalInfo.fullName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personalInfo: { ...data.personalInfo, fullName: e.target.value },
                    })
                  }
                />
              </div>

              <div className="info-input-group">
                <label>Professional Title</label>
                <input
                  type="text"
                  className="info-input-field"
                  value={data.personalInfo.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personalInfo: { ...data.personalInfo, title: e.target.value },
                    })
                  }
                />
              </div>

              <div className="info-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="info-input-field"
                  value={data.personalInfo.email}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personalInfo: { ...data.personalInfo, email: e.target.value },
                    })
                  }
                />
              </div>

              <div className="info-input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="info-input-field"
                  value={data.personalInfo.phone}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personalInfo: { ...data.personalInfo, phone: e.target.value },
                    })
                  }
                />
              </div>

              <div className="info-input-group">
                <label>Location</label>
                <input
                  type="text"
                  className="info-input-field"
                  value={data.personalInfo.location}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personalInfo: { ...data.personalInfo, location: e.target.value },
                    })
                  }
                />
              </div>

              <div className="info-input-group">
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  className="info-input-field"
                  value={data.personalInfo.linkedin}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personalInfo: { ...data.personalInfo, linkedin: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Main Action Bar: Generate Portfolio ─────────────── */}
      <div className="resume-action-bar">
        <div className="action-bar-text">
          <h3>Ready to build your live portfolio?</h3>
          <p>
            Generate a full responsive portfolio pre-populated with this parsed resume data in one click.
          </p>
        </div>

        <button
          type="button"
          className="btn-generate-portfolio"
          onClick={handleGeneratePortfolio}
          disabled={isGeneratingPortfolio}
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
                    <span className="badge-active-parsed">Parsed & Active</span>
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

