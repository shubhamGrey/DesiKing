"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  SlideProps,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import { CustomError } from "@/types/errors";
import { errorHandler } from "@/utils/errorHandler";

export type NotificationSeverity = "error" | "warning" | "info" | "success";

export interface NotificationOptions {
  title?: string;
  severity?: NotificationSeverity;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface Notification extends NotificationOptions {
  id: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, options?: NotificationOptions) => string;
  showError: (
    error: Error | CustomError | string,
    options?: Omit<NotificationOptions, "severity">
  ) => string;
  showSuccess: (
    message: string,
    options?: Omit<NotificationOptions, "severity">
  ) => string;
  showWarning: (
    message: string,
    options?: Omit<NotificationOptions, "severity">
  ) => string;
  showInfo: (
    message: string,
    options?: Omit<NotificationOptions, "severity">
  ) => string;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

function SlideTransition(props: Readonly<SlideProps>) {
  return <Slide {...props} direction="up" />;
}

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const showNotification = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      const id = generateId();
      const notification: Notification = {
        id,
        message,
        timestamp: new Date(),
        severity: "info",
        duration: 6000,
        persistent: false,
        ...options,
      };

      setNotifications((prev) => {
        const newNotifications = [notification, ...prev];
        // Keep only the most recent notifications
        return newNotifications.slice(0, maxNotifications);
      });

      // Auto-hide non-persistent notifications
      if (
        !notification.persistent &&
        notification.duration &&
        notification.duration > 0
      ) {
        setTimeout(() => {
          hideNotification(id);
        }, notification.duration);
      }

      return id;
    },
    [generateId, maxNotifications, hideNotification]
  );

  const showError = useCallback(
    (
      error: Error | CustomError | string,
      options: Omit<NotificationOptions, "severity"> = {}
    ): string => {
      let message: string;
      let title: string | undefined;

      if (typeof error === "string") {
        message = error;
      } else if (error instanceof CustomError) {
        message = errorHandler.getUserFriendlyMessage(error);
        title = error.name;

        // Log the error for debugging
        errorHandler.processError(error);
      } else {
        message = error.message || "An unexpected error occurred";
        title = "Error";

        // Log the error for debugging
        errorHandler.processError(error);
      }

      return showNotification(message, {
        ...options,
        title: title ?? options.title,
        severity: "error",
        duration: options.duration ?? 8000, // Longer duration for errors
        persistent: options.persistent ?? false,
      });
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "severity"> = {}
    ): string => {
      return showNotification(message, {
        ...options,
        severity: "success",
      });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "severity"> = {}
    ): string => {
      return showNotification(message, {
        ...options,
        severity: "warning",
      });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "severity"> = {}
    ): string => {
      return showNotification(message, {
        ...options,
        severity: "info",
      });
    },
    [showNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = useMemo(
    () => ({
      notifications,
      showNotification,
      showError,
      showSuccess,
      showWarning,
      showInfo,
      hideNotification,
      clearAll,
    }),
    [
      notifications,
      showNotification,
      showError,
      showSuccess,
      showWarning,
      showInfo,
      hideNotification,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const context = useContext(NotificationContext);
  if (!context) return null;

  const { notifications, hideNotification } = context;

  const getIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      case "success":
        return <SuccessIcon />;
      case "info":
      default:
        return <InfoIcon />;
    }
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          onClose={() => hideNotification(notification.id)}
          slots={{ transition: SlideTransition }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            position: "fixed",
            bottom: 16 + index * 80, // Stack notifications
            right: 16,
            zIndex: (theme) => theme.zIndex.snackbar + index,
          }}
        >
          <Alert
            severity={notification.severity}
            icon={getIcon(notification.severity ?? "info")}
            action={
              <>
                {notification.action && (
                  <IconButton
                    size="small"
                    aria-label={notification.action.label}
                    color="inherit"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => hideNotification(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
            sx={{
              width: "100%",
              maxWidth: 400,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            {notification.title && (
              <AlertTitle sx={{ marginBottom: 1 }}>
                {notification.title}
              </AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
