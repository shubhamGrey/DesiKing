import { errorHandler } from "./errorHandler";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * API Client with built-in error handling, retries, and logging
 */
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.defaultHeaders,
    };
    this.timeout = config.timeout ?? 30000; // 30 seconds default
    this.retries = config.retries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000; // 1 second default
  }

  /**
   * Make HTTP request with error handling and retries
   */
  public async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.timeout,
      retries = this.retries,
      retryDelay = this.retryDelay,
    } = config;

    const url = this.buildUrl(endpoint);
    const correlationId = this.generateCorrelationId();

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
      "X-Correlation-ID": correlationId,
    };

    // Add auth token if available
    const authToken = this.getAuthToken();
    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.makeRequest(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          timeout,
        });

        // Process the response through error handler
        const data = await response.json();
        return errorHandler.processApiResponse<T>(data, url);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except 408, 429
        if (error instanceof Response) {
          const status = error.status;
          if (
            status >= 400 &&
            status < 500 &&
            status !== 408 &&
            status !== 429
          ) {
            break;
          }
        }

        // If it's the last attempt, don't wait
        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    // Process the final error
    throw errorHandler.processError(lastError, {
      url,
      method,
      attempt: retries + 1,
      correlationId,
    });
  }

  /**
   * GET request helper
   */
  public async get<T>(
    endpoint: string,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST request helper
   */
  public async post<T>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  /**
   * PUT request helper
   */
  public async put<T>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  /**
   * DELETE request helper
   */
  public async delete<T>(
    endpoint: string,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  /**
   * PATCH request helper
   */
  public async patch<T>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  /**
   * Upload file with progress tracking
   */
  public async uploadFile<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const url = this.buildUrl(endpoint);
    const correlationId = this.generateCorrelationId();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Handle progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener("load", () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            const result = errorHandler.processApiResponse<T>(data, url);
            resolve(result);
          } else {
            const error = new Error(`Upload failed with status ${xhr.status}`);
            reject(errorHandler.processError(error, { url, correlationId }));
          }
        } catch (error) {
          reject(errorHandler.processError(error, { url, correlationId }));
        }
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        const error = new Error("Upload failed");
        reject(errorHandler.processError(error, { url, correlationId }));
      });

      // Handle timeout
      xhr.addEventListener("timeout", () => {
        const error = new Error("Upload timeout");
        reject(errorHandler.processError(error, { url, correlationId }));
      });

      // Setup request
      xhr.open("POST", url);
      xhr.timeout = config.timeout ?? this.timeout;

      // Add headers
      const authToken = this.getAuthToken();
      if (authToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
      }
      xhr.setRequestHeader("X-Correlation-ID", correlationId);

      // Send request
      xhr.send(formData);
    });
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    const cleanBaseURL = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    return `${cleanBaseURL}/${cleanEndpoint}`;
  }

  /**
   * Generate correlation ID for request tracking
   */
  private generateCorrelationId(): string {
    return `ui-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      // Try to get from cookies first (more secure)
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) =>
        c.trim().startsWith("access_token=")
      );
      if (tokenCookie) {
        return tokenCookie.split("=")[1];
      }

      // Fallback to localStorage
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  }

  /**
   * Make the actual fetch request with timeout
   */
  private async makeRequest(
    url: string,
    config: RequestInit & { timeout: number }
  ): Promise<Response> {
    const { timeout, ...fetchConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw response; // Will be handled by error handler
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      throw error;
    }
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Update base configuration
   */
  public updateConfig(config: Partial<ApiClientConfig>): void {
    if (config.baseURL) this.baseURL = config.baseURL;
    if (config.defaultHeaders) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        ...config.defaultHeaders,
      };
    }
    if (config.timeout) this.timeout = config.timeout;
    if (config.retries) this.retries = config.retries;
    if (config.retryDelay) this.retryDelay = config.retryDelay;
  }
}

// Create default API client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
});
