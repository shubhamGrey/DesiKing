import { v4 as uuidv4 } from "uuid";
import {
  CustomError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  ApiResponse,
  ErrorLogEntry,
  ErrorSeverity,
} from "@/types/errors";

/**
 * Central error handler utility class
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLogEntry[] = [];
  private readonly maxLogEntries = 1000;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Process and classify errors from different sources
   */
  public processError(
    error: unknown,
    context?: Record<string, any>
  ): CustomError {
    let processedError: CustomError;

    if (error instanceof CustomError) {
      processedError = error;
    } else if (error instanceof Error) {
      processedError = this.classifyError(error);
    } else if (typeof error === "string") {
      processedError = new CustomError(error);
    } else {
      processedError = new CustomError("An unknown error occurred");
    }

    // Log the error
    this.logError(processedError, context);

    return processedError;
  }

  /**
   * Classify generic errors into specific error types
   */
  private classifyError(error: Error): CustomError {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return new NetworkError(error.message);
    }

    if (
      message.includes("unauthorized") ||
      message.includes("authentication")
    ) {
      return new AuthenticationError(error.message);
    }

    if (message.includes("forbidden") || message.includes("access denied")) {
      return new AuthorizationError(error.message);
    }

    if (message.includes("not found") || message.includes("404")) {
      return new NotFoundError(error.message);
    }

    if (message.includes("validation") || message.includes("invalid")) {
      return new ValidationError(error.message);
    }

    return new ServerError(error.message);
  }

  /**
   * Process API response and handle errors
   */
  public processApiResponse<T>(response: any, url?: string): T {
    // Handle network or fetch errors
    if (!response) {
      throw new NetworkError("No response received from server");
    }

    // If it's a Response object from fetch
    if (response instanceof Response) {
      if (!response.ok) {
        this.handleHttpError(response, url);
      }
      return response as T;
    }

    // Handle API response format
    if (response.info) {
      const { info, data, id } = response as ApiResponse<T>;

      // Check if the API operation was successful
      if (!info.isSuccess) {
        const statusCode = parseInt(info.code);
        this.handleApiError(statusCode, info.message, url);
      }

      return data as T;
    }

    return response;
  }

  /**
   * Handle HTTP errors from fetch responses
   */
  private handleHttpError(response: Response, url?: string): never {
    const correlationId = response.headers.get("X-Correlation-ID") ?? uuidv4();

    switch (response.status) {
      case 400:
        throw new ValidationError(
          "Bad request",
          { url, status: response.status },
          correlationId
        );
      case 401:
        throw new AuthenticationError("Authentication required", correlationId);
      case 403:
        throw new AuthorizationError("Access forbidden", correlationId);
      case 404:
        throw new NotFoundError("Resource not found", correlationId);
      case 500:
        throw new ServerError("Internal server error", correlationId);
      default:
        throw new CustomError(
          `HTTP Error ${response.status}: ${response.statusText}`,
          "HTTP_ERROR",
          response.status,
          correlationId
        );
    }
  }

  /**
   * Handle API format errors
   */
  private handleApiError(
    statusCode: number,
    message: string,
    url?: string
  ): never {
    const correlationId = uuidv4();

    switch (statusCode) {
      case 400:
        throw new ValidationError(message, { url }, correlationId);
      case 401:
        throw new AuthenticationError(message, correlationId);
      case 403:
        throw new AuthorizationError(message, correlationId);
      case 404:
        throw new NotFoundError(message, correlationId);
      case 500:
        throw new ServerError(message, correlationId);
      default:
        throw new CustomError(message, "API_ERROR", statusCode, correlationId);
    }
  }

  /**
   * Log error for debugging and monitoring
   */
  private logError(error: CustomError, context?: Record<string, any>): void {
    const severity = this.determineSeverity(error);

    const logEntry: ErrorLogEntry = {
      timestamp: new Date(),
      error,
      context,
      severity,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    };

    this.errorLogs.push(logEntry);

    // Keep only the most recent logs
    if (this.errorLogs.length > this.maxLogEntries) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogEntries);
    }

    // Console logging for development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 ${error.name} [${severity.toUpperCase()}]`);
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Status:", error.status);
      if (error.correlationId) {
        console.error("Correlation ID:", error.correlationId);
      }
      if (context) {
        console.error("Context:", context);
      }
      console.error("Stack:", error.stack);
      console.groupEnd();
    }

    // Send to monitoring service in production
    if (
      process.env.NODE_ENV === "production" &&
      (severity === "high" || severity === "critical")
    ) {
      this.sendToMonitoring(logEntry);
    }
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: CustomError): ErrorSeverity {
    if (error instanceof NetworkError) return "medium";
    if (error instanceof ValidationError) return "low";
    if (error instanceof AuthenticationError) return "medium";
    if (error instanceof AuthorizationError) return "medium";
    if (error instanceof NotFoundError) return "low";
    if (error instanceof ServerError) return "high";

    // Based on status code
    if (error.status >= 500) return "high";
    if (error.status >= 400) return "medium";

    return "low";
  }

  /**
   * Get current user ID from authentication context
   */
  private getCurrentUserId(): string | undefined {
    // This would integrate with your auth system
    if (typeof window !== "undefined") {
      try {
        // Check localStorage, cookies, or auth context
        return localStorage.getItem("userId") ?? undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Get session ID
   */
  private getSessionId(): string | undefined {
    if (typeof window !== "undefined") {
      try {
        let sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
          sessionId = uuidv4();
          sessionStorage.setItem("sessionId", sessionId);
        }
        return sessionId;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Send error to external monitoring service
   */
  private sendToMonitoring(logEntry: ErrorLogEntry): void {
    try {
      // This would integrate with services like Sentry, LogRocket, etc.
      // Example: Sentry.captureException(logEntry.error, { extra: logEntry.context });
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Monitoring service integration not implemented for:",
          logEntry.error.message
        );
      }
    } catch (error) {
      console.error("Failed to send error to monitoring service:", error);
    }
  }

  /**
   * Get error logs for debugging
   */
  public getErrorLogs(): ErrorLogEntry[] {
    return [...this.errorLogs];
  }

  /**
   * Clear error logs
   */
  public clearLogs(): void {
    this.errorLogs = [];
  }

  /**
   * Get user-friendly error message
   */
  public getUserFriendlyMessage(error: CustomError): string {
    // If the error message is already user-friendly, return it
    if (this.isUserFriendlyMessage(error.message)) {
      return error.message;
    }

    switch (error.constructor) {
      case NetworkError:
        return "Please check your internet connection and try again.";
      case ValidationError:
        return error.message || "Please check your input and try again.";
      case AuthenticationError:
        return "Your session has expired. Please log in again.";
      case AuthorizationError:
        return "You do not have permission to perform this action.";
      case NotFoundError:
        return "The requested information could not be found.";
      case ServerError:
        return "Something went wrong on our end. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  /**
   * Check if error message is already user-friendly
   */
  private isUserFriendlyMessage(message: string): boolean {
    const technicalKeywords = [
      "null pointer",
      "undefined",
      "stack trace",
      "exception",
      "internal server error",
      "http error",
      "cors",
      "fetch failed",
      "network error",
      "500 internal server error",
      "404 not found",
      "401 unauthorized",
      "403 forbidden",
    ];

    const lowerMessage = message.toLowerCase();
    return !technicalKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  /**
   * Get appropriate notification duration based on error severity
   */
  public getNotificationDuration(error: CustomError): number {
    switch (error.constructor) {
      case ValidationError:
        return 5000; // 5 seconds for validation errors
      case AuthenticationError:
      case AuthorizationError:
        return 10000; // 10 seconds for auth errors
      case NetworkError:
        return 8000; // 8 seconds for network errors
      case ServerError:
        return 12000; // 12 seconds for server errors
      default:
        return 6000; // 6 seconds default
    }
  }

  /**
   * Get notification title based on error type
   */
  public getNotificationTitle(error: CustomError): string {
    switch (error.constructor) {
      case NetworkError:
        return "Connection Error";
      case ValidationError:
        return "Validation Error";
      case AuthenticationError:
        return "Authentication Required";
      case AuthorizationError:
        return "Access Denied";
      case NotFoundError:
        return "Not Found";
      case ServerError:
        return "Server Error";
      default:
        return "Error";
    }
  }

  /**
   * Determine if error should trigger logout
   */
  public shouldTriggerLogout(error: CustomError): boolean {
    return (
      error instanceof AuthenticationError &&
      (error.status === 401 || error.message.toLowerCase().includes("expired"))
    );
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
