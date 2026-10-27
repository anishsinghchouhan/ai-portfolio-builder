import React from "react";
import "./BlogSection.css";

const FEATURED_ARTICLES = [
  {
    id: "ai-portfolio-prompts-2026",
    title: "10 AI Portfolio Prompts That Get Software Engineers Hired at Vercel & Stripe",
    category: "Career & AI",
    readTime: "5 min read",
    date: "Aug 2, 2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    excerpt: "Discover how generative AI engines parse technical experience into recruiter-optimized project showcases with 99.8% precision.",
  },
  {
    id: "glassmorphism-ui-trends",
    title: "Designing Glassmorphic Developer Portfolios in React 19 & Vanilla CSS",
    category: "Design System",
    readTime: "7 min read",
    date: "Jul 28, 2026",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    excerpt: "A deep dive into backdrop blur tokens, high-contrast typography, and Vercel-inspired dark mode aesthetics for web engineers.",
  },
  {
    id: "ats-resume-parser-breakthrough",
    title: "Why Traditional PDF Resumes Are Failing ATS Scanners (And What AI Does Differently)",
    category: "Recruiter Insights",
    readTime: "4 min read",
    date: "Jul 19, 2026",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    excerpt: "How interactive web portfolios bypass rigid ATS filters and increase recruiter contact rates by up to 300%.",
  },
];

export const BlogSection = () => {
  const handleReadMore = (e, articleId) => {
    e.preventDefault();
    window.location.hash = `#blog-article?id=${articleId}`;
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    window.location.hash = "#blog";
  };

  return (
    <section id="blog" className="blog-section">
      <div className="blog-section-bg-glow" />

      <div className="blog-section-container">
        {/* Section Header */}
        <div className="blog-section-header">
          <div className="blog-section-badge">
            <span className="blog-badge-icon">📰</span>
            <span>Product & Engineering Insights</span>
          </div>

          <h2 className="blog-section-title">
            Latest Articles & <span className="blog-title-gradient">Career Guides</span>
          </h2>

          <p className="blog-section-subtitle">
            Expert strategies on AI resume parsing, glassmorphic web design, and high-converting candidate portfolios.
          </p>
        </div>

        {/* 3 Featured Articles Grid */}
        <div className="blog-section-grid">
          {FEATURED_ARTICLES.map((article) => (
            <article key={article.id} className="blog-section-card">
              <div className="blog-card-image-wrapper">
                <img src={article.image} alt={article.title} className="blog-card-image" />
                <span className="blog-card-category">{article.category}</span>
              </div>

              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span>{article.date}</span>
                  <span className="blog-meta-dot">•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="blog-card-title">{article.title}</h3>
                <p className="blog-card-excerpt">{article.excerpt}</p>

                <a
                  href={`#blog-article?id=${article.id}`}
                  className="blog-card-link"
                  onClick={(e) => handleReadMore(e, article.id)}
                >
                  <span>Read Article</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Footer Action */}
        <div className="blog-section-footer">
          <a href="#blog" className="blog-view-all-btn" onClick={handleViewAll}>
            <span>View All Articles</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
