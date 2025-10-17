"use client";

import {
  Box,
  Grid,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import BrandLogo from "../../../public/AgroNexisGreen.png";
import LoginImg from "../../../public/Login.png";

import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Cookies from "js-cookie";
import { useNotification } from "@/components/NotificationProvider";

// Simple UserProfile type
type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  [key: string]: any;
};

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  roleId: string;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Logo skeleton */}
          <Skeleton
            variant="rectangular"
            width={100}
            height={100}
            sx={{
              position: "absolute",
              top: 20,
              left: 25,
              zIndex: 3,
              borderRadius: 2,
            }}
          />

          {/* Main content skeleton */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{
              height: "100%",
              width: "100%",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Form section skeleton */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ ml: { xs: 0, sm: "100px" }, mt: { xs: 10, sm: 12 } }}>
                {/* Form title */}
                <Skeleton
                  variant="text"
                  width={200}
                  height={40}
                  sx={{ mb: 3 }}
                />

                {/* Form fields */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={56}
                  sx={{ mb: 2, borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={56}
                  sx={{ mb: 3, borderRadius: 1 }}
                />

                {/* Submit button */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  sx={{ mb: 2, borderRadius: 1 }}
                />

                {/* Link text */}
                <Skeleton
                  variant="text"
                  width={250}
                  height={20}
                  sx={{ mx: "auto" }}
                />
              </Box>
            </Grid>

            {/* Image section skeleton (desktop only) */}
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showError, showSuccess } = useNotification();

  const searchParams = useSearchParams();

  // Function to fetch user profile after login
  const fetchUserProfile = async (
    accessToken: string
  ): Promise<UserProfile | null> => {
    try {
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

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        console.error("Failed to fetch user profile");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Helper function to validate and get redirect path
  const getValidRedirectPath = (
    searchParams: URLSearchParams | null
  ): string => {
    const rawRedirectPath = searchParams?.get("redirect");

    if (!rawRedirectPath) return "/";

    try {
      // Decode the URL in case it's encoded
      const decodedPath = decodeURIComponent(rawRedirectPath);

      // Validate redirect path - must start with / and not be external
      if (decodedPath.startsWith("/") && !decodedPath.includes("://")) {
        return decodedPath;
      }
    } catch {
      console.warn("Invalid redirect path:", rawRedirectPath);
    }

    return "/";
  };

  // Helper function to handle successful login
  const handleSuccessfulLogin = async (loginData: any) => {
    try {
      // Store tokens in cookies first
      Cookies.set("access_token", loginData.accessToken, { expires: 7 });
      Cookies.set("refresh_token", loginData.refreshToken, { expires: 7 });

      // Fetch user profile and wait for it to complete
      const userProfile = await fetchUserProfile(loginData.accessToken);

      if (userProfile) {
        // Store user role in cookies for middleware
        Cookies.set("user_role", userProfile.roleName, { expires: 7 });
        Cookies.set("user_id", userProfile.id, { expires: 7 });

        // Wait a bit for cookies to be set properly
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      showSuccess("Login successful! Redirecting...");

      // Handle redirect with proper validation - no timeout needed now since we await everything
      const redirectPath = getValidRedirectPath(searchParams);

      // Use window.location for more reliable redirect that doesn't rely on Next.js router state
      if (typeof window !== "undefined") {
        window.location.href = redirectPath;
      } else {
        // Fallback to router.push if window is not available (SSR)
        router.push(redirectPath);
      }
    } catch (error) {
      console.warn(
        "Failed to fetch user profile, but login will continue:",
        error
      );

      // Even if profile fetch fails, still redirect to avoid user being stuck
      showSuccess("Login successful! Redirecting...");
      const redirectPath = getValidRedirectPath(searchParams);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        } else {
          router.push(redirectPath);
        }
      }, 300); // Longer delay if profile fetch failed
    }
  };

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    if (isLoading) return; // Prevent multiple simultaneous login attempts

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/user-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        await handleSuccessfulLogin(data.data);
      } else {
        try {
          const errorData = await response.json();
          showError(errorData.message ?? "Login failed");
        } catch {
          showError("Login failed - server error");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    credentials: SignUpCredentials
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/user-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        showSuccess(data.data?.message ?? "Sign-up successful! Please log in.");

        // Switch to login form after successful sign-up
        setIsLogin(true);
      } else {
        const errorData = await response.json();
        showError(errorData.message ?? "Sign Up failed");
      }
    } catch (error) {
      console.error("Sign Up error:", error);
      showError("Sign Up failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        display: "flex",
        alignItems: "center", // Center content vertically
        justifyContent: "center", // Center content horizontally
        position: "relative", // Added for background image
        backgroundImage: isMobile ? `url(${LoginImg.src})` : "none", // Set background image for mobile
        backgroundSize: "cover", // Ensure the image covers the entire background
        backgroundPosition: "center", // Center the background image
        backgroundRepeat: "no-repeat", // Prevent image repetition
        backgroundColor: isMobile ? "rgba(0, 0, 0, 0.1)" : "transparent", // Add a low-opacity overlay
        "&::before": isMobile
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Low-opacity white overlay
              zIndex: 1, // Ensure overlay is above the background
            }
          : {},
      }}
    >
      <Image
        src={BrandLogo}
        alt="Brand Logo"
        width={100}
        height={100}
        style={{
          position: "absolute", // Keep the logo positioned absolutely
          top: 20,
          left: 25,
          zIndex: 3, // Ensure the logo is above the overlay and content
        }}
      />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        direction={isMobile ? "column" : "row"}
        sx={{
          height: "100%",
          width: "100%",
          position: "relative", // Ensure content is above the overlay
          zIndex: 2, // Place content above the overlay
        }}
      >
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Center content vertically within the grid
            height: "100%", // Ensure Grid occupies full height
          }}
        >
          <Box
            sx={{
              marginLeft: isMobile ? "0 !important" : "100px !important",
              width: isMobile ? "100%" : "fit-content",
              mt: isMobile ? 10 : 12, // Add margin to ensure forms start below the logo
            }}
          >
            {isLogin ? (
              <LoginForm handleLogin={handleLogin} />
            ) : (
              <SignUpForm handleSignUp={handleSignUp} />
            )}

            <Typography
              variant="body2"
              sx={{ color: "primary.dark", textAlign: "center" }}
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                href="#"
                fontWeight="600"
                sx={{ textDecoration: "none", color: "primary.main" }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create account" : "Log in"}
              </Link>
            </Typography>
          </Box>
        </Grid>
        {!isMobile && (
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%", // Ensure Grid occupies full height
            }}
          >
            <Image
              src={LoginImg}
              alt="Login Image"
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
