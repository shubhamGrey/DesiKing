"use client";

import { BarChart, TrendingUp } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import type { AdminComponentProps } from "@/types/admin";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AdminAnalyticsProps extends AdminComponentProps {}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = () => {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary.main"
          gutterBottom
        >
          Analytics & Reports
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <BarChart sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Sales Analytics</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Sales analytics and revenue tracking charts will be displayed
                  here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp sx={{ mr: 1 }} color="success" />
                  <Typography variant="h6">Performance Metrics</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Key performance indicators and business metrics will be shown
                  here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
