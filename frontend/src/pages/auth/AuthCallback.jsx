import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { authStore } from "../../store/authSlice";
import { ROUTES } from "../../constants/routes";

/**
 * AuthCallback handles Supabase PKCE OAuth (e.g. Google sign-in) & email verification redirects.
 *
 * Requirements:
 * - No manual code exchange call (Supabase detectSessionInUrl handles PKCE code exchange automatically).
 * - Preserves browser auth storage without manual clearing.
 * - Checks supabase.auth.getSession(); if a session exists, navigates to ROUTES.DASHBOARD.
 * - Subscribes to onAuthStateChange and navigates to ROUTES.DASHBOARD on SIGNED_IN.
 * - Unsubscribes on unmount.
 * - Shows the error card ONLY if there is no session AND the URL contains "error" or "error_description".
 * - Otherwise displays the loading state while the session is confirmed.
 */
export const AuthCallback = () => {
  const [status, setStatus] = useState("loading"); // "loading" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // Check for error parameters in URL query or hash
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorParam = searchParams.get("error") || hashParams.get("error");
    const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");

    const handleSession = (session) => {
      if (!isMounted) return;
      if (session) {
        authStore.setState({
          session,
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      navigate(ROUTES.DASHBOARD, { replace: true });
    };

    // 1. Check if a session already exists (e.g. auto-detected by Supabase client)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session) {
        handleSession(session);
      } else if (errorParam || errorDescription) {
        // Show error card ONLY if there is no session AND error params exist in the URL
        setStatus("error");
        setErrorMessage(errorDescription || errorParam || "Authentication failed. Please try signing in again.");
      }
    });

    // 2. Otherwise subscribe to onAuthStateChange and navigate on SIGNED_IN
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "var(--color-background-dark, #0b0f17)",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(16px)",
        padding: "40px",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        textAlign: "center",
        color: "#fff",
      }}>
        {/* Loading State */}
        {status === "loading" && (
          <>
            <div style={{
              width: "48px",
              height: "48px",
              border: "3px solid rgba(99, 102, 241, 0.3)",
              borderTopColor: "#818cf8",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 24px",
            }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "8px", fontWeight: 700 }}>
              Verifying your account...
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Please wait while we confirm your identity.
            </p>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: "1.5rem",
              marginBottom: "12px",
              fontWeight: 700,
              color: "#fca5a5",
            }}>
              Authentication Error
            </h2>
            <p style={{
              color: "#94a3b8",
              fontSize: "0.9rem",
              marginBottom: "24px",
              lineHeight: "1.6",
            }}>
              {errorMessage}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate(ROUTES.SIGNUP)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Sign Up Again
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
