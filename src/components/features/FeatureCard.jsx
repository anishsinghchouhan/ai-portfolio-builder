import React from "react";

export const FeatureCard = ({ id, targetHash, icon, tag, title, description, linkText = "Explore Feature" }) => {
  const handleClick = () => {
    if (targetHash) {
      window.location.hash = targetHash;
    }
  };

  return (
    <div id={id} className="feature-card" onClick={handleClick} style={{ cursor: targetHash ? "pointer" : "default" }}>
      <div>
        <div className="feature-card-header">
          <div className="feature-icon-wrapper">{icon}</div>
          {tag && <span className="feature-tag">{tag}</span>}
        </div>

        <div className="feature-card-body">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="feature-card-footer">
        <span>{linkText}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;
