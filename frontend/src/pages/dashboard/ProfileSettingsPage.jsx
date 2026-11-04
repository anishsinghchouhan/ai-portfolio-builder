import React, { useState, useEffect, useCallback } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { authStore } from "../../store/authSlice";
import api from "../../services/api";
import { triggerDashboardRefresh } from "../../hooks/useSummary";
import "./ProfileSettingsPage.css";

export const ProfileSettingsPage = () => {
  const { theme } = useDashboardTheme();
  const { user, appUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    github: "",
    linkedin: "",
    website: "",
    avatarUrl: "",
  });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync profile state from appUser or backend
  const populateFields = useCallback((data) => {
    if (!data) return;
    setProfile({
      fullName: data.fullName || "",
      headline: data.headline || "",
      bio: data.bio || "",
      location: data.location || "",
      phone: data.phone || "",
      github: data.github || "",
      linkedin: data.linkedin || "",
      website: data.website || "",
      avatarUrl: data.avatarUrl || "",
    });
    setEmail(data.email || user?.email || "");
  }, [user?.email]);

  useEffect(() => {
    let isMounted = true;

    // Fast-path from cached store
    if (appUser) {
      populateFields(appUser);
      setIsLoading(false);
    }

    // Always fetch fresh profile on mount
    api
      .get("/users/me")
      .then((res) => {
        if (!isMounted) return;
        const freshUser = res.data?.data || res.data;
        if (freshUser) {
          populateFields(freshUser);
          authStore.setState({ appUser: freshUser });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!appUser) {
          setErrorMessage(
            err.response?.data?.error?.message ||
              err.message ||
              "Could not load profile. Please check your network."
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [appUser, populateFields]);

  const handleChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateUrl = (val, name) => {
    if (!val || !val.trim()) return null;
    if (!/^https?:\/\/.+/i.test(val.trim())) {
      return `${name} must be a valid URL starting with http:// or https://`;
    }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Client-side validation for URLs
    const errors = {};
    const ghErr = validateUrl(profile.github, "GitHub");
    if (ghErr) errors.github = ghErr;
    const liErr = validateUrl(profile.linkedin, "LinkedIn");
    if (liErr) errors.linkedin = liErr;
    const wsErr = validateUrl(profile.website, "Website");
    if (wsErr) errors.website = wsErr;
    const avErr = validateUrl(profile.avatarUrl, "Avatar URL");
    if (avErr) errors.avatarUrl = avErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Please correct the validation errors below.");
      return;
    }

    setIsSaving(true);
    setFieldErrors({});

    // Payload contains strictly allowed User fields only
    const payload = {
      fullName: profile.fullName?.trim() || null,
      headline: profile.headline?.trim() || null,
      bio: profile.bio?.trim() || null,
      location: profile.location?.trim() || null,
      phone: profile.phone?.trim() || null,
      github: profile.github?.trim() || null,
      linkedin: profile.linkedin?.trim() || null,
      website: profile.website?.trim() || null,
      avatarUrl: profile.avatarUrl?.trim() || null,
    };

    try {
      const res = await api.patch("/users/me", payload);
      const updatedUser = res.data?.data || res.data;

      if (updatedUser) {
        populateFields(updatedUser);
        authStore.setState({ appUser: updatedUser });
      }

      triggerDashboardRefresh();
      setSuccessMessage("Profile updated successfully!");

      // Auto-hide success message after 4s
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      const responseData = err.response?.data;
      const errorMsg =
        responseData?.error?.message ||
        responseData?.message ||
        err.message ||
        "Failed to update profile. Please try again.";

      setErrorMessage(errorMsg);

      // If backend returned structured Zod errors
      if (responseData?.error?.details) {
        const details = responseData.error.details;
        const newFieldErrors = {};
        for (const [key, val] of Object.entries(details)) {
          if (val?._errors?.length) {
            newFieldErrors[key] = val._errors.join(", ");
          }
        }
        setFieldErrors(newFieldErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = (profile.fullName || user?.email || "U")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className={`profile-settings-root ${theme}`}>
      <div className="profile-header-bar">
        <div>
          <h1>Account Profile Settings</h1>
          <p>Manage your public candidate profile, contact details, and social links.</p>
        </div>

        <button
          type="button"
          className="btn-save-profile"
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {successMessage && (
        <div className="profile-alert-banner success" role="status">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="profile-alert-banner error" role="alert">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="profile-form-grid">
        {/* Left: Avatar Card */}
        <div className="profile-card-box profile-avatar-card">
          <h3>Avatar</h3>
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName || "User Avatar"}
              className="profile-avatar-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="profile-avatar-fallback">
              {userInitials}
            </div>
          )}

          <div className="form-group-profile" style={{ marginTop: "1rem" }}>
            <label htmlFor="input-avatar-url">Avatar Image URL</label>
            <input
              id="input-avatar-url"
              type="url"
              className={`input-profile ${fieldErrors.avatarUrl ? "has-error" : ""}`}
              placeholder="https://example.com/avatar.jpg"
              value={profile.avatarUrl}
              onChange={(e) => handleChange("avatarUrl", e.target.value)}
              disabled={isSaving || isLoading}
            />
            {fieldErrors.avatarUrl && (
              <span className="field-error-text">{fieldErrors.avatarUrl}</span>
            )}
            <span className="field-hint-text">Direct HTTPS image link</span>
          </div>
        </div>

        {/* Right: Personal & Social Information Form */}
        <div className="profile-card-box">
          <h3 style={{ margin: "0 0 1.25rem 0" }}>👤 Personal Details</h3>

          <div className="profile-form-row">
            <div className="form-group-profile">
              <label htmlFor="input-full-name">Full Name</label>
              <input
                id="input-full-name"
                type="text"
                className={`input-profile ${fieldErrors.fullName ? "has-error" : ""}`}
                placeholder="e.g. Alex Morgan"
                value={profile.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                maxLength={100}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.fullName && (
                <span className="field-error-text">{fieldErrors.fullName}</span>
              )}
            </div>

            <div className="form-group-profile">
              <label htmlFor="input-email">
                Email Address <span className="read-only-badge">Managed by Auth</span>
              </label>
              <input
                id="input-email"
                type="email"
                className="input-profile read-only"
                value={email}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="profile-form-row">
            <div className="form-group-profile">
              <label htmlFor="input-headline">Professional Headline</label>
              <input
                id="input-headline"
                type="text"
                className={`input-profile ${fieldErrors.headline ? "has-error" : ""}`}
                placeholder="e.g. Senior Full-Stack Engineer"
                value={profile.headline}
                onChange={(e) => handleChange("headline", e.target.value)}
                maxLength={150}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.headline && (
                <span className="field-error-text">{fieldErrors.headline}</span>
              )}
            </div>

            <div className="form-group-profile">
              <label htmlFor="input-location">Location</label>
              <input
                id="input-location"
                type="text"
                className={`input-profile ${fieldErrors.location ? "has-error" : ""}`}
                placeholder="e.g. San Francisco, CA • Remote"
                value={profile.location}
                onChange={(e) => handleChange("location", e.target.value)}
                maxLength={100}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.location && (
                <span className="field-error-text">{fieldErrors.location}</span>
              )}
            </div>
          </div>

          <div className="profile-form-row">
            <div className="form-group-profile">
              <label htmlFor="input-phone">Phone Number</label>
              <input
                id="input-phone"
                type="tel"
                className={`input-profile ${fieldErrors.phone ? "has-error" : ""}`}
                placeholder="e.g. +1 (555) 012-3456"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={30}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.phone && (
                <span className="field-error-text">{fieldErrors.phone}</span>
              )}
            </div>

            <div className="form-group-profile">
              <label htmlFor="input-website">Personal Website</label>
              <input
                id="input-website"
                type="url"
                className={`input-profile ${fieldErrors.website ? "has-error" : ""}`}
                placeholder="https://yourwebsite.com"
                value={profile.website}
                onChange={(e) => handleChange("website", e.target.value)}
                maxLength={255}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.website && (
                <span className="field-error-text">{fieldErrors.website}</span>
              )}
            </div>
          </div>

          <div className="form-group-profile">
            <label htmlFor="input-bio">Bio / Summary</label>
            <textarea
              id="input-bio"
              className={`textarea-profile ${fieldErrors.bio ? "has-error" : ""}`}
              placeholder="Tell recruiters about your background, strengths, and what drives you..."
              rows={4}
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              maxLength={1000}
              disabled={isSaving || isLoading}
            />
            <div className="bio-char-count">
              {profile.bio?.length || 0} / 1000
            </div>
            {fieldErrors.bio && (
              <span className="field-error-text">{fieldErrors.bio}</span>
            )}
          </div>

          <h3 style={{ margin: "2rem 0 1rem 0" }}>🔗 Social Links</h3>
          <div className="profile-form-row">
            <div className="form-group-profile">
              <label htmlFor="input-github">GitHub Profile</label>
              <input
                id="input-github"
                type="url"
                className={`input-profile ${fieldErrors.github ? "has-error" : ""}`}
                placeholder="https://github.com/username"
                value={profile.github}
                onChange={(e) => handleChange("github", e.target.value)}
                maxLength={255}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.github && (
                <span className="field-error-text">{fieldErrors.github}</span>
              )}
            </div>

            <div className="form-group-profile">
              <label htmlFor="input-linkedin">LinkedIn Profile</label>
              <input
                id="input-linkedin"
                type="url"
                className={`input-profile ${fieldErrors.linkedin ? "has-error" : ""}`}
                placeholder="https://linkedin.com/in/username"
                value={profile.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                maxLength={255}
                disabled={isSaving || isLoading}
              />
              {fieldErrors.linkedin && (
                <span className="field-error-text">{fieldErrors.linkedin}</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
