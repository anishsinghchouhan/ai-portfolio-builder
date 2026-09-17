import React from "react";

export const PrivateRoute = ({ children, isAuthenticated, onRedirect }) => {
  if (!isAuthenticated) {
    if (onRedirect) {
      onRedirect("login");
    }
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-light, #fff)" }}>
        <h2>🔒 Authentication Required</h2>
        <p>Please log in to access this page.</p>
        <button
          onClick={() => onRedirect && onRedirect("login")}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
