import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import "./ProductJourneySection.css";

const STEP_ICONS = {
  profile: "👤",
  resume: "📄",
  ai_analysis: "✨",
  portfolio: "💻",
  theme: "🎨",
  publish: "🚀",
  custom_url: "🌐",
  pdf_export: "📥",
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
          <span>ℹ️ {showExplanation ? "Hide Details" : "How is progress measured?"}</span>
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
              <strong>Resume, AI Analysis, Custom URL & PDF Export:</strong> Scheduled for Round 2 and labeled "Coming soon".
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
          const stepIcon = STEP_ICONS[step.key] || "•";

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
                    {stepIcon}
                  </div>
                  <div className="step-label-group">
                    <h3 className="step-label-title">{step.label}</h3>
                    <p className="step-hint-text">{step.hint}</p>
                  </div>
                </div>

                {isInteractive && (
                  <div className="step-cta-hint">
                    <span>{isDone ? "Review →" : isCurrent ? "Action Required →" : "Next →"}</span>
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

