import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./BlogListPage.css";

const BLOG_POSTS = [
  {
    id: "ai-portfolio-tips-2026",
    title: "10 AI Portfolio Prompts That Get Software Engineers Hired at Vercel & Stripe",
    category: "Career & AI",
    readTime: "5 min read",
    date: "August 2, 2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    excerpt: "Discover how generative AI engines parse technical experience into recruiter-optimized project showcases with 99.8% precision.",
    author: "Alex Rivera, Head of Product",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "glassmorphism-ui-trends",
    title: "Designing Glassmorphic Developer Portfolios in React 19 & Vanilla CSS",
    category: "Design System",
    readTime: "7 min read",
    date: "July 28, 2026",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    excerpt: "A deep dive into backdrop blur tokens, high-contrast typography, and Vercel-inspired dark mode aesthetics for web engineers.",
    author: "Sarah Chen, Lead Designer",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "ats-resume-parser-breakthrough",
    title: "Why Traditional PDF Resumes Are Failing ATS Scanners (And What AI Does Differently)",
    category: "Recruiter Insights",
    readTime: "4 min read",
    date: "July 19, 2026",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    excerpt: "How interactive web portfolios bypass rigid ATS filters and increase recruiter contact rates by up to 300%.",
    author: "Marcus Vance, Talent Advisor",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
];

export const BlogListPage = ({ onSelectArticle, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Career & AI", "Design System", "Recruiter Insights"];

  const filteredPosts = selectedCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  const handleArticleClick = (post) => {
    localStorage.setItem("selected_blog_id", post.id);
    if (onSelectArticle) onSelectArticle(post);
    else window.location.hash = `#blog-article?id=${post.id}`;
  };

  return (
    <div className="blog-page-root">
      <Navbar onNavigateLogin={() => onNavigate("login")} onNavigateSignup={() => onNavigate("signup")} />

      <main className="blog-main-content">
        {/* Header Hero */}
        <section className="blog-hero-section">
          <div className="blog-badge">
            <span>📚 PORTFOLIO.AI PRODUCT BLOG</span>
          </div>
          <h1 className="blog-title">
            Engineering Better <span className="blog-title-gradient">Developer Portfolios</span>
          </h1>
          <p className="blog-subtitle">
            Guides, design inspiration, and recruiter insights to help software engineers & designers stand out in 2026.
          </p>

          {/* Category Tabs */}
          <div className="blog-categories-group">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Post Card */}
        {filteredPosts.length > 0 && (
          <section className="featured-post-container" onClick={() => handleArticleClick(filteredPosts[0])}>
            <div className="featured-post-card">
              <div className="featured-img-box">
                <img src={filteredPosts[0].image} alt={filteredPosts[0].title} className="featured-img" />
              </div>
              <div className="featured-info-box">
                <div className="post-meta-row">
                  <span className="post-category-tag">{filteredPosts[0].category}</span>
                  <span className="post-meta-text">• {filteredPosts[0].readTime}</span>
                </div>
                <h2 className="featured-post-title">{filteredPosts[0].title}</h2>
                <p className="featured-excerpt">{filteredPosts[0].excerpt}</p>
                <div className="author-row">
                  <img src={filteredPosts[0].authorAvatar} alt={filteredPosts[0].author} className="author-avatar" />
                  <div className="author-meta">
                    <strong>{filteredPosts[0].author}</strong>
                    <span>{filteredPosts[0].date}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="blog-grid-section">
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <div key={post.id} className="blog-post-card" onClick={() => handleArticleClick(post)}>
                <div className="card-img-box">
                  <img src={post.image} alt={post.title} className="card-img" />
                  <span className="card-category-pill">{post.category}</span>
                </div>
                <div className="card-body">
                  <span className="card-read-time">{post.readTime}</span>
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-excerpt">{post.excerpt}</p>
                </div>
                <div className="card-footer">
                  <div className="author-row-mini">
                    <img src={post.authorAvatar} alt={post.author} className="author-avatar-mini" />
                    <span>{post.author}</span>
                  </div>
                  <span className="read-more-link">Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogListPage;
