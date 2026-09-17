import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useAuth } from "../../hooks/useAuth";
import "./CustomDomainsPage.css";

export const CustomDomainsPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [domainInput, setDomainInput] = useState("alexrivera.dev");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleCheckDomain = (e) => {
    e.preventDefault();
    if (!domainInput) return;
    setIsChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      setIsChecking(false);
      setCheckResult({
        domain: domainInput.toLowerCase().replace(/^https?:\/\//, ""),
        available: true,
        sslStatus: "Automated TLS 1.3 Ready",
        edgeStatus: "Global Edge CDN 0ms Cache",
      });
    }, 600);
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      window.location.hash = "#publish-portfolio";
    } else {
      window.location.hash = "#signup";
    }
  };

  return (
    <div className="pub-domain-root">
      <Navbar
        onNavigateLogin={() => {
          if (onNavigate) onNavigate("login");
          else window.location.hash = "#login";
        }}
        onNavigateSignup={() => {
          if (onNavigate) onNavigate("signup");
          else window.location.hash = "#signup";
        }}
      />

      <main className="pub-domain-container">
        {/* Header Hero */}
        <section className="pub-domain-hero">
          <div className="pub-domain-badge">
            <span>🌐 CUSTOM DOMAINS & GLOBAL EDGE CDN</span>
          </div>
          <h1 className="pub-domain-title">
            Own Your Professional Identity on a <br />
            <span className="pub-domain-title-gradient">Custom Domain Name</span>
          </h1>
          <p className="pub-domain-subtitle">
            Connect your personal brand domain (yourname.dev / yourname.com). Automatic free SSL certificates, 1-click CNAME DNS verification, and global edge server distribution.
          </p>
        </section>

        {/* Domain Checker Mockup Tool */}
        <section className="pub-domain-checker-box">
          <div className="checker-card">
            <h3>🔍 Test Domain Connection & SSL Readiness</h3>
            <form className="checker-form" onSubmit={handleCheckDomain}>
              <div className="checker-input-wrapper">
                <span className="protocol-prefix">https://</span>
                <input
                  type="text"
                  placeholder="yourname.dev"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="checker-input"
                />
              </div>
              <button type="submit" className="btn-check-domain" disabled={isChecking}>
                {isChecking ? "Checking DNS..." : "Verify Domain →"}
              </button>
            </form>

            {checkResult && (
              <div className="check-result-card">
                <div className="result-header">
                  <span className="status-badge-green">✔ Ready for Edge Deployment</span>
                  <strong className="domain-name-display">https://{checkResult.domain}</strong>
                </div>

                <div className="result-details-grid">
                  <div className="detail-item">
                    <span>SSL Certificate</span>
                    <strong>{checkResult.sslStatus}</strong>
                  </div>
                  <div className="detail-item">
                    <span>CDN Distribution</span>
                    <strong>{checkResult.edgeStatus}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Subdomain Fallback</span>
                    <strong>{checkResult.domain.split(".")[0]}.portfolio.ai</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Honest Status Notice */}
        <section className="pub-status-notice">
          <div className="notice-inner">
            <span className="notice-icon">ℹ️</span>
            <div>
              <h4>Custom Domain Setup Information</h4>
              <p>
                Public domain checking is for feature preview. Custom domain CNAME connection and SSL provisioning can be configured from your authenticated account dashboard.
              </p>
            </div>
            <button className="btn-notice-cta" onClick={handleCtaClick}>
              {isAuthenticated ? "Go to Domain Settings →" : "Sign Up to Connect Domain →"}
            </button>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="pub-domain-features-grid">
          <div className="domain-feature-card">
            <div className="df-icon">🔒</div>
            <h3>Free Automatic SSL</h3>
            <p>Every custom domain receives an enterprise TLS 1.3 Let’s Encrypt SSL certificate auto-renewed indefinitely.</p>
          </div>
          <div className="domain-feature-card">
            <div className="df-icon">⚡</div>
            <h3>Global Edge Hosting</h3>
            <p>Your portfolio is cached across 250+ edge servers worldwide for sub-100ms load times anywhere on Earth.</p>
          </div>
          <div className="domain-feature-card">
            <div className="df-icon">🏷️</div>
            <h3>Free Subdomain Included</h3>
            <p>Every account includes a complimentary <code>yourname.portfolio.ai</code> link right out of the box.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomDomainsPage;
