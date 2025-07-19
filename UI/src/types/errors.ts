// Error types and interfaces
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  correlationId?: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  info: {
    code: string;
    message: string;
  };
  data?: T;
}

export class CustomError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly correlationId?: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    code: string = "UNKNOWN_ERROR",
    status: number = 500,
    correlationId?: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = "CustomError";
    this.code = code;
    this.status = status;
    this.correlationId = correlationId;
    this.details = details;
  }
}

export class NetworkError extends CustomError {
  constructor(
    message: string = "Network connection failed",
    correlationId?: string
  ) {
    super(message, "NETWORK_ERROR", 0, correlationId);
    this.name = "NetworkError";
  }
}

export class ValidationError extends CustomError {
  constructor(
    message: string,
    details?: Record<string, any>,
    correlationId?: string
  ) {
    super(message, "VALIDATION_ERROR", 400, correlationId, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends CustomError {
  constructor(
    message: string = "Authentication failed",
    correlationId?: string
  ) {
    super(message, "AUTHENTICATION_ERROR", 401, correlationId);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = "Access denied", correlationId?: string) {
    super(message, "AUTHORIZATION_ERROR", 403, correlationId);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Resource not found", correlationId?: string) {
    super(message, "NOT_FOUND_ERROR", 404, correlationId);
    this.name = "NotFoundError";
  }
}

export class ServerError extends CustomError {
  constructor(
    message: string = "Internal server error",
    correlationId?: string
  ) {
    super(message, "SERVER_ERROR", 500, correlationId);
    this.name = "ServerError";
  }
}

// Error severity levels
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface ErrorLogEntry {
  timestamp: Date;
  error: CustomError;
  context?: Record<string, any>;
  severity: ErrorSeverity;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}
