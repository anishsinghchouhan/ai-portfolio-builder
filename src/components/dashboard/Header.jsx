import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import ThemeToggle from "../common/ThemeToggle";
import "./Header.css";

export const Header = ({
  breadcrumbPath = ["Dashboard", "Overview"],
  onQuickAdd,
  onAiSearch,
  onThemeToggle,
  onLogout,
}) => {
  const { theme, toggleTheme } = useDashboardTheme();
  const [language, setLanguage] = useState("EN");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleToggleTheme = () => {
    toggleTheme();
    if (onThemeToggle) onThemeToggle(theme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = () => {
    const langs = ["EN", "ES", "FR", "DE"];
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIdx]);
  };

  return (
    <header className="header-root">
      {/* LEFT SECTION: Breadcrumb & Search Group */}
      <div className="header-left-group">
        {/* Breadcrumb Navigation */}
        <nav className="header-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbPath.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="breadcrumb-separator">/</span>}
              {idx === breadcrumbPath.length - 1 ? (
                <span className="breadcrumb-current">{item}</span>
              ) : (
                <a href="#home" className="breadcrumb-link">{item}</a>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Search Bar with AI Sparkle */}
        <div className="header-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search portfolios, skills, analytics..." />

          {/* AI Search Sparkle Button */}
          <button
            type="button"
            className="btn-ai-search-sparkle"
            onClick={onAiSearch || (() => { window.location.hash = "#ai-resume-parser"; })}
            title="Ask AI Assistant"
          >
            ✨
          </button>

          <span className="search-cmd-badge">⌘K</span>
        </div>
      </div>

      {/* RIGHT SECTION: Quick Add, Widgets, Language & User Profile */}
      <div className="header-right-group">
        {/* Quick Add CTA Button */}
        <button
          type="button"
          className="btn-quick-add"
          onClick={onQuickAdd || (() => { window.location.hash = "#upload-resume"; })}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Quick Add</span>
        </button>

        {/* Messages Icon Button */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => { window.location.hash = "#support-feedback"; }}
          title="Messages & Feedback"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="badge-count">2</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => { window.location.hash = "#notification-settings"; }}
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="badge-count">3</span>
        </button>

        {/* Dashboard Theme Switch */}
        <ThemeToggle theme={theme} onToggle={handleToggleTheme} />

        {/* Language Selector Pill */}
        <button
          type="button"
          className="language-selector-pill"
          onClick={handleLanguageChange}
          title="Switch Language"
        >
          <span>🌐</span>
          <span>{language}</span>
        </button>

        {/* User Avatar & Profile Dropdown Button */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="user-profile-menu-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
          >
            <div className="header-user-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex Morgan"
                className="header-user-avatar"
              />
              <span className="user-online-dot" />
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Profile Dropdown Panel */}
          {isProfileOpen && (
            <div className="header-dropdown-menu">
              <div className="dropdown-user-header">
                <h5>Alex Morgan</h5>
                <p>alex.morgan@company.com</p>
              </div>

              <button className="dropdown-menu-item" onClick={() => { setIsProfileOpen(false); window.location.hash = "#portfolio-preview"; }}>
                <span>🌐</span>
                <span>View Live Portfolio</span>
              </button>

              <button className="dropdown-menu-item" onClick={() => { setIsProfileOpen(false); window.location.hash = "#profile-settings"; }}>
                <span>👤</span>
                <span>Edit Candidate Profile</span>
              </button>

              <button className="dropdown-menu-item" onClick={() => { setIsProfileOpen(false); window.location.hash = "#billing-subscription"; }}>
                <span>💳</span>
                <span>Billing & Pro Plan</span>
              </button>

              <button
                className="dropdown-menu-item logout"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onLogout) onLogout();
                  else window.location.hash = "login";
                }}
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
