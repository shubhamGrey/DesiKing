import React from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 375,
        backgroundColor: "transparent",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        marginLeft: "100px !important",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="white"
        fontFamily="Rockwell"
        fontSize={40}
        gutterBottom
      >
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email address"
        margin="normal"
        variant="outlined"
        InputProps={{
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 30,
            border: "1px solid #000000",
          },
        }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        variant="outlined"
        InputProps={{
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 30,
            border: "1px solid #000000",
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#e67e22", // orange color
          color: "#ffffff",
          border: "2px solid #e67e22",
          fontWeight: "bold",
          py: 1.2,
          borderRadius: 8,
          mt: 2,
        }}
        onClick={() => {
          // Handle login logic here
          router.push("/home");
        }}
      >
        Log in
      </Button>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Link
          href="#"
          variant="body2"
          color="#e67e22"
          fontWeight="600"
          sx={{ textDecoration: "none" }}
        >
          Forgot password?
        </Link>
      </Box>

      <Typography variant="body2" color="#ffffff" sx={{ mt: 3 }}>
        Don&apos;t have an account?{" "}
        <Link
          href="#"
          fontWeight="600"
          color="#e67e22"
          sx={{ textDecoration: "none" }}
        >
          Create account
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
