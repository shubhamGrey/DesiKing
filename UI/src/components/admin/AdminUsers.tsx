"use client";

import {
  Add,
  Edit as EditIcon,
  FileDownload,
  People,
  Refresh,
  Settings,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import type { User, Role, Order, AdminComponentProps } from "@/types/admin";

interface AdminUsersProps extends AdminComponentProps {
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  roles: Role[];
  rolesLoading: boolean;
  rolesError: string | null;
  orders: Order[];
  onRefreshUsers: () => void;
  onRefreshRoles: () => void;
  formatDate: (dateString: string) => string;
}

const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  usersLoading,
  usersError,
  roles,
  rolesLoading,
  rolesError,
  orders,
  onRefreshUsers,
  onRefreshRoles,
  formatDate,
}) => {
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
            User Management & Roles
          </Typography>
        </Box>

        {rolesError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {rolesError}
          </Alert>
        )}

        {/* Users List */}
        <Typography variant="h6" gutterBottom>
          All Users
        </Typography>

        {usersError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {usersError}
          </Alert>
        )}

        {usersLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            No users found
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 4, maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.mobileNumber || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.roleName || "Unknown"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        color={user.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.lastLoginDate
                          ? formatDate(user.lastLoginDate)
                          : "Never"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* User Statistics */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            User Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="primary.main">
                    {users.length}
                  </Typography>
                  <Typography variant="body2">Total Users</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="success.main">
                    {users.filter((u) => u.isActive).length}
                  </Typography>
                  <Typography variant="body2">Active Users</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="info.main">
                    {
                      users.filter(
                        (u) =>
                          new Date(u.createdDate) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2">New Users (30d)</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="warning.main">
                    {Math.round(
                      (orders.filter(
                        (o) =>
                          new Date(o.createdDate) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length /
                        Math.max(
                          new Set(orders.map((o) => o.userId)).size,
                          1
                        )) *
                        100
                    )}
                    %
                  </Typography>
                  <Typography variant="body2">Activity Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
