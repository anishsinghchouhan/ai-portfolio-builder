import React, { useState, useEffect } from "react";
import TESTIMONIALS from "../../data/testimonials";
import TestimonialCard from "./TestimonialCard";
import "./TestimonialsSection.css";

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Responsive items per page check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(TESTIMONIALS.length / cardsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-bg-glow" />

      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="testimonials-badge">
            <span>✨ USER REVIEWS & SUCCESS STORIES</span>
          </div>
          <h2 className="testimonials-title">
            Loved by 10,000+ Candidates at <br />
            <span className="testimonials-title-gradient">Top Tech Companies</span>
          </h2>
          <p className="testimonials-subtitle">
            Read how software engineers, product designers, and managers used Portfolio.ai to land interviews and showcase their work.
          </p>
        </div>

        {/* Carousel Controls Header Row */}
        <div className="carousel-controls-row">
          {/* Indicator Dots */}
          <div className="carousel-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${currentIndex === idx ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Previous / Next Arrow Buttons */}
          <div className="carousel-arrows">
            <button className="carousel-arrow-btn" onClick={handlePrev} aria-label="Previous testimonials">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="carousel-arrow-btn" onClick={handleNext} aria-label="Next testimonials">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Track Wrapper */}
        <div className="carousel-track-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 + (24 * (cardsPerPage - 1) / cardsPerPage))}%)`,
            }}
          >
            {TESTIMONIALS.map((item) => (
              <TestimonialCard
                key={item.id}
                avatar={item.avatar}
                name={item.name}
                profession={item.profession}
                rating={item.rating}
                review={item.review}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
