import React from "react";
import Button from "../components/ui/Button";

export const NotFoundPage = ({ onGoHome }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background-dark, #0b0f17)",
        color: "#ffffff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>Page Not Found</h2>
      <p style={{ color: "#94a3b8", maxWidth: "480px", marginBottom: "28px" }}>
        Oops! The page or path you are looking for does not exist or has been moved.
      </p>
      <Button variant="primary" size="large" onClick={onGoHome}>
        🏠 Return to Landing Page
      </Button>
    </div>
  );
};

export default NotFoundPage;
