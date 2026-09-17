import React from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./RecentActivitySection.css";

export const RecentActivitySection = () => {
  const { theme } = useDashboardTheme();
  const activities = [
    {
      id: "activity_1",
      title: "Portfolio Published",
      description: "Deployed v2.4 update live to alexmorgan.portfolio.ai with SSL Edge CDN.",
      tag: "Live Deployment",
      time: "Just now",
      colorTheme: "emerald",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12 2 19 21 12 17 5 21 12 2" />
        </svg>
      ),
    },
    {
      id: "activity_2",
      title: "Recruiter Analytics Viewed",
      description: "Senior Technical Recruiter from Stripe (San Francisco, CA) spent 4m 12s inspecting portfolio.",
      tag: "Recruiter Lead",
      time: "12m ago",
      colorTheme: "rose",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      id: "activity_3",
      title: "AI Resume Uploaded & Parsed",
      description: "Uploaded Alex_Morgan_Senior_Engineer.pdf — AI extracted 14 skills & 3 work experiences.",
      tag: "AI Parser",
      time: "45m ago",
      colorTheme: "indigo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      id: "activity_4",
      title: "AI Suggestions Applied",
      description: "Accepted AI suggestion: Optimized ATS bullet points for Senior Full-Stack role.",
      tag: "ATS Score +15",
      time: "2h ago",
      colorTheme: "purple",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
        </svg>
      ),
    },
    {
      id: "activity_5",
      title: "Template Preset Switched",
      description: "Changed active portfolio theme layout to Vercel Ultra Dark Presets.",
      tag: "Theme Studio",
      time: "5h ago",
      colorTheme: "amber",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 0 0 20z" />
        </svg>
      ),
    },
    {
      id: "activity_6",
      title: "Portfolio Content Edited",
      description: "Updated bio headline and added 2 new open-source GitHub repositories.",
      tag: "Content Update",
      time: "Yesterday",
      colorTheme: "cyan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={`activity-section-root ${theme}`}>
      {/* Header */}
      <div className="activity-section-header">
        <div className="activity-section-title">
          <h3>Recent Activity Timeline</h3>
          <p>Chronological feed of your portfolio updates, recruiter visits, and AI optimization events.</p>
        </div>

        <button type="button" className="btn-filter-activity" onClick={() => alert("Filtering Activity Feed...")}>
          <span>Filter Logs</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </div>

      {/* Timeline List */}
      <div className="timeline-container">
        {activities.map((item) => (
          <div key={item.id} className="timeline-item-card">
            {/* Node Bullet Icon */}
            <div className={`timeline-node-bullet ${item.colorTheme}`}>
              {item.icon}
            </div>

            {/* Left Avatar & Details */}
            <div className="timeline-content-left">
              <img src={item.avatar} alt={item.title} className="timeline-user-avatar" />
              <div className="timeline-event-text">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <span className="event-details-tag">🏷️ {item.tag}</span>
              </div>
            </div>

            {/* Right Timestamp Badge */}
            <span className="timeline-time-badge">{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivitySection;
