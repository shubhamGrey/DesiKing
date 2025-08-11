"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import { Security } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import theme from "@/styles/theme";
import { michroma } from "@/styles/fonts";
import EmptyCart from "@/components/EmptyCart";
import RazorpayPayment from "@/components/RazorpayPayment";
import {
  PaymentFormData,
  OrderCreateRequest,
  RazorpayPaymentData,
} from "@/types/razorpay";
import { createOrder } from "@/utils/razorpayUtils";
import { useCart } from "@/contexts/CartContext";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string): boolean => {
  return imageSrc.includes("cloud.agronexis.com");
};

const Cart = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const {
    items: cartItems,
    total: subtotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );


  // Form data state
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
  });

  const [formErrors, setFormErrors] = useState<Partial<PaymentFormData>>({});
  const [userId, setUserId] = useState<string>("");

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Partial<PaymentFormData> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (userProfileRaw) {
      try {
        const userProfile = JSON.parse(userProfileRaw);
        setUserId(userProfile?.id);
      } catch {
        setUserId("");
        // Redirect to login if user profile is invalid
        router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
      }
    } else {
      // Redirect to login if no user profile exists
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
    }
  }, [router]);


  // Helper function to handle Razorpay orders
  const handleRazorpayOrder = async () => {
    try {
      setIsLoading(true);
      const orderData: OrderCreateRequest = {
        userId: userId,
        totalAmount: subtotal,
        currency: "INR",
        status: "created",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(orderData, "RAZORPAY");

      // The backend now returns the Razorpay order ID for Razorpay payments
      const razorpayOrderId = result.data.razorpayOrderId || "";

      if (!razorpayOrderId) {
        throw new Error("No Razorpay order ID received from server");
      }

      setOrderId(razorpayOrderId);
      setShowRazorpay(true);
    } catch (error: any) {
      console.error("Razorpay order error:", error);
      setAlertMessage(
        `Failed to create order: ${error.message || "Please try again."}`
      );
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      setAlertMessage("Please fill in all required fields correctly");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    // Handle Razorpay payment
    await handleRazorpayOrder();
  };

  // Handle successful payment
  const handlePaymentSuccess = (paymentData: RazorpayPaymentData) => {
    setAlertMessage("Payment successful! Redirecting...");
    setAlertSeverity("success");
    setShowAlert(true);

    // Clear cart after successful payment
    clearCart();

    setTimeout(() => {
      router.push(
        `/payment-result?status=success&order_id=${paymentData.razorpay_order_id}&payment_id=${paymentData.razorpay_payment_id}&signature=${paymentData.razorpay_signature}&user_id=${userId}&total_amount=${subtotal}&currency=INR`
      );
    }, 2000);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setAlertMessage(`Payment failed: ${error}`);
    setAlertSeverity("error");
    setShowAlert(true);
  };

  // Get button text based on current state
  const getButtonText = () => {
    if (isLoading) return "Processing...";
    return "Pay with Razorpay";
  };

  // Handle quantity update
  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  // Handle item removal
  const handleItemRemove = (itemId: string) => {
    removeItem(itemId);
  };

  if (cartItems.length === 0) {
    return <EmptyCart />; // Render EmptyCart component if cart is empty
  }

  return (
    <Container sx={{ mt: 3, mx: 6, mb: 6, justifySelf: "center" }}>
      <Box>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontFamily={michroma.style.fontFamily} // Apply michroma font style
          fontWeight={600}
          color="primary.main"
          sx={{ mb: 4 }}
        >
          Cart
        </Typography>
        <Grid container spacing={4}>
          {/* Left Column: Delivery Info and Payment Method */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                mb: 4,
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontFamily={michroma.style.fontFamily} // Apply michroma font style
                  color="primary.main"
                  sx={{ mb: 3 }}
                >
                  Shipping Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      size="small"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Mobile Number"
                      fullWidth
                      size="small"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={(e) =>
                        handleInputChange("mobile", e.target.value)
                      }
                      error={!!formErrors.mobile}
                      helperText={formErrors.mobile}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      size="small"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="State"
                      fullWidth
                      size="small"
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      error={!!formErrors.state}
                      helperText={formErrors.state}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="City"
                      fullWidth
                      size="small"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      error={!!formErrors.city}
                      helperText={formErrors.city}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="ZIP"
                      fullWidth
                      size="small"
                      placeholder="Enter your ZIP code"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      error={!!formErrors.zipCode}
                      helperText={formErrors.zipCode}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Address"
                      fullWidth
                      size="small"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                mb: 4,
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontFamily={michroma.style.fontFamily} // Apply michroma font style
                  color="primary.main"
                  sx={{ mb: 3 }}
                >
                  Order Summary
                </Typography>
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Box
                      key={`cart-item-${item.id}`}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          unoptimized={shouldUnoptimizeImage(item.image)}
                          style={{ borderRadius: "6px" }}
                        />
                        <Box>
                          <Typography fontWeight={500}>{item.name}</Typography>
                          <Typography variant="body2">
                            ₹{item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuantityUpdate(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                          sx={{ minWidth: "32px", height: "32px", p: 0 }}
                        >
                          -
                        </Button>
                        <Typography
                          sx={{ minWidth: "24px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuantityUpdate(item.id, item.quantity + 1)
                          }
                          sx={{ minWidth: "32px", height: "32px", p: 0 }}
                        >
                          +
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleItemRemove(item.id)}
                          sx={{ ml: 1 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))}

                  <Divider />

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Subtotal</Typography>
                    <Typography>₹{subtotal.toFixed(2)}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Shipping</Typography>
                    <Typography>Free</Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 600,
                    }}
                  >
                    <Typography>Total (INR)</Typography>
                    <Typography>₹{subtotal.toFixed(2)}</Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleConfirmOrder}
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "secondary.main" },
                    }}
                  >
                    {getButtonText()}
                  </Button>
                </Stack>

                {/* Additional Information */}
                <Box sx={{ mt: 3, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="info.main"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Security fontSize="small" />
                    All payments are secured with 256-bit SSL encryption
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Razorpay Payment Modal */}
        <RazorpayPayment
          open={showRazorpay}
          onClose={() => setShowRazorpay(false)}
          orderAmount={subtotal}
          orderId={orderId}
          formData={formData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

        {/* Alert Snackbar */}
        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowAlert(false)}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Cart;
