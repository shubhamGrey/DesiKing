"use client";

import {
  ExpandLess,
  ExpandMore,
  LocalShipping,
  People,
  Refresh,
  ShoppingCart,
  TrendingUp,
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
  Collapse,
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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { Order, AdminComponentProps } from "@/types/admin";

interface AdminOrdersProps extends AdminComponentProps {
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  onRefreshOrders: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  ordersLoading,
  ordersError,
  onRefreshOrders,
  formatCurrency,
}) => {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewOrderDetails = (orderId: string) => {
    sessionStorage.setItem("orderId", orderId);
    router.push(`/order-details/${orderId}`);
  };

  // Calculate order statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  const uniqueCustomers = new Set(orders.map((order) => order.userId)).size;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

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
            Order Management
          </Typography>
          <Button
            variant="outlined"
            onClick={onRefreshOrders}
            disabled={ordersLoading}
            startIcon={
              ordersLoading ? <CircularProgress size={20} /> : <Refresh />
            }
          >
            Refresh Orders
          </Button>
        </Box>

        {/* Order Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <ShoppingCart sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                      {totalOrders}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Total Orders</Typography>
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
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <TrendingUp sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: 'break-word', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                      {formatCurrency(totalRevenue)}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Total Revenue</Typography>
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
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <People sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                      {uniqueCustomers}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Customers</Typography>
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
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <LocalShipping sx={{ fontSize: 28, mr: 2 }} />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                      {pendingOrders}
                    </Typography>
                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Pending</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Orders Error */}
        {ordersError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {ordersError}
          </Alert>
        )}

        {/* Orders Table */}
        {ordersLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Alert severity="info">No orders found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {order.receiptId || order.id.substring(0, 8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{ width: 32, height: 32, mr: 1, fontSize: 14 }}
                          >
                            {order.shippingAddress?.fullName?.charAt(0) || "?"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {order.shippingAddress?.fullName || "Unknown"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {order.shippingAddress?.phoneNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(order.createdDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.orderItems?.length || 0} items
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleExpandOrder(order.id)}
                          sx={{ mr: 1 }}
                        >
                          {expandedOrder === order.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrderDetails(order.id)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 0 }}>
                        <Collapse
                          in={expandedOrder === order.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ py: 2 }}>
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Order Items:
                                </Typography>
                                {order.orderItems?.map((item) => (
                                  <Box key={item.id} sx={{ mb: 1, pl: 2 }}>
                                    <Typography variant="body2">
                                      • Product:{" "}
                                      {item.productName}{" "}
                                      (Qty: {item.quantity}, Price:{" "}
                                      {formatCurrency(item.price)})
                                    </Typography>
                                  </Box>
                                ))}
                              </Grid>

                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Shipping Address:
                                </Typography>
                                {order.shippingAddress && (
                                  <Typography variant="body2" sx={{ pl: 2 }}>
                                    {order.shippingAddress.addressLine},{" "}
                                    {order.shippingAddress.city}
                                    <br />
                                    {order.shippingAddress.stateCode} -{" "}
                                    {order.shippingAddress.pinCode}
                                  </Typography>
                                )}

                                {order.docketNumber && (
                                  <>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{ mt: 2 }}
                                    >
                                      Docket Number:
                                    </Typography>
                                    <Typography variant="body2" sx={{ pl: 2 }}>
                                      {order.docketNumber}
                                    </Typography>
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
