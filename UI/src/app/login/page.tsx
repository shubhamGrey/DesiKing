"use client";

import {
  Box,
  Grid,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import BrandLogo from "../../../public/AgroNexisGreen.png";
import LoginImg from "../../../public/Login.png";

import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNotification } from "@/components/NotificationProvider";
import { apiClient } from "@/utils/apiClient";

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
  const [isLogin, setIsLogin] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showError, showSuccess } = useNotification();

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const data = await apiClient.post<LoginResponse>(
        "/Auth/user-login",
        credentials
      );

      // Store tokens in cookies
      Cookies.set("access_token", data.access_token, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refresh_token", data.refresh_token, {
        secure: true,
        sameSite: "strict",
      });

      showSuccess("Login successful! Redirecting...");

      // Redirect to the home page
      router.push("/");
    } catch (error) {
      showError(error as Error);
    }
  };

  const handleSignUp = async (
    credentials: SignUpCredentials
  ): Promise<void> => {
    try {
      const data = await apiClient.post<SignUpResponse>(
        "/Auth/user-registration",
        credentials
      );

      showSuccess(data.message || "Sign-up successful! Please log in.");

      // Switch to login form after successful sign-up
      setIsLogin(true);
    } catch (error) {
      showError(error as Error);
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
