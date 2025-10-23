"use client";

import {
  Settings as SettingsIcon,
  Security,
  Notifications,
} from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import type { AdminComponentProps } from "@/types/admin";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AdminSettingsProps extends AdminComponentProps {}

const AdminSettings: React.FC<AdminSettingsProps> = () => {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary.main"
          gutterBottom
        >
          System Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SettingsIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">General Settings</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Configure general application settings and preferences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Security sx={{ mr: 1 }} color="warning" />
                  <Typography variant="h6">Security</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage security settings, authentication, and access controls.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Notifications sx={{ mr: 1 }} color="info" />
                  <Typography variant="h6">Notifications</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Configure notification preferences and email settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
