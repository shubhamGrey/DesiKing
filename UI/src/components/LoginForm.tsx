import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  useMediaQuery,
} from "@mui/material";

interface LoginFormProps {
  handleLogin: (credentials: { username: string; email: string, password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      handleLogin({
        username: formData.email,
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

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
        type="email"
        margin="normal"
        variant="outlined"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        onKeyDown={handleKeyDown}
        error={!!errors.email}
        helperText={errors.email}
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
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        onKeyDown={handleKeyDown}
        error={!!errors.password}
        helperText={errors.password}
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
        disabled={isLoading}
        sx={{
          backgroundColor: "primary.main",
          color: "#ffffff",
          border: "2px solid",
          borderColor: "primary.main",
          py: isMobile ? 1 : 1.2,
          borderRadius: 8,
          mt: 2,
        }}
        onClick={handleSubmit}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "primary.contrastText" }}
        >
          {isLoading ? "Logging in..." : "Log in"}
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
