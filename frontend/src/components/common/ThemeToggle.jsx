import React from "react";
import "./ThemeToggle.css";

export const ThemeToggle = ({ theme, onToggle, ariaLabel, title }) => {
  const isDark = theme === "dark";
  const defaultLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="theme-toggle-switch"
      onClick={onToggle}
      aria-label={ariaLabel || defaultLabel}
      title={title || defaultLabel}
    >
      <span className="toggle-track">
        <span className="toggle-icon moon-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
        <span className="toggle-icon sun-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </span>
        <span className={`toggle-knob ${theme}`} />
      </span>
    </button>
  );
};

export default ThemeToggle;
