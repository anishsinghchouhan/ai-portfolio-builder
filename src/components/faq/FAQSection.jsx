import React, { useState } from "react";
import FAQS from "../../data/faq";
import FAQItem from "./FAQItem";
import "./FAQSection.css";

export const FAQSection = () => {
  // Allow opening single item or multiple. Default first item open.
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-bg-glow" />

      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <div className="faq-badge">
            <span>✨ FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="faq-title">
            Got Questions? We Have <br />
            <span className="faq-title-gradient">Clear Answers</span>
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about AI resume parsing, portfolio themes, custom domain hosting, and candidate analytics.
          </p>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="accordion-list">
          {FAQS.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
