import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./BlogArticlePage.css";

export const BlogArticlePage = ({ onBack, onNavigate }) => {
  return (
    <div className="article-page-root">
      <Navbar onNavigateLogin={() => onNavigate("login")} onNavigateSignup={() => onNavigate("signup")} />

      <main className="article-main-container">
        {/* Navigation back button */}
        <button type="button" className="btn-article-back" onClick={onBack || (() => { window.location.hash = "#blog"; })}>
          ← Back to All Articles
        </button>

        {/* Article Header */}
        <header className="article-header">
          <div className="article-meta-badge">
            <span>CAREER & AI • 5 MIN READ</span>
          </div>
          <h1 className="article-main-title">
            10 AI Portfolio Prompts That Get Software Engineers Hired at Vercel & Stripe
          </h1>
          <p className="article-subtitle">
            How generative AI parses developer experience into high-impact case studies, live code embeds, and recruiter-converting landing pages.
          </p>

          <div className="article-author-card">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Alex Rivera"
              className="article-author-img"
            />
            <div>
              <strong className="author-name">Alex Rivera</strong>
              <div className="author-bio">Head of Product at Portfolio.ai • August 2, 2026</div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="article-hero-image-box">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
            alt="AI Coding Showcase"
            className="article-hero-img"
          />
        </div>

        {/* Article Body Content */}
        <article className="article-body-content">
          <h2>1. Why Traditional Static Resumes Fall Short in 2026</h2>
          <p>
            Recruiters at top tech firms spend an average of 6 seconds reviewing traditional PDF resumes. With hundreds of applications per role, text-heavy documents often fail to demonstrate true engineering craftsmanship.
          </p>
          <p>
            An interactive web portfolio built with Portfolio.ai transforms static bullet points into live project demonstrations, benchmark charts, and interactive code snippets that instantly capture recruiter interest.
          </p>

          <h2>2. Prompt #1: Extracting Quantifiable Engineering Impact</h2>
          <blockquote className="article-quote">
            "Parse my resume and extract the top 3 technical projects. For each project, write a 2-sentence executive summary emphasizing performance improvements (e.g. latency reductions, scale, memory optimization)."
          </blockquote>
          <p>
            Generative AI automatically structures your raw technical achievements into ATS-aligned metrics that speak directly to hiring managers.
          </p>

          <h2>3. Integrating Live GitHub & Recruiter Analytics</h2>
          <p>
            By linking your live portfolio with real-time candidate analytics, you get instant visibility into when hiring teams view your projects, download your resume, or click your GitHub links.
          </p>

          {/* CTA Box */}
          <div className="article-cta-box">
            <h3>Ready to Build Your AI Developer Portfolio?</h3>
            <p>Upload your PDF resume and generate a multi-page portfolio in less than 60 seconds.</p>
            <button
              type="button"
              className="btn-article-cta"
              onClick={() => { window.location.hash = "#ai-resume-parser"; }}
            >
              Generate AI Portfolio Free →
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
