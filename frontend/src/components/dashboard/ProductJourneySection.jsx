import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import "./ProductJourneySection.css";

const renderStepIcon = (key) => {
  switch (key) {
    case "profile":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "resume":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "ai_analysis":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>
      );
    case "portfolio":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "theme":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
        </svg>
      );
    case "publish":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "custom_url":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "pdf_export":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
};

export const ProductJourneySection = ({
  journey = [],
  onCreatePortfolio,
}) => {
  const navigate = useNavigate();
  const [showExplanation, setShowExplanation] = useState(false);

  if (!journey || journey.length === 0) return null;

  const handleStepClick = (step) => {
    if (step.status === "coming_soon") return;

    if (step.key === "portfolio" && step.route?.includes("action=create-portfolio")) {
      if (onCreatePortfolio) onCreatePortfolio();
      return;
    }

    if (step.route) {
      navigate(step.route);
    }
  };

  return (
    <section className="product-journey-section-root" aria-label="Candidate Portfolio Journey">
      <div className="journey-section-header">
        <div className="journey-title-group">
          <h2>Your Portfolio Journey</h2>
          <p>Step-by-step progress from candidate profile setup to live published website.</p>
        </div>

        <button
          type="button"
          className="btn-journey-info-toggle"
          onClick={() => setShowExplanation((prev) => !prev)}
          aria-expanded={showExplanation}
          aria-controls="journey-explanation-box"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{showExplanation ? "Hide details" : "How is progress measured?"}</span>
        </button>
      </div>

      {showExplanation && (
        <div id="journey-explanation-box" className="journey-explanation-card" role="region" aria-label="Journey progress measurement rules">
          <strong>Progress Thresholds:</strong>
          <ul>
            <li>
              <strong>Profile:</strong> Marked complete when your candidate profile strength reaches <strong>50% or higher</strong> (name, bio, contact details, headline).
            </li>
            <li>
              <strong>Portfolio:</strong> Marked complete once your first portfolio project is created.
            </li>
            <li>
              <strong>Theme:</strong> Marked complete when you apply a customized theme configuration in Theme Studio.
            </li>
            <li>
              <strong>Publish:</strong> Marked complete when any of your portfolios is deployed to status <code>PUBLISHED</code>.
            </li>
            <li>
              <strong>Resume, AI Analysis, Custom URL &amp; PDF Export:</strong> Coming soon in upcoming updates.
            </li>
          </ul>
        </div>
      )}

      {/* Stepper Ordered List */}
      <ol className="journey-stepper-list">
        {journey.map((step, idx) => {
          const isCurrent = step.status === "current";
          const isDone = step.status === "done";
          const isComingSoon = step.status === "coming_soon";
          const isInteractive = !isComingSoon;

          return (
            <li
              key={step.key || idx}
              className={`journey-step-item ${step.status}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div
                className={`step-card-content ${isInteractive ? "interactive" : "disabled"}`}
                onClick={() => isInteractive && handleStepClick(step)}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleStepClick(step);
                  }
                }}
                aria-disabled={isComingSoon ? "true" : undefined}
                title={step.hint}
              >
                <div className="step-indicator-row">
                  <span className="step-number-pill" aria-hidden="true">
                    {idx + 1}
                  </span>
                  <div className="step-status-tag">
                    <StatusBadge status={step.status} />
                  </div>
                </div>

                <div className="step-main-info">
                  <div className="step-icon-badge" aria-hidden="true">
                    {renderStepIcon(step.key)}
                  </div>
                  <div className="step-label-group">
                    <h3 className="step-label-title">{step.label}</h3>
                    <p className="step-hint-text">{step.hint}</p>
                  </div>
                </div>

                {isInteractive && (
                  <div className="step-cta-hint">
                    <span>{isDone ? "Review →" : isCurrent ? "Next up →" : "To do"}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ProductJourneySection;


