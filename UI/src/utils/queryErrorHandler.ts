import { QueryClient, MutationCache, QueryCache } from "@tanstack/react-query";
import { errorHandler } from "./errorHandler";
import { CustomError, NetworkError, AuthenticationError } from "@/types/errors";

/**
 * Configure React Query with error handling
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry on authentication errors
          if (error instanceof AuthenticationError) {
            return false;
          }

          // Don't retry on client errors (4xx)
          if (
            error instanceof CustomError &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false;
          }

          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Generally don't retry mutations, except for network errors
          if (error instanceof NetworkError) {
            return failureCount < 2;
          }
          return false;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Process and log query errors
        const processedError = errorHandler.processError(error, {
          queryKey: query.queryKey,
          type: "query",
        });

        // Handle specific error types
        if (processedError instanceof AuthenticationError) {
          handleAuthError();
        }

        console.error("Query error:", processedError);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        // Process and log mutation errors
        const processedError = errorHandler.processError(error, {
          mutationKey: mutation.options.mutationKey,
          variables,
          type: "mutation",
        });

        // Handle specific error types
        if (processedError instanceof AuthenticationError) {
          handleAuthError();
        }

        console.error("Mutation error:", processedError);
      },
    }),
  });
};

/**
 * Handle authentication errors globally
 */
const handleAuthError = () => {
  // Clear tokens
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Clear cookies
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Error clearing auth tokens:", error);
    }
  }
};

/**
 * Custom hook for handling query errors
 */
export const useQueryError = () => {
  const handleError = (error: unknown) => {
    return errorHandler.processError(error);
  };

  const getUserFriendlyMessage = (error: unknown) => {
    const processedError = errorHandler.processError(error);
    return errorHandler.getUserFriendlyMessage(processedError);
  };

  return {
    handleError,
    getUserFriendlyMessage,
  };
};

/**
 * Query error utility functions
 */
export const queryErrorUtils = {
  /**
   * Check if error is a network error
   */
  isNetworkError: (error: unknown): boolean => {
    return (
      error instanceof NetworkError ||
      (error instanceof Error &&
        error.message.toLowerCase().includes("network"))
    );
  },

  /**
   * Check if error is an authentication error
   */
  isAuthError: (error: unknown): boolean => {
    return (
      error instanceof AuthenticationError ||
      (error instanceof CustomError && error.status === 401)
    );
  },

  /**
   * Check if error should trigger a retry
   */
  shouldRetry: (error: unknown, failureCount: number): boolean => {
    if (failureCount >= 3) return false;

    if (queryErrorUtils.isAuthError(error)) return false;

    if (
      error instanceof CustomError &&
      error.status >= 400 &&
      error.status < 500
    ) {
      return false;
    }

    return true;
  },

  /**
   * Get retry delay for exponential backoff
   */
  getRetryDelay: (attemptIndex: number): number => {
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },
};

/**
 * Error boundary for React Query
 */
export const queryErrorHandler = {
  onError: (error: unknown, query?: any) => {
    const processedError = errorHandler.processError(error, {
      queryKey: query?.queryKey,
      type: "query",
    });

    // Handle authentication errors
    if (processedError instanceof AuthenticationError) {
      handleAuthError();
    }

    return processedError;
  },
};

export default createQueryClient;
