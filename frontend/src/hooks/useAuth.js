import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { authStore } from "../store/authSlice";
import api from "../services/api";

let syncPromise = null;
let syncedUserId = null;

/**
 * Calls GET /users/me ONCE after login and stores the result in authStore (appUser).
 * If a request is already in-flight or if appUser for this user is already in the store,
 * it returns the existing data without calling the backend again.
 */
export const syncBackendUser = async (user) => {
  const targetUser = user || authStore.getState().user;
  if (!targetUser?.id) return null;

  const currentAppUser = authStore.getState().appUser;
  // If user is already synced in store, do not call /users/me again
  if (currentAppUser && syncedUserId === targetUser.id) {
    return currentAppUser;
  }

  // Deduplicate in-flight requests (e.g. React StrictMode or multiple simultaneous mounts)
  if (syncPromise && syncedUserId === targetUser.id) {
    return syncPromise;
  }

  syncedUserId = targetUser.id;
  syncPromise = api
    .get("/users/me")
    .then((res) => {
      if (res.data?.data) {
        authStore.setState({ appUser: res.data.data });
        return res.data.data;
      }
      return null;
    })
    .catch((err) => {
      if (import.meta.env.DEV) {
        console.warn("Backend user sync notice:", err.message);
      }
      // Reset so a subsequent login or retry can try again
      syncedUserId = null;
      return null;
    })
    .finally(() => {
      syncPromise = null;
    });

  return syncPromise;
};

// Global singleton flag so auth listener & session check run ONCE for the application
let authInitialized = false;

const initAuth = () => {
  if (authInitialized) return;
  authInitialized = true;

  // Clean up any leftover demo flags
  if (typeof localStorage !== "undefined" && localStorage.getItem("ai_portfolio_demo_guest")) {
    localStorage.removeItem("ai_portfolio_demo_guest");
  }

  // 1. Initial session check from Supabase
  supabase.auth
    .getSession()
    .then(({ data: { session } }) => {
      if (session?.user) {
        authStore.setState({
          session,
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        syncBackendUser(session.user);
      } else {
        authStore.setState({ isLoading: false });
      }
    })
    .catch(() => {
      authStore.setState({ isLoading: false });
    });

  // 2. Single global listener for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
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
        if (session?.user) {
          syncBackendUser(session.user);
        }
        break;

      case "SIGNED_OUT":
        syncedUserId = null;
        syncPromise = null;
        authStore.setState({
          session: null,
          user: null,
          appUser: null,
          isAuthenticated: false,
          isLoading: false,
          pendingVerificationEmail: null,
          error: null,
        });
        break;

      case "PASSWORD_RECOVERY":
        sessionStorage.setItem("supabase_auth_recovery", "true");
        authStore.setState({
          session,
          user: session?.user || null,
          isAuthenticated: true,
          isLoading: false,
        });
        if (window.location.hash !== "#reset-password") {
          window.location.hash = "#reset-password";
        }
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
};

// Initialize once when module loads
initAuth();

/**
 * Maps raw Supabase auth errors to user-friendly messages.
 */
const mapAuthError = (error) => {
  if (!error) return "An unknown error occurred.";

  if (import.meta.env.DEV) {
    console.error("[Supabase Auth Error Details]:", error);
  }

  const msg = error.message || String(error);

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

  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Your email is not verified yet. Please check your inbox for the verification link.";
  }

  if (msg.includes("rate limit") || msg.includes("too many requests") || error.status === 429) {
    return "Too many attempts. Please wait a few minutes before trying again.";
  }

  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || error.name === "TypeError") {
    return "Unable to connect to the authentication server. Please check your internet connection and try again.";
  }

  if (msg.includes("AuthApiError") || msg.includes("AuthError")) {
    return "Authentication failed. Please try again.";
  }

  return msg;
};

const getCallbackUrl = () => `${window.location.origin}/auth/callback`;

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    // Component only subscribes to the shared store. Zero duplicate network requests.
    const unsubscribe = authStore.subscribe(setAuthState);
    return unsubscribe;
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
    sessionStorage.removeItem("supabase_auth_recovery");
    localStorage.removeItem("ai_portfolio_demo_guest");
    syncedUserId = null;
    syncPromise = null;
    await supabase.auth.signOut().catch(() => {});
    authStore.setState({
      user: null,
      appUser: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      pendingVerificationEmail: null,
      error: null,
    });
  };

  // ─── Forgot Password ────────────────────────────────────
  const forgotPassword = async (email) => {
    const cleanEmail = email ? email.toLowerCase().trim() : "";
    const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
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
