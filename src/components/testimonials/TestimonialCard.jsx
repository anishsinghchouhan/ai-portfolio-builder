import React from "react";

export const TestimonialCard = ({ avatar, name, profession, rating = 5, review }) => {
  return (
    <div className="testimonial-card">
      <div className="quote-icon-watermark">“</div>

      <div>
        {/* Rating Stars */}
        <div className="testimonial-rating-row">
          {Array.from({ length: rating }).map((_, i) => (
            <svg key={i} className="star-icon" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>

        {/* Review Quote */}
        <p className="testimonial-review">"{review}"</p>
      </div>

      {/* User Profile Footer */}
      <div className="testimonial-user-profile">
        <img src={avatar} alt={name} className="user-avatar-img" />
        <div className="user-details-text">
          <h4>{name}</h4>
          <span>{profession}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
