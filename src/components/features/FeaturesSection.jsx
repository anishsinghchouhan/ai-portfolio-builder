import React from "react";
import FeatureCard from "./FeatureCard";
import "./FeaturesSection.css";

export const FeaturesSection = () => {
  const featuresList = [
    {
      id: "ai-parser",
      targetHash: "#ai-resume-parser",
      title: "AI Resume Analysis",
      tag: "Smart NLP",
      description: "Upload PDF or Word resumes. Our generative AI parses your experience, skills, and projects into structured JSON with 99.8% precision.",
      icon: (
        <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: "portfolio-generator",
      targetHash: "#portfolio-builder",
      title: "Portfolio Generator",
      tag: "Instant Gen",
      description: "Automatically construct responsive, multi-page portfolio websites tailored to your exact role, industry, and candidate seniority.",
      icon: (
        <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: "drag-drop-editor",
      targetHash: "#section-editor",
      title: "Drag & Drop Editor",
      tag: "Visual Builder",
      description: "Reorder section blocks, customize typography, tweak color palettes, and preview layout changes in real-time with zero code required.",
      icon: (
        <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "theme-studio",
      targetHash: "#theme-studio",
      title: "Multiple Themes",
      tag: "30+ Presets",
      description: "Choose from 30+ Framer & Vercel inspired aesthetic templates engineered specifically for software engineers, designers, and managers.",
      icon: (
        <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a7 7 0 1 0 10 10" />
        </svg>
      ),
    },
    {
      id: "analytics",
      targetHash: "#recruiter-analytics",
      title: "Candidate Analytics",
      tag: "Real-Time Stats",
      description: "Track recruiter views, project clicks, resume downloads, and visitor traffic source with real-time privacy-first analytics.",
      icon: (
        <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: "custom-domains",
      targetHash: "#custom-domains",
      title: "One Click Publish",
      tag: "Global Edge",
      description: "Deploy instantly to edge CDN servers with free SSL certificates, automated SEO optimization, and custom domain configuration.",
      icon: (
        <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-bg-glow-1" />
      <div className="features-bg-glow-2" />

      <div className="features-container">
        {/* Header */}
        <div className="features-header">
          <div className="features-badge">
            <span>✨ POWERFUL CAPABILITIES</span>
          </div>
          <h2 className="features-title">
            Everything You Need to Build a <br />
            <span className="features-title-gradient">Standout AI Portfolio</span>
          </h2>
          <p className="features-subtitle">
            Transform static resumes into interactive, high-converting portfolio websites powered by generative AI and real-time candidate analytics.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="features-grid">
          {featuresList.map((item) => (
            <FeatureCard
              key={item.id}
              id={item.id}
              targetHash={item.targetHash}
              icon={item.icon}
              tag={item.tag}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
