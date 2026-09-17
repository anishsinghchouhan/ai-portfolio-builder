import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./BillingSubscriptionPage.css";

export const BillingSubscriptionPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const invoices = [
    { id: "INV-2026-001", date: "Oct 01, 2026", amount: "$19.00", status: "Paid", pdf: "Download PDF" },
    { id: "INV-2026-002", date: "Sep 01, 2026", amount: "$19.00", status: "Paid", pdf: "Download PDF" },
  ];

  return (
    <div className={`billing-page-root ${theme}`}>
      <div className="billing-header-bar">
        <div>
          <h1>Billing & Plan Subscription</h1>
          <p>Manage subscription plans, payment methods, credit card details, and invoice history.</p>
        </div>

        <div style={{ padding: "0.5rem 1.25rem", borderRadius: "999px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399", fontWeight: 700 }}>
          ⚡ Active Plan: PRO Tier ($19/mo)
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="pricing-plans-grid">
        {/* Free Plan */}
        <div className="billing-card-box">
          <h3 style={{ margin: "0 0 4px 0" }}>Starter Free</h3>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff" }}>$0 / mo</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: "8px 0 1.25rem 0" }}>Basic portfolio & 1 ATS resume upload.</p>
          <button style={{ width: "100%", height: "42px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontWeight: 600 }}>
            Current Tier
          </button>
        </div>

        {/* Pro Plan */}
        <div className="billing-card-box" style={{ border: "2px solid #818cf8", background: "rgba(79, 70, 229, 0.12)" }}>
          <div style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>⭐ MOST POPULAR</div>
          <h3 style={{ margin: "0 0 4px 0" }}>Pro Candidate</h3>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff" }}>$19 / mo</div>
          <p style={{ fontSize: "0.82rem", color: "#cbd5e1", margin: "8px 0 1.25rem 0" }}>Unlimited AI resumes, custom domain, and full analytics telemetry.</p>
          <button className="btn-upgrade-plan" onClick={() => setShowPaymentSuccess(true)}>
            Upgrade to Pro →
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="billing-card-box">
          <h3 style={{ margin: "0 0 4px 0" }}>Executive / Team</h3>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff" }}>$49 / mo</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: "8px 0 1.25rem 0" }}>Dedicated recruiter branding, custom CSS, and priority AI audit queue.</p>
          <button style={{ width: "100%", height: "42px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontWeight: 600 }}>
            Contact Sales
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="billing-card-box">
        <h3 style={{ margin: "0 0 1rem 0" }}>🧾 Payment Invoices & Billing History</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-dark)", color: "#94a3b8" }}>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Invoice ID</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Date</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Amount</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Status</th>
              <th style={{ padding: "0.75rem", textStyle: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--color-border-dark)" }}>
                <td style={{ padding: "0.85rem", fontWeight: 700 }}>{inv.id}</td>
                <td style={{ padding: "0.85rem", color: "#94a3b8" }}>{inv.date}</td>
                <td style={{ padding: "0.85rem", color: "#ffffff", fontWeight: 700 }}>{inv.amount}</td>
                <td style={{ padding: "0.85rem", color: "#34d399", fontWeight: 700 }}>✓ {inv.status}</td>
                <td style={{ padding: "0.85rem" }}>
                  <button style={{ padding: "0.3rem 0.75rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontSize: "0.75rem", cursor: "pointer" }}>
                    {inv.pdf}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ width: "420px", borderRadius: "24px", padding: "2rem", background: "#111827", border: "1px solid rgba(16,185,129,0.4)", textStyle: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎉</div>
            <h2 style={{ margin: "0 0 0.5rem 0", color: "#ffffff" }}>Payment Successful!</h2>
            <p style={{ fontSize: "0.88rem", color: "#cbd5e1" }}>Your account has been upgraded to Portfolio.ai PRO Tier ($19/mo).</p>
            <button className="btn-upgrade-plan" style={{ width: "100%", marginTop: "1.25rem" }} onClick={() => setShowPaymentSuccess(false)}>
              Continue to PRO Features
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSubscriptionPage;
