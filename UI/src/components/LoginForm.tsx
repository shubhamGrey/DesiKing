import React from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";

interface LoginFormProps {
  handleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin }) => {
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
        fontFamily="Rockwell"
        fontSize={40}
        sx={{ color: "primary.dark" }}
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
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "primary.main", // orange color
          color: "#ffffff",
          border: "2px solid",
          borderColor: "primary.main",
          py: 1.2,
          borderRadius: 8,
          mt: 2,
        }}
        onClick={handleLogin}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "primary.contrastText" }}
        >
          Log in
        </Typography>
      </Button>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Link
          href="#"
          variant="body2"
          fontWeight="600"
          sx={{ textDecoration: "none", color: "primary.main" }}
        >
          Forgot password?
        </Link>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, color: "primary.dark" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="#"
          fontWeight="600"
          color="#e67e22"
          sx={{ textDecoration: "none", color: "primary.main" }}
        >
          Create account
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
