/**
 * React hook for unified API error handling with automatic toast notifications
 * Integrates apiService with NotificationProvider
 */

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/NotificationProvider";
import { apiService } from "@/services/apiService";
import type { ApiRequestConfig, ApiOptions } from "@/services/apiService";
import { errorHandler } from "@/utils/errorHandler";
import { CustomError, AuthenticationError } from "@/types/errors";

interface UseApiOptions extends ApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: CustomError) => void;
  redirectOnAuth?: boolean;
  logoutOnAuth?: boolean;
}

interface UseApiReturn {
  // Core API methods with automatic error handling
  get: <T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "method">,
    options?: UseApiOptions
  ) => Promise<T>;
  post: <T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
    options?: UseApiOptions
  ) => Promise<T>;
  put: <T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
    options?: UseApiOptions
  ) => Promise<T>;
  patch: <T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
    options?: UseApiOptions
  ) => Promise<T>;
  delete: <T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "method">,
    options?: UseApiOptions
  ) => Promise<T>;

  // Utility methods
  uploadFile: <T = any>(
    endpoint: string,
    file: File | FormData,
    options?: UseApiOptions & { onProgress?: (progress: number) => void }
  ) => Promise<T>;

  // Manual error handling
  handleError: (error: unknown, customMessage?: string) => void;

  // Success notification helper
  showSuccess: (message: string, options?: any) => void;
}

export const useApi = (defaultOptions: UseApiOptions = {}): UseApiReturn => {
  const router = useRouter();
  const { showError, showSuccess, showWarning } = useNotification();
  const apiServiceRef = useRef(apiService);

  // Set up notification callbacks in apiService
  useEffect(() => {
    apiServiceRef.current.setNotificationCallbacks({
      showError,
      showSuccess,
      showWarning,
    });
  }, [showError, showSuccess, showWarning]);

  // Handle authentication errors by clearing tokens and redirecting
  const handleAuthError = useCallback(
    (error: CustomError) => {
      if (error instanceof AuthenticationError) {
        // Clear authentication tokens
        if (typeof window !== "undefined") {
          document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // Show authentication error
        showError(error, {
          title: errorHandler.getNotificationTitle(error),
          duration: errorHandler.getNotificationDuration(error),
          action: {
            label: "Login",
            onClick: () => router.push("/login"),
          },
        });

        // Redirect to login if configured
        if (defaultOptions.redirectOnAuth !== false) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      }
    },
    [router, showError, defaultOptions.redirectOnAuth]
  );

  // Enhanced error handler with automatic error processing
  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const processedError = errorHandler.processError(error);

      // Handle authentication errors specially
      if (errorHandler.shouldTriggerLogout(processedError)) {
        handleAuthError(processedError);
        return;
      }

      // Use custom message if provided
      const errorMessage =
        customMessage || errorHandler.getUserFriendlyMessage(processedError);

      showError(errorMessage, {
        title: errorHandler.getNotificationTitle(processedError),
        duration: errorHandler.getNotificationDuration(processedError),
      });

      // Call default onError callback if provided
      if (defaultOptions.onError) {
        defaultOptions.onError(processedError);
      }
    },
    [handleAuthError, showError, defaultOptions.onError]
  );

  // Wrapper function to add consistent error handling to API calls
  const wrapApiCall = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      options: UseApiOptions = {}
    ): Promise<T> => {
      const mergedOptions = { ...defaultOptions, ...options };

      try {
        const result = await apiCall();

        // Call success callback if provided
        if (mergedOptions.onSuccess) {
          mergedOptions.onSuccess(result);
        }

        return result;
      } catch (error) {
        // Use custom error handler if provided, otherwise use default
        if (mergedOptions.customErrorHandler) {
          const processedError = errorHandler.processError(error);
          mergedOptions.customErrorHandler(processedError);
        } else if (mergedOptions.onError) {
          const processedError = errorHandler.processError(error);
          mergedOptions.onError(processedError);
        } else {
          // Use automatic error handling
          handleError(error);
        }

        throw error; // Re-throw for caller to handle if needed
      }
    },
    [defaultOptions, handleError]
  );

  // API method wrappers
  const get = useCallback(
    <T = any>(
      endpoint: string,
      config?: Omit<ApiRequestConfig, "method">,
      options?: UseApiOptions
    ): Promise<T> => {
      return wrapApiCall(
        () => apiServiceRef.current.get<T>(endpoint, config, options),
        options
      );
    },
    [wrapApiCall]
  );

  const post = useCallback(
    <T = any>(
      endpoint: string,
      data?: any,
      config?: Omit<ApiRequestConfig, "method" | "body">,
      options?: UseApiOptions
    ): Promise<T> => {
      return wrapApiCall(
        () => apiServiceRef.current.post<T>(endpoint, data, config, options),
        options
      );
    },
    [wrapApiCall]
  );

  const put = useCallback(
    <T = any>(
      endpoint: string,
      data?: any,
      config?: Omit<ApiRequestConfig, "method" | "body">,
      options?: UseApiOptions
    ): Promise<T> => {
      return wrapApiCall(
        () => apiServiceRef.current.put<T>(endpoint, data, config, options),
        options
      );
    },
    [wrapApiCall]
  );

  const patch = useCallback(
    <T = any>(
      endpoint: string,
      data?: any,
      config?: Omit<ApiRequestConfig, "method" | "body">,
      options?: UseApiOptions
    ): Promise<T> => {
      return wrapApiCall(
        () => apiServiceRef.current.patch<T>(endpoint, data, config, options),
        options
      );
    },
    [wrapApiCall]
  );

  const deleteMethod = useCallback(
    <T = any>(
      endpoint: string,
      config?: Omit<ApiRequestConfig, "method">,
      options?: UseApiOptions
    ): Promise<T> => {
      return wrapApiCall(
        () => apiServiceRef.current.delete<T>(endpoint, config, options),
        options
      );
    },
    [wrapApiCall]
  );

  const uploadFile = useCallback(
    <T = any>(
      endpoint: string,
      file: File | FormData,
      options: UseApiOptions & { onProgress?: (progress: number) => void } = {}
    ): Promise<T> => {
      return wrapApiCall(
        () => apiServiceRef.current.uploadFile<T>(endpoint, file, options),
        options
      );
    },
    [wrapApiCall]
  );

  // Success notification helper
  const showSuccessNotification = useCallback(
    (message: string, options?: any) => {
      showSuccess(message, options);
    },
    [showSuccess]
  );

  return {
    get,
    post,
    put,
    patch,
    delete: deleteMethod,
    uploadFile,
    handleError,
    showSuccess: showSuccessNotification,
  };
};

// Pre-configured hooks for common use cases
export const useApiWithAuth = (options: UseApiOptions = {}) => {
  return useApi({
    includeAuth: true,
    redirectOnAuth: true,
    ...options,
  });
};

export const useApiWithoutAuth = (options: UseApiOptions = {}) => {
  return useApi({
    includeAuth: false,
    redirectOnAuth: false,
    ...options,
  });
};

export const useApiSilent = (options: UseApiOptions = {}) => {
  return useApi({
    showErrorToast: false,
    showSuccessToast: false,
    ...options,
  });
};

export const useApiWithSuccess = (
  successMessage: string,
  options: UseApiOptions = {}
) => {
  return useApi({
    showSuccessToast: true,
    successMessage,
    ...options,
  });
};

// Export types
export type { UseApiOptions, UseApiReturn };
