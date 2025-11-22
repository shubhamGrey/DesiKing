"use client";

import { processApiResponse } from "@/utils/apiErrorHandling";
import { isAdmin, isLoggedIn } from "@/utils/auth";
import {
  Analytics,
  Category,
  Dashboard,
  Inventory,
  NavigateNext,
  People,
  Settings,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
  useTheme,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState, useCallback } from "react";

// Import types
import type {
  Order,
  Product,
  Category as CategoryType,
  Brand,
  Role,
  User,
} from "@/types/admin";

// Import components
import AdminOverview from "@/components/admin/AdminOverview";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminBrands from "@/components/admin/AdminBrands";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";

const AdminDashboardContent: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<CategoryType[]>([]);
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

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

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

  // Trigger specific API calls when tab changes
  useEffect(() => {
    if (loading) return; // Don't fetch if still loading auth check

    switch (selectedTab) {
      case "overview":
        // Load all data for overview page
        if (brands.length === 0 && !brandsLoading) {
          fetchAllBrands().then((brandsData) => {
            if (products.length === 0 && !productsLoading) {
              fetchAllProducts(brandsData).then((productsData) => {
                if (orders.length === 0 && !ordersLoading) {
                  fetchAllOrders(productsData);
                }
              });
            }
          });
        } else if (products.length === 0 && !productsLoading) {
          fetchAllProducts().then((productsData) => {
            if (orders.length === 0 && !ordersLoading) {
              fetchAllOrders(productsData);
            }
          });
        } else if (orders.length === 0 && !ordersLoading) {
          fetchAllOrders();
        }
        if (categories.length === 0 && !categoriesLoading) {
          if (brands.length === 0 && !brandsLoading) {
            fetchAllBrands().then((brandsData) => {
              fetchAllCategories(brandsData);
            });
          } else {
            fetchAllCategories();
          }
        }
        break;
      case "orders":
        if (brands.length === 0 && !brandsLoading) {
          fetchAllBrands().then((brandsData) => {
            if (products.length === 0 && !productsLoading) {
              fetchAllProducts(brandsData).then((productsData) => {
                if (orders.length === 0 && !ordersLoading) {
                  fetchAllOrders(productsData);
                }
              });
            }
          });
        } else if (products.length === 0 && !productsLoading) {
          fetchAllProducts().then((productsData) => {
            if (orders.length === 0 && !ordersLoading) {
              fetchAllOrders(productsData);
            }
          });
        } else if (orders.length === 0 && !ordersLoading) {
          fetchAllOrders();
        }
        break;
      case "products":
        if (brands.length === 0 && !brandsLoading) {
          fetchAllBrands().then((brandsData) => {
            if (products.length === 0 && !productsLoading) {
              fetchAllProducts(brandsData);
            }
          });
        } else if (products.length === 0 && !productsLoading) {
          fetchAllProducts();
        }
        break;
      case "categories":
        if (brands.length === 0 && !brandsLoading) {
          fetchAllBrands().then((brandsData) => {
            if (categories.length === 0 && !categoriesLoading) {
              fetchAllCategories(brandsData);
            }
          });
        } else if (categories.length === 0 && !categoriesLoading) {
          fetchAllCategories();
        }
        break;
      case "brands":
        if (brands.length === 0 && !brandsLoading) {
          fetchAllBrands();
        }
        break;
      case "users":
        if (users.length === 0 && !usersLoading) {
          fetchAllUsers();
        }
        if (roles.length === 0 && !rolesLoading) {
          fetchAllRoles();
        }
        break;
    }
  }, [selectedTab, loading]);

  // Utility functions
  const formatCurrency = (amount: number, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount);
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

  const fetchAllProducts = useCallback(async (brandsData?: Brand[]) => {
    try {
      setProductsLoading(true);
      setProductsError(null);

      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = (await processApiResponse(response)) as any;
      
      // Use provided brands data or fall back to state
      const brandsToUse = brandsData || brands;
      
      console.log("Fetching products - brands available:", brandsToUse.length);
      console.log("Sample product brandId:", result[0]?.brandId);
      
      // Add brand names to products
      result.forEach((product: any) => {
        const brand = brandsToUse.find((b) => b.id === product.brandId);
        product.brandName = brand?.name || "Unknown Brand";
        if (!brand) {
          console.log(`No brand found for product ${product.name} with brandId: ${product.brandId}`);
        }
      });
      
      console.log("Products with brand names:", result.slice(0, 2));
      
      setProducts(result || []);
      return result || []; // Return the products for chaining
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setProductsError(error.message || "Failed to fetch products");
      return [];
    } finally {
      setProductsLoading(false);
    }
  }, [brands]);

  // Fetch functions
  const fetchAllOrders = useCallback(async (productsData?: Product[]) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/all-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = (await processApiResponse(response)) as any;

      // Use provided products data or fall back to state
      const productsToUse = productsData || products;

      // Add product names to order items
      result.forEach((order: any) => {
        if (order.orderItems && Array.isArray(order.orderItems)) {
          order.orderItems.forEach((item: any) => {
            const product = productsToUse.find((p) => p.id === item.productId);
            item.productName = product?.name || "Unknown Product";
          });
        }
      });

      console.log("Orders with products:", result);
      console.log("Products used:", productsToUse.length);

      setOrders(result || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setOrdersError(error.message || "Failed to fetch orders");
    } finally {
      setOrdersLoading(false);
    }
  }, [products]);

  const fetchAllCategories = useCallback(async (brandsData?: Brand[]) => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = (await processApiResponse(response)) as any;
      
      // Use provided brands data or fall back to state
      const brandsToUse = brandsData || brands;
      
      // Add brand names to categories
      result.forEach((category: any) => {
        const brand = brandsToUse.find((b) => b.id === category.brandId);
        category.brandName = brand?.name || "Unknown Brand";
      });
      
      setCategories(result || []);
      return result || [];
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setCategoriesError(error.message || "Failed to fetch categories");
      return [];
    } finally {
      setCategoriesLoading(false);
    }
  }, [brands]);

  const fetchAllBrands = useCallback(async () => {
    try {
      setBrandsLoading(true);
      setBrandsError(null);

      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await processApiResponse(response)) as any;
      setBrands(result || []);
      return result || []; // Return the brands for chaining
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      setBrandsError(error.message || "Failed to fetch brands");
      return [];
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  const fetchAllRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      setRolesError(null);

      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await processApiResponse(response)) as any;
      setRoles(result || []);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      setRolesError(error.message || "Failed to fetch roles");
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);

      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await processApiResponse(response)) as any;
      setUsers(result || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setUsersError(error.message || "Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Wrapper function to ensure brands are loaded before fetching products
  const refreshProducts = useCallback(async () => {
    if (brands.length === 0) {
      const brandsData = await fetchAllBrands();
      await fetchAllProducts(brandsData);
    } else {
      await fetchAllProducts();
    }
  }, [brands, fetchAllBrands, fetchAllProducts]);

  // Wrapper function to ensure brands are loaded before fetching categories
  const refreshCategories = useCallback(async () => {
    if (brands.length === 0) {
      const brandsData = await fetchAllBrands();
      await fetchAllCategories(brandsData);
    } else {
      await fetchAllCategories();
    }
  }, [brands, fetchAllBrands, fetchAllCategories]);

  // Navigation menu items
  const menuItems = [
    { id: "overview", label: "Overview", icon: Dashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Inventory },
    { id: "categories", label: "Categories", icon: Category },
    { id: "brands", label: "Brands", icon: Inventory },
    { id: "users", label: "Users", icon: People },
    { id: "analytics", label: "Analytics", icon: Analytics },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <AdminOverview
            orders={orders}
            products={products}
            categories={categories}
            brands={brands}
            formatCurrency={formatCurrency}
          />
        );
      case "orders":
        return (
          <AdminOrders
            orders={orders}
            ordersLoading={ordersLoading}
            ordersError={ordersError}
            onRefreshOrders={fetchAllOrders}
            formatCurrency={formatCurrency}
          />
        );
      case "products":
        return (
          <AdminProducts
            products={products}
            productsLoading={productsLoading}
            productsError={productsError}
            onRefreshProducts={refreshProducts}
            formatCurrency={formatCurrency}
          />
        );
      case "categories":
        return (
          <AdminCategories
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            brands={brands}
            onRefreshCategories={refreshCategories}
            formatDate={formatDate}
          />
        );
      case "brands":
        return (
          <AdminBrands
            brands={brands}
            brandsLoading={brandsLoading}
            brandsError={brandsError}
            onRefreshBrands={fetchAllBrands}
            formatDate={formatDate}
          />
        );
      case "users":
        return (
          <AdminUsers
            users={users}
            usersLoading={usersLoading}
            usersError={usersError}
            roles={roles}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            orders={orders}
            onRefreshUsers={fetchAllUsers}
            onRefreshRoles={fetchAllRoles}
            formatDate={formatDate}
          />
        );
      case "analytics":
        return <AdminAnalytics />;
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <AdminOverview
            orders={orders}
            products={products}
            categories={categories}
            brands={brands}
            formatCurrency={formatCurrency}
          />
        );
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setSelectedTab(itemId);
  };

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

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar as Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                color="primary.main"
                fontWeight="bold"
              >
                Admin Dashboard
              </Typography>
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      selected={selectedTab === item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        "&.Mui-selected": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                          "& .MuiListItemIcon-root": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Link underline="hover" color="inherit" href="/admin">
              Admin
            </Link>
            <Typography color="text.primary">
              {menuItems.find((item) => item.id === selectedTab)?.label ||
                "Overview"}
            </Typography>
          </Breadcrumbs>

          {/* Content */}
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={400} />
              </Box>
            }
          >
            {renderContent()}
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  );
};

const AdminDashboard = () => {
  return <AdminDashboardContent />;
};

export default AdminDashboard;
