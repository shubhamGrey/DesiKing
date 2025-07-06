import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  useMediaQuery,
} from "@mui/material";

interface LoginFormProps {
  handleLogin: (credentials: { username: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: isMobile ? "90%" : 375,
        backgroundColor: "transparent",
        borderRadius: 2,
        p: isMobile ? 2 : 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        fontFamily="Rockwell"
        fontSize={isMobile ? 30 : 40}
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
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        variant="outlined"
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "primary.main",
          color: "#ffffff",
          border: "2px solid",
          borderColor: "primary.main",
          py: isMobile ? 1 : 1.2,
          borderRadius: 8,
          mt: 2,
        }}
        onClick={() =>
          handleLogin({ username: "test@example.com", password: "password123" })
        }
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
    </Box>
  );
};

export default LoginForm;
