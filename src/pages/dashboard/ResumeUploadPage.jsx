import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./ResumeUploadPage.css";

export const ResumeUploadPage = ({ onUploadSuccess, onBack }) => {
  const { theme } = useDashboardTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [recentUploads, setRecentUploads] = useState([
    {
      id: "resume_1",
      name: "Alex_Morgan_Senior_FullStack_Resume.pdf",
      size: "1.4 MB",
      date: "Uploaded today at 2:15 PM",
      score: "92/100 ATS Match",
      format: "PDF",
    },
    {
      id: "resume_2",
      name: "Alex_Morgan_Tech_Lead_v2.docx",
      size: "820 KB",
      date: "Uploaded 3 days ago",
      score: "88/100 ATS Match",
      format: "DOCX",
    },
  ]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
    simulateFileUpload("Alex_Morgan_Uploaded_Resume.pdf");
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      simulateFileUpload(fileName);
    }
  };

  const simulateFileUpload = (fileName) => {
    alert(`Parsing "${fileName}" with AI Resume Engine... Extracted 14 skills & 3 work experiences!`);
    const newDoc = {
      id: `resume_${Date.now()}`,
      name: fileName,
      size: "1.2 MB",
      date: "Uploaded just now",
      score: "94/100 ATS Match",
      format: fileName.endsWith(".docx") ? "DOCX" : "PDF",
    };
    setRecentUploads([newDoc, ...recentUploads]);
    if (onUploadSuccess) onUploadSuccess(newDoc);
  };

  const handleDeleteResume = (id) => {
    setRecentUploads(recentUploads.filter((r) => r.id !== id));
  };

  return (
    <div className={`resume-upload-page-root ${theme}`}>
      <div className="upload-bg-mesh" />
      <div className="upload-bg-glow" />

      {/* Light / Dark Theme Toggle Button */}
      <button className="theme-toggle-resume" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* Main Container Card */}
      <div className="resume-upload-card">
        {/* Header Bar */}
        <div className="upload-header-bar">
          <a href="#home" className="upload-brand-link">
            <div className="upload-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="upload-brand-text">Portfolio.ai</span>
          </a>

          <span className="ai-badge-pill">✨ AI Resume Parser v3.0</span>
        </div>

        {/* Title Group */}
        <div className="upload-title-group">
          <h1>Upload Your Resume</h1>
          <p>
            Portfolio.ai will instantly parse your PDF or DOCX file, extract your technical skills, work history, and projects, and generate your portfolio page.
          </p>
        </div>

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
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
          />

          <div className="cloud-icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <h3>Drag & drop your resume file here</h3>
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
            <span className="file-format-badge">Supported: PDF, DOCX, TXT</span>
            <span className="file-format-badge">Maximum Size: 10 MB</span>
            <span className="file-format-badge">⚡ 99.8% Parse Accuracy</span>
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
          <h3>Recent Uploaded Resumes</h3>
          <div className="recent-uploads-list">
            {recentUploads.map((item) => (
              <div key={item.id} className="recent-upload-item">
                <div className="item-file-info">
                  <div className="file-type-icon">{item.format}</div>
                  <div className="file-details">
                    <h5>{item.name}</h5>
                    <p>{item.size} • {item.date} • <strong style={{ color: "#34d399" }}>{item.score}</strong></p>
                  </div>
                </div>

                <div className="item-action-btns">
                  <button
                    type="button"
                    className="btn-file-action"
                    onClick={() => alert(`Re-parsing "${item.name}"...`)}
                  >
                    Re-parse AI
                  </button>
                  <button
                    type="button"
                    className="btn-file-action"
                    style={{ color: "#f87171" }}
                    onClick={() => handleDeleteResume(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
