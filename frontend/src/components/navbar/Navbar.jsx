import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scrollToSection } from "../../utils/scrollUtils";
import { useLandingTheme } from "../../context/LandingThemeContext";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";
import { ROUTES } from "../../constants/routes";
import "./Navbar.css";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useLandingTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollNav = (e, sectionId) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (location.pathname === ROUTES.HOME) {
      scrollToSection(sectionId);
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => scrollToSection(sectionId), 150);
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
        <Link to={ROUTES.HOME} className="nav-brand" onClick={() => setIsMobileOpen(false)}>
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
        </Link>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <ul className="nav-links">
            <li className="nav-item">
              <a
                href="/#how-it-works"
                className="nav-link"
                onClick={(e) => handleScrollNav(e, "how-it-works")}
              >
                How It Works
              </a>
            </li>

            <li className="nav-item">
              <a
                href="/#features"
                className="nav-link"
                onClick={(e) => handleScrollNav(e, "features")}
              >
                Features
              </a>
            </li>

            {/* Templates: Scrolls down to the Theme Studio section on "/" */}
            <li className="nav-item">
              <a
                href="/#templates"
                className="nav-link"
                onClick={(e) => handleScrollNav(e, "templates")}
              >
                Templates
              </a>
            </li>

            {/* Pricing: Smooth scrolls down to the Pricing section on "/" */}
            <li className="nav-item">
              <a
                href="/#pricing"
                className="nav-link"
                onClick={(e) => handleScrollNav(e, "pricing")}
              >
                Pricing
              </a>
            </li>

            {/* Minimal SaaS Theme Toggle Switch */}
            <li className="nav-item">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </li>
          </ul>
        </nav>

        {/* Auth Action Buttons: If logged in, show ONE Dashboard button */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <Link to={ROUTES.DASHBOARD} className="btn-get-started">
              <span>Dashboard</span>
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
            </Link>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn-login">
                Login
              </Link>
              <Link to={ROUTES.SIGNUP} className="btn-get-started">
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
              </Link>
            </>
          )}
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
            <Link to={ROUTES.HOME} className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>
              Home <span>→</span>
            </Link>
          </li>
          <li>
            <a
              href="/#how-it-works"
              className="mobile-nav-link"
              onClick={(e) => handleScrollNav(e, "how-it-works")}
            >
              How It Works <span>→</span>
            </a>
          </li>
          <li>
            <a
              href="/#features"
              className="mobile-nav-link"
              onClick={(e) => handleScrollNav(e, "features")}
            >
              Features <span>→</span>
            </a>
          </li>
          <li>
            <a
              href="/#templates"
              className="mobile-nav-link"
              onClick={(e) => handleScrollNav(e, "templates")}
            >
              Templates <span>→</span>
            </a>
          </li>
          <li>
            <a
              href="/#pricing"
              className="mobile-nav-link"
              onClick={(e) => handleScrollNav(e, "pricing")}
            >
              Pricing <span>→</span>
            </a>
          </li>
          <li className="mobile-theme-row">
            <span className="mobile-theme-text">Theme</span>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </li>
        </ul>

        <div className="mobile-actions">
          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="btn-get-started"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Dashboard</span>
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
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="btn-login"
                onClick={() => setIsMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="btn-get-started"
                onClick={() => setIsMobileOpen(false)}
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
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
