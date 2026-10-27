import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import Button from "../../components/ui/Button";

export const ResetPasswordPage = () => {
  const { resetPassword, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(newPassword);
      sessionStorage.removeItem("supabase_auth_recovery");
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update password. Please try requesting a new reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--color-background-dark, #0b0f17)", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "440px", backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(12px)", padding: "36px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "8px", fontWeight: 700 }}>Set New Password</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
          Please enter your new password below.
        </p>

        {!isAuthenticated && !isLoading ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#f87171", marginBottom: "20px", fontSize: "0.95rem", lineHeight: "1.5" }}>
              No active password reset session found or link has expired. Please request a new password reset link.
            </p>
            <Button onClick={() => navigate(ROUTES.FORGOT_PASSWORD)} variant="primary" style={{ width: "100%" }}>
              Request New Reset Link
            </Button>
            <div style={{ marginTop: "16px" }}>
              <Link to={ROUTES.LOGIN} style={{ color: "#38bdf8", fontSize: "0.875rem", textDecoration: "none" }}>
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : success ? (
          <div style={{ backgroundColor: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>✅ Password Updated</h3>
            <p style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "16px" }}>Your password has been reset successfully.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="primary" style={{ width: "100%" }}>
                Continue to Dashboard →
              </Button>
              <Button onClick={() => navigate(ROUTES.LOGIN)} variant="secondary" style={{ width: "100%" }}>
                Go to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "16px" }}>{errorMsg}</div>
            )}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "8px" }}>New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(15,23,42,0.6)", color: "#fff", outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "8px" }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(15,23,42,0.6)", color: "#fff", outline: "none" }}
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting} style={{ width: "100%" }}>
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
