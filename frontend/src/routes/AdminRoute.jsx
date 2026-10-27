import React from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

/**
 * AdminRoute: Restricts access exclusively to authenticated users with ADMIN role.
 * Non-admin users are shown a clean 403 Forbidden page.
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, appUser, user } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--color-background-dark, #0b0f17)",
          color: "#fff",
        }}
      >
        <p style={{ color: "#94a3b8" }}>Verifying admin authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const role = appUser?.role || user?.user_metadata?.role || user?.role || "USER";
  const isAdmin = role === "ADMIN";

  if (!isAdmin) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--color-background-dark, #0b0f17)",
          padding: "20px",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            textAlign: "center",
            padding: "40px",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "16px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚫</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "8px", color: "#f87171" }}>
            403 — Forbidden
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "24px" }}>
            You do not have administrative privileges to access the System Control Panel.
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            style={{
              display: "inline-block",
              padding: "10px 24px",
              borderRadius: "8px",
              background: "#6366f1",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
