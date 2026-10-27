import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "./SignupPage.css";

export const SignupPage = () => {
  const { signup, loginWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({ email, password, fullName });
      setSignupSuccess(true);
    } catch (err) {
      console.error("Signup Error:", err);
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setErrorMsg("");
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || "Google registration failed.");
    }
  };

  // ─── Post-Signup Success Screen ──────────────────────────
  if (signupSuccess) {
    return (
      <div className="signup-page-container">
        <div className="signup-bg-mesh" />
        <div className="signup-bg-glow-1" />
        <div className="signup-bg-glow-2" />

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: "100vh", zIndex: 10 }}>
          <div className="auth-card" style={{ maxWidth: "520px", textAlign: "center", padding: "40px", backgroundColor: "rgba(17, 24, 39, 0.85)", borderRadius: "16px", border: "1px solid var(--color-border-dark)", backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>
              📩
            </div>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "12px", color: "#fff", fontWeight: 700 }}>
              Check your email
            </h2>
            <p style={{ color: "var(--color-text-secondary-dark)", marginBottom: "8px", lineHeight: "1.6" }}>
              We sent a verification link to:
            </p>
            <p style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#38bdf8" }}>{email}</strong>
            </p>

            <div style={{
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#93c5fd",
              padding: "14px 18px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              marginBottom: "24px",
              textAlign: "left",
              lineHeight: "1.6",
            }}>
              <strong>📧 Next steps:</strong>
              <ol style={{ margin: "8px 0 0 0", paddingLeft: "18px" }}>
                <li>Open your email inbox</li>
                <li>Click the verification link we sent</li>
                <li>You'll be redirected back here automatically</li>
              </ol>
              <p style={{ marginTop: "10px", fontSize: "0.8rem", color: "#64748b" }}>
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
            </div>

            <Link
              to={ROUTES.LOGIN}
              className="btn-submit-auth"
              style={{ width: "100%", display: "inline-block", textAlign: "center", textDecoration: "none" }}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Signup Form ─────────────────────────────────────────
  return (
    <div className="signup-page-container">
      {/* Background Mesh Glows */}
      <div className="signup-bg-mesh" />
      <div className="signup-bg-glow-1" />
      <div className="signup-bg-glow-2" />

      <div className="signup-split-wrapper">
        {/* LEFT PANEL: SaaS Visual Illustration & Hero */}
        <div className="signup-left-panel">
          <Link to={ROUTES.HOME} className="signup-brand">
            <div className="brand-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="brand-title-text">Portfolio.ai</span>
          </Link>

          <div className="signup-left-content">
            <h2>
              Build Your Career-Defining <br />
              <span style={{
                background: "linear-gradient(135deg, #ffffff 30%, #818CF8 70%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                AI Portfolio in 60s
              </span>
            </h2>
            <p>
              Join 40,000+ developers, designers, and creators who land dream interviews with AI-generated personal websites.
            </p>

            {/* SaaS Features Graphic Card */}
            <div className="features-graphic-card">
              <div className="graphic-card-header">
                <span className="graphic-badge">✨ PRO FEATURES INCLUDED</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted-dark)" }}>Free Forever Plan</span>
              </div>

              <div className="feature-check-list">
                <div className="feature-check-item">
                  <div className="check-icon-pill">✓</div>
                  <span>1-Click PDF Resume to Portfolio Transformation</span>
                </div>
                <div className="feature-check-item">
                  <div className="check-icon-pill">✓</div>
                  <span>Real-time Recruiter Analytics & Visitor Heatmaps</span>
                </div>
                <div className="feature-check-item">
                  <div className="check-icon-pill">✓</div>
                  <span>Custom Subdomains & Edge Global Deployment</span>
                </div>
                <div className="feature-check-item">
                  <div className="check-icon-pill">✓</div>
                  <span>Modern Dark Glassmorphism Design System</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer Testimonial */}
          <div className="left-testimonial">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Jenkins"
              className="testimonial-avatar-sm"
            />
            <div>
              <p className="testimonial-quote-text">
                "Portfolio.ai landed me 3 interviews at Vercel & Stripe within my first week."
              </p>
              <span className="testimonial-author">Sarah Jenkins — Senior Frontend Engineer</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Signup Auth Card */}
        <div className="signup-right-panel">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create your free account</h1>
              <p>
                Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
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
              </div>
            )}

            {/* Google OAuth Button */}
            <div className="social-auth-grid" style={{ gridTemplateColumns: "1fr" }}>
              <button className="btn-social-auth" onClick={handleGoogleSignup}>
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
              <span>OR REGISTER WITH EMAIL</span>
            </div>

            {/* Email & Password Input Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="name-input">
                  Full Name
                </label>
                <div className="form-input-wrapper">
                  <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="Alex Morgan"
                    className="auth-input-field"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="email-input">
                  Email Address
                </label>
                <div className="form-input-wrapper">
                  <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="alex@example.com"
                    className="auth-input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="password-input">
                  Password
                </label>
                <div className="form-input-wrapper">
                  <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    className="auth-input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password-input">
                  Confirm Password
                </label>
                <div className="form-input-wrapper">
                  <svg className="input-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="confirm-password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="auth-input-field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button type="submit" className="btn-submit-auth" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-terms-note">
              By creating an account, you agree to Portfolio.ai's <a href="#terms" style={{ color: "var(--color-primary-dark)" }}>Terms of Service</a> and <a href="#privacy" style={{ color: "var(--color-primary-dark)" }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
