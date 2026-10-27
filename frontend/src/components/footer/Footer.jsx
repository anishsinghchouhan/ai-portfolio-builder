import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { scrollToSection } from "../../utils/scrollUtils";
import SocialLinks from "./SocialLinks";
import "./Footer.css";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollNav = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === ROUTES.HOME) {
      scrollToSection(sectionId);
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => scrollToSection(sectionId), 150);
    }
  };

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
          {/* Column 1: Logo, Mission & Socials */}
          <div className="footer-brand-col">
            <Link to={ROUTES.HOME} className="footer-brand-link">
              <div className="footer-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="footer-brand-text">Portfolio.ai</span>
            </Link>

            <p className="footer-about-text">
              Transforming flat PDF resumes into high-converting, hosted web portfolios with custom domains, AI content generation, and recruiter analytics.
            </p>

            <SocialLinks />
          </div>

          {/* Column 2: Product (Links to Landing Sections) */}
          <div className="footer-links-col">
            <h4>Product</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a href="/#features" onClick={(e) => handleScrollNav(e, "features")}>
                  Features
                </a>
              </li>
              <li className="footer-link-item">
                <a href="/#templates" onClick={(e) => handleScrollNav(e, "templates")}>
                  Templates
                </a>
              </li>
              <li className="footer-link-item">
                <a href="/#pricing" onClick={(e) => handleScrollNav(e, "pricing")}>
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-links-col">
            <h4>Company</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to={ROUTES.CONTACT}>Contact Us</Link>
              </li>
              <li className="footer-link-item">
                {isAuthenticated ? (
                  <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
                ) : (
                  <Link to={ROUTES.LOGIN}>Sign In</Link>
                )}
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-links-col">
            <h4>Legal</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
              </li>
              <li className="footer-link-item">
                <Link to={ROUTES.TERMS}>Terms of Service</Link>
              </li>
              <li className="footer-link-item">
                <Link to={ROUTES.REFUND}>Refund Policy</Link>
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
