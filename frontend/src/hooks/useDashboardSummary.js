import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";
import { normalizeSummary } from "../utils/normalizeSummary";

/**
 * Custom event helper to notify useDashboardSummary to refresh data silently
 * from anywhere in the application (after profile save, resume upload, publish).
 */
export const triggerDashboardRefresh = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("dashboard:refresh"));
  }
};

/**
 * Custom hook to fetch Dashboard Summary data.
 * - Initial load shows loading skeleton.
 * - Silent refetch (no loading skeleton) runs on window focus, tab visibility,
 *   and every 60 seconds while the tab is visible.
 * - Stops polling while an error is set.
 * - Cleans up all listeners and the interval on unmount.
 *
 * @returns {{
 *   summary: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: (options?: { silent?: boolean }) => Promise<void>
 * }}
 */
export const useDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep ref to error state so interval and event callbacks see the latest value
  const errorRef = useRef(error);
  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  const fetchSummary = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get("/dashboard/summary");
      if (response.data?.success && response.data?.data) {
        const normalized = normalizeSummary(response.data.data);
        setSummary(normalized);
      } else {
        throw new Error(response.data?.message || "Failed to load dashboard summary.");
      }
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Could not connect to the dashboard service. Please check your network or try again.";
      setError(message);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  // 1. Initial page load fetch
  useEffect(() => {
    fetchSummary({ silent: false });
  }, [fetchSummary]);

  // 2. Auto-update listeners: window focus, tab visibility, 60s timer, custom refresh event
  useEffect(() => {
    const handleSilentRefresh = () => {
      // Do not poll or silent-refetch if an error is active
      if (!errorRef.current && typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchSummary({ silent: true });
      }
    };

    // Refetch on window focus
    window.addEventListener("focus", handleSilentRefresh);

    // Refetch when tab becomes visible
    document.addEventListener("visibilitychange", handleSilentRefresh);

    // Refetch when a page action (save, upload, publish) triggers refresh
    const handleCustomRefresh = () => {
      fetchSummary({ silent: true });
    };
    window.addEventListener("dashboard:refresh", handleCustomRefresh);

    // Refetch every 60 seconds while tab is visible (if no error)
    const intervalId = setInterval(() => {
      if (!errorRef.current && document.visibilityState === "visible") {
        fetchSummary({ silent: true });
      }
    }, 60000);

    // Clean up all listeners and interval on unmount
    return () => {
      window.removeEventListener("focus", handleSilentRefresh);
      document.removeEventListener("visibilitychange", handleSilentRefresh);
      window.removeEventListener("dashboard:refresh", handleCustomRefresh);
      clearInterval(intervalId);
    };
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};

export default useDashboardSummary;
