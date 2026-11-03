import React from "react";
import "./ErrorState.css";

export const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this section.",
  onRetry,
  retryText = "Try again",
  className = "",
}) => {
  return (
    <div className={`error-state-card ${className}`} role="alert">
      <div className="error-state-content">
        <span className="error-state-icon" aria-hidden="true">⚠️</span>
        <div className="error-state-text">
          <h3 className="error-state-title">{title}</h3>
          <p className="error-state-message">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          className="btn-error-retry"
          onClick={onRetry}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;

