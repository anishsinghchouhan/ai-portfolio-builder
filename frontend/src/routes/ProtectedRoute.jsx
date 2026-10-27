import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

/**
 * ProtectedRoute: Ensures that only authenticated users can access nested dashboard routes.
 * If authentication is still being restored, displays a clean loading spinner.
 * If unauthenticated, smoothly redirects to /login.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            border: "3px solid rgba(99, 102, 241, 0.3)",
            borderTopColor: "#818cf8",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
