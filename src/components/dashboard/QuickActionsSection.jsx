import React from "react";
import "./QuickActionsSection.css";

export const QuickActionsSection = ({ onActionClick }) => {
  const actionsList = [
    {
      id: "upload_resume",
      title: "Upload Resume",
      description: "Auto-parse PDF or DOCX file to extract work experience & skills.",
      colorTheme: "indigo",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      id: "edit_portfolio",
      title: "Edit Portfolio",
      description: "Customize sections, reorder projects, and update bio.",
      colorTheme: "cyan",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      id: "change_theme",
      title: "Change Theme",
      description: "Switch between 30+ glassmorphism & dark mode presets.",
      colorTheme: "purple",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="13.5" cy="6.5" r=".5" />
          <circle cx="17.5" cy="10.5" r=".5" />
          <circle cx="8.5" cy="7.5" r=".5" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.71 1.7-1.64 0-.44-.17-.85-.45-1.16-.27-.31-.44-.72-.44-1.2 0-.93.75-1.68 1.68-1.68H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9.02-10-9.02z" />
        </svg>
      ),
    },
    {
      id: "publish_portfolio",
      title: "Publish Portfolio",
      description: "Deploy instant SSL updates to your live custom domain.",
      colorTheme: "emerald",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 19 21 12 17 5 21 12 2" />
        </svg>
      ),
    },
    {
      id: "download_resume",
      title: "Download Resume",
      description: "Export high-resolution ATS-optimized PDF resume.",
      colorTheme: "amber",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      ),
    },
    {
      id: "view_analytics",
      title: "View Analytics",
      description: "Track recruiter views, geographic traffic, and clicks.",
      colorTheme: "rose",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: "ai_improve_resume",
      title: "AI Improve Resume",
      description: "Get AI bullet point rewrites & skill gap suggestions.",
      colorTheme: "violet",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      id: "share_portfolio",
      title: "Share Portfolio",
      description: "Generate candidate QR code & shareable live URL.",
      colorTheme: "blue",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
    },
  ];

  const handleCardClick = (actionId, title) => {
    if (onActionClick) {
      onActionClick(actionId, title);
    } else {
      const map = {
        upload_resume: "#upload-resume",
        edit_portfolio: "#portfolio-builder",
        change_theme: "#theme-customization",
        publish_portfolio: "#publish-portfolio",
        download_resume: "#resume-history",
        view_analytics: "#analytics-dashboard",
        ai_improve_resume: "#analysis-overview",
        share_portfolio: "#portfolio-preview",
      };
      window.location.hash = map[actionId] || "#portfolio-builder";
    }
  };

  return (
    <section className="quick-actions-section-root">
      <div className="quick-actions-header">
        <div className="quick-actions-title-group">
          <h2>Quick Actions</h2>
          <p>Instant shortcuts to build, optimize, and distribute your candidate profile.</p>
        </div>
      </div>

      <div className="quick-actions-grid-8">
        {actionsList.map((action) => (
          <div
            key={action.id}
            className={`large-action-card ${action.colorTheme}`}
            onClick={() => handleCardClick(action.id, action.title)}
          >
            {/* Top Row: Icon Badge & Arrow */}
            <div className="action-card-top">
              <div className={`action-icon-badge ${action.colorTheme}`}>
                {action.icon}
              </div>
              <svg className="action-arrow-indicator" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>

            {/* Bottom Row: Title & Description */}
            <div className="action-card-body">
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;
