"use client";

import { useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

interface ForgotPasswordForm {
  email: string;
}

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const mode = token ? "reset" : "forgot";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const forgotForm = useForm<ForgotPasswordForm>({
    defaultValues: { email: "" },
  });
  const resetForm = useForm<ResetPasswordForm>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`${apiUrl}/Auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (json.info?.isSuccess) {
        setSuccessMessage(
          json.data ||
            "If that email is registered, check your inbox for a reset link.",
        );
      } else {
        setErrorMessage(
          json.info?.message || "Something went wrong. Please try again.",
        );
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleResetPassword = async (data: ResetPasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`${apiUrl}/Auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });
      const json = await res.json();
      if (json.info?.isSuccess) {
        setSuccessMessage(
          "Password reset successfully! Redirecting to login...",
        );
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setErrorMessage(
          json.info?.message ||
            "Invalid or expired token. Please request a new reset link.",
        );
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          {mode === "forgot" ? "Forgot Password" : "Reset Password"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {mode === "forgot"
            ? "Enter your email and we'll send you a reset link."
            : "Enter your new password below."}
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {mode === "forgot" && (
        <Box
          component="form"
          onSubmit={forgotForm.handleSubmit(handleForgotPassword)}
        >
          <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Email Address</InputLabel>
          <Controller
            name="email"
            control={forgotForm.control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="email"
                variant="filled"
                placeholder="Enter your email"
                error={!!forgotForm.formState.errors.email}
                helperText={forgotForm.formState.errors.email?.message}
                sx={{ mb: 3 }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            endIcon={<ArrowForward />}
            fullWidth
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </Box>
      )}

      {mode === "reset" && (
        <Box
          component="form"
          onSubmit={resetForm.handleSubmit(handleResetPassword)}
        >
          <InputLabel sx={{ mb: 1, fontWeight: 500 }}>New Password</InputLabel>
          <Controller
            name="newPassword"
            control={resetForm.control}
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="password"
                variant="filled"
                placeholder="New password"
                error={!!resetForm.formState.errors.newPassword}
                helperText={resetForm.formState.errors.newPassword?.message}
                sx={{ mb: 3 }}
              />
            )}
          />
          <InputLabel sx={{ mb: 1, fontWeight: 500 }}>
            Confirm Password
          </InputLabel>
          <Controller
            name="confirmPassword"
            control={resetForm.control}
            rules={{ required: "Please confirm your password" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="password"
                variant="filled"
                placeholder="Confirm new password"
                error={!!resetForm.formState.errors.confirmPassword}
                helperText={resetForm.formState.errors.confirmPassword?.message}
                sx={{ mb: 3 }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            endIcon={<ArrowForward />}
            fullWidth
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
