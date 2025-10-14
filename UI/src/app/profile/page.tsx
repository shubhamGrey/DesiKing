"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Stack,
  useMediaQuery,
  Chip,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  ExitToApp,
  Edit,
  Save,
  Cancel,
  NavigateNext,
  LocationOn,
  Star,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUserId } from "@/utils/auth";
import Cookies from "js-cookie";
import { useNotification } from "@/components/NotificationProvider";

// Simple UserProfile type
type UserProfile = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  roleName?: string;
  [key: string]: any;
};
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";
import { Order, OrdersApiResponse } from "@/types/order";
import { Product } from "@/types/product";
import AddressManager from "@/components/AddressManager";

const ProfileContent: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccess, showError } = useNotification();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState("All");
  const [productDetails, setProductDetails] = useState<Record<string, Product>>(
    {}
  );
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });

  // Function to fetch user profile from API
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);

      // Get the access token from cookies
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        showError("Authentication token not found. Please log in again.");
        router.push("/login");
        return;
      }

      // Make API call to get user profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/user-profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          showError("Session expired. Please log in again.");
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          Cookies.remove("user_role");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.info?.isSuccess && result.data) {
        const profileData: UserProfile = result.data;
        setUserProfile(profileData);
        setEditForm({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          mobileNumber: profileData.mobileNumber || "",
        });
      } else {
        throw new Error(result.info?.message || "Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showError(
        error instanceof Error
          ? error.message
          : "Failed to load profile data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [showError, router]);

  useEffect(() => {
    // Check if user is logged in using simple cookie check
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    // Fetch user profile from API
    fetchUserProfile();
  }, [router, fetchUserProfile]);

  const fetchProductDetails = async (
    productId: string
  ): Promise<Product | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const rawData = await response.json();
      const data: Product = rawData.data ? rawData.data : rawData;
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  const fetchOrders = async () => {
    const userId = getUserId();
    if (!userId) return;

    setOrdersLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/orders/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: OrdersApiResponse = await response.json();
      if (data.info.isSuccess && data.data) {
        setOrders(data.data);

        // Fetch product details for all order items
        const uniqueProductIds = Array.from(
          new Set(
            data.data.flatMap((order) =>
              order.orderItems.map((item) => item.productId)
            )
          )
        );

        const productPromises = uniqueProductIds.map(async (productId) => {
          const product = await fetchProductDetails(productId);
          return { productId, product };
        });

        const productResults = await Promise.all(productPromises);
        const productMap: Record<string, Product> = {};
        productResults.forEach(({ productId, product }) => {
          if (product) {
            productMap[productId] = product;
          }
        });

        setProductDetails(productMap);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showError("Failed to load orders");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch orders when tab changes to orders or when user is logged in
  useEffect(() => {
    if (selectedTab === "orders" && getUserId()) {
      fetchOrders();
    }
  }, [selectedTab]);

  const handleLogout = () => {
    // Simple logout - just remove cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_role");
    Cookies.remove("user_id");
    showSuccess("Logged out successfully");
    router.push("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && userProfile) {
      // Reset form if canceling
      setEditForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        mobileNumber: userProfile.mobileNumber || "",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!getUserId()) {
      showError("User ID not found. Please log in again.");
      return;
    }

    // Basic validation
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      showError("First name and last name are required");
      return;
    }

    if (!editForm.email.trim() || !editForm.mobileNumber.trim()) {
      showError("Email and mobile number are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      showError("Please enter a valid email address");
      return;
    }

    // Mobile number validation (basic)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(editForm.mobileNumber.replace(/\D/g, ""))) {
      showError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setSaving(true);

      // Get the access token from cookies
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        showError("Authentication token not found. Please log in again.");
        router.push("/login");
        return;
      }

      // Prepare the update payload
      const updatePayload = {
        id: getUserId(),
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
        mobileNumber: editForm.mobileNumber.trim(),
        userName: editForm.email.trim(), // Assuming username is same as email
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/user-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.info?.code === "200" && result.data) {
          // Update the user profile in state
          const updatedProfile = { ...userProfile, ...result.data };
          setUserProfile(updatedProfile);

          // Profile updated successfully - no need to store in session
          showSuccess("Profile updated successfully");
          setIsEditing(false);
        } else {
          throw new Error(result.info?.message || "Failed to update profile");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.info?.message ||
            errorData?.message ||
            `HTTP error! status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showError(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const orderStatuses = [
    "All",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  const getStatusFromOrderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return "Confirmed";
      case "shipped":
        return "Shipped";
      case "paid":
        return "Delivered";
      case "failed":
        return "Cancelled";
      case "cancelled":
        return "Cancelled";
      case "returned":
        return "Returned";
      default:
        return "Confirmed";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "All") return true;
    return getStatusFromOrderStatus(order.status) === orderFilter;
  });

  const menuItems = [
    { id: "profile", label: "Personal Information", icon: <Person /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag /> },
    { id: "address", label: "Address", icon: <LocationOn /> },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="60vh"
          gap={3}
          sx={{ p: 3 }}
        >
          {/* Breadcrumbs skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Skeleton variant="text" width={50} height={20} />
            <Skeleton variant="text" width={10} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>

          {/* Header skeleton */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              sx={{ borderRadius: 1 }}
            />
          </Box>

          {/* Main content grid */}
          <Grid container spacing={3}>
            {/* Sidebar skeleton */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Profile card */}
                <Box
                  sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Skeleton variant="circular" width={80} height={80} />
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                </Box>

                {/* Menu items */}
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rectangular"
                    width="100%"
                    height={48}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Content area skeleton */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                {/* Form header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Skeleton variant="text" width={180} height={24} />
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={36}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>

                {/* Form fields grid */}
                <Grid container spacing={3}>
                  {[1, 2, 3, 4, 5, 6].map((field) => (
                    <Grid key={field} size={{ xs: 12, sm: 6 }}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={56}
                        sx={{ borderRadius: 1 }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Action buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                    justifyContent: "flex-end",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={36}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={36}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Unable to load profile. Please try logging in again.
        </Alert>
      </Container>
    );
  }

  const renderProfileInfo = () => (
    <Card
      sx={{
        mb: 4,
        backgroundColor: "transparent",
        boxShadow: "none",
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
      }}
      elevation={0}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h6"
            color="primary.main"
            fontFamily={michroma.style.fontFamily}
          >
            Personal Information
          </Typography>
          {!isEditing ? (
            <Button
              startIcon={<Edit />}
              onClick={handleEditToggle}
              variant="contained"
            >
              Edit
            </Button>
          ) : (
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleEditToggle}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Save />
                  )
                }
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          )}
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={editForm.mobileNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, mobileNumber: e.target.value })
              }
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Role"
              value={userProfile.roleName || "N/A"}
              disabled
              variant="filled"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderOrders = () => (
    <Card
      sx={{
        mb: 4,
        backgroundColor: "transparent",
        boxShadow: "none",
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
      }}
      elevation={0}
    >
      <CardContent>
        <Typography
          variant="h6"
          color="primary.main"
          fontFamily={michroma.style.fontFamily}
          sx={{ mb: 3 }}
        >
          My Orders
        </Typography>

        {/* Order Status Tabs */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              gap: 0,
              borderBottom: "1px solid",
              borderColor: "divider",
              overflowX: "auto",
            }}
          >
            {orderStatuses.map((status) => (
              <Button
                key={status}
                onClick={() => setOrderFilter(status)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 0,
                  borderBottom:
                    orderFilter === status
                      ? "2px solid"
                      : "2px solid transparent",
                  borderColor:
                    orderFilter === status ? "primary.main" : "transparent",
                  color:
                    orderFilter === status ? "primary.main" : "text.secondary",
                  fontWeight: orderFilter === status ? "600" : "400",
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: "primary.main",
                  },
                }}
              >
                {status}
              </Button>
            ))}
          </Box>
        </Box>

        {ordersLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              {orders.length === 0
                ? "No orders found"
                : `No ${orderFilter.toLowerCase()} orders found`}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {orders.length === 0
                ? "Start shopping to see your order history here!"
                : `You don't have any ${orderFilter.toLowerCase()} orders yet.`}
            </Typography>
            {orders.length === 0 && (
              <Button
                variant="contained"
                onClick={() => router.push("/products")}
              >
                Browse Products
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxHeight: "600px",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "primary.main",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "primary.dark",
              },
            }}
          >
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "visible",
                }}
              >
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  {/* Order Summary Header - Always Visible */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "stretch" : "flex-start",
                      mb: 2,
                      gap: isMobile ? 1 : 0,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          alignItems: isMobile ? "flex-start" : "center",
                          gap: isMobile ? 1 : 2,
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={getStatusFromOrderStatus(order.status)}
                          color={
                            getStatusFromOrderStatus(order.status) ===
                            "Delivered"
                              ? "success"
                              : getStatusFromOrderStatus(order.status) ===
                                "Cancelled"
                              ? "error"
                              : getStatusFromOrderStatus(order.status) ===
                                "Confirmed"
                              ? "info"
                              : getStatusFromOrderStatus(order.status) ===
                                "Shipped"
                              ? "warning"
                              : getStatusFromOrderStatus(order.status) ===
                                "Returned"
                              ? "secondary"
                              : "default"
                          }
                          size="small"
                          sx={{ fontWeight: "600" }}
                        />
                        {getStatusFromOrderStatus(order.status) ===
                          "Delivered" && (
                          <Button
                            size="small"
                            startIcon={<Star />}
                            sx={{
                              color: "primary.main",
                              textTransform: "none",
                              fontWeight: "600",
                              fontSize: isMobile ? "0.75rem" : undefined,
                              padding: isMobile ? "4px 8px" : undefined,
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              showSuccess(
                                "Rate & Review functionality coming soon!"
                              );
                            }}
                          >
                            {isMobile
                              ? "Rate & Review"
                              : "Rate & Review Product"}
                          </Button>
                        )}
                      </Box>

                      {/* Order Basic Info */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1}
                        sx={{
                          wordBreak: "break-word",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: isMobile ? "0.75rem" : undefined,
                        }}
                      >
                        {new Date(order.createdDate).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}{" "}
                        {isMobile && <br />}
                        {!isMobile && "| "}Order No: {order.id.split("-")[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.orderItems.length} item
                        {order.orderItems.length > 1 ? "s" : ""}
                      </Typography>
                    </Box>

                    {/* Right side - Total and Actions */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body1" fontWeight="600">
                          Total: ₹{order.totalAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: isMobile ? "0.75rem" : undefined,
                          padding: isMobile ? "4px 8px" : undefined,
                          minWidth: isMobile ? "auto" : undefined,
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          router.push(`/order-details/${order.id}`);
                        }}
                      >
                        {isMobile ? "Details" : "Order Details"}
                      </Button>
                    </Box>
                  </Box>

                  {/* Order Items Section */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      gap: isMobile ? 1.5 : 2,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600" mb={1}>
                      Order Items:
                    </Typography>
                    {order.orderItems.map((item) => {
                      const product = productDetails[item.productId];
                      return (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            gap: isMobile ? 2 : 3,
                            alignItems: "center",
                            flexWrap: isMobile ? "nowrap" : "wrap",
                          }}
                        >
                          <Box
                            sx={{
                              width: isMobile ? 60 : 80,
                              height: isMobile ? 60 : 80,
                              borderRadius: 2,
                              backgroundColor: "grey.200",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                product?.thumbnailUrl ||
                                product?.imageUrls?.[0] ||
                                "/DesiKing.png"
                              }
                              alt={product?.name || "Product"}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/DesiKing.png";
                              }}
                            />
                          </Box>
                          <Box
                            sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              mb={0.5}
                              sx={{
                                fontSize: isMobile ? "0.875rem" : undefined,
                                wordBreak: "break-word",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: isMobile ? 2 : 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {product?.name ||
                                `Product ID: ${
                                  item.productId.split("-")[0]
                                }...`}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                                overflow: "hidden",
                              }}
                            >
                              {/* Price Display */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: isMobile ? 0.5 : 1,
                                  flexWrap: "wrap",
                                  fontSize: isMobile ? "0.75rem" : undefined,
                                }}
                              >
                                {(() => {
                                  const productPriceInfo =
                                    product?.pricesAndSkus?.[0];
                                  const isDiscounted =
                                    productPriceInfo?.isDiscounted;
                                  const originalPrice =
                                    productPriceInfo?.price || item.price;
                                  const discountedPrice = item.price; // This is the actual charged price

                                  // Calculate total prices
                                  const originalTotal =
                                    originalPrice * item.quantity;
                                  const discountedTotal =
                                    discountedPrice * item.quantity;

                                  return (
                                    <>
                                      {isDiscounted &&
                                      originalPrice > discountedPrice ? (
                                        <>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                              textDecoration: "line-through",
                                            }}
                                          >
                                            ₹{originalTotal.toFixed(2)}
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="success.main"
                                            fontWeight="600"
                                          >
                                            ₹{discountedTotal.toFixed(2)}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            (₹{discountedPrice.toFixed(2)} ×{" "}
                                            {item.quantity})
                                          </Typography>
                                        </>
                                      ) : (
                                        <>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            ₹{discountedTotal.toFixed(2)}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            (₹{discountedPrice.toFixed(2)} ×{" "}
                                            {item.quantity})
                                          </Typography>
                                        </>
                                      )}
                                    </>
                                  );
                                })()}
                              </Box>

                              {/* Discount Badge */}
                              {(() => {
                                const productPriceInfo =
                                  product?.pricesAndSkus?.[0];
                                const isDiscounted =
                                  productPriceInfo?.isDiscounted;
                                const discountPercentage =
                                  productPriceInfo?.discountPercentage;

                                return isDiscounted &&
                                  discountPercentage > 0 ? (
                                  <Typography
                                    variant="caption"
                                    color="success.main"
                                    fontWeight="600"
                                  >
                                    {discountPercentage}% OFF
                                  </Typography>
                                ) : null;
                              })()}
                            </Box>
                            {product?.categoryName && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Category: {product.categoryName}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return renderProfileInfo();
      case "orders":
        return renderOrders();
      case "address":
        return (
          <Card
            sx={{
              mb: 4,
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "8px",
            }}
            elevation={0}
          >
            <CardContent>
              <Typography
                variant="h6"
                color="primary.main"
                fontFamily={michroma.style.fontFamily}
                sx={{ mb: 3 }}
              >
                Saved Addresses
              </Typography>
              {getUserId() ? (
                <AddressManager
                  userId={getUserId()!}
                  showSelectionMode={false}
                  hideAddNewButton={false}
                />
              ) : (
                <Alert severity="info">
                  Please log in to manage your addresses.
                </Alert>
              )}
            </CardContent>
          </Card>
        );
      default:
        return renderOrders();
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
            Profile
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
            My Profile
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "secondary.main",
                color: "secondary.main",
              },
            }}
          >
            Logout
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and account settings.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Sidebar - Navigation */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* User Greeting Section */}
            <Card
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "8px",
              }}
              elevation={0}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{ width: 50, height: 50, bgcolor: "primary.main" }}
                  >
                    {userProfile.firstName?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hello,
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {userProfile.firstName} {userProfile.lastName}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "8px",
              }}
              elevation={0}
            >
              <CardContent sx={{ p: "0px !important" }}>
                <List sx={{ p: 0 }}>
                  {menuItems.map((item, index) => (
                    <ListItemButton
                      key={item.id}
                      selected={selectedTab === item.id}
                      onClick={() => setSelectedTab(item.id)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderBottom:
                          index < menuItems.length - 1 ? "1px solid" : "none",
                        borderColor: "divider",
                        "&.Mui-selected": {
                          backgroundColor: "primary.main",
                          color: "white",
                          "& .MuiListItemIcon-root": {
                            color: "white",
                          },
                          "&:hover": {
                            backgroundColor: "primary.main",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color:
                            selectedTab === item.id
                              ? "white"
                              : "text.secondary",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            color={
                              selectedTab === item.id ? "white" : "text.primary"
                            }
                            fontWeight={selectedTab === item.id ? "600" : "400"}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right Column - Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>{renderContent()}</Grid>
      </Grid>
    </Container>
  );
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
      <ProfileContent />
    </Suspense>
  );
}
