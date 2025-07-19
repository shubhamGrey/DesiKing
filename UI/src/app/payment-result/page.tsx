"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CheckCircle, ErrorOutline, Home, Receipt } from "@mui/icons-material";
import { michroma } from "@/styles/fonts";
import { verifyPayment } from "@/utils/razorpayUtils";

const PaymentResult: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "verifying"
  >("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const orderId = searchParams?.get("order_id");
  const paymentId = searchParams?.get("payment_id");
  const signature = searchParams?.get("signature");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!orderId || !paymentId || !signature) {
        setPaymentStatus("failed");
        setErrorMessage("Invalid payment parameters");
        setIsVerifying(false);
        return;
      }

      try {
        const isValid = await verifyPayment(
          {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          },
          orderId
        );

        setPaymentStatus(isValid ? "success" : "failed");
        if (!isValid) {
          setErrorMessage("Payment verification failed");
        }
      } catch (error: any) {
        setPaymentStatus("failed");
        setErrorMessage(error?.message ?? "Payment verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPaymentStatus();
  }, [orderId, paymentId, signature]);

  if (isVerifying) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 8,
          mb: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }} color="primary.main">
            Verifying Payment...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we confirm your payment
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: "1px solid",
          borderColor:
            paymentStatus === "success" ? "success.main" : "error.main",
          borderRadius: 2,
        }}
      >
        {paymentStatus === "success" ? (
          <>
            <CheckCircle
              sx={{
                fontSize: 80,
                color: "success.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
              color="success.main"
              gutterBottom
            >
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Thank you for your purchase. Your order has been confirmed and you
              will receive an email confirmation shortly.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Order ID: <strong>{orderId}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment ID: <strong>{paymentId}</strong>
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <ErrorOutline
              sx={{
                fontSize: 80,
                color: "error.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
              color="error.main"
              gutterBottom
            >
              Payment Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We&apos;re sorry, but your payment could not be processed. Please
              try again.
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 4, textAlign: "left" }}>
                {errorMessage}
              </Alert>
            )}
          </>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => router.push("/")}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "secondary.main",
                color: "secondary.main",
              },
            }}
          >
            Go to Home
          </Button>

          {paymentStatus === "success" ? (
            <Button
              variant="contained"
              startIcon={<Receipt />}
              onClick={() => router.push("/orders")}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "secondary.main" },
              }}
            >
              View Orders
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => router.push("/cart")}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "secondary.main" },
              }}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult;
