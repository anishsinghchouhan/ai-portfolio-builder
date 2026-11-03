import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import api from "../services/api";
import { normalizeSummary } from "../utils/normalizeSummary";

export const SUMMARY_QUERY_KEY = ["summary"];

/**
 * Triggers an invalidation of the summary query in the QueryClient.
 * Can be called from mutation callbacks or event handlers anywhere in the app.
 */
export const triggerDashboardRefresh = () => {
  queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("dashboard:refresh"));
  }
};

/**
 * Fetcher function for dashboard summary
 */
export const fetchSummaryApi = async () => {
  const response = await api.get("/dashboard/summary");
  if (response.data?.success && response.data?.data) {
    return normalizeSummary(response.data.data);
  }
  throw new Error(response.data?.message || "Failed to load dashboard summary.");
};

/**
 * Shared hook to fetch Dashboard Summary data using @tanstack/react-query.
 *
 * Requirements:
 * - queryKey: ["summary"]
 * - staleTime: 60_000 (60s)
 * - refetchOnWindowFocus: false
 *
 * Automatically deduplicates requests and ensures only one request is in flight.
 */
export const useSummary = () => {
  const query = useQuery({
    queryKey: SUMMARY_QUERY_KEY,
    queryFn: fetchSummaryApi,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const errorMessage = query.error
    ? query.error?.response?.data?.error?.message ||
      query.error?.response?.data?.message ||
      query.error?.message ||
      "Could not connect to the dashboard service. Please check your network or try again."
    : null;

  return {
    summary: query.data || null,
    data: query.data || null,
    loading: query.isLoading,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: errorMessage,
    refetch: query.refetch,
  };
};

export default useSummary;
