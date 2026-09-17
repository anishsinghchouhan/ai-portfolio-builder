import React from "react";

export const AdminRoute = ({ children, userRole, onRedirect }) => {
  if (userRole !== "ADMIN") {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-light, #fff)" }}>
        <h2>🚫 403 Forbidden Access</h2>
        <p>You do not have permission to view the Admin Dashboard.</p>
        <button
          onClick={() => onRedirect && onRedirect("dashboard")}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
