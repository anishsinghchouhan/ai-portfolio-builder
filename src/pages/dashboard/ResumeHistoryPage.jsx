import React, { useState } from "react";
import "./ResumeHistoryPage.css";

export const ResumeHistoryPage = ({ onUploadNewVersion, onDownload, onMakeActive }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [versions, setVersions] = useState([
    {
      id: "v_3_2",
      version: "v3.2",
      fileName: "Alex_Morgan_Senior_FullStack_Resume.pdf",
      uploadDate: "Oct 24, 2026 at 14:32 PM",
      fileSize: "1.4 MB",
      format: "PDF",
      isActive: true,
      atsScore: "94/100 ATS Match",
      extractedSkills: "14 Skills Parsed",
    },
    {
      id: "v_3_1",
      version: "v3.1",
      fileName: "Alex_Morgan_Tech_Lead_v2.docx",
      uploadDate: "Sep 18, 2026 at 10:15 AM",
      fileSize: "820 KB",
      format: "DOCX",
      isActive: false,
      atsScore: "88/100 ATS Match",
      extractedSkills: "12 Skills Parsed",
    },
    {
      id: "v_2_0",
      version: "v2.0",
      fileName: "Alex_Morgan_Software_Engineer_2025.pdf",
      uploadDate: "May 12, 2026 at 16:45 PM",
      fileSize: "1.8 MB",
      format: "PDF",
      isActive: false,
      atsScore: "82/100 ATS Match",
      extractedSkills: "10 Skills Parsed",
    },
    {
      id: "v_1_0",
      version: "v1.0",
      fileName: "Alex_Morgan_Initial_Draft.pdf",
      uploadDate: "Jan 05, 2026 at 09:20 AM",
      fileSize: "1.1 MB",
      format: "PDF",
      isActive: false,
      atsScore: "76/100 ATS Match",
      extractedSkills: "8 Skills Parsed",
    },
  ]);

  const handleMakeActive = (id) => {
    setVersions(
      versions.map((v) => ({
        ...v,
        isActive: v.id === id,
      }))
    );
    if (onMakeActive) onMakeActive(id);
    else alert(`Version ${id} is now set as the active portfolio resume!`);
  };

  const handleDeleteVersion = (id, version) => {
    if (confirm(`Are you sure you want to delete resume version ${version}?`)) {
      setVersions(versions.filter((v) => v.id !== id));
    }
  };

  const filteredVersions = versions.filter((v) => {
    const matchesCategory =
      activeFilter === "all" ||
      (activeFilter === "active" && v.isActive) ||
      v.format.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      v.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="history-page-root">
      <div className="history-card-container">
        {/* Header Bar */}
        <div className="history-header-bar">
          <div className="history-title-group">
            <h2>Resume Version History</h2>
            <p>
              Manage, compare, and switch between previous ATS resume uploads and generated AI revisions.
            </p>
          </div>

          <button
            type="button"
            className="btn-upload-new-version"
            onClick={onUploadNewVersion || (() => alert("Opening Resume Upload modal..."))}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Upload New Version</span>
          </button>
        </div>

        {/* Controls Bar: Search & Filter Tabs */}
        <div className="history-controls-row">
          <div className="history-search-field">
            <svg className="history-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search versions or file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="history-filter-tabs">
            <button
              className={`history-filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({versions.length})
            </button>
            <button
              className={`history-filter-btn ${activeFilter === "active" ? "active" : ""}`}
              onClick={() => setActiveFilter("active")}
            >
              Active
            </button>
            <button
              className={`history-filter-btn ${activeFilter === "pdf" ? "active" : ""}`}
              onClick={() => setActiveFilter("pdf")}
            >
              PDF
            </button>
            <button
              className={`history-filter-btn ${activeFilter === "docx" ? "active" : ""}`}
              onClick={() => setActiveFilter("docx")}
            >
              DOCX
            </button>
          </div>
        </div>

        {/* Resume Versions List */}
        {filteredVersions.length > 0 ? (
          <div className="history-versions-list">
            {filteredVersions.map((v) => (
              <div
                key={v.id}
                className={`version-card-item ${v.isActive ? "active-version" : ""}`}
              >
                {/* Left Side: Version Tag & Details */}
                <div className="version-item-left">
                  <span className="version-badge-tag">{v.version}</span>
                  <div className="version-info-body">
                    <h4>
                      <span>{v.fileName}</span>
                      {v.isActive && <span className="current-active-pill">🟢 Active Version</span>}
                    </h4>
                    <p>
                      {v.fileSize} • {v.uploadDate} • <strong style={{ color: "#34d399" }}>{v.atsScore}</strong>
                    </p>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="version-item-actions">
                  {!v.isActive && (
                    <button
                      type="button"
                      className="btn-version-action"
                      onClick={() => handleMakeActive(v.id)}
                    >
                      Make Active
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-version-action"
                    onClick={() => {
                      if (onDownload) onDownload(v);
                      else alert(`Downloading "${v.fileName}"...`);
                    }}
                  >
                    Download
                  </button>

                  <button
                    type="button"
                    className="btn-version-action delete"
                    onClick={() => handleDeleteVersion(v.id, v.version)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-empty-state">
            <div className="history-empty-icon">📄</div>
            <h3>No resume versions found</h3>
            <p>No resume version history matching your query "{searchQuery}".</p>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="history-pagination-footer">
          <span>Showing {filteredVersions.length} of {versions.length} versions</span>
          <div className="pagination-btn-group">
            <button
              className="btn-page-step"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>
            <span style={{ fontSize: "0.8rem", padding: "0 8px" }}>Page {currentPage} of 1</span>
            <button className="btn-page-step" disabled>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeHistoryPage;
