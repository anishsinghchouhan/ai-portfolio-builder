import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import ThemeToggle from "../common/ThemeToggle";
import "./Header.css";

export const Header = ({
  breadcrumbPath = ["Dashboard", "Overview"],
  onQuickAdd,
  onThemeToggle,
  onOpenNotifications,
  onLogout,
}) => {
  const { theme, toggleTheme } = useDashboardTheme();
  const { user, appUser, logout } = useAuth();
  const navigate = useNavigate();

  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);

  // Real user display metadata
  const userName = user?.user_metadata?.full_name || appUser?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || appUser?.avatarUrl || null;
  const userPlan = (appUser?.plan || "Free").toUpperCase();
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
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(e.target)) {
        setIsMessagesOpen(false);
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
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuickAddClick = () => {
    if (onQuickAdd) {
      onQuickAdd();
    } else {
      navigate(ROUTES.DASHBOARD_UPLOAD);
    }
  };

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
      {/* LEFT SECTION: Clean Breadcrumb Navigation */}
      <div className="header-left-group">
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

      {/* RIGHT SECTION: Quick Add, Notifications, Messages, Theme & Real User Profile */}
      <div className="header-right-group">
        {/* Quick Add CTA Button */}
        <button
          type="button"
          className="btn-quick-add"
          onClick={handleQuickAddClick}
          title="Create or Upload New Portfolio"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Quick Add</span>
        </button>

        {/* Messages & Inquiries Icon Button (Badges removed) */}
        <div ref={messagesRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => {
              setIsMessagesOpen(!isMessagesOpen);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            title="Messages & Inquiries"
            aria-expanded={isMessagesOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Messages Floating Panel */}
          {isMessagesOpen && (
            <div className="header-dropdown-menu dropdown-wide">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <strong style={{ fontSize: "0.85rem", color: "#fff" }}>Inbox & Inquiries</strong>
              </div>
              <div style={{ padding: "12px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                No new messages at this time.
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon Button (Badges removed) */}
        <div ref={notificationsRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsMessagesOpen(false);
              setIsProfileOpen(false);
            }}
            title="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Notifications Floating Panel */}
          {isNotificationsOpen && (
            <div className="header-dropdown-menu dropdown-wide">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <strong style={{ fontSize: "0.85rem", color: "#fff" }}>Notifications</strong>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if (onOpenNotifications) onOpenNotifications();
                  }}
                  style={{ background: "none", border: "none", color: "#818cf8", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                >
                  View All →
                </button>
              </div>
              <div style={{ padding: "12px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                You're all caught up!
              </div>
            </div>
          )}
        </div>

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
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
              setIsMessagesOpen(false);
            }}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Profile Dropdown Panel */}
          {isProfileOpen && (
            <div className="header-dropdown-menu">
              <div className="dropdown-user-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <h5 style={{ margin: 0 }}>{userName}</h5>
                  <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: "4px", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", fontWeight: 700 }}>
                    {userPlan} PLAN
                  </span>
                </div>
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
                <span>🌐</span>
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
                <span>👤</span>
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
                <span>⚙️</span>
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
                <span>💎</span>
                <span>Billing & Plans</span>
              </button>

              <button
                type="button"
                className="dropdown-menu-item logout"
                onClick={handleLogout}
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
