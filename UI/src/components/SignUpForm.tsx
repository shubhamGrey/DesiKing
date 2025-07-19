import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";

interface SignUpFormProps {
  handleSignUp: (credentials: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    mobileNumber: string;
    roleId: string;
  }) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ handleSignUp }) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
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
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    };

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      handleSignUp({
        username: formData.email,
        password: formData.password,
        email: formData.email,
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ")[1] || "",
        mobileNumber: formData.phoneNumber,
        roleId: "01982363-91f8-702f-9ae5-fa383967036e", // Default role
      });
    } catch (error) {
      console.error("Sign up error:", error);
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
        Sign Up
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        margin="normal"
        variant="outlined"
        value={formData.fullName}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
        onKeyDown={handleKeyDown}
        error={!!errors.fullName}
        helperText={errors.fullName}
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
        label="Phone Number"
        type="tel"
        margin="normal"
        variant="outlined"
        value={formData.phoneNumber}
        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
        onKeyDown={handleKeyDown}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
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
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        variant="outlined"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        onKeyDown={handleKeyDown}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
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
          backgroundColor: "primary.main", // orange color
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
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Typography>
      </Button>
    </Box>
  );
};

export default SignUpForm;
