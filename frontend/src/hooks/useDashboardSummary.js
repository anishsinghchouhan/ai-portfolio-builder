import { queryClient } from "../lib/queryClient";
import { useSummary, SUMMARY_QUERY_KEY, fetchSummaryApi } from "./useSummary";

/**
 * Custom event helper to notify the query client to refresh summary data silently
 * from anywhere in the application (after profile save, resume upload, publish).
 */
export const triggerDashboardRefresh = () => {
  queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("dashboard:refresh"));
  }
};

/**
 * Re-export useSummary as useDashboardSummary for backward compatibility.
 * Now backed by @tanstack/react-query with queryKey ["summary"],
 * staleTime: 60_000, and refetchOnWindowFocus: false.
 */
export const useDashboardSummary = useSummary;

export { useSummary, SUMMARY_QUERY_KEY, fetchSummaryApi };
export default useSummary;
