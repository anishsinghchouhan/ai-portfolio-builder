import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPortfolio } from "../../services/portfolioService";
import { getBuilderPath, ROUTES } from "../../constants/routes";
import "./CreatePortfolioModal.css";

export const CreatePortfolioModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("dark-glass");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setError(null);
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Please enter a title for your portfolio.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createPortfolio({
        title: cleanTitle,
        theme: template,
      });

      const newId = res.data?.id || res.id;
      if (newId) {
        onClose();
        navigate(getBuilderPath(newId));
      } else {
        setError("Portfolio created, but no ID was returned.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create portfolio. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-portfolio-modal-title"
    >
      <div className="create-portfolio-modal-card">
        <div className="modal-header-row">
          <div className="modal-title-group">
            <h2 id="create-portfolio-modal-title">Create New Portfolio</h2>
            <p>Give your portfolio a title to start customizing.</p>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="modal-error-banner" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-portfolio-form">
          <div className="form-group-field">
            <label htmlFor="portfolio-title-input">Portfolio Title *</label>
            <input
              ref={inputRef}
              id="portfolio-title-input"
              type="text"
              className="modal-text-input"
              placeholder="e.g. Full-Stack Developer Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group-field">
            <label htmlFor="portfolio-template-select">Starting Theme Preset</label>
            <select
              id="portfolio-template-select"
              className="modal-select-input"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="dark-glass">Dark Glass (Modern developer aesthetic)</option>
              <option value="minimal">Minimal (Clean typography & white space)</option>
              <option value="cyberpunk">Cyberpunk (High-contrast neon dark mode)</option>
              <option value="editorial">Editorial (Bold serif layout)</option>
            </select>
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Creating..." : "Create & Open Builder"}
            </button>
          </div>

          <div className="modal-secondary-option">
            <span>Want to start with pre-made content?</span>{" "}
            <Link
              to={ROUTES.TEMPLATES}
              onClick={onClose}
              className="link-templates-secondary"
            >
              Browse templates →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolioModal;

