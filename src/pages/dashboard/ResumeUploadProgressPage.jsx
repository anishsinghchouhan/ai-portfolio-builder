import React, { useState, useEffect } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./ResumeUploadProgressPage.css";

export const ResumeUploadProgressPage = ({ onComplete, onCancel }) => {
  const { theme } = useDashboardTheme();
  const [uploadState, setUploadState] = useState("uploading"); // "uploading" | "success" | "error"
  const [progress, setProgress] = useState(78);

  // Auto-simulate progress ticker if uploading
  useEffect(() => {
    let interval;
    if (uploadState === "uploading" && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            setUploadState("success");
            return 100;
          }
          return prev + 4;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [uploadState, progress]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSetState = (state) => {
    setUploadState(state);
    if (state === "uploading") setProgress(65);
    else if (state === "success") setProgress(100);
    else if (state === "error") setProgress(42);
  };

  const strokeDashoffset = 500 - (500 * progress) / 100;

  return (
    <div className={`progress-page-root ${theme}`}>
      <div className="progress-bg-mesh" />
      <div className="progress-bg-glow" />

      {/* Main Container Card */}
      <div className="progress-card">
        {/* Interactive State Simulator Bar */}
        <div className="state-simulation-bar">
          <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>Simulate State:</span>
          <button
            type="button"
            className={`btn-state-toggle ${uploadState === "uploading" ? "active" : ""}`}
            onClick={() => handleSetState("uploading")}
          >
            ⏳ Uploading ({progress}%)
          </button>
          <button
            type="button"
            className={`btn-state-toggle ${uploadState === "success" ? "active" : ""}`}
            onClick={() => handleSetState("success")}
          >
            ✓ Success (100%)
          </button>
          <button
            type="button"
            className={`btn-state-toggle ${uploadState === "error" ? "active" : ""}`}
            onClick={() => handleSetState("error")}
          >
            ⚠️ Error State
          </button>
        </div>

        {/* Large SVG Progress Circle */}
        <div className="large-circle-wrapper">
          <svg viewBox="0 0 180 180">
            <defs>
              <linearGradient id="progressCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle className="circle-track-bg" cx="90" cy="90" r="80" />

            {/* Filled Animated Stroke */}
            <circle
              className={`circle-fill-progress ${uploadState}`}
              cx="90"
              cy="90"
              r="80"
              style={{ strokeDashoffset }}
            />
          </svg>

          {/* Center Text */}
          <div className="circle-center-content">
            <span className="percentage-text">{progress}%</span>
            <span className="status-label-sub">
              {uploadState === "uploading" && "Uploading"}
              {uploadState === "success" && "Complete"}
              {uploadState === "error" && "Failed"}
            </span>
          </div>
        </div>

        {/* File Information & Horizontal Progress Bar */}
        <div className="file-info-box">
          <div className="file-row-top">
            <span className="file-name-text">Alex_Morgan_Senior_FullStack_Resume.pdf</span>
            <span className="file-size-badge">2.4 MB of 3.1 MB</span>
          </div>

          <div className="horizontal-progress-track">
            <div
              className={`horizontal-progress-fill ${uploadState}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-stats-row">
            <span>
              {uploadState === "uploading" && "⏱️ ~ 3 seconds remaining"}
              {uploadState === "success" && "⏱️ Upload & AI parsing finished"}
              {uploadState === "error" && "⏱️ Upload timed out"}
            </span>
            <span>⚡ 1.4 MB/s • SSL Encrypted</span>
          </div>
        </div>

        {/* Success or Error State Banners */}
        {uploadState === "success" && (
          <div className="state-banner-box success">
            <span>✨ Resume Upload & AI Parsing Complete! 14 Technical Skills Extracted.</span>
          </div>
        )}

        {uploadState === "error" && (
          <div className="state-banner-box error">
            <span>⚠️ Network Connection Interrupted. Click "Retry Upload" to resume.</span>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="progress-actions-footer">
          {uploadState === "error" ? (
            <>
              <button type="button" className="btn-cancel-upload" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="btn-retry-upload" onClick={() => handleSetState("uploading")}>
                Retry Upload
              </button>
            </>
          ) : uploadState === "success" ? (
            <button
              type="button"
              className="btn-retry-upload"
              onClick={onComplete || (() => alert("Navigating to AI Portfolio Dashboard..."))}
            >
              Continue to Dashboard →
            </button>
          ) : (
            <button type="button" className="btn-cancel-upload" onClick={onCancel || (() => alert("Upload Cancelled"))}>
              Cancel Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadProgressPage;
