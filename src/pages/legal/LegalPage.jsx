import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./LegalPage.css";

const CONTENT_MAP = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "Your data privacy, security, and algorithmic transparency at Portfolio.ai.",
    lastUpdated: "August 2026",
    content: (
      <>
        <h2>1. Information We Collect</h2>
        <p>Portfolio.ai processes resume files (PDF, DOCX) and candidate profile data strictly for the purpose of generating interactive web portfolios. We never sell your personal data to third-party data brokers.</p>
        <h2>2. AI Processing & Data Retention</h2>
        <p>Resumes uploaded to our AI parser are stored securely on encrypted Supabase Storage instances with AES-256 encryption at rest. You can permanently delete your parsed resume data at any time from Account Settings.</p>
        <h2>3. Cookie & Visitor Tracking</h2>
        <p>Portfolio.ai uses privacy-first analytics to measure recruiter visits without tracking cross-site user activity.</p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Guidelines and terms governing your use of Portfolio.ai services and hosting.",
    lastUpdated: "August 2026",
    content: (
      <>
        <h2>1. Acceptance of Terms</h2>
        <p>By creating an account or hosting a portfolio on Portfolio.ai, you agree to comply with our acceptable use policies and community guidelines.</p>
        <h2>2. Portfolio Hosting & Custom Domains</h2>
        <p>Free and PRO plan users receive edge deployment on SSL-enabled subdomains or custom domains. Portfolio.ai reserves the right to terminate accounts deploying phishing or malicious content.</p>
      </>
    ),
  },
  security: {
    title: "Security & Compliance",
    subtitle: "Enterprise-grade infrastructure protection and encryption protocols.",
    lastUpdated: "August 2026",
    content: (
      <>
        <h2>1. Infrastructure Security</h2>
        <p>Our platform is deployed across SOC2 Type II compliant global edge networks with automated DDoS protection and TLS 1.3 SSL encryption.</p>
        <h2>2. Authentication & Data Protection</h2>
        <p>User sessions are protected with Supabase Auth JWT tokens, row-level security (RLS), and opt-in Time-Based One-Time Password (2FA) verification.</p>
      </>
    ),
  },
  careers: {
    title: "Careers at Portfolio.ai",
    subtitle: "Join our remote team building the future of AI-driven developer showcase platforms.",
    lastUpdated: "Hiring Openings - August 2026",
    content: (
      <>
        <h2>Open Positions</h2>
        <div className="job-card-box">
          <h3>Senior Frontend Engineer (React 19 / Vite / WebGL)</h3>
          <p>Remote (US / Europe / Asia) • Full-time</p>
          <button className="btn-job-apply" onClick={() => window.location.hash = "#signup"}>Apply Now →</button>
        </div>
        <div className="job-card-box">
          <h3>AI / Machine Learning Engineer (LLM Fine-Tuning)</h3>
          <p>Remote (US / Europe) • Full-time</p>
          <button className="btn-job-apply" onClick={() => window.location.hash = "#signup"}>Apply Now →</button>
        </div>
      </>
    ),
  },
  about: {
    title: "About Portfolio.ai",
    subtitle: "Empowering 100,000+ software engineers & designers to build high-converting personal websites.",
    lastUpdated: "Founded 2026",
    content: (
      <>
        <h2>Our Mission</h2>
        <p>We believe that static PDF resumes fail to convey modern engineering talent. Our mission is to automate portfolio design using generative AI, letting developers focus on shipping code while our platform handles presentation.</p>
      </>
    ),
  },
};

export const LegalPage = ({ type = "privacy", onNavigate }) => {
  const currentInfo = CONTENT_MAP[type] || CONTENT_MAP.privacy;

  return (
    <div className="legal-page-root">
      <Navbar onNavigateLogin={() => onNavigate("login")} onNavigateSignup={() => onNavigate("signup")} />

      <main className="legal-main-container">
        <header className="legal-header">
          <span className="legal-badge">{currentInfo.lastUpdated}</span>
          <h1 className="legal-title">{currentInfo.title}</h1>
          <p className="legal-subtitle">{currentInfo.subtitle}</p>
        </header>

        <div className="legal-card-body">
          {currentInfo.content}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
