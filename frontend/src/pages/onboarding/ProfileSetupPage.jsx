import React, { useState, useRef } from "react";
import "./ProfileSetupPage.css";

export const ProfileSetupPage = ({ onSaveAndContinue, onPrevious }) => {
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80");
  const [fullName, setFullName] = useState("Alex Morgan");
  const [username, setUsername] = useState("alexmorgan");
  const [jobTitle, setJobTitle] = useState("Senior Full-Stack Engineer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("Building high-scale web platforms with React, Node.js, and AI. Passionate about sleek UX, open-source projects, and engineering leadership.");
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 234-5678");
  const [website, setWebsite] = useState("https://alexmorgan.dev");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/alexmorgan");
  const [github, setGithub] = useState("github.com/alexmorgan");
  const [portfolioUrl, setPortfolioUrl] = useState("alexmorgan.portfolio.ai");

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const maxBioChar = 240;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const handleBioChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxBioChar) {
      setBio(text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job Title is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (onSaveAndContinue) {
      onSaveAndContinue({
        avatar,
        fullName,
        username,
        jobTitle,
        location,
        bio,
        phoneNumber,
        website,
        linkedin,
        github,
        portfolioUrl,
      });
    } else {
      alert("Profile Saved! Advancing to Step 3: Choose Portfolio Theme...");
    }
  };

  return (
    <div className="profile-setup-root">
      <div className="profile-bg-mesh" />
      <div className="profile-bg-glow" />

      <div className="profile-setup-card">
        {/* Header Bar */}
        <div className="profile-header-bar">
          <a href="#home" className="profile-brand">
            <div className="profile-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="profile-brand-text">Portfolio.ai</span>
          </a>

          <span className="step-indicator-pill">Step 2 of 4</span>
        </div>

        {/* Step 2 Progress Bar Track (50%) */}
        <div className="progress-bar-track" aria-label="Progress: Step 2 of 4">
          <div className="progress-bar-fill-step2" />
        </div>

        {/* Title Group */}
        <div className="profile-title-group">
          <h1 className="profile-heading">Setup Your Public Profile</h1>
          <p className="profile-subtitle">
            Configure your candidate profile details, contact links, and bio. These will be displayed across your portfolio website.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Large Profile Picture Upload Section */}
          <div className="avatar-upload-container">
            <div className="avatar-preview-circle">
              {avatar ? (
                <img src={avatar} alt="Profile" className="avatar-img-preview" />
              ) : (
                <div className="avatar-placeholder-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                className="avatar-camera-badge"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            <div className="avatar-upload-info">
              <h4>Profile Picture</h4>
              <p>Supports JPG, PNG or WebP. Maximum file size 5MB.</p>
              <div className="avatar-actions-btns">
                <button
                  type="button"
                  className="btn-upload-file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Photo
                </button>
                {avatar && (
                  <button type="button" className="btn-remove-avatar" onClick={handleRemoveAvatar}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2-Column Form Grid */}
          <div className="profile-form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  className={`form-input-field ${errors.fullName ? "error" : ""}`}
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              {errors.fullName && <span className="validation-msg">{errors.fullName}</span>}
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username *</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
                <input
                  type="text"
                  className={`form-input-field ${errors.username ? "error" : ""}`}
                  placeholder="alexmorgan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {errors.username && <span className="validation-msg">{errors.username}</span>}
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <input
                  type="text"
                  className={`form-input-field ${errors.jobTitle ? "error" : ""}`}
                  placeholder="Senior Full-Stack Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              {errors.jobTitle && <span className="validation-msg">{errors.jobTitle}</span>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Bio (Full Row) */}
            <div className="form-group form-group-full">
              <div className="form-label">
                <span>Bio / Summary</span>
                <span className={`char-counter ${bio.length >= maxBioChar ? "limit" : ""}`}>
                  {bio.length} / {maxBioChar}
                </span>
              </div>
              <textarea
                className="form-textarea-field"
                placeholder="Write a brief professional summary about your skills, achievements, and impact..."
                value={bio}
                onChange={handleBioChange}
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="+1 (555) 234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Personal Website */}
            <div className="form-group">
              <label className="form-label">Personal Website</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="https://alexmorgan.dev"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="form-group">
              <label className="form-label">LinkedIn Profile</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="linkedin.com/in/alexmorgan"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>

            {/* GitHub */}
            <div className="form-group">
              <label className="form-label">GitHub Profile</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="github.com/alexmorgan"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>
            </div>

            {/* Portfolio Custom Subdomain URL */}
            <div className="form-group form-group-full">
              <label className="form-label">Portfolio Domain Subdomain</label>
              <div className="form-input-wrapper">
                <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="alexmorgan.portfolio.ai"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="profile-actions-row">
            <button type="button" className="btn-prev-step" onClick={onPrevious}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </button>

            <button type="submit" className="btn-save-continue">
              <span>Save & Continue</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
