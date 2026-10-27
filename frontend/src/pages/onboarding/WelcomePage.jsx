import React from "react";
import "./WelcomePage.css";

export const WelcomePage = ({ userName = "Alex", onContinue, onSkip }) => {
  const handleContinue = () => {
    if (onContinue) onContinue();
    else alert("Advancing to Step 2: Upload Resume & Extract Skills...");
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    else window.location.hash = "home";
  };

  return (
    <div className="welcome-page-root">
      {/* Ambient Mesh Glows */}
      <div className="welcome-bg-mesh" />
      <div className="welcome-bg-glow-1" />
      <div className="welcome-bg-glow-2" />

      {/* Main Onboarding Card Container */}
      <div className="welcome-card">
        {/* Header Bar */}
        <div className="welcome-header-bar">
          <a href="#home" className="welcome-brand">
            <div className="welcome-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="welcome-brand-text">Portfolio.ai</span>
          </a>

          <span className="step-indicator-pill">Step 1 of 4</span>
        </div>

        {/* Step 1 Progress Bar Track (25%) */}
        <div className="progress-bar-track" aria-label="Progress: Step 1 of 4">
          <div className="progress-bar-fill" />
        </div>

        {/* Friendly Welcome Illustration Hero */}
        <div className="welcome-illustration-hero">
          {/* Floating Status Card 1 */}
          <div className="float-card-1">
            <div className="float-icon-pill">⚡</div>
            <span>AI Parser Ready</span>
          </div>

          {/* Center Avatar Box */}
          <div className="hero-avatar-box">
            <span className="hero-wave-hand">👋</span>
          </div>

          {/* Floating Status Card 2 */}
          <div className="float-card-2">
            <div className="float-icon-pill">🎨</div>
            <span>30+ Themes Loaded</span>
          </div>
        </div>

        {/* Greeting & Short Platform Intro */}
        <h1 className="welcome-greeting">
          Welcome, <span className="greeting-name-gradient">{userName}</span>! <br />
          Let’s Build Your AI Portfolio
        </h1>

        <p className="welcome-intro-text">
          In just 4 quick steps, we’ll parse your resume, match you with top Vercel & Stripe inspired themes, and launch your live portfolio website.
        </p>

        {/* Action Buttons Row */}
        <div className="welcome-actions-row">
          <button type="button" className="btn-skip-step" onClick={handleSkip}>
            Skip for now
          </button>

          <button type="button" className="btn-continue-step" onClick={handleContinue}>
            <span>Continue Setup</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
