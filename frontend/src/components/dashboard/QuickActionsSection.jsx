import React from "react";
import "./QuickActionsSection.css";

export const QuickActionsSection = ({ onActionClick }) => {
  const actionsList = [
    {
      id: "create_portfolio",
      title: "Create Portfolio",
      description: "Start a new portfolio tailored for a specific role or stack.",
      colorTheme: "indigo",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: "edit_profile",
      title: "Edit Profile",
      description: "Update headline, bio, contact details, and engineering skills.",
      colorTheme: "purple",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "browse_templates",
      title: "Browse Templates",
      description: "Explore developer layouts and dark-mode design presets.",
      colorTheme: "cyan",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      id: "upload_resume",
      title: "Upload Resume",
      description: "Resume PDF parsing and section extraction coming soon.",
      colorTheme: "neutral",
      disabled: true,
      badge: "Coming soon",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  const handleCardClick = (action) => {
    if (action.disabled) return;
    if (onActionClick) {
      onActionClick(action.id, action.title);
    }
  };

  return (
    <section className="quick-actions-section-root" aria-label="Quick Actions">
      <div className="quick-actions-header">
        <div className="quick-actions-title-group">
          <h2>Quick Actions</h2>
          <p>Instant shortcuts to build, customize, and share your candidate profile.</p>
        </div>
      </div>

      <div className="quick-actions-grid-8">
        {actionsList.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`large-action-card ${action.colorTheme} ${action.disabled ? "disabled" : ""}`}
            onClick={() => handleCardClick(action)}
            disabled={action.disabled}
            aria-disabled={action.disabled ? "true" : undefined}
            aria-label={`${action.title}: ${action.description}`}
          >
            {/* Top Row: Icon Badge & Arrow */}
            <div className="action-card-top">
              <div className={`action-icon-badge ${action.colorTheme}`}>
                {action.icon}
              </div>
              {action.badge ? (
                <span className="action-card-soon-badge">{action.badge}</span>
              ) : (
                <svg className="action-arrow-indicator" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              )}
            </div>

            {/* Bottom Content Area */}
            <div className="action-card-bottom">
              <h3 className="action-card-title">{action.title}</h3>
              <p className="action-card-desc">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;
