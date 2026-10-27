import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { triggerDashboardRefresh } from "../../hooks/useDashboardSummary";
import "./ProfileSettingsPage.css";

export const ProfileSettingsPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [profile, setProfile] = useState({
    fullName: "Alex Morgan",
    username: "alexmorgan",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    jobTitle: "Senior Full-Stack Engineer",
    company: "TechScale Inc.",
    website: "https://alexmorgan.dev",
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan",
    twitter: "https://x.com/alexmorgan_dev",
    bio: "Senior Full-Stack Engineer with 6+ years of experience building scalable SaaS apps and AI integrations.",
  });

  const handleChange = (field, val) => {
    setProfile({ ...profile, [field]: val });
  };

  const handleSave = () => {
    triggerDashboardRefresh();
    alert("Profile settings saved successfully!");
  };

  return (
    <div className={`profile-settings-root ${theme}`}>
      <div className="profile-header-bar">
        <div>
          <h1>Account Profile Settings</h1>
          <p>Manage your public candidate profile, contact details, and social links.</p>
        </div>

        <button type="button" className="btn-save-profile" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <div className="profile-form-grid">
        {/* Left: Avatar Upload Card */}
        <div className="profile-card-box" style={{ textStyle: "center" }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Avatar"
            style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem auto", display: "block" }}
          />
          <button style={{ padding: "0.45rem 1.15rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontSize: "0.8rem", cursor: "pointer", display: "block", margin: "0 auto" }}>
            Upload Picture
          </button>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "8px" }}>PNG, JPG or WebP up to 5MB</div>
        </div>

        {/* Right: Personal & Social Information Form */}
        <div className="profile-card-box">
          <h3 style={{ margin: "0 0 1.25rem 0" }}>👤 Personal Details</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group-profile">
              <label>Full Name</label>
              <input type="text" className="input-profile" value={profile.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
            </div>

            <div className="form-group-profile">
              <label>Username</label>
              <input type="text" className="input-profile" value={profile.username} onChange={(e) => handleChange("username", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group-profile">
              <label>Email Address</label>
              <input type="email" className="input-profile" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} />
            </div>

            <div className="form-group-profile">
              <label>Phone Number</label>
              <input type="text" className="input-profile" value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group-profile">
              <label>Job Title</label>
              <input type="text" className="input-profile" value={profile.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} />
            </div>

            <div className="form-group-profile">
              <label>Current Company</label>
              <input type="text" className="input-profile" value={profile.company} onChange={(e) => handleChange("company", e.target.value)} />
            </div>
          </div>

          <h3 style={{ margin: "1.5rem 0 1rem 0" }}>🔗 Social Links</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group-profile">
              <label>LinkedIn URL</label>
              <input type="text" className="input-profile" value={profile.linkedin} onChange={(e) => handleChange("linkedin", e.target.value)} />
            </div>

            <div className="form-group-profile">
              <label>GitHub URL</label>
              <input type="text" className="input-profile" value={profile.github} onChange={(e) => handleChange("github", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
