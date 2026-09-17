import React, { useState } from "react";
import SocialLinks from "./SocialLinks";
import "./Footer.css";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-bg-glow" />

      <div className="footer-container">
        {/* Top Newsletter Card */}
        <div className="newsletter-card">
          <div className="newsletter-info">
            <h3>Stay Ahead of the Job Market</h3>
            <p>
              Get weekly portfolio tips, new theme drops, and AI prompt engineering guides delivered straight to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="enter your email address"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              {subscribed ? "✨ Subscribed!" : "Subscribe Updates"}
            </button>
          </form>
        </div>

        {/* Main Multi-Column Links Grid */}
        <div className="footer-main-grid">
          {/* Column 1: Logo & About */}
          <div className="footer-brand-col">
            <a href="#home" className="footer-brand-link">
              <div className="footer-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="footer-brand-text">Portfolio.ai</span>
            </a>

            <p className="footer-about-text">
              Transforming flat PDF resumes into high-converting, hosted web portfolios with custom domains, AI content generation, and recruiter analytics.
            </p>

            <SocialLinks />
          </div>

          {/* Column 2: Resources */}
          <div className="footer-links-col">
            <h4>Resources</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><a href="#ai-resume-parser">AI Resume Parser</a></li>
              <li className="footer-link-item"><a href="#theme-studio">Theme Studio</a></li>
              <li className="footer-link-item"><a href="#custom-domains">Custom Domains</a></li>
              <li className="footer-link-item"><a href="#recruiter-analytics">Recruiter Analytics</a></li>
              <li className="footer-link-item"><a href="#features">Drag & Drop Editor</a></li>
              <li className="footer-link-item"><a href="#pricing">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-links-col">
            <h4>Company</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><a href="#about">About Us</a></li>
              <li className="footer-link-item">
                <a href="#careers">
                  Careers <span className="footer-mini-tag">Hiring</span>
                </a>
              </li>
              <li className="footer-link-item"><a href="#about">Press Kit</a></li>
              <li className="footer-link-item"><a href="#blog">Product Blog</a></li>
              <li className="footer-link-item"><a href="#about">Partner Program</a></li>
              <li className="footer-link-item"><a href="#about">Contact Support</a></li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div className="footer-links-col">
            <h4>Legal & Security</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><a href="#privacy">Privacy Policy</a></li>
              <li className="footer-link-item"><a href="#terms">Terms of Service</a></li>
              <li className="footer-link-item"><a href="#cookies">Cookie Preferences</a></li>
              <li className="footer-link-item"><a href="#security">Security Overview</a></li>
              <li className="footer-link-item"><a href="#gdpr">GDPR Compliance</a></li>
              <li className="footer-link-item">
                <span className="system-status-indicator">
                  <span className="status-dot" /> All Systems Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} AI Portfolio Builder Inc. All rights reserved.</p>
          <p>Engineered with React 19 & Vite for developers and designers worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
