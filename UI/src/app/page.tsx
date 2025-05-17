"use client";

import { Box, Button, TextField, Typography, Link, Stack } from "@mui/material";
import Image from "next/image";
import BrandLogo from "@/public/images/Brand Logo (1).png";

import LoginForm from "@/views/login_form";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("/Login Background.jpg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        px: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        height="100vh"
        spacing={2}
      >
        <LoginForm />
        <Image
          src={BrandLogo}
          alt="Brand Logo"
          width={250}
          style={{ marginBottom: "60px" }}
        />
      </Stack>
    </Box>
  );
}
