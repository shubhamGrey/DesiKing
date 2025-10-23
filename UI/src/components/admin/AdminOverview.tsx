"use client";

import {
  Category,
  Inventory,
  LocalShipping,
  ShoppingCart,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import type {
  Order,
  Product,
  Category as CategoryType,
  Brand,
  AdminComponentProps,
} from "@/types/admin";

interface AdminOverviewProps extends AdminComponentProps {
  orders: Order[];
  products: Product[];
  categories: CategoryType[];
  brands: Brand[];
  formatCurrency: (amount: number) => string;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({
  orders,
  products,
  categories,
  brands,
  formatCurrency,
}) => {
  const router = useRouter();

  // Calculate statistics
  const totalProducts = products.filter(
    (p) => !p.isDeleted && p.isActive
  ).length;
  const totalOrders = orders.length;
  const totalCategories = categories.filter(
    (c) => !c.isDeleted && c.isActive
  ).length;
  const totalBrands = brands.filter((b) => !b.isDeleted && b.isActive).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const statsCards = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      change: products.length > 0 ? `${totalProducts} items` : "0 items",
      color: "primary",
      icon: <Inventory />,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change:
        totalOrders > 0
          ? `${orders.filter((o) => o.status === "pending").length} pending`
          : "0 orders",
      color: "success",
      icon: <ShoppingCart />,
    },
    {
      title: "Categories",
      value: totalCategories.toString(),
      change:
        totalCategories > 0 ? `${totalCategories} active` : "0 categories",
      color: "info",
      icon: <Category />,
    },
    {
      title: "Revenue",
      value: totalRevenue > 0 ? formatCurrency(totalRevenue) : "₹0",
      change: `${totalBrands} brands`,
      color: "warning",
      icon: <TrendingUp />,
    },
  ];

  return (
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
};

export default AdminOverview;
