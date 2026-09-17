import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Show generic response for security privacy, log error internally
      console.error("Forgot Password Error:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--color-background-dark, #0b0f17)", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "440px", backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(12px)", padding: "36px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "8px", fontWeight: 700 }}>Reset Password</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
          Enter your account email address and we'll send you instructions to reset your password.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", padding: "16px", borderRadius: "10px", fontSize: "0.9rem", lineHeight: "1.5" }}>
            <p style={{ margin: 0 }}>
              If an account exists for <strong>{email}</strong>, we've sent password reset instructions to your inbox.
            </p>
            <div style={{ marginTop: "20px" }}>
              <Button onClick={() => (window.location.hash = "login")} variant="secondary" style={{ width: "100%" }}>
                Return to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "16px" }}>{errorMsg}</div>
            )}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "8px" }}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(15,23,42,0.6)", color: "#fff", outline: "none" }}
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting} style={{ width: "100%" }}>
              Send Reset Instructions
            </Button>
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <a href="#login" style={{ color: "#38bdf8", fontSize: "0.875rem", textDecoration: "none" }}>
                ← Back to Login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
