"use client";

import { processApiResponse } from "@/utils/apiErrorHandling";
import { isAdmin, isLoggedIn } from "@/utils/auth";
import {
  Add,
  Analytics,
  Category,
  ChevronLeft,
  Dashboard,
  Edit as EditIcon,
  ExpandLess,
  ExpandMore,
  FileDownload,
  Inventory,
  LocalShipping,
  Menu as MenuIcon,
  NavigateNext,
  Notifications,
  People,
  Refresh,
  Search,
  Settings,
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
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// Backend API Response Interfaces
interface ApiResponseInfo {
  isSuccess: boolean;
  code: string;
  message: string;
}

interface ApiResponse<T> {
  info: ApiResponseInfo;
  data: T;
  id: string;
}

// Product interfaces based on backend ProductResponseModel
interface ProductPrice {
  id: string;
  currencyId: string;
  currencyCode: string;
  price: number;
  createdDate: string;
  modifiedDate?: string;
  isDiscounted: boolean;
  discountPercentage: number;
  discountedAmount?: number;
  weightId?: string;
  weightValue?: number;
  weightUnit?: string;
  skuNumber: string;
  barcode?: string;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  categoryName: string;
  manufacturingDate: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle?: string;
  metaDescription?: string;
  imageUrls: string[];
  keyFeatures: string[];
  uses: string[];
  origin?: string;
  shelfLife?: string;
  storageInstructions?: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  ingredients?: string;
  nutritionalInfo?: string;
  thumbnailUrl?: string;
  pricesAndSkus: ProductPrice[];
}

// Category interfaces based on backend CategoryResponseModel
interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  brandId: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Brand interfaces based on backend BrandResponseModel
interface Brand {
  id: string;
  name: string;
  code?: string;
  description?: string;
  logoUrl?: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Order interfaces based on backend OrderByUserResponseModel
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdDate: string;
}

interface Transaction {
  id: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  userId: string;
  signature?: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
  createdDate: string;
}

interface DetailedAddress {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  landMark?: string;
  pinCode: string;
  stateCode: string;
  countryCode: string;
  addressType: string;
  createdDate: string;
}

interface Order {
  id: string;
  userId: string;
  razorpayOrderId?: string;
  receiptId?: string;
  status: string;
  totalAmount: number;
  currency?: string;
  createdDate: string;
  docketNumber?: string;
  orderItems: OrderItem[];
  transaction?: Transaction;
  shippingAddress?: DetailedAddress;
  billingAddress?: DetailedAddress;
}

// Role interface for user management
interface Role {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
}

const AdminDashboardContent: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  // Roles state for user management
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Modern dashboard states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Fetch all orders function
  const fetchAllOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        setOrdersError("Authentication required");
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/all-orders`;
      console.log("Fetching orders from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Orders API response status:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Orders API error response:", errorText);
        setOrdersError(`API Error: ${response.status} ${response.statusText}`);
        setOrders([]);
        return;
      }

      const result = await processApiResponse<ApiResponse<Order[]>>(response);
      console.log("Processed orders response:", result);

      if (result && result.data) {
        console.log("Setting orders data:", result.data.length, "items");
        setOrders(result.data);
      } else {
        console.log("No orders data found");
        setOrdersError("No orders found");
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrdersError("Failed to fetch orders");

      // Fallback mock data for development
      const mockOrders: Order[] = [
        {
          id: "1",
          userId: "cust1",
          razorpayOrderId: "rzp_order_123",
          receiptId: "receipt_123",
          status: "Delivered",
          totalAmount: 200,
          currency: "USD",
          createdDate: new Date().toISOString(),
          docketNumber: "DOC123",
          orderItems: [
            {
              id: "item1",
              orderId: "1",
              productId: "prod1",
              quantity: 2,
              price: 100,
              createdDate: new Date().toISOString(),
            },
          ],
          transaction: {
            id: "txn1",
            razorpayPaymentId: "pay_123",
            razorpayOrderId: "rzp_order_123",
            userId: "cust1",
            signature: "signature_123",
            totalAmount: 200,
            currency: "USD",
            status: "Completed",
            paymentMethod: "Credit Card",
            paidAt: new Date().toISOString(),
            createdDate: new Date().toISOString(),
          },
          shippingAddress: {
            id: "addr1",
            userId: "cust1",
            fullName: "John Doe",
            phoneNumber: "1234567890",
            addressLine: "123 Main St",
            city: "Sample City",
            landMark: "Near Sample Mall",
            pinCode: "12345",
            stateCode: "ST",
            countryCode: "US",
            addressType: "Home",
            createdDate: new Date().toISOString(),
          },
        },
      ];
      console.log("Using mock orders data:", mockOrders);
      setOrders(mockOrders);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch products function
  const fetchAllProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Products endpoint returns array directly without wrapper
      const productsData = await processApiResponse<Product[]>(response);
      if (productsData && Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsError("Failed to fetch products");
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch categories function
  const fetchAllCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Categories endpoint returns array directly without wrapper
      const categoriesData = await processApiResponse<Category[]>(response);
      if (categoriesData && Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoriesError("Failed to fetch categories");
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch brands function
  const fetchAllBrands = async () => {
    try {
      setBrandsLoading(true);
      setBrandsError(null);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/brand`;
      console.log("Fetching brands from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Brands API error response:", errorText);
        setBrandsError(`API Error: ${response.status} ${response.statusText}`);
        setBrands([]);
        return;
      }

      const result = await processApiResponse<ApiResponse<Brand[]>>(response);
      console.log("Processed brands response:", result);

      if (result && result.data && Array.isArray(result.data)) {
        console.log("Setting brands data:", result.data.length, "items");
        setBrands(result.data);
      } else {
        console.log("No brands data found or invalid format");
        setBrands([]);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
      setBrandsError("Failed to fetch brands");

      // Fallback mock data for development
      const mockBrands: Brand[] = [
        {
          id: "1",
          name: "Sample Brand 1",
          code: "SB1",
          description: "Description for brand 1",
          logoUrl: undefined,
          isActive: true,
          isDeleted: false,
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Sample Brand 2",
          code: "SB2",
          description: "Description for brand 2",
          logoUrl: undefined,
          isActive: true,
          isDeleted: false,
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
        },
      ];
      console.log("Using mock brands data:", mockBrands);
      setBrands(mockBrands);
    } finally {
      setBrandsLoading(false);
    }
  };

  // Fetch roles function for user management
  const fetchAllRoles = async () => {
    try {
      setRolesLoading(true);
      setRolesError(null);

      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        setRolesError("Authentication required");
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/role`;
      console.log("Fetching roles from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Roles API response status:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Roles API error response:", errorText);
        setRolesError(`API Error: ${response.status} ${response.statusText}`);
        setRoles([]);
        return;
      }

      // Roles endpoint returns array directly without wrapper
      const rolesData = await processApiResponse<Role[]>(response);
      console.log("Processed roles response:", rolesData);

      if (rolesData && Array.isArray(rolesData)) {
        console.log("Setting roles data:", rolesData.length, "items");
        setRoles(rolesData);
      } else {
        console.log("No roles data found or invalid format");
        setRoles([]);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setRolesError("Failed to fetch roles");

      // Fallback mock data for development
      const mockRoles: Role[] = [
        {
          id: "1",
          name: "Admin",
          description: "Administrator role with full access",
          isActive: true,
          isDeleted: false,
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Customer",
          description: "Regular customer role",
          isActive: true,
          isDeleted: false,
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
        },
      ];
      console.log("Using mock roles data:", mockRoles);
      setRoles(mockRoles);
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);

      // Calculate analytics from existing data
      const analytics = {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalBrands: brands.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        recentOrders: orders
          .sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          )
          .slice(0, 5),
        topCategories: categories.filter((cat) => cat.isActive).slice(0, 5),
        pendingOrders: orders.filter(
          (order) => order.status?.toLowerCase() === "pending"
        ).length,
        completedOrders: orders.filter(
          (order) => order.status?.toLowerCase() === "paid"
        ).length,
      };

      setAnalyticsData(analytics);
    } catch (err) {
      console.error("Error calculating analytics:", err);
      setAnalyticsError("Failed to calculate analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch data when tabs are selected
  useEffect(() => {
    switch (selectedTab) {
      case "orders":
        fetchAllOrders();
        break;
      case "products":
        fetchAllProducts();
        break;
      case "categories":
        fetchAllCategories();
        break;
      case "brands":
        fetchAllBrands();
        break;
      case "users":
        fetchAllRoles();
        break;
      case "analytics":
        fetchAnalyticsData();
        break;
      default:
        // For overview, fetch basic data
        if (products.length === 0) fetchAllProducts();
        if (categories.length === 0) fetchAllCategories();
        if (brands.length === 0) fetchAllBrands();
        if (orders.length === 0) fetchAllOrders();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  // Fetch analytics when data changes
  useEffect(() => {
    if (selectedTab === "analytics" || selectedTab === "overview") {
      fetchAnalyticsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, categories, brands, orders, selectedTab]);

  // Helper functions
  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount / 100); // Assuming amount is in paise
  };

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderOrdersTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "primary.contrastText" }}>
                Order ID
              </TableCell>
              <TableCell sx={{ color: "primary.contrastText" }}>
                Customer
              </TableCell>
              <TableCell sx={{ color: "primary.contrastText" }}>Date</TableCell>
              <TableCell sx={{ color: "primary.contrastText" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "primary.contrastText" }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: "primary.contrastText" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow
                key={order.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    #{order.receiptId || order.id.substring(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.shippingAddress ? (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.shippingAddress.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.shippingAddress.phoneNumber}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2">N/A</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(order.createdDate)}
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
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(order.totalAmount, order.currency)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedOrder(order)}
                      color="primary"
                    >
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
    );
  };

  // Calculate real-time statistics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCategories = categories.length;
  const totalBrands = brands.length;
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

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  // Calculate order statistics for orders section
  const uniqueCustomers = new Set(orders.map((order) => order.userId)).size;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const renderOrders = () => (
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
            onClick={fetchAllOrders}
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
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <ShoppingCart sx={{ fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {totalOrders}
                    </Typography>
                    <Typography variant="body2">Total Orders</Typography>
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
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <TrendingUp sx={{ fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(totalRevenue)}
                    </Typography>
                    <Typography variant="body2">Total Revenue</Typography>
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
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <People sx={{ fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {uniqueCustomers}
                    </Typography>
                    <Typography variant="body2">Customers</Typography>
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
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <LocalShipping sx={{ fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {pendingOrders}
                    </Typography>
                    <Typography variant="body2">Pending</Typography>
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
                                      {item.productId.substring(0, 8)}... (Qty:{" "}
                                      {item.quantity}, Price:{" "}
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

  const renderProducts = () => (
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
            Product Management
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchAllProducts}
            disabled={productsLoading}
            startIcon={
              productsLoading ? <CircularProgress size={20} /> : <Refresh />
            }
          >
            Refresh Products
          </Button>
        </Box>

        {productsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {productsError}
          </Alert>
        )}

        {productsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">No products found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.id?.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.categoryName || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {/* Brand name needs to be fetched separately or included in product response */}
                        Brand
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.pricesAndSkus &&
                        product.pricesAndSkus.length > 0
                          ? formatCurrency(product.pricesAndSkus[0].price)
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {/* Stock quantity is not in the Product model, showing active status instead */}
                        {product.isActive ? "In Stock" : "Out of Stock"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive ? "Active" : "Inactive"}
                        color={product.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderCategories = () => (
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
            Category Management
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchAllCategories}
            disabled={categoriesLoading}
            startIcon={
              categoriesLoading ? <CircularProgress size={20} /> : <Refresh />
            }
          >
            Refresh Categories
          </Button>
        </Box>

        {categoriesError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {categoriesError}
          </Alert>
        )}

        {categoriesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Alert severity="info">No categories found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Category ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Products Count</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {category.id?.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {category.name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {category.description || "No description"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {/* Product count is not in Category model, calculate from products */}
                        {
                          products.filter((p) => p.categoryId === category.id)
                            .length
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.isActive ? "Active" : "Inactive"}
                        color={category.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {category.createdDate
                          ? formatDate(category.createdDate)
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderBrands = () => (
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
            Brand Management
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchAllBrands}
            disabled={brandsLoading}
            startIcon={
              brandsLoading ? <CircularProgress size={20} /> : <Refresh />
            }
          >
            Refresh Brands
          </Button>
        </Box>

        {brandsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {brandsError}
          </Alert>
        )}

        {brandsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : brands.length === 0 ? (
          <Alert severity="info">No brands found</Alert>
        ) : (
          <Grid container spacing={3}>
            {brands.map((brand) => (
              <Grid key={brand.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                        {brand.name?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {brand.name || "N/A"}
                        </Typography>
                        <Chip
                          label={brand.isActive ? "Active" : "Inactive"}
                          color={brand.isActive ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    </Box>
                    {brand.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {brand.description}
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
                        {brand.createdDate
                          ? formatDate(brand.createdDate)
                          : "N/A"}
                      </Typography>
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderUsers = () => (
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
            onClick={fetchAllRoles}
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
            <Button variant="outlined" startIcon={<People />}>
              View All Users
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
                    {orders ? new Set(orders.map((o) => o.userId)).size : 0}
                  </Typography>
                  <Typography variant="body2">Total Users</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="success.main">
                    {roles.filter((r) => r.isActive).length}
                  </Typography>
                  <Typography variant="body2">Active Roles</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="info.main">
                    {
                      orders.filter(
                        (o) =>
                          new Date(o.createdDate) >
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

  const renderAnalytics = () => (
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
            Analytics & Reports
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchAnalyticsData}
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

        {analyticsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : analyticsData ? (
          <>
            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 32, mr: 2 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          ₹{(analyticsData.totalRevenue / 100).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">Total Revenue</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <ShoppingCart sx={{ fontSize: 32, mr: 2 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {analyticsData.totalOrders}
                        </Typography>
                        <Typography variant="body2">Total Orders</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <Inventory sx={{ fontSize: 32, mr: 2 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {analyticsData.totalProducts}
                        </Typography>
                        <Typography variant="body2">Total Products</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <People sx={{ fontSize: 32, mr: 2 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {new Set(orders.map((o) => o.userId)).size}
                        </Typography>
                        <Typography variant="body2">Active Users</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Order Status Analytics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Status Distribution
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Pending Orders:</Typography>
                        <Chip
                          label={analyticsData.pendingOrders}
                          color="warning"
                          size="small"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Completed Orders:</Typography>
                        <Chip
                          label={analyticsData.completedOrders}
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Success Rate:</Typography>
                        <Typography fontWeight="bold" color="success.main">
                          {analyticsData.totalOrders > 0
                            ? Math.round(
                                (analyticsData.completedOrders /
                                  analyticsData.totalOrders) *
                                  100
                              )
                            : 0}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List dense>
                      {analyticsData.recentOrders
                        .slice(0, 5)
                        .map((order: Order) => (
                          <ListItem key={order.id}>
                            <ListItemIcon>
                              <ShoppingCart color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={`Order #${
                                order.receiptId || order.id.substring(0, 8)
                              }`}
                              secondary={`₹${(
                                order.totalAmount / 100
                              ).toLocaleString()} - ${formatDate(
                                order.createdDate
                              )}`}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Export and Report Actions */}
            <Typography variant="h6" gutterBottom>
              Generate Reports
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Button variant="outlined" fullWidth startIcon={<Analytics />}>
                  Sales Report
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Button variant="outlined" fullWidth startIcon={<Inventory />}>
                  Product Performance
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Button variant="outlined" fullWidth startIcon={<People />}>
                  User Activity
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FileDownload />}
                >
                  Export All Data
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <Alert severity="info">No analytics data available</Alert>
        )}
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
      case "brands":
        return renderBrands();
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8f9fa", // Light background matching the uploaded image
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: sidebarCollapsed ? 80 : 240,
          flexShrink: 0,
          bgcolor: "#ffffff", // White sidebar background
          borderRight: "1px solid #e9ecef",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Admin Profile Section */}
        <Box sx={{ p: 3, borderBottom: "1px solid #e9ecef" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              AS
            </Avatar>
            {!sidebarCollapsed && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6c757d", fontSize: "0.75rem" }}
                >
                  Admin Store
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#212529" }}
                >
                  Saboor
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Search Bar */}
        {!sidebarCollapsed && (
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search..."
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#212529",
                  bgcolor: "#f8f9fa",
                  "& fieldset": {
                    borderColor: "#dee2e6",
                  },
                  "&:hover fieldset": {
                    borderColor: "#adb5bd",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#6c757d",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#6c757d" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, px: 2, py: 1 }}>
          {[
            { icon: <Dashboard />, label: "Dashboard", id: "overview" },
            { icon: <Inventory />, label: "Products", id: "products" },
            { icon: <Category />, label: "Categories", id: "categories" },
            { icon: <LocalShipping />, label: "Brands", id: "brands" },
            { icon: <ShoppingCart />, label: "Orders", id: "orders" },
            { icon: <People />, label: "Users", id: "users" },
            {
              icon: <Analytics />,
              label: "Analytics",
              id: "analytics",
              addIcon: true,
            },
            { icon: <Settings />, label: "Settings", id: "settings" },
          ].map((item) => (
            <ListItemButton
              key={item.id}
              selected={selectedTab === item.id}
              onClick={() => setSelectedTab(item.id)}
              sx={{
                mb: 1,
                borderRadius: 2,
                color: selectedTab === item.id ? "white" : "#6c757d",
                bgcolor:
                  selectedTab === item.id ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: "#e9ecef",
                },
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                  minWidth: sidebarCollapsed ? 0 : 40,
                },
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                px: sidebarCollapsed ? 1 : 2,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: selectedTab === item.id ? 600 : 400,
                  }}
                />
              )}
              {!sidebarCollapsed && item.id === "analytics" && (
                <Add sx={{ ml: "auto", fontSize: "1rem" }} />
              )}
            </ListItemButton>
          ))}
        </Box>

        {/* Discover New Features Card */}
        {!sidebarCollapsed && (
          <Box sx={{ p: 2, mt: "auto" }}>
            <Card
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Discover New Features!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: "0.75rem" }}>
                Lorem Ipsum dolor sit amet consectetur adipiscing elit. Sed arcu
                leo lobortis a.
              </Typography>
              <Button
                variant="contained"
                size="small"
                endIcon={<NavigateNext />}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontSize: "0.75rem",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Upgrade Now
              </Button>
            </Card>
          </Box>
        )}
        {!sidebarCollapsed && (
          <Box sx={{ p: 2, mt: "auto" }}>
            <Card
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Discover New Features!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: "0.75rem" }}>
                Lorem Ipsum dolor sit amet consectetur adipiscing elit. Sed arcu
                leo lobortis a.
              </Typography>
              <Button
                variant="contained"
                size="small"
                endIcon={<NavigateNext />}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontSize: "0.75rem",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Upgrade Now
              </Button>
            </Card>
          </Box>
        )}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Navigation Bar */}
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e9ecef",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left side: Breadcrumb and Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              sx={{ color: "#6c757d" }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <ChevronLeft />}
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#212529", fontWeight: "bold" }}
            >
              Order Product
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", color: "#6c757d" }}
            >
              <Link
                href="/"
                style={{ textDecoration: "none", color: "#6c757d" }}
              >
                Dashboard
              </Link>
              <NavigateNext sx={{ mx: 1, fontSize: "1rem" }} />
              <Typography sx={{ color: "#212529" }}>Order Product</Typography>
            </Box>
          </Box>

          {/* Right side: Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ color: "#6c757d" }}>EN</Typography>
            <IconButton sx={{ color: "#6c757d" }}>
              <Notifications />
            </IconButton>
            <IconButton sx={{ color: "#6c757d" }}>
              <Settings />
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              S
            </Avatar>
            <Typography sx={{ color: "#212529", fontWeight: "bold" }}>
              My Account
            </Typography>
          </Box>
        </Box>

        {/* Main Content Area - Dynamic based on selected tab */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>{renderContent()}</Box>
      </Box>
    </Box>
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
            <Skeleton variant="rectangular" width="100%" height={40} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        </Container>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
