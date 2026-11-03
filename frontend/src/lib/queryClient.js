import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance for React Query.
 * Configured with global defaults:
 * - staleTime: 60_000 (1 minute)
 * - refetchOnWindowFocus: false (avoids repeated requests when switching tabs or DevTools)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default queryClient;

