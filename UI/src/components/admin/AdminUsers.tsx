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
          <Button
            variant="outlined"
            onClick={onRefreshRoles}
            disabled={rolesLoading}
            startIcon={
              rolesLoading ? <CircularProgress size={20} /> : <Refresh />
            }
          >
            Refresh Roles
          </Button>
        </Box>

        {rolesError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {rolesError}
          </Alert>
        )}

        {/* User Management Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<People />}
              onClick={onRefreshUsers}
              disabled={usersLoading}
            >
              {usersLoading ? <CircularProgress size={16} /> : "Refresh Users"}
            </Button>
            <Button variant="outlined" startIcon={<Add />}>
              Add New User
            </Button>
            <Button variant="outlined" startIcon={<Settings />}>
              Manage Permissions
            </Button>
            <Button variant="outlined" startIcon={<FileDownload />}>
              Export Users
            </Button>
          </Box>
        </Box>

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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}
                        >
                          {user.fullName?.charAt(0) || "?"}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {user.fullName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.phoneNumber || "N/A"}
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
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton size="small" color="primary">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Roles Management */}
        <Typography variant="h6" gutterBottom>
          System Roles
        </Typography>
        {rolesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : roles.length === 0 ? (
          <Alert severity="info">No roles found</Alert>
        ) : (
          <Grid container spacing={3}>
            {roles.map((role) => (
              <Grid key={role.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          bgcolor: "secondary.main",
                        }}
                      >
                        {role.name?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {role.name || "N/A"}
                        </Typography>
                        <Chip
                          label={role.isActive ? "Active" : "Inactive"}
                          color={role.isActive ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    </Box>
                    {role.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {role.description}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Created:{" "}
                        {role.createdDate
                          ? formatDate(role.createdDate)
                          : "N/A"}
                      </Typography>
                      <IconButton size="small" color="primary">
                        <Settings />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
