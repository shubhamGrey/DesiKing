"use client";

import { Box, Grid } from "@mui/material";
import Image from "next/image";
import BrandLogo from "../../public/AgroNexisGreen.png";
import LoginImg from "../../public/Login.png";

import LoginForm from "@/views/login_form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    // TODO: Authenticate the user here...

    // Set cookie using API route
    await fetch("/api/login", { method: "POST" });
    router.push("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // backgroundImage: 'url("/Login Background.jpg")',
        // backgroundSize: "cover",
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
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
          <LoginForm handleLogin={handleLogin} />
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
