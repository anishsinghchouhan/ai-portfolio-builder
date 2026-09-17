import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { authStore } from "../store/authSlice";
import api from "../services/api";

/**
 * Silently syncs authenticated user with Express backend PostgreSQL database
 */
const syncBackendUser = async () => {
  try {
    const res = await api.get("/users/me");
    if (res.data?.data) {
      authStore.setState({ appUser: res.data.data });
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("Backend user sync silent notice:", err.message);
    }
  }
};

/**
 * Maps raw Supabase auth errors to user-friendly messages.
 */
const mapAuthError = (error) => {
  if (!error) return "An unknown error occurred.";

  if (import.meta.env.DEV) {
    console.error("[Supabase Auth Error Details]:", error);
  }

  const msg = error.message || String(error);

  // Signup errors
  if (msg.includes("User already registered") || msg.includes("already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (msg.includes("Password should be at least")) {
    return "Password is too short. Please use at least 6 characters.";
  }
  if (msg.includes("Unable to validate email address")) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("Signups not allowed")) {
    return "Signups are currently disabled. Please contact support.";
  }

  // Login errors
  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Your email is not verified yet. Please check your inbox for the verification link.";
  }

  // Rate limit
  if (msg.includes("rate limit") || msg.includes("too many requests") || error.status === 429) {
    return "Too many attempts. Please wait a few minutes before trying again.";
  }

  // Network errors
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || error.name === "TypeError") {
    return "Unable to connect to the authentication server. Please check your internet connection and try again.";
  }

  // Generic fallback — avoid exposing raw Supabase internals
  if (msg.includes("AuthApiError") || msg.includes("AuthError")) {
    return "Authentication failed. Please try again.";
  }

  return msg;
};

/**
 * Auth callback redirect URL — uses /auth/callback path (not hash)
 * because Supabase appends tokens as URL fragments which would
 * collide with hash-based routing.
 */
const getCallbackUrl = () => `${window.location.origin}/auth/callback`;

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribeStore = authStore.subscribe(setAuthState);

    // Initialize session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        authStore.setState({
          session,
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        syncBackendUser();
      } else {
        authStore.setState({ isLoading: false });
      }
    }).catch(() => {
      authStore.setState({ isLoading: false });
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          authStore.setState({
            session,
            user: session?.user || null,
            isAuthenticated: !!session,
            isLoading: false,
            error: null,
          });
          if (session) {
            syncBackendUser();
          }
          break;

        case "SIGNED_OUT":
          authStore.setState({
            session: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            pendingVerificationEmail: null,
            error: null,
          });
          break;

        case "PASSWORD_RECOVERY":
          // User arrived via password reset link — redirect to reset page
          authStore.setState({
            session,
            user: session?.user || null,
            isAuthenticated: true,
            isLoading: false,
          });
          break;

        case "USER_UPDATED":
          authStore.setState({
            session,
            user: session?.user || null,
            isLoading: false,
          });
          break;

        default:
          authStore.setState({
            session,
            user: session?.user || null,
            isAuthenticated: !!session,
            isLoading: false,
          });
      }
    });

    return () => {
      unsubscribeStore();
      subscription?.unsubscribe();
    };
  }, []);

  // ─── Signup ──────────────────────────────────────────────
  const signup = async ({ email, password, fullName }) => {
    try {
      const cleanEmail = email ? email.toLowerCase().trim() : "";

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: getCallbackUrl(),
        },
      });

      if (error) throw error;

      // Supabase returns user with identities = [] if user is already registered
      if (data?.user && data?.user?.identities && data.user.identities.length === 0) {
        throw new Error("User already registered");
      }

      authStore.setState({
        pendingVerificationEmail: cleanEmail,
        isAuthenticated: false,
        isLoading: false,
      });

      return data;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  // ─── Login ───────────────────────────────────────────────
  const login = async ({ email, password }) => {
    try {
      const cleanEmail = email ? email.toLowerCase().trim() : "";

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  // ─── Google OAuth ────────────────────────────────────────
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getCallbackUrl() },
    });
    if (error) throw new Error(mapAuthError(error));
    return data;
  };

  // ─── Logout ──────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut().catch(() => { });
    authStore.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      pendingVerificationEmail: null,
      error: null,
    });
  };

  // ─── Forgot Password ────────────────────────────────────
  const forgotPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getCallbackUrl(),
    });
    if (error) throw new Error(mapAuthError(error));
    return data;
  };

  // ─── Reset Password ─────────────────────────────────────
  const resetPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(mapAuthError(error));
    return data;
  };

  // ─── Magic Link ──────────────────────────────────────────
  const loginWithMagicLink = async (email) => {
    const cleanEmail = email ? email.toLowerCase().trim() : "";
    const { data, error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: getCallbackUrl(),
      },
    });
    if (error) throw new Error(mapAuthError(error));
    return data;
  };

  // ─── Resend Verification Email ───────────────────────────
  const resendVerificationEmail = async (email) => {
    try {
      const cleanEmail = email ? email.toLowerCase().trim() : "";
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
        options: {
          emailRedirectTo: getCallbackUrl(),
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  return {
    ...authState,
    signup,
    login,
    loginWithMagicLink,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
  };
};

export default useAuth;
