"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";
import { errorHandler } from "@/utils/errorHandler";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

/**
 * Error Boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error using our error handler
    const processedError = errorHandler.processError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // Generate error ID for tracking
    const errorId = `boundary-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 React Error Boundary");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Processed Error:", processedError);
      console.groupEnd();
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.error.light}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <ErrorOutline
                sx={{
                  fontSize: 64,
                  color: "error.main",
                  mb: 2,
                }}
              />

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="error.main"
              >
                Oops! Something went wrong
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We encountered an unexpected error. Our team has been notified
                and is working to fix this issue.
              </Typography>

              {this.state.errorId && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 3, display: "block" }}
                >
                  Error ID: {this.state.errorId}
                </Typography>
              )}
            </Box>

            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}
            >
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReset}
                color="primary"
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                onClick={this.handleReload}
                color="error"
              >
                Reload Page
              </Button>
            </Box>

            {this.props.showDetails &&
              process.env.NODE_ENV === "development" &&
              this.state.error && (
                <Box sx={{ mt: 4, textAlign: "left" }}>
                  <Typography variant="h6" gutterBottom>
                    Error Details (Development Only):
                  </Typography>

                  <Paper
                    sx={{ p: 2, backgroundColor: "grey.100", overflow: "auto" }}
                  >
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{ fontSize: "0.75rem", whiteSpace: "pre-wrap" }}
                    >
                      {this.state.error.message}
                      {"\n\n"}
                      {this.state.error.stack}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          {"\n\nComponent Stack:"}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </Typography>
                  </Paper>
                </Box>
              )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                If this problem persists, please contact our support team.
              </Typography>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based Error Boundary component for functional components
 */
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorId?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  errorId,
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
        <ErrorOutline sx={{ fontSize: 48, color: "error.main", mb: 2 }} />

        <Typography variant="h6" gutterBottom color="error.main">
          Something went wrong
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error.message || "An unexpected error occurred"}
        </Typography>

        {errorId && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 2, display: "block" }}
          >
            Error ID: {errorId}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button size="small" onClick={resetError} variant="contained">
            Try Again
          </Button>
          <Button size="small" onClick={handleReload} variant="outlined">
            Reload
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
}
