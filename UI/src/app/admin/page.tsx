"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  Chip,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  Category,
  People,
  ShoppingCart,
  Analytics,
  Settings,
  TrendingUp,
  LocalShipping,
  NavigateNext,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { isLoggedIn, isAdmin } from "@/utils/auth";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";

const AdminDashboardContent: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router]);

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: <Dashboard /> },
    { id: "products", label: "Product Management", icon: <Inventory /> },
    { id: "categories", label: "Category Management", icon: <Category /> },
    { id: "orders", label: "Order Management", icon: <ShoppingCart /> },
    { id: "users", label: "User Management", icon: <People /> },
    { id: "analytics", label: "Analytics", icon: <Analytics /> },
    { id: "settings", label: "Settings", icon: <Settings /> },
  ];

  const statsCards = [
    {
      title: "Total Products",
      value: "156",
      change: "+12%",
      color: "primary",
      icon: <Inventory />,
    },
    {
      title: "Total Orders",
      value: "2,847",
      change: "+18%",
      color: "success",
      icon: <ShoppingCart />,
    },
    {
      title: "Total Users",
      value: "1,234",
      change: "+8%",
      color: "info",
      icon: <People />,
    },
    {
      title: "Revenue",
      value: "₹45,678",
      change: "+22%",
      color: "warning",
      icon: <TrendingUp />,
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          gap={3}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={200} height={30} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
      </Container>
    );
  }

  const renderOverview = () => (
    <>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      color={stat.color as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box color={`${stat.color}.main`}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Inventory />}
                  onClick={() => router.push("/add-product")}
                  fullWidth
                >
                  Add New Product
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Category />}
                  onClick={() => router.push("/add-category")}
                  fullWidth
                >
                  Add New Category
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocalShipping />}
                  fullWidth
                >
                  Manage Orders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="New order #1234 received"
                    secondary="2 minutes ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Product 'Organic Turmeric' updated"
                    secondary="1 hour ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="New user registered"
                    secondary="3 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Category 'Spices' created"
                    secondary="1 day ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const renderProducts = () => (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Product Management</Typography>
          <Button
            variant="contained"
            startIcon={<Inventory />}
            onClick={() => router.push("/add-product")}
          >
            Add Product
          </Button>
        </Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Manage your product inventory, update pricing, and monitor stock
          levels.
        </Alert>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => router.push("/products")}>
            View All Products
          </Button>
          <Button variant="outlined">Export Products</Button>
          <Button variant="outlined">Bulk Update</Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCategories = () => (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Category Management</Typography>
          <Button
            variant="contained"
            startIcon={<Category />}
            onClick={() => router.push("/add-category")}
          >
            Add Category
          </Button>
        </Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Organize your products by creating and managing categories.
        </Alert>
        <Box display="flex" gap={2}>
          <Button variant="outlined">View All Categories</Button>
          <Button variant="outlined">Reorder Categories</Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderOrders = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Management
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Track and manage customer orders, process payments, and handle
          shipments.
        </Alert>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="orange">
                  23
                </Typography>
                <Typography variant="body2">Pending Orders</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="blue">
                  156
                </Typography>
                <Typography variant="body2">Processing</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="green">
                  2,234
                </Typography>
                <Typography variant="body2">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="red">
                  12
                </Typography>
                <Typography variant="body2">Cancelled</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderUsers = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Management
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Manage user accounts, roles, and permissions.
        </Alert>
        <Box display="flex" gap={2}>
          <Button variant="outlined">View All Users</Button>
          <Button variant="outlined">Manage Roles</Button>
          <Button variant="outlined">Export Users</Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAnalytics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Analytics & Reports
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          View detailed analytics and generate reports for your business.
        </Alert>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="outlined" fullWidth>
              Sales Report
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="outlined" fullWidth>
              Product Performance
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="outlined" fullWidth>
              User Activity
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="outlined" fullWidth>
              Revenue Analysis
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Settings
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Configure system settings and preferences.
        </Alert>
        <List>
          <ListItem>
            <ListItemText
              primary="Payment Settings"
              secondary="Configure payment gateways and options"
            />
            <Button variant="outlined" size="small">
              Configure
            </Button>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Email Templates"
              secondary="Customize email notifications"
            />
            <Button variant="outlined" size="small">
              Edit
            </Button>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Shipping Settings"
              secondary="Manage shipping options and rates"
            />
            <Button variant="outlined" size="small">
              Manage
            </Button>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Tax Configuration"
              secondary="Set up tax rates and rules"
            />
            <Button variant="outlined" size="small">
              Setup
            </Button>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderOverview();
      case "products":
        return renderProducts();
      case "categories":
        return renderCategories();
      case "orders":
        return renderOrders();
      case "users":
        return renderUsers();
      case "analytics":
        return renderAnalytics();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <Container sx={{ mt: isMobile ? 8 : 12, mb: 6, px: isMobile ? 2 : 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            component="button"
            variant="body1"
            onClick={() => router.push("/")}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Home
          </Link>
          <Typography variant="body1" color="text.primary">
            Admin Dashboard
          </Typography>
        </Breadcrumbs>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            color="primary.main"
          >
            Admin Dashboard
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Welcome to your admin dashboard. Manage your ecommerce store from
          here.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ borderRadius: 2, boxShadow: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={selectedTab === item.id}
                  onClick={() => setSelectedTab(item.id)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        selectedTab === item.id
                          ? "primary.contrastText"
                          : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>{renderContent()}</Grid>
      </Grid>
    </Container>
  );
};

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            gap={3}
          >
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton variant="rectangular" width={300} height={40} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
        </Container>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
