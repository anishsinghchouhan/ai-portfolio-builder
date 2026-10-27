import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./VerifyEmailPage.css";

export const VerifyEmailPage = ({ onBackToLogin }) => {
  const { resendVerificationEmail, pendingVerificationEmail } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [email, setEmail] = useState(pendingVerificationEmail || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [countdown, setCountdown] = useState(55);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: "" });

  // Sync email from auth store if it updates
  useEffect(() => {
    if (pendingVerificationEmail && pendingVerificationEmail !== email) {
      setEmail(pendingVerificationEmail);
      setNewEmail(pendingVerificationEmail);
    }
  }, [pendingVerificationEmail]);

  // 60-Second Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading || !email) return;

    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      await resendVerificationEmail(email);
      setCountdown(60);
      setNotification({
        type: "success",
        message: `✨ A new verification link has been sent to ${email}`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmail = (e) => {
    e.preventDefault();
    if (newEmail && newEmail.includes("@")) {
      setEmail(newEmail);
      setIsEditingEmail(false);
      setNotification({
        type: "success",
        message: `Email updated to ${newEmail}. Use the resend button below to send a new verification link.`,
      });
    } else {
      setNotification({
        type: "error",
        message: "Please enter a valid email address.",
      });
    }
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      window.location.hash = "login";
    }
  };

  return (
    <div className={`verify-page-root ${theme}`}>
      {/* Background Mesh Glows */}
      <div className="verify-bg-grid" />
      <div className="verify-bg-glow" />

      {/* Light / Dark Mode Toggle Button */}
      <button className="theme-toggle-fixed" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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

      {/* Centered Verification Card */}
      <div className="verify-card">
        {/* Brand Logo */}
        <a href="#home" className="verify-brand">
          <div className="verify-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="verify-brand-text">Portfolio.ai</span>
        </a>

        {/* Success Animated Illustration Badge */}
        <div className="illustration-box">
          <div className="illustration-glow-ring" />
          <div className="illustration-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="mail-check-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Heading & Description */}
        <h1 className="verify-heading">Verify Your Email</h1>
        <p className="verify-description">
          We've sent a confirmation link to your inbox. Click the link to complete your signup and initialize your AI Portfolio workspace.
        </p>

        {/* Target Email Display & Change Email Link */}
        {!isEditingEmail ? (
          <div className="email-display-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, opacity: 0.7 }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="email-address-text">{email || "No email provided"}</span>
            <button className="btn-change-email" onClick={() => { setIsEditingEmail(true); setNewEmail(email); }}>
              Change
            </button>
          </div>
        ) : (
          <form className="email-edit-form" onSubmit={handleSaveEmail}>
            <input
              type="email"
              className="email-edit-input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="btn-save-email">Save</button>
          </form>
        )}

        {/* Notification Toast Alert */}
        {notification.message && (
          <div className={`alert-banner ${notification.type}`}>
            {notification.type === "success" ? "✓" : "⚠️"} {notification.message}
          </div>
        )}

        {/* Primary Resend Email Button with Countdown Timer */}
        <button
          className={`btn-resend ${countdown > 0 || isLoading ? "disabled" : "active"}`}
          onClick={handleResend}
          disabled={countdown > 0 || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Sending Email...</span>
            </>
          ) : countdown > 0 ? (
            <span>Resend link in {countdown}s</span>
          ) : (
            <>
              <span>Resend Verification Email</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </>
          )}
        </button>

        {/* Back to Login Button */}
        <div>
          <button className="btn-back-login" onClick={handleBackToLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
