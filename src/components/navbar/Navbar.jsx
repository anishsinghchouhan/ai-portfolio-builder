import React, { useState, useEffect } from "react";
import { scrollToSection } from "../../utils/scrollUtils";
import { useLandingTheme } from "../../context/LandingThemeContext";
import ThemeToggle from "../common/ThemeToggle";
import "./Navbar.css";

export const Navbar = ({ onNavigateLogin, onNavigateSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useLandingTheme();

  const handleSectionNav = (e, sectionId) => {
    e.preventDefault();
    setIsMobileOpen(false);

    const hasLandingSection = document.getElementById(sectionId);
    if (hasLandingSection) {
      window.history.pushState(null, "", `#${sectionId}`);
      scrollToSection(sectionId);
    } else {
      window.location.hash = `#${sectionId}`;
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onNavigateLogin) {
      onNavigateLogin();
    } else {
      window.location.hash = "#login";
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    if (onNavigateSignup) {
      onNavigateSignup();
    } else {
      window.location.hash = "#signup";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`navbar-container ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-wrapper">
        {/* Brand / Logo */}
        <a href="#home" className="nav-brand" onClick={(e) => handleSectionNav(e, "home")}>
          <div className="brand-icon-wrapper">
            <svg
              className="brand-icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="brand-title">
            <span className="brand-name">Portfolio.ai</span>
            <span className="brand-badge">2.0</span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <ul className="nav-links">
            <li className="nav-item">
              <a href="#how-it-works" className="nav-link" onClick={(e) => handleSectionNav(e, "how-it-works")}>
                How It Works
              </a>
            </li>

            <li className="nav-item">
              <a href="#features" className="nav-link" onClick={(e) => handleSectionNav(e, "features")}>
                Features
              </a>
            </li>

            <li className="nav-item">
              <a href="#templates" className="nav-link" onClick={(e) => handleSectionNav(e, "templates")}>
                Templates
              </a>
            </li>

            <li className="nav-item">
              <a href="#pricing" className="nav-link" onClick={(e) => handleSectionNav(e, "pricing")}>
                Pricing
              </a>
            </li>

            <li className="nav-item">
              <a href="#blog" className="nav-link" onClick={(e) => handleSectionNav(e, "blog")}>
                Blog
              </a>
            </li>

            {/* Minimal SaaS Theme Toggle Switch */}
            <li className="nav-item">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </li>
          </ul>
        </nav>

        {/* Public Auth Action Buttons */}
        <div className="nav-actions">
          <a href="#login" className="btn-login" onClick={handleLoginClick}>
            Login
          </a>
          <a href="#signup" className="btn-get-started" onClick={handleSignupClick}>
            <span>Get Started</span>
            <svg
              className="btn-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Glass Drawer */}
      <div className={`mobile-drawer ${isMobileOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          <li>
            <a href="#home" className="mobile-nav-link" onClick={(e) => handleSectionNav(e, "home")}>
              Home <span>→</span>
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="mobile-nav-link" onClick={(e) => handleSectionNav(e, "how-it-works")}>
              How It Works <span>→</span>
            </a>
          </li>
          <li>
            <a href="#features" className="mobile-nav-link" onClick={(e) => handleSectionNav(e, "features")}>
              Features <span>→</span>
            </a>
          </li>
          <li>
            <a href="#templates" className="mobile-nav-link" onClick={(e) => handleSectionNav(e, "templates")}>
              Templates <span>→</span>
            </a>
          </li>
          <li>
            <a href="#pricing" className="mobile-nav-link" onClick={(e) => handleSectionNav(e, "pricing")}>
              Pricing <span>→</span>
            </a>
          </li>
          <li>
            <a href="#blog" className="mobile-nav-link" onClick={(e) => handleSectionNav(e, "blog")}>
              Blog <span>→</span>
            </a>
          </li>
          <li className="mobile-theme-row">
            <span className="mobile-theme-text">Theme</span>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </li>
        </ul>

        <div className="mobile-actions">
          <a
            href="#login"
            className="btn-login"
            onClick={(e) => {
              setIsMobileOpen(false);
              handleLoginClick(e);
            }}
          >
            Login
          </a>
          <a
            href="#signup"
            className="btn-get-started"
            onClick={(e) => {
              setIsMobileOpen(false);
              handleSignupClick(e);
            }}
          >
            <span>Get Started</span>
            <svg
              className="btn-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
