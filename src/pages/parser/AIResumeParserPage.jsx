import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import "./AIResumeParserPage.css";

// ─── Initial Pre-populated AI Extracted Data ──────────────────────────────
const INITIAL_EXTRACTED_DATA = {
  personalInfo: {
    fullName: "Anish Singh",
    title: "Senior Frontend & AI Engineer",
    email: "anish.singh@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    website: "https://anishsingh.dev",
    linkedin: "linkedin.com/in/anishsingh",
    github: "github.com/anishsingh0477",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    confidence: "high",
  },
  summary:
    "Passionate Frontend Engineer with 5+ years of experience building modern, responsive, and high-performance web applications using React, TypeScript, and Vite. Specialized in AI integration, modern CSS design systems, and glassmorphism UIs.",
  experiences: [
    {
      id: "exp-1",
      position: "Senior Frontend Engineer",
      company: "Vercel Partner Labs",
      location: "San Francisco, CA",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      description: "Led frontend architecture for Next.js and React 19 analytics dashboard used by 40,000+ developers. Improved LCP load speeds by 42%.",
      confidence: "high",
    },
    {
      id: "exp-2",
      position: "Frontend Developer Intern",
      company: "ABC Technologies",
      location: "San Jose, CA",
      startDate: "Jan 2022",
      endDate: "Dec 2023",
      current: false,
      description: "Developed component library using React, Vanilla CSS design tokens, and REST APIs. Integrated automated CI/CD deployment pipelines.",
      confidence: "high",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: "2019",
      endYear: "2023",
      grade: "3.85 / 4.0 GPA",
      location: "Berkeley, CA",
      confidence: "high",
    },
  ],
  skills: [
    { id: "sk-1", name: "React 19", category: "Frontend", confidence: "high" },
    { id: "sk-2", name: "JavaScript (ES6+)", category: "Frontend", confidence: "high" },
    { id: "sk-3", name: "TypeScript", category: "Frontend", confidence: "high" },
    { id: "sk-4", name: "HTML5 / Semantic UI", category: "Frontend", confidence: "high" },
    { id: "sk-5", name: "Vanilla CSS & Tokens", category: "Frontend", confidence: "high" },
    { id: "sk-6", name: "Vite / Webpack", category: "Tools", confidence: "high" },
    { id: "sk-7", name: "Node.js & Express", category: "Backend", confidence: "review" },
    { id: "sk-8", name: "Supabase & PostgreSQL", category: "Backend", confidence: "review" },
    { id: "sk-9", name: "REST APIs & GraphQL", category: "Backend", confidence: "high" },
    { id: "sk-10", name: "Git & GitHub Actions", category: "Tools", confidence: "high" },
    { id: "sk-11", name: "Responsive Design", category: "Frontend", confidence: "high" },
    { id: "sk-12", name: "AI Agent Orchestration", category: "Tools", confidence: "review" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI Portfolio Builder",
      description: "Automated 1-click resume-to-website generator built with React 19, Supabase Auth, and custom glassmorphism design system.",
      techs: ["React 19", "Vite", "Supabase", "Vanilla CSS"],
      projectUrl: "https://portfolio.ai-demo.dev",
      githubUrl: "https://github.com/anishsingh0477/ai-portfolio",
      confidence: "high",
    },
    {
      id: "proj-2",
      name: "Appointment Booking Platform",
      description: "Full-stack client scheduling app with real-time availability sync, automated email notifications, and Stripe payment integration.",
      techs: ["React", "JavaScript", "REST API", "Express"],
      projectUrl: "https://booking-demo.dev",
      githubUrl: "https://github.com/anishsingh0477/appointment-booking",
      confidence: "high",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      issueDate: "Mar 2024",
      credentialUrl: "https://aws.amazon.com/verification",
      confidence: "high",
    },
    {
      id: "cert-2",
      name: "Meta Front-End Developer Professional",
      organization: "Coursera / Meta",
      issueDate: "Nov 2023",
      credentialUrl: "https://coursera.org/verify/meta-frontend",
      confidence: "high",
    },
    {
      id: "cert-3",
      name: "Supabase Certified Database Developer",
      organization: "Supabase Academy",
      issueDate: "Jan 2025",
      credentialUrl: "https://supabase.com/verify",
      confidence: "high",
    },
  ],
};

export const AIResumeParserPage = ({ onNavigate }) => {
  // ─── STAGE STATE: 'upload' | 'uploading' | 'processing' | 'parsed_success' | 'review' | 'confirmed' | 'error'
  const [stage, setStage] = useState("upload");

  // ─── FILE UPLOAD STATE
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorState, setErrorState] = useState(null); // null | 'format' | 'size' | 'upload' | 'parse'

  // ─── AI PROCESSING STAGE STATE
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const processingTimerRef = useRef(null);

  // ─── REVIEW WORKSPACE STATE
  const [activeSection, setActiveSection] = useState("personal");
  const [data, setData] = useState(INITIAL_EXTRACTED_DATA);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("All");
  const [newSkillName, setNewSkillName] = useState("");
  const [aiRegenerating, setAiRegenerating] = useState(false);

  // File input ref
  const fileInputRef = useRef(null);

  // Nav helper
  const navigateTo = (view) => {
    if (onNavigate) onNavigate(view);
    else window.location.hash = view;
  };

  // ─── 1. FILE SELECTION & UPLOAD SIMULATION ──────────────────────────────
  const handleFileSelected = (file) => {
    setErrorState(null);

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorState("size");
      return;
    }

    // Validate format (.pdf, .doc, .docx)
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isExtensionValid = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrorState("format");
      return;
    }

    const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    setSelectedFile({ name: file.name, size: formattedSize, raw: file });

    // Transition to uploading state
    setStage("uploading");
    setUploadProgress(15);
  };

  // Upload Progress Effect
  useEffect(() => {
    let timer;
    if (stage === "uploading") {
      timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Transition automatically to AI processing stage
            setTimeout(() => startAIProcessing(), 400);
            return 100;
          }
          return prev + 25;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [stage]);

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Simulate LinkedIn Import
  const handleLinkedInImport = () => {
    setErrorState(null);
    setSelectedFile({ name: "linkedin-profile-import.pdf", size: "1.8 MB" });
    setStage("uploading");
    setUploadProgress(20);
  };

  // ─── 2. AI PROCESSING SIMULATION ──────────────────────────────────────
  const startAIProcessing = () => {
    setStage("processing");
    setProcessingProgress(0);
    setProcessingStepIndex(0);

    const stepsCount = 6;
    let currentStep = 0;

    processingTimerRef.current = setInterval(() => {
      currentStep += 1;
      setProcessingStepIndex(currentStep);
      setProcessingProgress(Math.min(Math.round((currentStep / stepsCount) * 100), 100));

      if (currentStep >= stepsCount) {
        clearInterval(processingTimerRef.current);
        setTimeout(() => {
          setStage("parsed_success");
        }, 600);
      }
    }, 750);
  };

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearInterval(processingTimerRef.current);
    };
  }, []);

  // ─── 3. FORM EDIT HANDLERS ─────────────────────────────────────────────
  const markChanged = () => setHasUnsavedChanges(true);

  const handlePersonalInfoChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
    markChanged();
  };

  const handleSummaryChange = (val) => {
    setData((prev) => ({ ...prev, summary: val }));
    markChanged();
  };

  // AI Summary Regenerate Simulation
  const handleRegenerateSummary = () => {
    setAiRegenerating(true);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        summary:
          "Results-driven Senior Frontend Engineer with expert proficiency in React 19, TypeScript, and modern CSS design systems. Proven track record of scaling high-performance web applications, optimizing Core Web Vitals, and integrating autonomous AI capabilities.",
      }));
      setAiRegenerating(false);
      markChanged();
    }, 1200);
  };

  // Experience Handlers
  const handleExperienceChange = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
    markChanged();
  };

  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      position: "Full Stack Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "2023",
      endDate: "2024",
      current: false,
      description: "Designed responsive UI components and integrated REST API endpoints.",
      confidence: "high",
    };
    setData((prev) => ({ ...prev, experiences: [...prev.experiences, newExp] }));
    markChanged();
  };

  const handleDeleteExperience = (id) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
    markChanged();
  };

  // Education Handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: "Stanford Online / Tech Institute",
      degree: "Professional Certification",
      fieldOfStudy: "Software Architecture",
      startYear: "2023",
      endYear: "2024",
      grade: "Pass",
      location: "Online",
      confidence: "high",
    };
    setData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
    markChanged();
  };

  const handleDeleteEducation = (id) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
    markChanged();
  };

  // Skills Handlers
  const handleRemoveSkill = (id) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((sk) => sk.id !== id),
    }));
    markChanged();
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSk = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: skillCategoryFilter === "All" ? "Frontend" : skillCategoryFilter,
      confidence: "high",
    };
    setData((prev) => ({ ...prev, skills: [...prev.skills, newSk] }));
    setNewSkillName("");
    markChanged();
  };

  // Project Handlers
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: "Realtime Analytics Dashboard",
      description: "Recruiter metrics dashboard featuring interactive visual charts and heatmaps.",
      techs: ["React", "TypeScript", "TailwindCSS"],
      projectUrl: "https://demo-analytics.dev",
      githubUrl: "https://github.com/anishsingh0477/analytics-dashboard",
      confidence: "high",
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
    markChanged();
  };

  const handleDeleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    markChanged();
  };

  // Certification Handlers
  const handleAddCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: "Certified React Developer",
      organization: "JS Guild",
      issueDate: "2024",
      credentialUrl: "https://jsguild.com/cert",
      confidence: "high",
    };
    setData((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
    markChanged();
  };

  const handleDeleteCertification = (id) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
    markChanged();
  };

  // Save / Discard Changes
  const handleSaveChanges = () => {
    setHasUnsavedChanges(false);
  };
  const handleDiscardChanges = () => {
    setData(INITIAL_EXTRACTED_DATA);
    setHasUnsavedChanges(false);
  };

  // Reset to Upload Stage
  const handleResetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setStage("upload");
    setErrorState(null);
    setHasUnsavedChanges(false);
  };

  // Filter skills by category
  const filteredSkills =
    skillCategoryFilter === "All"
      ? data.skills
      : data.skills.filter((sk) => sk.category === skillCategoryFilter);

  // ─── RENDER METHOD ──────────────────────────────────────────────────────
  return (
    <div className="parser-page-root">
      {/* Background Subtle Mesh */}
      <div className="parser-bg-mesh" />

      {/* Standard Application Navbar */}
      <Navbar onNavigateLogin={() => navigateTo("login")} onNavigateSignup={() => navigateTo("signup")} />

      {/* Main Container Workspace */}
      <main className="parser-main-content">
        {/* ─── 3. BREADCRUMB ────────────────────────────────────────── */}
        <nav className="parser-breadcrumb" aria-label="Breadcrumb">
          <a href="/#" onClick={(e) => { e.preventDefault(); navigateTo(""); }}>
            Home
          </a>
          <span className="crumb-separator">/</span>
          <span className="crumb-active">AI Resume Parser</span>
        </nav>

        {/* ─── 4. PAGE HEADER ───────────────────────────────────────── */}
        <header className="parser-page-header">
          <div className="header-badge">
            <span className="badge-sparkle">✨</span>
            <span>AI Resume Parser</span>
          </div>

          <h1 className="header-title">Turn Your Resume Into Structured Portfolio Data</h1>

          <p className="header-subtitle">
            Upload your resume and let AI extract your experience, education, skills, projects, and professional information automatically.
          </p>

          <div className="header-trust-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Your resume remains private and secure. Encrypted SSL parsing.</span>
          </div>
        </header>

        {/* ─── 5. PROGRESS STEPPER ──────────────────────────────────── */}
        <div className="parser-stepper-container">
          <div className="stepper-track">
            {/* Step 1: Upload */}
            <div className={`step-item ${stage === "upload" || stage === "uploading" ? "active" : stage !== "upload" ? "completed" : ""}`}>
              <div className="step-badge">
                {stage !== "upload" && stage !== "uploading" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              <span className="step-label">Upload Resume</span>
            </div>

            <div className={`step-connector ${stage !== "upload" && stage !== "uploading" ? "filled" : ""}`} />

            {/* Step 2: AI Processing */}
            <div className={`step-item ${stage === "processing" || stage === "parsed_success" ? "active" : stage === "review" || stage === "confirmed" ? "completed" : "muted"}`}>
              <div className="step-badge">
                {stage === "review" || stage === "confirmed" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  "2"
                )}
              </div>
              <span className="step-label">AI Processing</span>
            </div>

            <div className={`step-connector ${stage === "review" || stage === "confirmed" ? "filled" : ""}`} />

            {/* Step 3: Review Information */}
            <div className={`step-item ${stage === "review" ? "active" : stage === "confirmed" ? "completed" : "muted"}`}>
              <div className="step-badge">
                {stage === "confirmed" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  "3"
                )}
              </div>
              <span className="step-label">Review Information</span>
            </div>

            <div className={`step-connector ${stage === "confirmed" ? "filled" : ""}`} />

            {/* Step 4: Confirm */}
            <div className={`step-item ${stage === "confirmed" ? "active completed" : "muted"}`}>
              <div className="step-badge">
                {stage === "confirmed" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  "4"
                )}
              </div>
              <span className="step-label">Confirm & Deploy</span>
            </div>
          </div>
        </div>

        {/* ─── STAGE 1: UPLOAD CARD ─────────────────────────────────── */}
        {(stage === "upload" || stage === "uploading") && (
          <div className="upload-stage-wrapper">
            {/* Error Banner States (if any) */}
            {errorState && (
              <div className="parser-error-banner">
                <div className="error-banner-icon">⚠️</div>
                <div className="error-banner-info">
                  {errorState === "format" && (
                    <>
                      <h4>Unsupported File Format</h4>
                      <p>This file format isn't supported. Please upload a PDF, DOC, or DOCX document.</p>
                    </>
                  )}
                  {errorState === "size" && (
                    <>
                      <h4>File Too Large</h4>
                      <p>Your resume exceeds the maximum 10MB file size limit.</p>
                    </>
                  )}
                  {errorState === "upload" && (
                    <>
                      <h4>Upload Failed</h4>
                      <p>We couldn't upload your resume. Please check your file and try again.</p>
                    </>
                  )}
                </div>
                <button className="btn-error-retry" onClick={() => setErrorState(null)}>
                  Choose Another File
                </button>
              </div>
            )}

            <div className="upload-card">
              <div className="upload-header">
                <h2>Upload your resume</h2>
                <p>Upload your existing resume and we'll extract your professional information.</p>
              </div>

              {/* Drag & Drop Dropzone */}
              {stage === "upload" && (
                <>
                  <div
                    className={`dropzone-box ${isDragActive ? "drag-active" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={(e) => e.target.files && e.target.files[0] && handleFileSelected(e.target.files[0])}
                    />

                    <div className="dropzone-icon-circle">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>

                    <h3 className="dropzone-title">Drag & drop your resume here</h3>
                    <p className="dropzone-or-text">or</p>

                    <button
                      type="button"
                      className="btn-browse-files"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                    >
                      Browse Files
                    </button>

                    <span className="dropzone-formats">PDF, DOC, DOCX • Maximum 10MB</span>
                  </div>

                  <div className="upload-divider">
                    <span>OR IMPORT PROFILE</span>
                  </div>

                  {/* LinkedIn Import Option */}
                  <button className="btn-linkedin-import" onClick={handleLinkedInImport}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>Import from LinkedIn Profile</span>
                  </button>
                </>
              )}

              {/* ─── 8. UPLOAD PROGRESS STATE ──────────────────────────────── */}
              {stage === "uploading" && selectedFile && (
                <div className="upload-progress-box">
                  <div className="progress-file-info">
                    <div className="file-icon-lead">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="file-details">
                      <span className="file-name">{selectedFile.name}</span>
                      <span className="file-size">{selectedFile.size}</span>
                    </div>
                    <button className="btn-cancel-upload" onClick={handleResetUpload}>
                      Cancel Upload
                    </button>
                  </div>

                  <div className="progress-bar-label">
                    <span>Uploading resume...</span>
                    <strong>{uploadProgress}%</strong>
                  </div>

                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── STAGE 2: AI PROCESSING STATE ────────────────────────────── */}
        {stage === "processing" && (
          <div className="processing-card">
            <div className="ai-pulse-circle">
              <div className="pulse-ring-1" />
              <div className="pulse-ring-2" />
              <div className="pulse-icon">✨</div>
            </div>

            <h2 className="processing-title">AI is analyzing your resume</h2>
            <p className="processing-subtitle">We're identifying your experience, education, skills and projects.</p>

            {/* Checklist items */}
            <div className="processing-checklist">
              <div className={`checklist-item ${processingStepIndex >= 1 ? "done" : ""}`}>
                <span className="check-icon">{processingStepIndex >= 1 ? "✓" : "○"}</span>
                <span>Reading resume</span>
              </div>
              <div className={`checklist-item ${processingStepIndex >= 2 ? "done" : ""}`}>
                <span className="check-icon">{processingStepIndex >= 2 ? "✓" : "○"}</span>
                <span>Detecting personal information</span>
              </div>
              <div className={`checklist-item ${processingStepIndex === 3 ? "active" : processingStepIndex > 3 ? "done" : ""}`}>
                <span className="check-icon">{processingStepIndex > 3 ? "✓" : processingStepIndex === 3 ? "●" : "○"}</span>
                <span>Extracting work experience</span>
              </div>
              <div className={`checklist-item ${processingStepIndex === 4 ? "active" : processingStepIndex > 4 ? "done" : ""}`}>
                <span className="check-icon">{processingStepIndex > 4 ? "✓" : processingStepIndex === 4 ? "●" : "○"}</span>
                <span>Identifying skills</span>
              </div>
              <div className={`checklist-item ${processingStepIndex === 5 ? "active" : processingStepIndex > 5 ? "done" : ""}`}>
                <span className="check-icon">{processingStepIndex > 5 ? "✓" : processingStepIndex === 5 ? "●" : "○"}</span>
                <span>Detecting projects</span>
              </div>
              <div className={`checklist-item ${processingStepIndex >= 6 ? "done" : ""}`}>
                <span className="check-icon">{processingStepIndex >= 6 ? "✓" : "○"}</span>
                <span>Structuring portfolio data</span>
              </div>
            </div>

            <div className="overall-progress-box">
              <div className="progress-bar-label">
                <span>Analyzing Resume</span>
                <strong>{processingProgress}%</strong>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${processingProgress}%` }} />
              </div>
              <span className="microcopy-note">This usually takes a few seconds.</span>
            </div>
          </div>
        )}

        {/* ─── STAGE 3: PARSED SUCCESS INTERMEDIARY ─────────────────────── */}
        {stage === "parsed_success" && (
          <div className="success-intermediary-card">
            <div className="success-icon-badge">✅</div>
            <h2>Resume parsed successfully!</h2>
            <p>We found your professional information. Review it before creating your portfolio.</p>

            <div className="extracted-counters-grid">
              <div className="counter-card">
                <span className="counter-icon">👤</span>
                <span className="counter-num">1</span>
                <span className="counter-label">Personal Info</span>
              </div>
              <div className="counter-card">
                <span className="counter-icon">💼</span>
                <span className="counter-num">{data.experiences.length}</span>
                <span className="counter-label">Experiences</span>
              </div>
              <div className="counter-card">
                <span className="counter-icon">🎓</span>
                <span className="counter-num">{data.education.length}</span>
                <span className="counter-label">Education</span>
              </div>
              <div className="counter-card">
                <span className="counter-icon">⚡</span>
                <span className="counter-num">{data.skills.length}</span>
                <span className="counter-label">Skills</span>
              </div>
              <div className="counter-card">
                <span className="counter-icon">🚀</span>
                <span className="counter-num">{data.projects.length}</span>
                <span className="counter-label">Projects</span>
              </div>
              <div className="counter-card">
                <span className="counter-icon">📜</span>
                <span className="counter-num">{data.certifications.length}</span>
                <span className="counter-label">Certifications</span>
              </div>
            </div>

            <button className="btn-review-data" onClick={() => setStage("review")}>
              <span>Review Extracted Data</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}

        {/* ─── STAGE 4: REVIEW & EDIT WORKSPACE ─────────────────────────── */}
        {stage === "review" && (
          <div className="review-workspace-grid">
            {/* Top Tools Action Bar */}
            <div className="review-tools-bar">
              <div className="tools-left">
                <span className="review-badge-live">LIVE REVIEW</span>
                <span className="tools-text">Review and fine-tune your portfolio data.</span>
              </div>
              <div className="tools-right">
                <button
                  className="btn-view-original-resume"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>View Original Resume</span>
                </button>
              </div>
            </div>

            {/* 11. LEFT SIDEBAR NAVIGATION */}
            <aside className="review-sidebar">
              <div className="sidebar-header">
                <h3>Resume Data</h3>
                <span className="completion-pill">7 / 7 Complete</span>
              </div>

              <nav className="sidebar-nav-list">
                <button
                  className={`sidebar-nav-item ${activeSection === "personal" ? "active" : ""}`}
                  onClick={() => setActiveSection("personal")}
                >
                  <span className="nav-icon">👤</span>
                  <span className="nav-label">Personal Information</span>
                  <span className="nav-status-check">✓</span>
                </button>

                <button
                  className={`sidebar-nav-item ${activeSection === "summary" ? "active" : ""}`}
                  onClick={() => setActiveSection("summary")}
                >
                  <span className="nav-icon">✍️</span>
                  <span className="nav-label">Professional Summary</span>
                  <span className="nav-status-check">✓</span>
                </button>

                <button
                  className={`sidebar-nav-item ${activeSection === "experience" ? "active" : ""}`}
                  onClick={() => setActiveSection("experience")}
                >
                  <span className="nav-icon">💼</span>
                  <span className="nav-label">Experience</span>
                  <span className="nav-status-check">✓</span>
                </button>

                <button
                  className={`sidebar-nav-item ${activeSection === "education" ? "active" : ""}`}
                  onClick={() => setActiveSection("education")}
                >
                  <span className="nav-icon">🎓</span>
                  <span className="nav-label">Education</span>
                  <span className="nav-status-check">✓</span>
                </button>

                <button
                  className={`sidebar-nav-item ${activeSection === "skills" ? "active" : ""}`}
                  onClick={() => setActiveSection("skills")}
                >
                  <span className="nav-icon">⚡</span>
                  <span className="nav-label">Skills</span>
                  {/* 19. AI Confidence Warning Badge */}
                  <span className="nav-status-warn" title="AI confidence requires verification">⚠️</span>
                </button>

                <button
                  className={`sidebar-nav-item ${activeSection === "projects" ? "active" : ""}`}
                  onClick={() => setActiveSection("projects")}
                >
                  <span className="nav-icon">🚀</span>
                  <span className="nav-label">Projects</span>
                  <span className="nav-status-check">✓</span>
                </button>

                <button
                  className={`sidebar-nav-item ${activeSection === "certifications" ? "active" : ""}`}
                  onClick={() => setActiveSection("certifications")}
                >
                  <span className="nav-icon">📜</span>
                  <span className="nav-label">Certifications</span>
                  <span className="nav-status-check">✓</span>
                </button>
              </nav>
            </aside>

            {/* RIGHT CONTENT AREA FOR EDITING SECTIONS */}
            <div className="review-content-area">
              {/* ─── 12. PERSONAL INFORMATION SECTION ────────────────── */}
              {activeSection === "personal" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Personal Information</h2>
                      <p>Your primary contact details for recruiters.</p>
                    </div>
                    <span className="badge-ai-extracted">✨ AI Extracted</span>
                  </div>

                  <div className="form-grid-two-col">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.fullName}
                        onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Professional Title</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.title}
                        onChange={(e) => handlePersonalInfoChange("title", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="editor-input"
                        value={data.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.location}
                        onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Website / Portfolio URL</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.website}
                        onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">LinkedIn Profile</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">GitHub Profile</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={data.personalInfo.github}
                        onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 13. PROFESSIONAL SUMMARY ────────────────────────── */}
              {activeSection === "summary" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Professional Summary</h2>
                      <p>High-level elevator pitch highlighting your core experience.</p>
                    </div>
                    <button
                      type="button"
                      className="btn-ai-regenerate"
                      onClick={handleRegenerateSummary}
                      disabled={aiRegenerating}
                    >
                      {aiRegenerating ? "✨ AI Regenerating..." : "✨ Regenerate with AI"}
                    </button>
                  </div>

                  <div className="form-group">
                    <textarea
                      className="editor-textarea"
                      rows={6}
                      value={data.summary}
                      onChange={(e) => handleSummaryChange(e.target.value)}
                    />
                    <div className="textarea-footer">
                      <span className="ai-confidence-indicator high">High AI Confidence</span>
                      <span className="char-counter">{data.summary.length} / 600</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 14. EXPERIENCE SECTION ──────────────────────────── */}
              {activeSection === "experience" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Work Experience ({data.experiences.length})</h2>
                      <p>Detailed employment history extracted from your resume.</p>
                    </div>
                    <button className="btn-add-item" onClick={handleAddExperience}>
                      + Add Experience
                    </button>
                  </div>

                  {data.experiences.length === 0 ? (
                    /* 25. EMPTY DATA STATE */
                    <div className="empty-section-box">
                      <span className="empty-icon">💼</span>
                      <h4>No work experiences found</h4>
                      <p>We couldn't identify any work experiences in your resume.</p>
                      <button className="btn-add-item" onClick={handleAddExperience}>
                        + Add Experience Manually
                      </button>
                    </div>
                  ) : (
                    <div className="cards-stack">
                      {data.experiences.map((exp, index) => (
                        <div key={exp.id} className="item-edit-card">
                          <div className="item-card-top">
                            <div className="drag-handle" title="Drag to reorder">⋮⋮</div>
                            <h3 className="item-title">{exp.position || "Position Title"}</h3>
                            <div className="item-actions">
                              <button className="btn-card-delete" onClick={() => handleDeleteExperience(exp.id)}>
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="form-grid-two-col">
                            <div className="form-group">
                              <label className="form-label">Position / Role</label>
                              <input
                                type="text"
                                className="editor-input"
                                value={exp.position}
                                onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Company Name</label>
                              <input
                                type="text"
                                className="editor-input"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Start Date</label>
                              <input
                                type="text"
                                className="editor-input"
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">End Date</label>
                              <input
                                type="text"
                                className="editor-input"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="checkbox-form-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => handleExperienceChange(exp.id, "current", e.target.checked)}
                              />
                              <span>I currently work in this role</span>
                            </label>
                          </div>

                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label className="form-label">Key Responsibilities & Achievements</label>
                            <textarea
                              className="editor-textarea"
                              rows={3}
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── 15. EDUCATION SECTION ──────────────────────────── */}
              {activeSection === "education" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Education ({data.education.length})</h2>
                      <p>Academic degrees, universities, and qualifications.</p>
                    </div>
                    <button className="btn-add-item" onClick={handleAddEducation}>
                      + Add Education
                    </button>
                  </div>

                  <div className="cards-stack">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="item-edit-card">
                        <div className="item-card-top">
                          <h3 className="item-title">{edu.degree} in {edu.fieldOfStudy}</h3>
                          <button className="btn-card-delete" onClick={() => handleDeleteEducation(edu.id)}>
                            Delete
                          </button>
                        </div>

                        <div className="form-grid-two-col">
                          <div className="form-group">
                            <label className="form-label">Institution / University</label>
                            <input
                              type="text"
                              className="editor-input"
                              value={edu.institution}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((ed) => (ed.id === edu.id ? { ...ed, institution: val } : ed)),
                                }));
                                markChanged();
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Degree</label>
                            <input
                              type="text"
                              className="editor-input"
                              value={edu.degree}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((ed) => (ed.id === edu.id ? { ...ed, degree: val } : ed)),
                                }));
                                markChanged();
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Field of Study</label>
                            <input
                              type="text"
                              className="editor-input"
                              value={edu.fieldOfStudy}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((ed) => (ed.id === edu.id ? { ...ed, fieldOfStudy: val } : ed)),
                                }));
                                markChanged();
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Grade / CGPA</label>
                            <input
                              type="text"
                              className="editor-input"
                              value={edu.grade}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((ed) => (ed.id === edu.id ? { ...ed, grade: val } : ed)),
                                }));
                                markChanged();
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── 16. SKILLS SECTION ───────────────────────────────── */}
              {activeSection === "skills" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Skills & Competencies ({data.skills.length})</h2>
                      <p>Technical abilities, frameworks, and soft skills.</p>
                    </div>
                  </div>

                  {/* 19. AI Confidence UX Warning Notice */}
                  <div className="ai-warning-box">
                    <span className="warn-icon">⚠️</span>
                    <div className="warn-info">
                      <strong>Please verify extracted skills</strong>
                      <p>Some extracted skills require user verification. Confirm or add missing skills below.</p>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="category-filter-bar">
                    {["All", "Frontend", "Backend", "Tools", "Soft Skills"].map((cat) => (
                      <button
                        key={cat}
                        className={`btn-category-chip ${skillCategoryFilter === cat ? "active" : ""}`}
                        onClick={() => setSkillCategoryFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Skills Chips Container */}
                  <div className="skills-chips-wrapper">
                    {filteredSkills.map((sk) => (
                      <div key={sk.id} className={`skill-chip-pill ${sk.confidence === "review" ? "needs-review" : ""}`}>
                        <span className="chip-text">{sk.name}</span>
                        {sk.confidence === "review" && <span className="chip-warn-dot" title="Needs Review">•</span>}
                        <button
                          type="button"
                          className="btn-remove-chip"
                          onClick={() => handleRemoveSkill(sk.id)}
                          aria-label={`Remove ${sk.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Skill Form */}
                  <form className="add-skill-form" onSubmit={handleAddSkill}>
                    <input
                      type="text"
                      className="editor-input"
                      placeholder="Add another skill (e.g. Docker, GraphQL, Figma)..."
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />
                    <button type="submit" className="btn-add-skill-submit">
                      + Add Skill
                    </button>
                  </form>
                </div>
              )}

              {/* ─── 17. PROJECTS SECTION ────────────────────────────── */}
              {activeSection === "projects" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Projects ({data.projects.length})</h2>
                      <p>Featured projects extracted for your portfolio showcase.</p>
                    </div>
                    <button className="btn-add-item" onClick={handleAddProject}>
                      + Add Project
                    </button>
                  </div>

                  <div className="cards-stack">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="item-edit-card">
                        <div className="item-card-top">
                          <h3 className="item-title">{proj.name}</h3>
                          <button className="btn-card-delete" onClick={() => handleDeleteProject(proj.id)}>
                            Delete
                          </button>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Project Name</label>
                          <input
                            type="text"
                            className="editor-input"
                            value={proj.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, name: val } : p)),
                              }));
                              markChanged();
                            }}
                          />
                        </div>

                        <div className="form-group" style={{ marginTop: "12px" }}>
                          <label className="form-label">Description</label>
                          <textarea
                            className="editor-textarea"
                            rows={3}
                            value={proj.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, description: val } : p)),
                              }));
                              markChanged();
                            }}
                          />
                        </div>

                        <div className="tech-tags-list" style={{ marginTop: "12px" }}>
                          {proj.techs.map((t, idx) => (
                            <span key={idx} className="tech-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── 18. CERTIFICATIONS SECTION ──────────────────────── */}
              {activeSection === "certifications" && (
                <div className="section-editor-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Certifications ({data.certifications.length})</h2>
                      <p>Professional credentials and licenses.</p>
                    </div>
                    <button className="btn-add-item" onClick={handleAddCertification}>
                      + Add Certification
                    </button>
                  </div>

                  <div className="cards-stack">
                    {data.certifications.map((cert) => (
                      <div key={cert.id} className="item-edit-card">
                        <div className="item-card-top">
                          <h3 className="item-title">{cert.name}</h3>
                          <button className="btn-card-delete" onClick={() => handleDeleteCertification(cert.id)}>
                            Delete
                          </button>
                        </div>

                        <div className="form-grid-two-col">
                          <div className="form-group">
                            <label className="form-label">Certification Name</label>
                            <input
                              type="text"
                              className="editor-input"
                              value={cert.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, name: val } : c)),
                                }));
                                markChanged();
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Issuing Organization</label>
                            <input
                              type="text"
                              className="editor-input"
                              value={cert.organization}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, organization: val } : c)),
                                }));
                                markChanged();
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── 22. FINAL CONFIRMATION BOTTOM FOOTER ─────────────── */}
              <div className="final-confirmation-bar">
                <div className="confirm-info">
                  <h3>Everything look good?</h3>
                  <p>Confirm your information to continue building your portfolio website.</p>
                </div>
                <div className="confirm-actions">
                  <button className="btn-secondary-link" onClick={handleResetUpload}>
                    ← Upload Different Resume
                  </button>
                  <button className="btn-primary-confirm" onClick={() => setStage("confirmed")}>
                    <span>Confirm & Continue</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 23. CONFIRMATION SUCCESS STAGE ───────────────────────── */}
        {stage === "confirmed" && (
          <div className="confirmed-stage-card">
            <div className="celebration-badge">🚀</div>
            <h2>Your portfolio data is ready!</h2>
            <p>Your resume information has been structured and is ready to generate your interactive portfolio.</p>

            <div className="confirmed-ctas-row">
              <button
                className="btn-primary-confirm"
                onClick={() => navigateTo("templates-marketplace")}
              >
                <span>Choose Portfolio Template</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ─── 20. ORIGINAL RESUME PREVIEW DRAWER ─────────────────────── */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Original Resume Preview</h3>
              <button className="btn-close-drawer" onClick={() => setIsDrawerOpen(false)}>
                ×
              </button>
            </div>

            <div className="drawer-body">
              <div className="pdf-preview-mockup">
                <div className="mockup-doc-header">
                  <strong>{selectedFile ? selectedFile.name : "resume-anish-singh.pdf"}</strong>
                  <span className="page-count">Page 1 of 2</span>
                </div>
                <div className="mockup-pdf-canvas">
                  <div className="pdf-line title-line" />
                  <div className="pdf-line sub-line" />
                  <div className="pdf-block" />
                  <div className="pdf-line" />
                  <div className="pdf-line" />
                  <div className="pdf-block" />
                  <div className="pdf-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 21. STICKY UNSAVED CHANGES BAR ────────────────────────── */}
      {hasUnsavedChanges && stage === "review" && (
        <div className="unsaved-changes-sticky-bar">
          <div className="unsaved-text">
            <span className="unsaved-dot">•</span>
            <span>You have unsaved changes in your extracted data.</span>
          </div>
          <div className="unsaved-buttons">
            <button className="btn-discard" onClick={handleDiscardChanges}>
              Discard
            </button>
            <button className="btn-save" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResumeParserPage;
