import React, { useState } from "react";
import { triggerDashboardRefresh } from "../../hooks/useDashboardSummary";
import "./ResumeUploadPage.css";

export const ResumeUploadPage = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file) => {
    setUploadError(null);

    // Validate PDF type
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setUploadError("Invalid file format. Please upload a PDF file only.");
      return;
    }

    // Validate 5 MB maximum size limit
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    if (file.size > MAX_SIZE) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const newDoc = {
      id: `resume_${Date.now()}`,
      name: file.name,
      size: sizeStr,
      date: "Uploaded just now",
      format: "PDF",
    };

    setRecentUploads([newDoc, ...recentUploads]);
    triggerDashboardRefresh();
    if (onUploadSuccess) onUploadSuccess(newDoc);
  };

  const handleDeleteResume = (id) => {
    setRecentUploads(recentUploads.filter((r) => r.id !== id));
  };

  return (
    <div className="resume-upload-container w-full">
      {/* Title Group */}
      <div className="upload-title-group">
        <h1>Upload Your Resume</h1>
        <p>
          Upload your PDF resume to automatically extract your skills, work history, and projects for your portfolio.
        </p>
      </div>

      {/* Validation Error Banner */}
      {uploadError && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#f87171",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>⚠️</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        className={`drag-drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("resume-file-input").click()}
      >
        <input
          type="file"
          id="resume-file-input"
          style={{ display: "none" }}
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
        />

        <div className="cloud-icon-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h3>Drag & drop your resume PDF here</h3>
        <p>or click to browse your computer files</p>

        <button type="button" className="btn-choose-file">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Upload from Computer</span>
        </button>

        <div className="file-meta-row">
          <span className="file-format-badge">PDF only</span>
          <span className="file-format-badge">Max 5 MB</span>
        </div>
      </div>

      {/* Upload Tips Card */}
      <div className="upload-tips-card">
        <span className="tips-icon-bulb">💡</span>
        <div className="tips-text">
          <h4>Pro Tip for Maximum ATS Accuracy</h4>
          <p>
            Standard single-column PDF files without complex table layouts yield the highest AI parsing accuracy and recruiter ATS compatibility.
          </p>
        </div>
      </div>

      {/* Recent Uploads Section */}
      <div className="recent-uploads-box">
        <h3>Uploaded Resumes</h3>
        {recentUploads.length > 0 ? (
          <div className="recent-uploads-list">
            {recentUploads.map((item) => (
              <div key={item.id} className="recent-upload-item">
                <div className="item-file-info">
                  <div className="file-type-icon">{item.format}</div>
                  <div className="file-details">
                    <h5>{item.name}</h5>
                    <p>{item.size} • {item.date}</p>
                  </div>
                </div>

                <div className="item-action-btns">
                  <button
                    type="button"
                    className="btn-file-action"
                    style={{ color: "#f87171" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteResume(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              color: "var(--color-text-muted, #94a3b8)",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "14px",
              border: "1px dashed rgba(255, 255, 255, 0.08)",
              marginTop: "12px",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📄</div>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-text-primary, #f1f5f9)" }}>
              No resumes yet. Upload your first PDF.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;
