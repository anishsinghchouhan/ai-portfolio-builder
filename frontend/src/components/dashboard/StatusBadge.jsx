import React from "react";
import "./StatusBadge.css";

const STATUS_CONFIGS = {
  PUBLISHED: {
    label: "Live",
    className: "badge-published",
    icon: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
  },
  DRAFT: {
    label: "Draft",
    className: "badge-draft",
    icon: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
  },
  ARCHIVED: {
    label: "Archived",
    className: "badge-archived",
    icon: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <line x1="1" y1="1" x2="7" y2="7" />
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
  },
  done: {
    label: "Completed",
    className: "badge-done",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  current: {
    label: "Next up",
    className: "badge-current",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  },
  todo: {
    label: "To do",
    className: "badge-todo",
    icon: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
        <circle cx="4" cy="4" r="2.5" />
      </svg>
    ),
  },
  coming_soon: {
    label: "Coming soon",
    className: "badge-coming-soon",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
};

export const StatusBadge = ({ status = "DRAFT", labelOverride, className = "" }) => {
  const config = STATUS_CONFIGS[status] || {
    label: status,
    className: "badge-neutral",
    icon: null,
  };

  return (
    <span className={`status-badge-root ${config.className} ${className}`}>
      {config.icon && <span className="badge-indicator-icon" aria-hidden="true">{config.icon}</span>}
      <span>{labelOverride || config.label}</span>
    </span>
  );
};

export default StatusBadge;

