import React from "react";
import { scrollToSection } from "../../utils/scrollUtils";
import "./Hero.css";

export const Hero = () => {
  const handleGetStarted = () => {
    window.location.hash = "#signup";
  };

  const handleExploreTemplates = () => {
    scrollToSection("templates");
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Gradient & Mesh Overlay */}
      <div className="hero-bg-grid" />
      <div className="hero-glow-primary" />
      <div className="hero-glow-secondary" />

      <div className="hero-container">
        {/* Top Badge */}
        <div className="hero-badge">
          <span className="hero-badge-sparkle">✨</span>
          <span>Next-Gen AI Portfolio Engine 2.0</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Turn Your Resume Into a <br />
          <span className="hero-title-gradient">Stunning AI Portfolio</span> in Seconds
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Build your professional candidate portfolio with generative AI. Instantly convert skills, experience, and project highlights into a hosted, responsive web portfolio.
        </p>

        {/* CTA Group */}
        <div className="hero-cta-group">
          {/* Primary CTA: Get Started Free */}
          <button className="hero-btn-primary" onClick={handleGetStarted}>
            <span>Get Started Free</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Secondary CTA: Explore Templates */}
          <button className="hero-btn-secondary" onClick={handleExploreTemplates}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>Explore Templates</span>
          </button>
        </div>

        {/* Trust Proof */}
        <div className="hero-trust-bar">
          <div className="trust-avatars">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" className="avatar-img" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" className="avatar-img" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" className="avatar-img" />
          </div>
          <span>
            <strong className="stars">★★★★★</strong> 4.9/5 Rating by 10,000+ Software Engineers & Designers
          </span>
        </div>

        {/* Interactive Dashboard Mockup & Floating Cards */}
        <div className="dashboard-mockup-wrapper">
          {/* Floating Card 1: AI Resume Parsed */}
          <div className="floating-card floating-card-1">
            <div className="floating-icon-box floating-icon-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="floating-text">
              <h5>AI Parsing Complete</h5>
              <p>99.8% Extraction Accuracy</p>
            </div>
          </div>

          {/* Floating Card 2: Live Visitor Traffic */}
          <div className="floating-card floating-card-2">
            <div className="floating-icon-box floating-icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div className="floating-text">
              <h5>2,410 Recruiter Views</h5>
              <p>+142% Views This Week</p>
            </div>
          </div>

          {/* Floating Card 3: ATS Match Score */}
          <div className="floating-card floating-card-3">
            <div className="floating-icon-box floating-icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="floating-text">
              <h5>ATS Optimization Score</h5>
              <p>98/100 Top Tier Candidate</p>
            </div>
          </div>

          {/* Main Glass Mockup Container */}
          <div className="mockup-frame">
            <div className="mockup-header">
              <div className="window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="mockup-url-bar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>https://portfolio.ai/alex-rivera</span>
              </div>
              <div style={{ width: 40 }} />
            </div>

            <div className="mockup-body">
              {/* Sidebar Panel */}
              <div className="mockup-sidebar">
                <div className="user-profile-widget">
                  <div className="user-avatar">AR</div>
                  <div className="user-info">
                    <h5>Alex Rivera</h5>
                    <span>Senior Full-Stack Engineer</span>
                  </div>
                </div>

                <div className="parse-status-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                  <span>Parsed from Resume.pdf</span>
                </div>

                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted-dark)", display: "block", marginBottom: 6 }}>
                    EXTRACTED SKILLS
                  </span>
                  <div className="skills-pill-list">
                    <span className="skill-tag">React 19</span>
                    <span className="skill-tag">TypeScript</span>
                    <span className="skill-tag">Next.js</span>
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">AI Agents</span>
                    <span className="skill-tag">Tailwind</span>
                  </div>
                </div>
              </div>

              {/* Main Canvas Panel */}
              <div className="mockup-main">
                <div className="mockup-stats-grid">
                  <div className="stat-card-mini">
                    <span>PORTFOLIO VIEWS</span>
                    <strong>2,840</strong>
                  </div>
                  <div className="stat-card-mini">
                    <span>RECRUITER CLICKS</span>
                    <strong>148</strong>
                  </div>
                  <div className="stat-card-mini">
                    <span>MATCH SCORE</span>
                    <strong>98%</strong>
                  </div>
                </div>

                <div className="portfolio-preview-card">
                  <div className="preview-hero-sim">
                    <h3>Alex Rivera</h3>
                    <p>Building high-performance distributed systems & AI-native web experiences.</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "1.5rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--color-border-dark)",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "var(--color-primary-dark)", fontWeight: "600" }}>
                      ● Active Theme: Vercel Dark Minimal
                    </span>
                    <button
                      onClick={() => { window.location.hash = "#portfolio-preview"; }}
                      style={{
                        padding: "0.35rem 0.85rem",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-primary)",
                        color: "white",
                        border: "none",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Live Preview →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
