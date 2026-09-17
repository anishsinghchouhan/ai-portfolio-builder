import React, { useState } from "react";
import "./OnboardingWizardPage.css";
import { authStore } from "../../store/authSlice";

const CATEGORIES = [
  {
    id: "portfolio",
    title: "Personal & Developer Portfolio",
    description: "Showcase your projects, resume, skills, and get hired by top tech recruiters.",
    icon: "💼",
    popular: true,
  },
  {
    id: "business",
    title: "Business & Startup",
    description: "Promote your company, products, team, and convert visitors into clients.",
    icon: "🚀",
    popular: false,
  },
  {
    id: "creative",
    title: "UI/UX & Creative Agency",
    description: "Visual gallery layout for designers, animators, and creative studios.",
    icon: "🎨",
    popular: false,
  },
  {
    id: "blog",
    title: "Blog & Publication",
    description: "Publish articles, technical tutorials, newsletters, and grow an audience.",
    icon: "✍️",
    popular: false,
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Store",
    description: "Sell digital products, templates, courses, or physical merchandise.",
    icon: "🛍️",
    popular: false,
  },
];

const TEMPLATES = [
  {
    id: "minimal-dark",
    name: "Minimalist Dark",
    description: "Vercel & Linear inspired sleek dark theme with high contrast typography.",
    badge: "Most Popular",
    color: "#6366f1",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism Neo",
    description: "Framer & Apple inspired futuristic translucent glowing panels.",
    badge: "Featured",
    color: "#38bdf8",
  },
  {
    id: "clean-light",
    name: "Clean Light & Crisp",
    description: "Stripe inspired modern light aesthetics for corporate & agency sites.",
    badge: "Clean",
    color: "#10b981",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Developer",
    description: "Terminal & hacker style dark theme with neon code blocks.",
    badge: "Dev Choice",
    color: "#f59e0b",
  },
];

export const OnboardingWizardPage = ({ onCompleteSetup, onNavigate }) => {
  // Step 1 to 4
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Data: Category
  const [selectedCategory, setSelectedCategory] = useState("portfolio");

  // Step 2 Data: Details
  const [websiteName, setWebsiteName] = useState("Anish Singh Portfolio");
  const [tagline, setTagline] = useState("Building high-scale AI web applications and cloud architectures.");
  const [targetAudience, setTargetAudience] = useState("Tech Recruiters & Engineering Managers");
  const [primaryGoal, setPrimaryGoal] = useState("Get Hired / Land Offers");
  const [errors, setErrors] = useState({});

  // Step 3 Data: Template
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-dark");

  const navigateTo = (view) => {
    if (onNavigate) onNavigate(view);
    else window.location.hash = view;
  };

  // Step Validation & Navigation
  const handleNext = () => {
    if (currentStep === 2) {
      const newErr = {};
      if (!websiteName.trim()) newErr.websiteName = "Website Name is required";
      if (!tagline.trim()) newErr.tagline = "Tagline/Description is required";
      if (Object.keys(newErr).length > 0) {
        setErrors(newErr);
        return;
      }
      setErrors({});
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final Submission Handler -> Complete Onboarding and Launch Dashboard
  const handleFinalSubmit = () => {
    // Persist onboarding completion in localStorage & authStore
    localStorage.setItem("ai_portfolio_onboarding_completed", "true");
    
    // Update global state
    authStore.setState({ hasCompletedOnboarding: true });

    if (onCompleteSetup) {
      onCompleteSetup({
        category: selectedCategory,
        websiteName,
        tagline,
        targetAudience,
        primaryGoal,
        template: selectedTemplate,
      });
    } else {
      navigateTo("dashboard");
    }
  };

  const categoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  const templateObj = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="wizard-page-root">
      <div className="wizard-bg-mesh" />

      {/* Header Bar */}
      <header className="wizard-header-nav">
        <div className="wizard-header-container">
          <a href="/#" className="wizard-brand" onClick={(e) => { e.preventDefault(); navigateTo(""); }}>
            <div className="wizard-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="wizard-brand-text">Portfolio.ai</span>
          </a>

          <div className="wizard-step-pill">
            <span>Step {currentStep} of 4</span>
          </div>
        </div>
      </header>

      {/* Main Setup Workspace Card */}
      <main className="wizard-main-container">
        <div className="wizard-card">
          {/* Progress Bar Track */}
          <div className="wizard-progress-track" aria-label={`Progress: Step ${currentStep} of 4`}>
            <div
              className="wizard-progress-fill"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          {/* Stepper Dots Header */}
          <div className="wizard-dots-bar">
            <div className={`dot-item ${currentStep >= 1 ? "active" : ""}`}>
              <div className="dot-circle">{currentStep > 1 ? "✓" : "1"}</div>
              <span className="dot-label">Category</span>
            </div>
            <div className="dot-line" />
            <div className={`dot-item ${currentStep >= 2 ? "active" : ""}`}>
              <div className="dot-circle">{currentStep > 2 ? "✓" : "2"}</div>
              <span className="dot-label">Details</span>
            </div>
            <div className="dot-line" />
            <div className={`dot-item ${currentStep >= 3 ? "active" : ""}`}>
              <div className="dot-circle">{currentStep > 3 ? "✓" : "3"}</div>
              <span className="dot-label">Template</span>
            </div>
            <div className="dot-line" />
            <div className={`dot-item ${currentStep === 4 ? "active" : ""}`}>
              <div className="dot-circle">4</div>
              <span className="dot-label">Summary</span>
            </div>
          </div>

          {/* ─── STEP 1: CHOOSE CATEGORY ───────────────────────────────── */}
          {currentStep === 1 && (
            <div className="wizard-step-content">
              <h1 className="wizard-heading">What kind of website are you building?</h1>
              <p className="wizard-subheading">
                Choose the category that best matches your goals. We'll tailor your design, layout, and content structures automatically.
              </p>

              <div className="categories-grid">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-card ${selectedCategory === cat.id ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.popular && <span className="popular-badge">POPULAR</span>}
                    <div className="category-icon">{cat.icon}</div>
                    <h3 className="category-title">{cat.title}</h3>
                    <p className="category-desc">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 2: ENTER DETAILS ─────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="wizard-step-content">
              <h1 className="wizard-heading">Enter basic website details</h1>
              <p className="wizard-subheading">
                Provide key information about your project or persona so AI can generate tailored metadata and headings.
              </p>

              <div className="form-stack">
                <div className="form-group">
                  <label className="form-label">Website or Portfolio Name *</label>
                  <input
                    type="text"
                    className={`wizard-input ${errors.websiteName ? "error" : ""}`}
                    placeholder="e.g. Anish Singh Portfolio / Apex Studio"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                  {errors.websiteName && <span className="err-msg">{errors.websiteName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline or Brief Description *</label>
                  <textarea
                    className={`wizard-textarea ${errors.tagline ? "error" : ""}`}
                    rows={3}
                    placeholder="e.g. Building high-scale web platforms with React, Node.js, and AI. Passionate about sleek UX."
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                  {errors.tagline && <span className="err-msg">{errors.tagline}</span>}
                </div>

                <div className="form-grid-two">
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select
                      className="wizard-select"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    >
                      <option value="Tech Recruiters & Engineering Managers">Tech Recruiters & Engineering Managers</option>
                      <option value="Enterprise Clients & Founders">Enterprise Clients & Founders</option>
                      <option value="Creative Directors & Agencies">Creative Directors & Agencies</option>
                      <option value="General Public & Readers">General Public & Readers</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Goal</label>
                    <select
                      className="wizard-select"
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                    >
                      <option value="Get Hired / Land Offers">Get Hired / Land Offers</option>
                      <option value="Showcase Projects & Code">Showcase Projects & Code</option>
                      <option value="Book Freelance Clients">Book Freelance Clients</option>
                      <option value="Sell Products / Courses">Sell Products / Courses</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: PICK TEMPLATE ─────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="wizard-step-content">
              <h1 className="wizard-heading">Pick a template or design style</h1>
              <p className="wizard-subheading">
                Choose the visual aesthetic for your website. You can customize colors, typography, and sections anytime later.
              </p>

              <div className="templates-grid">
                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className={`template-style-card ${selectedTemplate === tmpl.id ? "selected" : ""}`}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                  >
                    <div className="template-card-header">
                      <span className="template-badge" style={{ borderColor: tmpl.color, color: tmpl.color }}>
                        {tmpl.badge}
                      </span>
                    </div>

                    <div className="template-preview-box">
                      <div className="mini-header-line" style={{ background: tmpl.color }} />
                      <div className="mini-body-line" />
                      <div className="mini-body-line short" />
                    </div>

                    <h3 className="template-title">{tmpl.name}</h3>
                    <p className="template-desc">{tmpl.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 4: SUMMARY & CONFIRMATION ───────────────────────── */}
          {currentStep === 4 && (
            <div className="wizard-step-content">
              <h1 className="wizard-heading">Review setup summary</h1>
              <p className="wizard-subheading">
                Everything is configured and ready. Confirm your details to launch your website dashboard.
              </p>

              <div className="summary-card">
                <div className="summary-row">
                  <div className="summary-icon">🏷️</div>
                  <div className="summary-info">
                    <span className="summary-label">Selected Category</span>
                    <strong className="summary-val">{categoryObj.title}</strong>
                  </div>
                </div>

                <div className="summary-row">
                  <div className="summary-icon">🌐</div>
                  <div className="summary-info">
                    <span className="summary-label">Website Name</span>
                    <strong className="summary-val">{websiteName}</strong>
                  </div>
                </div>

                <div className="summary-row">
                  <div className="summary-icon">✍️</div>
                  <div className="summary-info">
                    <span className="summary-label">Tagline</span>
                    <p className="summary-val-text">{tagline}</p>
                  </div>
                </div>

                <div className="summary-row">
                  <div className="summary-icon">🎯</div>
                  <div className="summary-info">
                    <span className="summary-label">Target Audience & Goal</span>
                    <strong className="summary-val">{targetAudience} • {primaryGoal}</strong>
                  </div>
                </div>

                <div className="summary-row">
                  <div className="summary-icon">🎨</div>
                  <div className="summary-info">
                    <span className="summary-label">Design Template</span>
                    <strong className="summary-val" style={{ color: templateObj.color }}>
                      {templateObj.name} ({templateObj.badge})
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── ACTION BUTTONS FOOTER ─────────────────────────────────── */}
          <div className="wizard-actions-bar">
            {currentStep > 1 ? (
              <button type="button" className="btn-wizard-back" onClick={handleBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button type="button" className="btn-wizard-next" onClick={handleNext}>
                <span>Next Step</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button type="button" className="btn-wizard-submit" onClick={handleFinalSubmit}>
                <span>Complete Setup & Launch Dashboard</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingWizardPage;
