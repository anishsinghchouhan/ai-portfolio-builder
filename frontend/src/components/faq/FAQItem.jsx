import React from "react";

export const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className={`accordion-item ${isOpen ? "active" : ""}`}>
      <button className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <div className="chevron-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className="accordion-panel">
        <p className="accordion-answer">{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem;
