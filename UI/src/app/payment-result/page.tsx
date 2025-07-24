"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Skeleton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, ErrorOutline, Home, Receipt } from "@mui/icons-material";
import { michroma } from "@/styles/fonts";
import { verifyPayment } from "@/utils/razorpayUtils";

interface PaymentResultData {
  status: "success" | "failed";
  orderId: string;
  paymentId?: string;
  signature?: string;
  userId?: string;
  totalAmount?: number;
  currency?: string;
  timestamp?: string;
  errorMessage?: string;
  paymentMethod?: string;
}

const PaymentResultContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "verifying"
  >("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentData, setPaymentData] = useState<PaymentResultData | null>(
    null
  );

  const status = searchParams?.get("status");
  const orderIdFromUrl = searchParams?.get("order_id");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        // Helper function to handle Razorpay payment verification
        const handleRazorpayVerification = async (
          paymentResult: PaymentResultData
        ) => {
          if (paymentResult.status === "success" && paymentResult.paymentId) {
            const isValid = await verifyPayment(
              {
                razorpay_order_id: paymentResult.orderId,
                razorpay_payment_id: paymentResult.paymentId,
                razorpay_signature: paymentResult.signature ?? "",
              },
              paymentResult.userId ?? "",
              paymentResult.totalAmount ?? 0,
              paymentResult.currency ?? "INR"
            );

            setPaymentStatus(isValid ? "success" : "failed");
            if (!isValid) {
              setErrorMessage("Payment verification failed");
            }
          } else if (paymentResult.status === "success") {
            // For COD orders, no payment verification needed
            setPaymentStatus("success");
          } else {
            setPaymentStatus("failed");
            setErrorMessage(paymentResult.errorMessage ?? "Payment failed");
          }
        };

        // Helper function to handle fallback URL parameters
        const handleFallbackData = () => {
          if (status === "success" && orderIdFromUrl) {
            setPaymentStatus("success");
            setPaymentData({
              status: "success",
              orderId: orderIdFromUrl,
              paymentMethod: "Unknown",
            });
          } else {
            setPaymentStatus("failed");
            setErrorMessage("No payment data found. Please try again.");
          }
        };

        // Try to get payment data from session storage first
        const storedPaymentResult = sessionStorage.getItem("payment_result");

        if (storedPaymentResult) {
          const paymentResult = JSON.parse(storedPaymentResult);
          setPaymentData(paymentResult);

          await handleRazorpayVerification(paymentResult);

          // Clear the session storage after reading
          sessionStorage.removeItem("payment_result");
        } else {
          handleFallbackData();
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setPaymentStatus("failed");
        setErrorMessage(error?.message ?? "Payment verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPaymentStatus();
  }, [status, orderIdFromUrl]);

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
          minHeight: "60vh",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "8px",
            minWidth: 400,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: "primary.main",
                mb: 3,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            color="primary.main"
            sx={{ mb: 2 }}
          >
            Verifying Payment
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please wait while we verify your payment details...
          </Typography>

          <Box
            sx={{
              p: 2,
              backgroundColor: "info.50",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "info.200",
            }}
          >
            <Typography variant="body2" color="info.main">
              🔄 This usually takes a few seconds
            </Typography>
          </Box>
        </Paper>
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
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "1px solid",
          borderColor:
            paymentStatus === "success" ? "success.main" : "error.main",
          borderRadius: "8px",
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Order Details:
              </Typography>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "success.50",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "success.200",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Order ID: <strong>{paymentData?.orderId ?? "N/A"}</strong>
                </Typography>
                {paymentData?.paymentId && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Payment ID: <strong>{paymentData.paymentId}</strong>
                  </Typography>
                )}
                {paymentData?.totalAmount && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Amount:{" "}
                    <strong>₹{paymentData.totalAmount.toFixed(2)}</strong>
                  </Typography>
                )}
                {paymentData?.paymentMethod && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Payment Method: <strong>{paymentData.paymentMethod}</strong>
                  </Typography>
                )}
                {paymentData?.timestamp && (
                  <Typography variant="body2" color="text.secondary">
                    Date:{" "}
                    <strong>
                      {new Date(paymentData.timestamp).toLocaleString()}
                    </strong>
                  </Typography>
                )}
              </Box>
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
              minWidth: 140,
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
                fontWeight: 600,
                minWidth: 140,
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
                fontWeight: 600,
                minWidth: 140,
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

const PaymentResult: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            gap={3}
          >
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton variant="text" width={250} height={30} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        </Container>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
};

export default PaymentResult;
