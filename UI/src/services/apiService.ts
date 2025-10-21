/**
 * Centralized API Service with unified error handling and toast notifications
 * Integrates with existing NotificationProvider and ErrorHandler systems
 */

import { errorHandler } from "@/utils/errorHandler";
import {
  CustomError,
  NetworkError,
  AuthenticationError,
  ServerError,
} from "@/types/errors";

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  signal?: AbortSignal;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  info: {
    isSuccess: boolean;
    code: string;
    message: string;
  };
  data: T;
  id: string;
}

export interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  customErrorHandler?: (error: CustomError) => void;
  retries?: number;
  retryDelay?: number;
  includeAuth?: boolean;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number = 30000; // 30 seconds
  private notificationCallbacks: {
    showError?: (error: Error | CustomError | string, options?: any) => void;
    showSuccess?: (message: string, options?: any) => void;
    showWarning?: (message: string, options?: any) => void;
  } = {};

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Set notification callbacks from NotificationProvider
   */
  public setNotificationCallbacks(
    callbacks: typeof this.notificationCallbacks
  ) {
    this.notificationCallbacks = callbacks;
  }

  /**
   * Get authorization header if available
   */
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};

    // Get token from cookies (client-side only)
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      return { Authorization: `Bearer ${token}` };
    }

    return {};
  }

  /**
   * Create a correlation ID for request tracking
   */
  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle timeout for requests
   */
  private createTimeoutSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  /**
   * Process API response and handle different response formats
   */
  private async processResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      await this.handleHttpError(response);
    }

    const contentType = response.headers.get("content-type");

    // Handle non-JSON responses
    if (!contentType || !contentType.includes("application/json")) {
      if (response.status === 204) {
        return {} as T; // No content
      }
      throw new ServerError(`Unexpected response type: ${contentType}`);
    }

    const data = await response.json();

    // Handle wrapped API responses
    if (data && typeof data === "object" && "info" in data && "data" in data) {
      const apiResponse = data as ApiResponse<T>;

      if (!apiResponse.info.isSuccess) {
        throw new ServerError(
          `API Error: ${apiResponse.info.message}`,
          apiResponse.id
        );
      }

      return apiResponse.data;
    }

    // Return direct data if not wrapped
    return data as T;
  }

  /**
   * Handle HTTP errors and convert to appropriate CustomError types
   */
  private async handleHttpError(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let correlationId: string | undefined;

    try {
      const errorData = await response.json();

      if (errorData.info?.message) {
        errorMessage = errorData.info.message;
        correlationId = errorData.id;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      }
    } catch {
      // If response is not JSON, use default message
    }

    switch (response.status) {
      case 400:
        throw new CustomError(
          errorMessage,
          "VALIDATION_ERROR",
          400,
          correlationId
        );
      case 401:
        throw new AuthenticationError(errorMessage, correlationId);
      case 403:
        throw new CustomError(
          errorMessage,
          "AUTHORIZATION_ERROR",
          403,
          correlationId
        );
      case 404:
        throw new CustomError(
          errorMessage,
          "NOT_FOUND_ERROR",
          404,
          correlationId
        );
      case 409:
        throw new CustomError(
          errorMessage,
          "CONFLICT_ERROR",
          409,
          correlationId
        );
      case 422:
        throw new CustomError(
          errorMessage,
          "VALIDATION_ERROR",
          422,
          correlationId
        );
      case 429:
        throw new CustomError(
          errorMessage,
          "RATE_LIMIT_ERROR",
          429,
          correlationId
        );
      case 500:
      default:
        throw new ServerError(errorMessage, correlationId);
    }
  }

  /**
   * Retry logic for failed requests
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 0,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && error instanceof NetworkError) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.withRetry(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * Core request method with full error handling and notification integration
   */
  public async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {},
    options: ApiOptions = {}
  ): Promise<T> {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage,
      customErrorHandler,
      retries = 1,
      retryDelay = 1000,
      includeAuth = true,
    } = options;

    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.defaultTimeout,
      ...restConfig
    } = config;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    // Build headers
    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...(includeAuth ? this.getAuthHeader() : {}),
      "X-Correlation-ID": this.generateCorrelationId(),
      ...headers,
    };

    // Prepare request configuration
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: this.createTimeoutSignal(timeout),
      ...restConfig,
    };

    // Add body if provided
    if (body !== undefined) {
      if (body instanceof FormData) {
        // Remove Content-Type for FormData (let browser set it)
        delete requestHeaders["Content-Type"];
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    const operation = async (): Promise<T> => {
      try {
        const response = await fetch(url, requestConfig);
        const result = await this.processResponse<T>(response);

        // Show success toast if requested
        if (
          showSuccessToast &&
          successMessage &&
          this.notificationCallbacks.showSuccess
        ) {
          this.notificationCallbacks.showSuccess(successMessage);
        }

        return result;
      } catch (error) {
        // Convert fetch errors to custom errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new NetworkError(
            "Network connection failed. Please check your internet connection."
          );
        }

        if (error instanceof Error && error.name === "AbortError") {
          throw new NetworkError("Request timeout. Please try again.");
        }

        // Re-throw custom errors as-is
        if (error instanceof CustomError) {
          throw error;
        }

        // Convert other errors to generic server error
        throw new ServerError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    };

    try {
      return await this.withRetry(operation, retries, retryDelay);
    } catch (error) {
      const processedError = errorHandler.processError(error);

      // Use custom error handler if provided
      if (customErrorHandler) {
        customErrorHandler(processedError);
      } else if (showErrorToast && this.notificationCallbacks.showError) {
        // Show error toast with user-friendly message
        this.notificationCallbacks.showError(processedError, {
          title: processedError.name,
          duration: 8000,
        });
      }

      // Re-throw the error for caller to handle if needed
      throw processedError;
    }
  }

  // Convenience methods for different HTTP methods
  public get<T>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "method">,
    options?: ApiOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" }, options);
  }

  public post<T>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
    options?: ApiOptions
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      { ...config, method: "POST", body: data },
      options
    );
  }

  public put<T>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
    options?: ApiOptions
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      { ...config, method: "PUT", body: data },
      options
    );
  }

  public patch<T>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
    options?: ApiOptions
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      { ...config, method: "PATCH", body: data },
      options
    );
  }

  public delete<T>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "method">,
    options?: ApiOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" }, options);
  }

  /**
   * Upload file with progress tracking
   */
  public async uploadFile<T>(
    endpoint: string,
    file: File | FormData,
    options: ApiOptions & { onProgress?: (progress: number) => void } = {}
  ): Promise<T> {
    const { onProgress, ...restOptions } = options;

    let formData: FormData;
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append("file", file);
    }

    // Note: Progress tracking requires XMLHttpRequest, not fetch
    // This is a simplified version using fetch
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: formData,
      },
      restOptions
    );
  }
}

// Export singleton instance
export const apiService = new ApiService();
