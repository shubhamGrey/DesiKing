"use client";

import {
  Box,
  Grid,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert, // Import Snackbar and Alert components
} from "@mui/material";
import Image from "next/image";
import BrandLogo from "../../../public/AgroNexisGreen.png";
import LoginImg from "../../../public/Login.png";

import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie for managing cookies

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface SignUpCredentials {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone_number: string;
}

interface SignUpResponse {
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // State to toggle between forms
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is mobile
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Store tokens in cookies
      Cookies.set("access_token", data.access_token, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refresh_token", data.refresh_token, {
        secure: true,
        sameSite: "strict",
      });

      // Redirect to the home page
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during login:", error.message);
        setSnackbar({ open: true, message: error.message, severity: "error" });
      } else {
        console.error("Error during login:", error);
        setSnackbar({
          open: true,
          message: "An unexpected error occurred",
          severity: "error",
        });
      }
    }
  };

  const handleSignUp = async (
    credentials: SignUpCredentials
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      const data: SignUpResponse = await response.json();

      setSnackbar({
        open: true,
        message: data.message || "Sign-up successful! Please log in.",
        severity: "success",
      });

      // Redirect to login page after successful sign-up
      setIsLogin(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign-up:", error.message);
        setSnackbar({ open: true, message: error.message, severity: "error" });
      } else {
        console.error("Error during sign-up:", error);
        setSnackbar({
          open: true,
          message: "An unexpected error occurred",
          severity: "error",
        });
      }
    }
  };

  return (
    <>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
