import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import ThemeToggle from "../common/ThemeToggle";
import "./Header.css";

export const Header = ({
  breadcrumbPath = ["Dashboard", "Overview"],
  onThemeToggle,
  onLogout,
  isMobileOpen = false,
  onToggleMobileMenu,
}) => {
  const { theme, toggleTheme } = useDashboardTheme();
  const { user, appUser, logout } = useAuth();
  const navigate = useNavigate();

  // Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Real user display metadata
  const userName = user?.user_metadata?.full_name || appUser?.fullName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || appUser?.avatarUrl || null;
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  // Global click-outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    }
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="header-root">
      {/* LEFT SECTION: Mobile Toggle & Breadcrumb Navigation */}
      <div className="header-left-group">
        <button
          type="button"
          className="btn-mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            {isMobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <nav className="header-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbPath.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="breadcrumb-separator">/</span>}
              {idx === breadcrumbPath.length - 1 ? (
                <span className="breadcrumb-current">{item}</span>
              ) : (
                <Link to={ROUTES.DASHBOARD} className="breadcrumb-link">{item}</Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* RIGHT SECTION: Theme Toggle & Real User Profile Menu */}
      <div className="header-right-group">
        {/* Dashboard Theme Switch (Dark/Light) */}
        <ThemeToggle
          theme={theme}
          onToggle={() => {
            toggleTheme();
            if (onThemeToggle) onThemeToggle(theme === "dark" ? "light" : "dark");
          }}
        />

        {/* User Avatar & Profile Dropdown Button */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="user-profile-menu-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            title={userName}
          >
            <div className="header-user-avatar-wrapper">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="header-user-avatar"
                />
              ) : (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    border: "2px solid rgba(129, 140, 248, 0.5)",
                  }}
                >
                  {userInitials}
                </div>
              )}
              <span className="user-online-dot" />
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8" }} aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Profile Dropdown Panel */}
          {isProfileOpen && (
            <div className="header-dropdown-menu">
              <div className="dropdown-user-header">
                <h5 style={{ margin: "0 0 4px 0" }}>{userName}</h5>
                {userEmail && <p>{userEmail}</p>}
              </div>

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(ROUTES.DASHBOARD);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Dashboard Overview</span>
              </button>

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(ROUTES.DASHBOARD_PROFILE);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Candidate Profile</span>
              </button>

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(ROUTES.DASHBOARD_SETTINGS);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Settings</span>
              </button>

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(ROUTES.PRICING);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span>Billing & Plans</span>
              </button>

              <button
                type="button"
                className="dropdown-menu-item logout"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
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
