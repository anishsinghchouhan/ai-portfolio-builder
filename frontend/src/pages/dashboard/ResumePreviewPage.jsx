import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./ResumePreviewPage.css";

export const ResumePreviewPage = ({ onReplace, onDelete, onBack }) => {
  const { theme } = useDashboardTheme();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileInfo = {
    name: "Alex_Morgan_Senior_FullStack_Resume.pdf",
    size: "2.4 MB",
    uploadDate: "Oct 24, 2026 at 14:32 PM",
    atsScore: "94/100 ATS Match",
    format: "PDF Document",
    extractedSkills: 14,
  };

  const handleZoomIn = () => {
    if (zoomLevel < 150) setZoomLevel((prev) => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel((prev) => prev - 10);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    alert(`Downloading "${fileInfo.name}"...`);
  };

  return (
    <div className={`preview-page-root ${theme}`}>
      <div className="preview-bg-mesh" />
      <div className="preview-bg-glow" />

      {/* Top Toolbar Bar */}
      <div className="preview-top-toolbar">
        <div className="file-meta-header">
          <h2>Resume Document Preview</h2>
          <div className="file-sub-meta">
            <span>{fileInfo.name}</span>
            <span>•</span>
            <span className="ats-score-pill">✨ {fileInfo.atsScore}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="top-action-buttons">
          <button
            type="button"
            className="btn-preview-action secondary"
            onClick={onReplace || (() => alert("Opening Resume Replace Modal..."))}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Replace Resume</span>
          </button>

          <button type="button" className="btn-preview-action primary" onClick={handleDownload}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            className="btn-preview-action delete"
            onClick={onDelete || (() => alert("Deleting resume..."))}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Two Column Grid: PDF Reader + File Details Sidebar */}
      <div className="preview-main-grid">
        {/* PDF Reader Canvas Panel */}
        <div className="pdf-viewer-card">
          {/* Reader Controls Bar */}
          <div className="reader-controls-bar">
            <div className="zoom-controls-group">
              <button type="button" className="btn-zoom-icon" onClick={handleZoomOut} title="Zoom Out">
                -
              </button>
              <span className="zoom-val-text">{zoomLevel}%</span>
              <button type="button" className="btn-zoom-icon" onClick={handleZoomIn} title="Zoom In">
                +
              </button>
            </div>

            <span className="page-num-text">Page 1 of 1</span>

            <button
              type="button"
              className="btn-zoom-icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              ⤢
            </button>
          </div>

          {/* Rendered PDF Mockup Document Sheet */}
          <div
            className="pdf-document-sheet"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            <div className="pdf-header-demo">
              <h1>Alex Morgan</h1>
              <p>Senior Full-Stack Engineer • alex.morgan@email.com • San Francisco, CA</p>
            </div>
            <div className="pdf-divider" />

            <div className="pdf-section-block">
              <h3>Professional Summary</h3>
              <p>
                Senior Full-Stack Engineer with 6+ years of experience designing scalable microservices, high-performance React applications, and AI integrations at high-growth SaaS startups.
              </p>
            </div>

            <div className="pdf-section-block">
              <h3>Technical Skills</h3>
              <p>
                <strong>Languages & Frameworks:</strong> React, TypeScript, Node.js, Next.js, Python, Tailwind CSS, GraphQL, PostgreSQL, Docker, AWS
              </p>
            </div>

            <div className="pdf-section-block">
              <h3>Work Experience</h3>
              <p><strong>Senior Software Engineer — TechScale Inc.</strong> (2022 – Present)</p>
              <ul className="pdf-bullet-list">
                <li>Architected real-time WebSocket dashboard serving 250,000+ daily active users.</li>
                <li>Optimized LCP performance by 42% through edge caching and dynamic bundle splitting.</li>
                <li>Mentored 5 junior engineers and established automated CI/CD deployment pipelines.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* File Metadata Sidebar Card */}
        <div className="file-metadata-sidebar-card">
          <h3>Resume Metadata</h3>

          <div className="meta-detail-row">
            <label>File Name</label>
            <span>{fileInfo.name}</span>
          </div>

          <div className="meta-detail-row">
            <label>File Format</label>
            <span>{fileInfo.format}</span>
          </div>

          <div className="meta-detail-row">
            <label>File Size</label>
            <span>{fileInfo.size}</span>
          </div>

          <div className="meta-detail-row">
            <label>Upload Date & Time</label>
            <span>{fileInfo.uploadDate}</span>
          </div>

          <div className="meta-detail-row">
            <label>AI ATS Score</label>
            <span style={{ color: "#34d399" }}>{fileInfo.atsScore}</span>
          </div>

          <div className="meta-detail-row" style={{ borderBottom: "none" }}>
            <label>Parsed Skills Extracted</label>
            <span style={{ color: "#818cf8" }}>{fileInfo.extractedSkills} Technical Skills</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewPage;
