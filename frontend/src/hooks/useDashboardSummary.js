import { useSummary, triggerDashboardRefresh, SUMMARY_QUERY_KEY, fetchSummaryApi } from "./useSummary";

/**
 * Re-export useSummary as useDashboardSummary for backward compatibility.
 * Backed by single-source @tanstack/react-query cache.
 */
export const useDashboardSummary = useSummary;

export { useSummary, triggerDashboardRefresh, SUMMARY_QUERY_KEY, fetchSummaryApi };
export default useSummary;
