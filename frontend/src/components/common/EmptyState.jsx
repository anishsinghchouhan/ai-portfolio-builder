import React from "react";
import "./EmptyState.css";

export const EmptyState = ({
  icon = "📁",
  title = "No data found",
  description = "Get started by creating your first entry.",
  actionButton,
  secondaryLink,
  className = "",
}) => {
  return (
    <div className={`empty-state-box ${className}`}>
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {(actionButton || secondaryLink) && (
        <div className="empty-state-actions">
          {actionButton}
          {secondaryLink}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

