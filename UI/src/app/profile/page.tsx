"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
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
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  Settings,
  ExitToApp,
  Edit,
  Save,
  Cancel,
  NavigateNext,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useUserSession, type UserProfile } from "@/utils/userSession";
import Cookies from "js-cookie";
import { useNotification } from "@/components/NotificationProvider";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";

const ProfileContent: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { getUserProfile, clearUserProfile, isLoggedIn } = useUserSession();
  const { showSuccess, showError } = useNotification();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const profile = getUserProfile();
    if (profile) {
      setUserProfile(profile);
      setEditForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        mobileNumber: profile.mobileNumber || "",
      });
    }
    setLoading(false);
  }, [isLoggedIn, getUserProfile, router]);

  const handleLogout = () => {
    clearUserProfile();
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_role");
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
    try {
      setLoading(true);
      // Here you would typically call an API to update the profile
      // For now, we'll just show a success message
      showSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch {
      showError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile Information", icon: <Person /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag /> },
    { id: "settings", label: "Account Settings", icon: <Settings /> },
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
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "primary.main",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h6"
          color="primary.main"
          fontFamily={michroma.style.fontFamily}
        >
          Profile Information
        </Typography>
        <Button
          startIcon={isEditing ? <Cancel /> : <Edit />}
          onClick={handleEditToggle}
          variant={isEditing ? "outlined" : "contained"}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
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
      {isEditing && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveProfile}
            disabled={loading}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderOrders = () => (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "primary.main",
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        color="primary.main"
        fontFamily={michroma.style.fontFamily}
      >
        Order History
      </Typography>
      <Alert severity="info">
        No orders found. Start shopping to see your order history here!
      </Alert>
      <Box mt={2}>
        <Button variant="contained" onClick={() => router.push("/products")}>
          Browse Products
        </Button>
      </Box>
    </Box>
  );

  const renderSettings = () => (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "primary.main",
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        color="primary.main"
        fontFamily={michroma.style.fontFamily}
      >
        Account Settings
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Change Password"
            secondary="Update your account password"
          />
          <Button variant="outlined" size="small">
            Change
          </Button>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Email Notifications"
            secondary="Manage your email preferences"
          />
          <Button variant="outlined" size="small">
            Manage
          </Button>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Privacy Settings"
            secondary="Control your privacy preferences"
          />
          <Button variant="outlined" size="small">
            Settings
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return renderProfileInfo();
      case "orders":
        return renderOrders();
      case "settings":
        return renderSettings();
      default:
        return renderProfileInfo();
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

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              flexDirection={isMobile ? "column" : "row"}
              textAlign={isMobile ? "center" : "left"}
            >
              <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
                {userProfile.firstName?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box flex={1}>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="primary.main"
                >
                  {userProfile.firstName} {userProfile.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userProfile.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile.roleName} • Member since{" "}
                  {new Date(userProfile.createdDate).getFullYear()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            <List sx={{ p: 0 }}>
              {menuItems.map((item, index) => (
                <ListItemButton
                  key={item.id}
                  selected={selectedTab === item.id}
                  onClick={() => setSelectedTab(item.id)}
                  sx={{
                    borderBottom:
                      index < menuItems.length - 1 ? "1px solid" : "none",
                    borderColor: "primary.main",
                    borderRadius:
                      index == 0
                        ? "8px 8px 0 0"
                        : index < menuItems.length - 1
                        ? "0"
                        : "0 0 8px 8px",
                    "&.Mui-selected": {
                      backgroundColor: "secondary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        selectedTab === item.id
                          ? "primary.contrastText"
                          : "primary.main",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        color={
                          selectedTab === item.id
                            ? "primary.contrastText"
                            : "primary.main"
                        }
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>{renderContent()}</Grid>
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
