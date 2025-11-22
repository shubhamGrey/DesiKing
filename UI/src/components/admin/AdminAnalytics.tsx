"use client";

import {
  BarChart,
  Refresh,
  Visibility,
  ShoppingCart,
  Navigation,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import React from "react";
import type { AdminComponentProps } from "@/types/admin";
import type { AnalyticsEvent } from "@/config/analytics";

interface AdminAnalyticsProps extends AdminComponentProps {
  analyticsEvents: AnalyticsEvent[];
  analyticsLoading: boolean;
  analyticsError: string | null;
  onRefreshAnalytics: () => void;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  analyticsEvents,
  analyticsLoading,
  analyticsError,
  onRefreshAnalytics,
}) => {
  // Calculate statistics
  const totalEvents = analyticsEvents.length;
  const pageViews = analyticsEvents.filter((e) => e.action === "page_view").length;
  const ecommerceEvents = analyticsEvents.filter(
    (e) => e.category === "ecommerce"
  ).length;

  // Get unique sessions
  const uniqueSessions = new Set(analyticsEvents.map((e) => e.sessionId)).size;

  // Group events by category
  const eventsByCategory = analyticsEvents.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group events by action
  const eventsByAction = analyticsEvents.reduce((acc, event) => {
    acc[event.action] = (acc[event.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, "primary" | "success" | "warning" | "info" | "error"> = {
      ecommerce: "success",
      user_interaction: "info",
      navigation: "primary",
      error: "error",
      performance: "warning",
      form: "info",
      engagement: "primary",
    };
    return colors[category] || "default";
  };
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Analytics & Events
          </Typography>
          <Button
            variant="outlined"
            onClick={onRefreshAnalytics}
            disabled={analyticsLoading}
            startIcon={
              analyticsLoading ? <CircularProgress size={20} /> : <Refresh />
            }
          >
            Refresh Analytics
          </Button>
        </Box>

        {analyticsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {analyticsError}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <BarChart sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: "break-word" }}>
                      {totalEvents}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                      Total Events
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <Visibility sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: "break-word" }}>
                      {pageViews}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                      Page Views
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <Navigation sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: "break-word" }}>
                      {uniqueSessions}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                      Unique Sessions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <ShoppingCart sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: "break-word" }}>
                      {ecommerceEvents}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                      Ecommerce Events
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Events by Category */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Events by Category
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(eventsByCategory).map(([category, count]) => (
                    <Box
                      key={category}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={category}
                        color={getCategoryColor(category) as any}
                        size="small"
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {count} events
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Actions
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(eventsByAction)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([action, count]) => (
                      <Box
                        key={action}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">{action}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {count}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Events Table */}
        {analyticsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : analyticsEvents.length === 0 ? (
          <Alert severity="info">No analytics events found</Alert>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Recent Events
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 600, overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Session ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsEvents
                    .slice()
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 50)
                    .map((event, index) => (
                      <TableRow key={`${event.sessionId}-${index}`} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(event.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.category}
                            color={getCategoryColor(event.category) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{event.action}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {event.label || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {event.userId
                              ? event.userId.substring(0, 8) + "..."
                              : "Anonymous"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {event.sessionId.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
