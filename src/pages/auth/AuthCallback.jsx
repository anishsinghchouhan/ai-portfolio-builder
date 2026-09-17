import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { authStore } from "../../store/authSlice";

/**
 * AuthCallback handles Supabase PKCE & Email Verification auth redirects.
 *
 * Flow Strategy:
 * 1. Listens for `onAuthStateChange` (SIGNED_IN / TOKEN_REFRESHED).
 * 2. Checks `getSession()` for auto-detected session.
 * 3. Exchanges authorization `code` via `exchangeCodeForSession(code)` or `verifyOtp({ token_hash, type })`.
 * 4. Restores Supabase session in `authStore` and redirects to `/#dashboard`.
 * 5. Displays actual Supabase error messages on failure (no artificial timeouts).
 */
export const AuthCallback = () => {
  const [status, setStatus] = useState("processing"); // "processing" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    const handleSuccess = (session, isRecovery) => {
      if (!isSubscribed) return;
      if (session) {
        authStore.setState({
          session,
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      setStatus("success");
      setTimeout(() => {
        window.location.replace(isRecovery ? "/#reset-password" : "/#dashboard");
      }, 1000);
    };

    const handleError = (msg) => {
      if (!isSubscribed) return;
      setStatus("error");
      setErrorMessage(msg || "Failed to verify email. Please try signing in.");
    };

    const processAuthCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");
        const errorParam = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");
        const isRecovery = type === "recovery" || window.location.hash.includes("type=recovery");

        // 1. If Supabase returned an explicit error in URL parameters
        if (errorParam) {
          handleError(errorDescription || `Authentication error: ${errorParam}`);
          return;
        }

        // 2. Check if active session ALREADY exists (e.g. auto-detected by Supabase client)
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          handleSuccess(currentSession, isRecovery);
          return;
        }

        // 3. PKCE Flow: Exchange authorization code for session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[AuthCallback] PKCE Code Exchange Error:", error);
            // Double check if session was created concurrently
            const { data: { session: checkSession } } = await supabase.auth.getSession();
            if (checkSession) {
              handleSuccess(checkSession, isRecovery);
              return;
            }
            // Display actual Supabase error message
            handleError(error.message || "Invalid or expired verification link.");
            return;
          }

          if (data?.session) {
            handleSuccess(data.session, isRecovery);
            return;
          }
        }

        // 4. OTP Token Hash Flow (if token_hash is present)
        if (tokenHash && type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type,
          });
          if (error) {
            console.error("[AuthCallback] Verify OTP Error:", error);
            handleError(error.message || "Verification link is invalid or expired.");
            return;
          }
          if (data?.session) {
            handleSuccess(data.session, isRecovery);
            return;
          }
        }

        // 5. Implicit Flow / Hash Fragment Fallback
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.get("access_token")) {
          const { data: { session: hashSession } } = await supabase.auth.getSession();
          if (hashSession) {
            handleSuccess(hashSession, isRecovery);
            return;
          }
        }

        // 6. Final fallback check
        const { data: { session: finalSession } } = await supabase.auth.getSession();
        if (finalSession) {
          handleSuccess(finalSession, isRecovery);
          return;
        }

        // If no code, token, or session exists
        handleError("No verification link parameters found. Please check your link or sign in.");
      } catch (err) {
        console.error("[AuthCallback] Unexpected Exception:", err);
        handleError(err.message || "An unexpected error occurred during verification.");
      }
    };

    // Secondary guarantee: Listen for SIGNED_IN event from Supabase client
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        const url = new URL(window.location.href);
        const isRecovery = url.searchParams.get("type") === "recovery";
        handleSuccess(session, isRecovery);
      }
    });

    processAuthCallback();

    return () => {
      isSubscribed = false;
      subscription?.unsubscribe();
    };
  }, []);

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
        {/* Processing State */}
        {status === "processing" && (
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

        {/* Success State */}
        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
              ✅
            </div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "8px", fontWeight: 700 }}>
              Verification Successful!
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Redirecting you to your account...
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
              Verification Link Issue
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
                onClick={() => { window.location.replace("/#login"); }}
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
                onClick={() => { window.location.replace("/#signup"); }}
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
