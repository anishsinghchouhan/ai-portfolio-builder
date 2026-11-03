import React from "react";
import "./StatusBadge.css";

const STATUS_CONFIGS = {
  PUBLISHED: {
    label: "Live",
    className: "badge-published",
    icon: "●",
  },
  DRAFT: {
    label: "Draft",
    className: "badge-draft",
    icon: "○",
  },
  ARCHIVED: {
    label: "Archived",
    className: "badge-archived",
    icon: "⊘",
  },
  done: {
    label: "Completed",
    className: "badge-done",
    icon: "✓",
  },
  current: {
    label: "Current Step",
    className: "badge-current",
    icon: "➜",
  },
  todo: {
    label: "Next Up",
    className: "badge-todo",
    icon: "•",
  },
  coming_soon: {
    label: "Coming soon",
    className: "badge-coming-soon",
    icon: "⏳",
  },
};

export const StatusBadge = ({ status = "DRAFT", labelOverride, className = "" }) => {
  const config = STATUS_CONFIGS[status] || {
    label: status,
    className: "badge-neutral",
    icon: "•",
  };

  return (
    <span className={`status-badge-root ${config.className} ${className}`}>
      <span className="badge-indicator-icon" aria-hidden="true">{config.icon}</span>
      <span>{labelOverride || config.label}</span>
    </span>
  );
};

export default StatusBadge;

