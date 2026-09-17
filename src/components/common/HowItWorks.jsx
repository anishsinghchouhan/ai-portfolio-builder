import React from "react";
import "./HowItWorks.css";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Drop your existing PDF or Word resume. Our parser reads your work experience, skills, and projects instantly.",
      icon: (
        <svg className="step-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI extracts key metrics, formats project highlights, and structures your candidate profile into clean web sections.",
      icon: (
        <svg className="step-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Customize Portfolio",
      description: "Pick from 30+ Vercel & Framer inspired themes, reorder section blocks, tweak accent colors, and add live project links.",
      icon: (
        <svg className="step-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a7 7 0 1 0 10 10" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Publish Website",
      description: "Deploy with a single click to edge servers. Connect your custom domain with free SSL and start receiving recruiter views.",
      icon: (
        <svg className="step-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-bg-glow" />

      <div className="how-it-works-container">
        {/* Header */}
        <div className="how-header">
          <div className="how-badge">
            <span>✨ SIMPLE 4-STEP PROCESS</span>
          </div>
          <h2 className="how-title">
            From PDF Resume to <br />
            <span className="how-title-gradient">Live Portfolio</span> in Minutes
          </h2>
          <p className="how-subtitle">
            No coding or complex web setup required. Our generative AI engine handles parsing, layout structure, theme styling, and global edge hosting.
          </p>
        </div>

        {/* Horizontal Timeline Container */}
        <div className="timeline-wrapper">
          {/* Connection Line Across Steps */}
          <div className="timeline-connect-line" />

          {/* 4 Step Nodes */}
          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-icon-badge-wrapper">
                  <span className="step-number-tag">{step.number}</span>
                  <div className="step-icon-box">{step.icon}</div>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
