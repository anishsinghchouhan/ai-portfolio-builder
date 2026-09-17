import React, { useState, useRef } from "react";
import "./TwoFactorPage.css";

export const TwoFactorPage = ({ onVerifySuccess, onCancel }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secretCopied, setSecretCopied] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState({ type: null, message: "" });
  
  const inputRefs = useRef([]);

  const secretKey = "K7X9-M2P4-W8Q3-J5N6";
  const backupCodes = [
    "8F3A - 9C12",
    "7B42 - 1E9D",
    "5K88 - 3M21",
    "4P10 - 6L75",
    "2N94 - 8H33",
    "9W55 - 4X67",
  ];

  // OTP Input Handler & Focus Shift
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2500);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setAlertStatus({
        type: "error",
        message: "Please enter all 6 digits of your authenticator code.",
      });
      return;
    }

    setIsLoading(true);
    setAlertStatus({ type: null, message: "" });

    setTimeout(() => {
      setIsLoading(false);
      // Demonstration validation check (valid code e.g. 123456 or any 6 digits for testing)
      if (code === "000000") {
        setAlertStatus({
          type: "error",
          message: "Invalid 6-digit authentication code. Please check your app and try again.",
        });
      } else {
        setAlertStatus({
          type: "success",
          message: "✓ Two-Factor Authentication Verified! Redirecting to dashboard...",
        });
        if (onVerifySuccess) setTimeout(onVerifySuccess, 1200);
      }
    }, 1200);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else window.location.hash = "login";
  };

  return (
    <div className="twofa-page-root">
      <div className="twofa-bg-mesh" />
      <div className="twofa-bg-glow" />

      <div className="twofa-card">
        {/* Header Bar */}
        <div className="twofa-header-row">
          <a href="#home" className="twofa-brand">
            <div className="twofa-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="twofa-brand-text">Portfolio.ai</span>
          </a>

          <span className="security-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            2FA SECURED
          </span>
        </div>

        {/* Title */}
        <h1 className="twofa-heading">Two-Factor Authentication</h1>
        <p className="twofa-subtitle">
          Scan the QR code with your authenticator app (Google Authenticator, 1Password, or Authy) and enter the 6-digit verification code below.
        </p>

        {/* QR Code Section */}
        <div className="qr-setup-box">
          <div className="qr-code-frame">
            <svg className="qr-code-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="white" />
              {/* Simulated Crisp QR Vector Elements */}
              <rect x="10" y="10" width="30" height="30" fill="#0f172a" />
              <rect x="15" y="15" width="20" height="20" fill="white" />
              <rect x="20" y="20" width="10" height="10" fill="#0f172a" />

              <rect x="60" y="10" width="30" height="30" fill="#0f172a" />
              <rect x="65" y="15" width="20" height="20" fill="white" />
              <rect x="70" y="20" width="10" height="10" fill="#0f172a" />

              <rect x="10" y="60" width="30" height="30" fill="#0f172a" />
              <rect x="15" y="65" width="20" height="20" fill="white" />
              <rect x="20" y="70" width="10" height="10" fill="#0f172a" />

              {/* Data Blocks */}
              <rect x="45" y="10" width="10" height="10" fill="#0f172a" />
              <rect x="45" y="25" width="10" height="15" fill="#0f172a" />
              <rect x="10" y="45" width="15" height="10" fill="#0f172a" />
              <rect x="30" y="45" width="25" height="10" fill="#0f172a" />
              <rect x="60" y="45" width="30" height="10" fill="#0f172a" />
              <rect x="45" y="60" width="10" height="30" fill="#0f172a" />
              <rect x="60" y="60" width="15" height="15" fill="#0f172a" />
              <rect x="75" y="75" width="15" height="15" fill="#0f172a" />
            </svg>
          </div>

          <div className="qr-instructions">
            <h4>1. Scan QR Code</h4>
            <p>Use your authenticator app to scan the code or manually input the secret key.</p>

            {/* Secret Key Field with Copy Button */}
            <div className="secret-key-wrapper">
              <span className="secret-key-code">{secretKey}</span>
              <button type="button" className="btn-copy-secret" onClick={handleCopySecret}>
                {secretCopied ? "Copied! ✓" : "Copy Secret"}
              </button>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleVerify}>
          {/* 6-Digit OTP Input */}
          <div className="otp-section">
            <div className="otp-label-row">
              <label className="otp-label">2. Enter 6-Digit Verification Code</label>
              <span style={{ fontSize: "0.75rem", color: "var(--color-secondary)" }}>
                App: Portfolio.ai ({secretKey.slice(0, 4)})
              </span>
            </div>

            <div className="otp-inputs-grid" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`otp-digit-input ${alertStatus.type === "error" ? "error" : ""}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
          </div>

          {/* Backup Codes Section */}
          <div className="backup-codes-box">
            <div className="backup-codes-header" onClick={() => setShowBackupCodes(!showBackupCodes)}>
              <h5>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                Emergency Backup Codes
              </h5>
              <span style={{ fontSize: "0.75rem", color: "var(--color-primary-dark)" }}>
                {showBackupCodes ? "Hide" : "Show Codes"}
              </span>
            </div>

            {showBackupCodes && (
              <div className="backup-codes-grid">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="backup-code-pill">
                    {code}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Tips Card */}
          <div className="security-tips-card">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p>
              Keep your backup codes stored in a secure password manager. Each code can only be used once if you lose access to your authenticator app.
            </p>
          </div>

          {/* Alert Messages (Success & Error States) */}
          {alertStatus.message && (
            <div className={`twofa-alert ${alertStatus.type}`}>
              {alertStatus.type === "success" ? "✓" : "⚠️"} {alertStatus.message}
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="twofa-actions-row">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>

            <button type="submit" className="btn-verify-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner-sm" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Code</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorPage;
