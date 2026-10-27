import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "./LoginPage.css";

export const LoginPage = () => {
  const { login, loginWithGoogle, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendStatus, setResendStatus] = useState(""); // "" | "sending" | "sent"

  const handleResendVerification = async () => {
    if (resendStatus === "sending") return;
    setResendStatus("sending");
    try {
      await resendVerificationEmail(email);
      setResendStatus("sent");
    } catch (err) {
      setErrorMsg(err.message || "Failed to resend verification email.");
      setResendStatus("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsEmailUnverified(false);
    setResendStatus("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      // Check if the error is about unverified email
      if (err.message?.includes("not verified") || err.message?.includes("not confirmed")) {
        setIsEmailUnverified(true);
      }
      if (err.message?.includes("connect") || err.message?.includes("Failed to fetch") || err.message?.includes("fetch")) {
        setErrorMsg("Unable to connect to authentication server. Please check your internet connection and try again.");
      } else {
        setErrorMsg(err.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg("");
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || "Google authentication failed.");
    }
  };

  return (
    <div className="login-page-container">
      {/* Background Mesh Glows */}
      <div className="login-bg-mesh" />
      <div className="login-bg-glow-1" />
      <div className="login-bg-glow-2" />

      <div className="login-split-wrapper">
        {/* LEFT PANEL: Visual Illustration Hero */}
        <div className="login-left-panel">
          <Link to={ROUTES.HOME} className="login-brand">
            <div className="brand-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="brand-title-text">Portfolio.ai</span>
          </Link>

          <div className="login-left-content">
            <h2>
              Welcome Back to Your <br />
              <span style={{
                background: "linear-gradient(135deg, #ffffff 30%, #818CF8 70%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                AI Portfolio Workspace
              </span>
            </h2>
            <p>
              Log in to manage your AI resumes, view real-time recruiter analytics, and publish updates to your custom domain.
            </p>

            <div className="illustration-card">
              <div className="illustration-card-header">
                <span className="ill-dot ill-dot-red" />
                <span className="ill-dot ill-dot-yellow" />
                <span className="ill-dot ill-dot-green" />
                <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted-dark)", marginLeft: "6px" }}>
                  dashboard.portfolio.ai/analytics
                </span>
              </div>

              <div className="illustration-card-body">
                <div className="ill-stat-row">
                  <div className="ill-stat-label">
                    <span>⚡ Supabase Auth Active</span>
                  </div>
                  <span className="ill-stat-val">Secured</span>
                </div>

                <div className="ill-stat-row">
                  <div className="ill-stat-label">
                    <span>👁️ Recruiter Views</span>
                  </div>
                  <span className="ill-stat-val">+240% This Week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Login Auth Form */}
        <div className="login-right-panel">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Sign in to your account</h1>
              <p>
                Don't have an account? <Link to={ROUTES.SIGNUP}>Sign up for free</Link>
              </p>
            </div>

            {errorMsg && (
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#fca5a5",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                marginBottom: "16px"
              }}>
                {errorMsg}
                {isEmailUnverified && (
                  <div style={{ marginTop: "10px" }}>
                    {resendStatus === "sent" ? (
                      <span style={{ color: "#6ee7b7", fontSize: "0.85rem" }}>
                        ✓ Verification email sent! Check your inbox.
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendStatus === "sending"}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#38bdf8",
                          cursor: resendStatus === "sending" ? "not-allowed" : "pointer",
                          textDecoration: "underline",
                          fontSize: "0.85rem",
                          padding: 0,
                          opacity: resendStatus === "sending" ? 0.6 : 1,
                        }}
                      >
                        {resendStatus === "sending" ? "Sending..." : "Resend verification email"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            

            {/* Google OAuth Button */}
            <div className="social-auth-grid" style={{ gridTemplateColumns: "1fr" }}>
              <button className="btn-social-auth" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            {/* Email & Password Input Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email-input">
                  Email Address
                </label>
                <div className="form-input-wrapper">
                  <input
                    id="email-input"
                    type="email"
                    placeholder="name@example.com"
                    className="auth-input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password-input">
                  Password
                </label>
                <div className="form-input-wrapper">
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="auth-input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="form-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <Link to={ROUTES.FORGOT_PASSWORD} className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="btn-submit-auth" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
