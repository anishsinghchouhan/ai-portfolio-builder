import React, { useState } from "react";
import "./Sidebar.css";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = ({
  activeItem = "dashboard",
  onSelectMenuItem,
  isMobileOpen = false,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const menuSections = [
    {
      title: "Main Menu",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          ),
        },
        {
          id: "portfolio",
          label: "Portfolio",
          badge: "3",
          badgeType: "count",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          ),
        },
        {
          id: "resume",
          label: "Resume & AI",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          ),
        },
        {
          id: "templates",
          label: "Templates",
          badge: "NEW",
          badgeType: "new",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          ),
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
        {
          id: "billing",
          label: "Billing",
          badge: "PRO",
          badgeType: "pro",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          ),
        },
        {
          id: "help",
          label: "Help Center",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ),
        },
      ],
    },
  ];

  const handleItemClick = (id) => {
    if (onSelectMenuItem) onSelectMenuItem(id);
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    } else {
      await logout();
      window.location.hash = "#login";
    }
  };

  return (
    <aside
      className={`sidebar-root ${isCollapsed ? "collapsed" : "expanded"} ${
        isMobileOpen ? "mobile-open" : ""
      }`}
    >
      {/* Sidebar Header Bar */}
      <div className="sidebar-header">
        <a href="#home" className="sidebar-brand-link">
          <div className="sidebar-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="sidebar-brand-text">Portfolio.ai</span>
        </a>

        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          className="btn-collapse-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Nav Menu Groups */}
      <nav className="sidebar-nav">
        {menuSections.map((section, idx) => (
          <div key={idx} className="sidebar-section-group">
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`sidebar-nav-item ${activeItem === item.id ? "active" : ""}`}
              >
                <a
                  href={`#${item.id}`}
                  className="sidebar-nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.id);
                  }}
                  title={item.label}
                >
                  <div className="nav-item-icon">{item.icon}</div>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge-pill ${item.badgeType}`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              </div>
            ))}
          </div>
        ))}

        {/* Logout Item */}
        <div className="sidebar-section-group" style={{ marginTop: "auto" }}>
          <div className="sidebar-nav-item">
            <a
              href="#logout"
              className="sidebar-nav-link logout-item"
              onClick={handleLogoutClick}
              title="Logout"
            >
              <div className="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </nav>

      {/* User Profile Snippet Bottom Sidebar */}
      <div className="sidebar-user-footer">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          alt="Alex Morgan"
          className="user-avatar-main"
        />
        <div className="user-text-info">
          <span className="user-name-text">Alex Morgan</span>
          <span className="user-role-text">Senior Candidate • Pro</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
