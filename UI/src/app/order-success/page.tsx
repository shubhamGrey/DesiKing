"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  CheckCircle,
  LocalShipping,
  Payment,
  Home,
  Receipt,
  Schedule,
} from "@mui/icons-material";
import { michroma } from "@/styles/fonts";

const OrderSuccessContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "ORD-" + Date.now(),
    method: "cod",
    amount: 0,
    status: "confirmed",
  });

  useEffect(() => {
    const method = searchParams?.get("method") ?? "cod";
    const amount = searchParams?.get("amount") ?? "0";

    setOrderDetails((prev) => ({
      ...prev,
      method,
      amount: parseFloat(amount),
    }));
  }, [searchParams]);

  const nextSteps = [
    {
      icon: <Receipt />,
      title: "Order Confirmation",
      description: "You will receive an order confirmation email shortly",
      status: "completed",
    },
    {
      icon: <Schedule />,
      title: "Processing",
      description: "We are preparing your order",
      status: "current",
    },
    {
      icon: <LocalShipping />,
      title: "Shipping",
      description: "Your order will be shipped within 2-3 business days",
      status: "pending",
    },
    {
      icon: <CheckCircle />,
      title: "Delivery",
      description: "Estimated delivery in 5-7 business days",
      status: "pending",
    },
  ];

  return (
    <Container sx={{ mt: 3, mx: 6, mb: 6, justifySelf: "center" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        {/* Success Icon */}
        <CheckCircle
          sx={{
            fontSize: 80,
            color: "success.main",
            mb: 2,
          }}
        />

        {/* Main Heading */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontFamily: michroma.style.fontFamily,
            color: "success.main",
            mb: 2,
          }}
        >
          Order Placed Successfully!
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your order. We&apos;ve received your order and will
          start processing it soon.
        </Typography>

        {/* Order Details Card */}
        <Card sx={{ width: "100%", mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Order Details
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="body1">
                <strong>Order ID:</strong>
              </Typography>
              <Chip
                label={orderDetails.orderId}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="body1">
                <strong>Payment Method:</strong>
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Payment fontSize="small" />
                <Typography>
                  {orderDetails.method === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="body1">
                <strong>Order Status:</strong>
              </Typography>
              <Chip label={orderDetails.status.toUpperCase()} color="success" />
            </Box>

            {orderDetails.amount > 0 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">
                  <strong>Total Amount:</strong>
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{orderDetails.amount.toFixed(2)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card sx={{ width: "100%", mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              What happens next?
            </Typography>

            <List>
              {nextSteps.map((step) => {
                const getIconColor = () => {
                  if (step.status === "completed") return "success.main";
                  if (step.status === "current") return "primary.main";
                  return "grey.400";
                };

                const getTextColor = () => {
                  if (step.status === "completed") return "success.main";
                  if (step.status === "current") return "primary.main";
                  return "text.primary";
                };

                return (
                  <ListItem key={step.title} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ color: getIconColor() }}>
                      {step.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={step.title}
                      secondary={step.description}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight:
                            step.status === "current" ? "bold" : "normal",
                          color: getTextColor(),
                        },
                      }}
                    />
                    {step.status === "completed" && (
                      <CheckCircle color="success" fontSize="small" />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>

        {/* Important Notes */}
        {orderDetails.method === "cod" && (
          <Card sx={{ width: "100%", mb: 4, bgcolor: "warning.light" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.dark">
                Cash on Delivery Notes
              </Typography>
              <Typography variant="body2" color="warning.dark">
                • Please keep the exact amount ready at the time of delivery
                <br />
                • Our delivery partner will collect the payment
                <br />• You can pay in cash only
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => router.push("/")}
            size="large"
          >
            Continue Shopping
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.push("/profile")}
            size="large"
          >
            View Orders
          </Button>

          <Button
            variant="outlined"
            startIcon={<Receipt />}
            onClick={() => window.print()}
            size="large"
          >
            Print Receipt
          </Button>
        </Box>

        <Divider sx={{ width: "100%", my: 4 }} />

        {/* Support Information */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Need help with your order?
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button
            variant="text"
            onClick={() => router.push("/contact")}
            size="small"
          >
            Contact Support
          </Button>

          <Button
            variant="text"
            onClick={() => router.push("/shipping-policy")}
            size="small"
          >
            Shipping Policy
          </Button>

          <Button
            variant="text"
            onClick={() => router.push("/refund-policy")}
            size="small"
          >
            Return Policy
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default function OrderSuccessPage() {
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
            textAlign="center"
            gap={4}
          >
            {/* Success icon */}
            <Skeleton variant="circular" width={80} height={80} />

            {/* Success message */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Skeleton variant="text" width={300} height={40} />
              <Skeleton variant="text" width={400} height={24} />
            </Box>

            {/* Order details card */}
            <Box
              sx={{
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 3 }} />

              {/* Order info rows */}
              {[1, 2, 3, 4].map((row) => (
                <Box
                  key={row}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Skeleton variant="text" width={120} height={20} />
                  <Skeleton variant="text" width={150} height={20} />
                </Box>
              ))}
            </Box>

            {/* Next steps card */}
            <Box
              sx={{
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Skeleton variant="text" width={200} height={28} sx={{ mb: 3 }} />

              {/* Step items */}
              {[1, 2, 3, 4].map((step) => (
                <Box
                  key={step}
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton variant="text" width="80%" height={16} />
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={150}
                height={48}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={150}
                height={48}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          </Box>
        </Container>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
