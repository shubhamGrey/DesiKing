/**
 * Analytics Debug Panel
 * Shows real-time analytics events in development mode
 */

"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper, Collapse, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { analyticsConfig } from "@/config/analytics";

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  customData?: Record<string, any>;
}

export const AnalyticsDebugPanel: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!analyticsConfig.enableDebugMode) return;

    // Intercept console.log calls to capture analytics events
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      // Check if this is an analytics event log
      if (args[0]?.includes("[BeaconAnalytics] Event tracked:")) {
        try {
          const eventData = args[1];
          if (eventData && typeof eventData === "object") {
            setEvents((prev) => [eventData, ...prev.slice(0, 19)]); // Keep last 20 events
          }
        } catch {
          // Ignore parsing errors
        }
      }
      originalLog.apply(console, args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  if (!analyticsConfig.enableDebugMode || events.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 400,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="caption" fontWeight="bold">
          Analytics Debug ({events.length})
        </Typography>
        <IconButton size="small" color="inherit">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ maxHeight: 300, overflow: "auto", p: 1 }}>
          {events.map((event, index) => (
            <Paper
              key={`${event.timestamp}-${index}`}
              sx={{
                mb: 1,
                p: 1,
                fontSize: "0.75rem",
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="caption" fontWeight="bold" color="primary">
                {event.event}
              </Typography>
              <Typography variant="caption" display="block">
                {event.category} → {event.action}
              </Typography>
              {event.label && (
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {event.label}
                </Typography>
              )}
              {event.customData && (
                <Typography
                  variant="caption"
                  display="block"
                  color="text.disabled"
                >
                  {JSON.stringify(event.customData, null, 1).substring(0, 100)}
                  ...
                </Typography>
              )}
              <Typography variant="caption" color="text.disabled">
                {new Date(event.timestamp).toLocaleTimeString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default AnalyticsDebugPanel;
