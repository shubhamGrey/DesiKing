"use client";

import { Box, Grid, Typography, Link } from "@mui/material";
import Image from "next/image";
import BrandLogo from "../../../public/AgroNexisGreen.png";
import LoginImg from "../../../public/Login.png";

import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // State to toggle between forms

  const handleLogin = async () => {
    // TODO: Authenticate the user here...

    // Set cookie using API route
    await fetch("/api/login", { method: "POST" });
    router.push("/");
  };

  const handleSignUp = async () => {
    // TODO: Register the user here...

    // Redirect to login page after successful sign-up
    setIsLogin(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid size={6}>
          <Image
            src={BrandLogo}
            alt="Brand Logo"
            width={100}
            height={100}
            style={{ position: "absolute", top: 20, left: 25 }}
          />
          <Box sx={{ marginLeft: "100px !important", width: "fit-content" }}>
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
        <Grid size={6}>
          <Image
            src={LoginImg}
            alt="Login Image"
            style={{ height: "100%", width: "100%" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
