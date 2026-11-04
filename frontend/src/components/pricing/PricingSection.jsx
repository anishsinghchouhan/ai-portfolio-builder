import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "./PricingSection.css";

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (planType) => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.SIGNUP);
    }
  };

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-container">
        {/* Section Header */}
        <div className="pricing-header">
          <div className="pricing-badge">
            <span>💎 SIMPLE & TRANSPARENT PRICING</span>
          </div>
          <h2 className="pricing-title">
            Build Your Portfolio Free. <br />
            <span className="pricing-title-gradient">Upgrade as You Grow.</span>
          </h2>
          <p className="pricing-subtitle">
            No credit card required to get started. Cancel or upgrade anytime with a 14-day money-back guarantee.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="billing-toggle-container">
            <span className={`toggle-label ${!isYearly ? "active" : ""}`}>Monthly</span>
            <button
              type="button"
              className={`toggle-switch-btn ${isYearly ? "yearly" : ""}`}
              onClick={() => setIsYearly(!isYearly)}
              aria-label="Toggle annual or monthly pricing"
            >
              <div className="toggle-switch-thumb" />
            </button>
            <span className={`toggle-label ${isYearly ? "active" : ""}`}>
              Annual <span className="discount-tag">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-cards-grid">
          {/* Starter Plan */}
          <div className="pricing-card">
            <div className="card-plan-header">
              <span className="plan-name">Free Starter</span>
              <p className="plan-desc">Perfect for students & junior engineers creating their first portfolio.</p>
              <div className="plan-price-row">
                <span className="price-currency">$</span>
                <span className="price-amount">0</span>
                <span className="price-period">/ forever</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li>✓ 1 Active AI Portfolio</li>
              <li>✓ Standard PDF Resume Parser</li>
              <li>✓ Free Subdomain (name.portfolio.ai)</li>
              <li>✓ 5 Basic Aesthetic Themes</li>
              <li>✓ Standard Mobile Responsive Layout</li>
            </ul>

            <button
              type="button"
              className="btn-plan-action secondary"
              onClick={() => handlePlanClick("starter")}
            >
              {isAuthenticated ? "Current Plan / Setup" : "Get Started Free"}
            </button>
          </div>

          {/* Pro Developer Plan (Featured) */}
          <div className="pricing-card featured">
            <div className="featured-badge-ribbon">🔥 MOST POPULAR</div>
            <div className="card-plan-header">
              <span className="plan-name">Pro Developer</span>
              <p className="plan-desc">Engineered for ambitious engineers & designers targeting top tech roles.</p>
              <div className="plan-price-row">
                <span className="price-currency">$</span>
                <span className="price-amount">{isYearly ? "12" : "15"}</span>
                <span className="price-period">/ month</span>
              </div>
              {isYearly && <span className="billing-cycle-note">Billed annually ($144/yr)</span>}
            </div>

            <ul className="plan-features-list">
              <li>✓ Unlimited AI Portfolio Websites</li>
              <li>✓ Generative Deep Resume Parser (99.8% precision)</li>
              <li>✓ 30+ Premium Framer & Vercel Inspired Themes</li>
              <li>✓ Custom Domain Setup + Free SSL Certificate</li>
              <li>✓ Real-Time Recruiter Analytics & Visitor Heatmaps</li>
              <li>✓ Priority Edge CDN Speed & SEO Meta Generation</li>
            </ul>

            <button
              type="button"
              className="btn-plan-action primary"
              onClick={() => handlePlanClick("pro")}
            >
              {isAuthenticated ? "Upgrade to Pro →" : "Start 14-Day Free Pro Trial →"}
            </button>
          </div>

          {/* Executive & Team Plan */}
          <div className="pricing-card">
            <div className="card-plan-header">
              <span className="plan-name">Executive / Team</span>
              <p className="plan-desc">For Tech Leads, CTOs, and agency founders managing multiple brands.</p>
              <div className="plan-price-row">
                <span className="price-currency">$</span>
                <span className="price-amount">{isYearly ? "29" : "35"}</span>
                <span className="price-period">/ month</span>
              </div>
              {isYearly && <span className="billing-cycle-note">Billed annually ($348/yr)</span>}
            </div>

            <ul className="plan-features-list">
              <li>✓ Everything in Pro Plan</li>
              <li>✓ White-Label Custom Branding</li>
              <li>✓ Custom Domain DNS Configuration Assistance</li>
              <li>✓ Unlimited PDF & Markdown Exporting</li>
              <li>✓ 1-on-1 Portfolio Design Consultation</li>
              <li>✓ 24/7 Dedicated Priority Support</li>
            </ul>

            <button
              type="button"
              className="btn-plan-action secondary"
              onClick={() => handlePlanClick("executive")}
            >
              {isAuthenticated ? "Manage Subscription" : "Contact Sales / Upgrade"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
