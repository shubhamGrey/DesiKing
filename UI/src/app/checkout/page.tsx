"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Alert,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from "@mui/material";
import {
  CreditCard,
  LocalShipping,
  Payment,
  CheckCircle,
  NavigateNext,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUserSession } from "@/utils/userSession";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, total, clearCart } = useCart();
  const { getUserProfile, isLoggedIn } = useUserSession();

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const steps = ["Shipping Details", "Payment Method", "Review Order"];
  const totalAmount = total;
  const shippingCost = totalAmount > 500 ? 0 : 50;
  const finalAmount = totalAmount + shippingCost;

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // Pre-fill form with user data if available
    const userProfile = getUserProfile();
    if (userProfile) {
      setShippingDetails((prev) => ({
        ...prev,
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.mobileNumber || "",
      }));
    }
  }, [isLoggedIn, items.length, getUserProfile, router]);

  const handleInputChange = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateShippingDetails = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    return required.every(
      (field) => shippingDetails[field as keyof ShippingDetails].trim() !== ""
    );
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingDetails()) {
      alert("Please fill in all required fields");
      return;
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") {
      // Handle Cash on Delivery
      try {
        setLoading(true);

        // Create order with COD
        const orderData = {
          userId: getUserProfile()?.id ?? "",
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price.toString()),
          })),
          totalAmount: finalAmount,
          currency: "INR",
          status: "pending",
          brandId: "default-brand-id", // You might want to get this dynamically
          paymentMethod: "cod",
          shippingDetails,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Checkout/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          }
        );

        if (response.ok) {
          clearCart();
          router.push("/order-success?method=cod");
        } else {
          throw new Error("Failed to create order");
        }
      } catch (error) {
        console.error("Order creation failed:", error);
        alert("Failed to place order. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Online Payment (simplified for now)
      try {
        setLoading(true);

        // Simulate online payment processing
        await new Promise((resolve) => setTimeout(resolve, 1000));

        clearCart();
        router.push("/order-success?method=online");
      } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderShippingDetails = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={shippingDetails.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={shippingDetails.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={shippingDetails.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="Phone Number"
              value={shippingDetails.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={shippingDetails.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="City"
              value={shippingDetails.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="State"
              value={shippingDetails.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="ZIP Code"
              value={shippingDetails.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPaymentMethod = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">Choose your payment method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="razorpay"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <CreditCard />
                  Online Payment (Credit/Debit Card, UPI, Net Banking)
                </Box>
              }
            />
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Payment />
                  Cash on Delivery
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {paymentMethod === "cod" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You will pay ₹{finalAmount} when your order is delivered.
          </Alert>
        )}

        {paymentMethod === "razorpay" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You will be redirected to a secure payment gateway to complete your
            payment.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderOrderReview = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Subtotal:</Typography>
              <Typography>₹{totalAmount.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Shipping:</Typography>
              <Typography>
                {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">₹{finalAmount.toFixed(2)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shipping Details
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {shippingDetails.firstName} {shippingDetails.lastName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {shippingDetails.address}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {shippingDetails.city}, {shippingDetails.state}{" "}
              {shippingDetails.zipCode}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {shippingDetails.phone}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body2">
              {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderShippingDetails();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderOrderReview();
      default:
        return null;
    }
  };

  return (
    <Container sx={{ mt: isMobile ? 8 : 12, mb: 6, px: isMobile ? 2 : 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            component="button"
            variant="body1"
            onClick={() => router.push("/")}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Home
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => router.push("/cart")}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Cart
          </Link>
          <Typography variant="body1" color="text.primary">
            Checkout
          </Typography>
        </Breadcrumbs>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontFamily={michroma.style.fontFamily}
          fontWeight={600}
          color="primary.main"
          sx={{ mb: 2 }}
        >
          Checkout
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete your order by providing your shipping and payment
          information.
        </Typography>
      </Box>

      {/* Step Indicator */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          {steps.map((step, index) => (
            <Box key={step} display="flex" alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: index <= activeStep ? "primary.main" : "grey.300",
                  color: index <= activeStep ? "white" : "grey.600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                {index < activeStep ? (
                  <CheckCircle fontSize="small" />
                ) : (
                  index + 1
                )}
              </Box>
              <Typography
                color={index <= activeStep ? "primary" : "textSecondary"}
                sx={{ mr: 2 }}
              >
                {step}
              </Typography>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 50,
                    height: 2,
                    bgcolor: index < activeStep ? "primary.main" : "grey.300",
                    mr: 2,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          variant="outlined"
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handlePlaceOrder}
            disabled={loading}
            variant="contained"
            size="large"
            startIcon={
              loading ? (
                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  animation="pulse"
                />
              ) : (
                <LocalShipping />
              )
            }
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Breadcrumbs skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Skeleton variant="text" width={50} height={20} />
            <Skeleton variant="text" width={10} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>

          {/* Title skeleton */}
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            {/* Main content skeleton */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Stepper skeleton */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  {[1, 2, 3].map((step) => (
                    <Box
                      key={step}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={80} height={20} />
                    </Box>
                  ))}
                </Box>
                <Skeleton variant="rectangular" width="100%" height={2} />
              </Box>

              {/* Form card skeleton */}
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                }}
              >
                <Skeleton
                  variant="text"
                  width={150}
                  height={28}
                  sx={{ mb: 3 }}
                />

                {/* Form fields grid */}
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((field) => {
                    let gridSize;
                    if (field <= 4) {
                      gridSize = 6;
                    } else if (field === 5) {
                      gridSize = 12;
                    } else {
                      gridSize = 4;
                    }

                    return (
                      <Grid key={field} size={{ xs: 12, sm: gridSize }}>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={56}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* Navigation buttons */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={36}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={36}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Grid>

            {/* Order summary skeleton */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 3 }}>
                <Skeleton
                  variant="text"
                  width={120}
                  height={28}
                  sx={{ mb: 3 }}
                />

                {/* Cart items */}
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={60}
                      sx={{ borderRadius: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton
                        variant="text"
                        width="100%"
                        height={20}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton variant="text" width="60%" height={16} />
                    </Box>
                  </Box>
                ))}

                {/* Price breakdown */}
                <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                  {[1, 2, 3, 4].map((line) => (
                    <Box
                      key={line}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={60} height={20} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
