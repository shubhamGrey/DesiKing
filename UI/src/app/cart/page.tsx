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
  useMediaQuery,
  Alert,
  Snackbar,
  Container,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Security, Add, Remove } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import theme from "@/styles/theme";
import { michroma } from "@/styles/fonts";
import EmptyCart from "@/components/EmptyCart";
import {
  PaymentFormData,
  OrderCreateRequest,
  RazorpayPaymentData,
} from "@/types/razorpay";
import { createOrder, initializeRazorpayPayment } from "@/utils/razorpayUtils";
import { useCart } from "@/contexts/CartContext";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (
  imageSrc: string | undefined | null
): boolean => {
  if (!imageSrc || typeof imageSrc !== "string") {
    return false;
  }
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
    refreshCartFromDatabase,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  // Form data state
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    email: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [billingData, setBillingData] = useState<PaymentFormData>({
    name: "",
    email: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<PaymentFormData>>({});
  const [billingErrors, setBillingErrors] = useState<Partial<PaymentFormData>>(
    {}
  );
  const [userId, setUserId] = useState<string>("");
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);

  // Calculate totals
  const discountAmount = 56.85; // WelcomeHome20 discount
  const taxes = 14.21;
  const orderTotal = subtotal - discountAmount + taxes;

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Partial<PaymentFormData> = {};
    const billingErrs: Partial<PaymentFormData> = {};

    // Validate shipping address
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.mobile))
      errors.mobile = "Mobile number must be 10 digits starting with 6-9";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.zipCode))
      errors.zipCode = "Pincode must be 6 digits";

    // Validate billing address if different billing is enabled
    if (useDifferentBilling) {
      if (!billingData.name.trim()) billingErrs.name = "Full name is required";
      if (!billingData.email.trim()) billingErrs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(billingData.email))
        billingErrs.email = "Email is invalid";
      if (!billingData.mobile.trim())
        billingErrs.mobile = "Mobile number is required";
      else if (!/^[6-9]\d{9}$/.test(billingData.mobile))
        billingErrs.mobile =
          "Mobile number must be 10 digits starting with 6-9";
      if (!billingData.address.trim())
        billingErrs.address = "Address is required";
      if (!billingData.city.trim()) billingErrs.city = "City is required";
      if (!billingData.state.trim()) billingErrs.state = "State is required";
      if (!billingData.zipCode.trim())
        billingErrs.zipCode = "Pincode is required";
      else if (!/^\d{6}$/.test(billingData.zipCode))
        billingErrs.zipCode = "Pincode must be 6 digits";
    }

    setFormErrors(errors);
    setBillingErrors(billingErrs);
    return (
      Object.keys(errors).length === 0 && Object.keys(billingErrs).length === 0
    );
  };

  // Handle form input changes
  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle billing input changes
  const handleBillingInputChange = (
    field: keyof PaymentFormData,
    value: string
  ) => {
    setBillingData((prev) => ({ ...prev, [field]: value }));
    if (billingErrors[field]) {
      setBillingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    console.log("🛒 Cart page useEffect called");

    // Ensure we're on the client side
    if (typeof window === "undefined") {
      console.log("⚠️ Cart page - running on server, skipping");
      return;
    }

    const userProfileRaw = sessionStorage.getItem("user_profile");
    console.log("👤 Cart page - user profile:", userProfileRaw);

    if (userProfileRaw) {
      try {
        const userProfile = JSON.parse(userProfileRaw);
        const extractedUserId = userProfile?.id;
        console.log("🆔 Cart page - extracted userId:", extractedUserId);
        setUserId(extractedUserId);
      } catch (error) {
        console.error("❌ Cart page - error parsing user profile:", error);
        setUserId("");
        // Redirect to login if user profile is invalid
        router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
      }
    } else {
      console.log("🚫 Cart page - no user profile, redirecting to login");
      // Redirect to login if no user profile exists
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
    }
  }, [router]);

  // Separate useEffect for refreshing cart data
  useEffect(() => {
    console.log("🔄 Cart refresh useEffect called, userId:", userId);

    if (userId && typeof window !== "undefined") {
      console.log("✅ Conditions met, calling refreshCartFromDatabase");
      refreshCartFromDatabase();
    }
  }, [userId, refreshCartFromDatabase]);

  // Helper function to handle Razorpay orders
  const handleRazorpayOrder = async () => {
    try {
      setIsLoading(true);

      // Validate that we have a userId
      if (!userId) {
        throw new Error("User not authenticated. Please log in.");
      }

      // Validate that we have cart items
      if (!cartItems || cartItems.length === 0) {
        throw new Error(
          "Your cart is empty. Please add items before checkout."
        );
      }

      // Validate that all cart items have required fields
      const invalidItems = cartItems.filter(
        (item) => !item.productId || !item.quantity || !item.price
      );

      if (invalidItems.length > 0) {
        console.error("Invalid cart items:", invalidItems);
        throw new Error(
          "Some cart items are missing required information. Please refresh and try again."
        );
      }

      // Generate a new GUID for the order
      const orderId = crypto.randomUUID();

      const orderData: OrderCreateRequest = {
        id: orderId,
        userId: userId,
        totalAmount: orderTotal,
        currency: "INR",
        status: "created",
        paymentMethod: "RAZORPAY",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Sending order data:", orderData);
      console.log("User ID:", userId);
      console.log("Cart items:", cartItems);

      const result = await createOrder(orderData, "RAZORPAY");

      // The backend now returns the Razorpay order ID for Razorpay payments
      const razorpayOrderId = result.data.razorpayOrderId || "";

      if (!razorpayOrderId) {
        throw new Error("No Razorpay order ID received from server");
      }

      // Directly initialize Razorpay payment
      const razorpayOrderData = {
        id: razorpayOrderId,
        amount: orderTotal * 100, // Convert to paisa
        currency: "INR",
      };

      // Use billing data if different billing is enabled, otherwise use shipping data
      const paymentFormData = useDifferentBilling ? billingData : formData;

      await initializeRazorpayPayment(
        razorpayOrderData,
        paymentFormData,
        handlePaymentSuccess,
        handlePaymentError
      );
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
        `/payment-result?status=success&order_id=${paymentData.razorpay_order_id}&payment_id=${paymentData.razorpay_payment_id}&signature=${paymentData.razorpay_signature}&user_id=${userId}&total_amount=${orderTotal}&currency=INR`
      );
    }, 2000);
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    setAlertMessage(`Payment failed: ${error.message || error}`);
    setAlertSeverity("error");
    setShowAlert(true);
  };

  // Get button text based on current state
  const getButtonText = () => {
    if (isLoading) return "Processing...";
    return "Continue to payment";
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            color="primary.main"
          >
            Cart
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Order Details and Shipping */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Order Details Card */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                backgroundColor: "transparent",
                opacity: 0,
                animation: "slideIn 0.4s ease-out forwards",
                "@keyframes slideIn": {
                  "0%": { opacity: 0, transform: "translateY(-5px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary.main"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                fontFamily={michroma.style.fontFamily}
              >
                Your Order ({cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"})
              </Typography>

              <Stack spacing={3}>
                {cartItems.map((item) => (
                  <Box
                    key={`cart-item-${item.id}`}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "stretch", sm: "center" },
                      p: { xs: 2, sm: 2 },
                      backgroundColor: "white",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      gap: { xs: 2, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1.5, sm: 2 },
                        flex: 1,
                      }}
                    >
                      <Image
                        src={item.image || "/ProductBackground.png"}
                        alt={item.name || "Product"}
                        width={isMobile ? 50 : 60}
                        height={isMobile ? 50 : 60}
                        unoptimized={shouldUnoptimizeImage(item.image)}
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          fontWeight={500}
                          sx={{
                            mb: 0.5,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            lineHeight: { xs: 1.3, sm: 1.5 },
                            wordBreak: "break-word",
                          }}
                        >
                          {item.name || "Unknown Product"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ${item.price?.toFixed(2)} each
                        </Typography>
                        {/* Mobile-only total price */}
                        {isMobile && (
                          <Typography
                            fontWeight={600}
                            color="primary.main"
                            sx={{ fontSize: "0.875rem", mt: 0.5 }}
                          >
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, sm: 2 },
                        justifyContent: { xs: "space-between", sm: "flex-end" },
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                      }}
                    >
                      {/* Quantity Controls */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 0.5, sm: 1 },
                          border: "1px solid",
                          borderColor: "#84a897",
                          borderRadius: 1,
                          p: { xs: 0.25, sm: 0.5 },
                          minWidth: { xs: "90px", sm: "100px" },
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuantityUpdate(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                          sx={{
                            minWidth: { xs: "28px", sm: "32px" },
                            height: { xs: "28px", sm: "32px" },
                            p: 0,
                            color: "text.primary",
                          }}
                        >
                          <Remove fontSize={isMobile ? "small" : "small"} />
                        </Button>
                        <Typography
                          sx={{
                            minWidth: { xs: "20px", sm: "24px" },
                            textAlign: "center",
                            fontWeight: 500,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuantityUpdate(item.id, item.quantity + 1)
                          }
                          sx={{
                            minWidth: { xs: "28px", sm: "32px" },
                            height: { xs: "28px", sm: "32px" },
                            p: 0,
                            color: "text.primary",
                          }}
                        >
                          <Add fontSize={isMobile ? "small" : "small"} />
                        </Button>
                      </Box>

                      {/* Item Total - Desktop only */}
                      {!isMobile && (
                        <Box sx={{ textAlign: "right", minWidth: "80px" }}>
                          <Typography fontWeight={600}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      )}

                      {/* Remove Button */}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleItemRemove(item.id)}
                        sx={{
                          ml: { xs: 0, sm: 1 },
                          fontSize: { xs: "0.75rem", sm: "0.75rem" },
                          textTransform: "none",
                          minHeight: { xs: "32px", sm: "auto" },
                          px: { xs: 1.5, sm: 1 },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Shipping Details Card */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                backgroundColor: "transparent",
                opacity: 0,
                animation: "slideIn 0.5s ease-out forwards",
                animationDelay: "0.1s",
                "@keyframes slideIn": {
                  "0%": { opacity: 0, transform: "translateY(-5px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary.main"
                sx={{ mb: 3 }}
                fontFamily={michroma.style.fontFamily}
              >
                Shipping details
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Full Name*"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Mobile Number*"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only digits
                      if (value.length <= 10) {
                        handleInputChange("mobile", value);
                      }
                    }}
                    error={!!formErrors.mobile}
                    helperText={formErrors.mobile || "10-digit mobile number"}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    type="email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="House No., Building Name, Street, Area*"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    multiline
                    rows={2}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Landmark (Optional)"
                    value={formData.landmark || ""}
                    onChange={(e) =>
                      handleInputChange("landmark", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Pincode*"
                    value={formData.zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only digits
                      if (value.length <= 6) {
                        handleInputChange("zipCode", value);
                      }
                    }}
                    error={!!formErrors.zipCode}
                    helperText={formErrors.zipCode || "6-digit pincode"}
                    inputProps={{
                      maxLength: 6,
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="City*"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="State*"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={useDifferentBilling}
                    onChange={(e) => {
                      setUseDifferentBilling(e.target.checked);
                      // Clear billing data and errors when unchecked
                      if (!e.target.checked) {
                        setBillingData({
                          name: "",
                          email: "",
                          mobile: "",
                          address: "",
                          landmark: "",
                          city: "",
                          state: "",
                          zipCode: "",
                        });
                        setBillingErrors({});
                      }
                    }}
                    size="small"
                  />
                }
                label="Use a different billing address"
                sx={{ mt: 2 }}
              />

              {/* Billing Address Form - Only show when checkbox is checked */}
              {useDifferentBilling && (
                <Box
                  sx={{
                    mt: 3,
                    opacity: 0,
                    animation: "fadeIn 0.3s ease-in forwards",
                    "@keyframes fadeIn": {
                      "0%": { opacity: 0, transform: "translateY(-10px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ mb: 3 }}
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="primary.main"
                      fontFamily={michroma.style.fontFamily}
                    >
                      Billing Address
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setBillingData(formData)}
                      sx={{ mb: 2 }}
                    >
                      Copy from shipping address
                    </Button>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Full Name*"
                        value={billingData.name}
                        onChange={(e) =>
                          handleBillingInputChange("name", e.target.value)
                        }
                        error={!!billingErrors.name}
                        helperText={billingErrors.name}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Mobile Number*"
                        value={billingData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Only digits
                          if (value.length <= 10) {
                            handleBillingInputChange("mobile", value);
                          }
                        }}
                        error={!!billingErrors.mobile}
                        helperText={
                          billingErrors.mobile || "10-digit mobile number"
                        }
                        inputProps={{
                          maxLength: 10,
                          pattern: "[0-9]*",
                          inputMode: "numeric",
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Email Address"
                        value={billingData.email}
                        onChange={(e) =>
                          handleBillingInputChange("email", e.target.value)
                        }
                        error={!!billingErrors.email}
                        helperText={billingErrors.email}
                        type="email"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="House No., Building Name, Street, Area*"
                        value={billingData.address}
                        onChange={(e) =>
                          handleBillingInputChange("address", e.target.value)
                        }
                        error={!!billingErrors.address}
                        helperText={billingErrors.address}
                        multiline
                        rows={2}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Landmark (Optional)"
                        value={billingData.landmark || ""}
                        onChange={(e) =>
                          handleBillingInputChange("landmark", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Pincode*"
                        value={billingData.zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Only digits
                          if (value.length <= 6) {
                            handleBillingInputChange("zipCode", value);
                          }
                        }}
                        error={!!billingErrors.zipCode}
                        helperText={billingErrors.zipCode || "6-digit pincode"}
                        inputProps={{
                          maxLength: 6,
                          pattern: "[0-9]*",
                          inputMode: "numeric",
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="City*"
                        value={billingData.city}
                        onChange={(e) =>
                          handleBillingInputChange("city", e.target.value)
                        }
                        error={!!billingErrors.city}
                        helperText={billingErrors.city}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="State*"
                        value={billingData.state}
                        onChange={(e) =>
                          handleBillingInputChange("state", e.target.value)
                        }
                        error={!!billingErrors.state}
                        helperText={billingErrors.state}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Payment Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: "#1a3d2e",
                color: "white",
                borderRadius: 2,
                position: "sticky",
                top: 20,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 4 }}
                fontFamily={michroma.style.fontFamily}
              >
                Payment Summary
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="#84a897">
                  Order Total
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color="white"
                  sx={{ mb: 1 }}
                >
                  ${orderTotal.toFixed(2)}
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="#84a897">Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography color="#84a897">Discounts</Typography>
                    <Typography variant="body2" color="grey.400">
                      WelcomeHome20 applied!
                    </Typography>
                  </Box>
                  <Typography color="#4caf50">
                    -${discountAmount.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="#84a897">Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="#84a897">Taxes</Typography>
                  <Typography>${taxes.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ borderColor: "grey.600" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <Typography>Order Total</Typography>
                  <Typography>${orderTotal.toFixed(2)}</Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleConfirmOrder}
                  disabled={isLoading}
                  size="medium"
                  sx={{
                    py: 2,
                    fontSize: "16px",
                    fontWeight: 600,
                    backgroundColor: "white",
                    color: "#1a3d2e",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                    "&:disabled": {
                      backgroundColor: "grey.400",
                      color: "grey.600",
                    },
                    height: 48,
                  }}
                  endIcon={
                    <Box component="span" sx={{ ml: 1 }}>
                      →
                    </Box>
                  }
                >
                  {getButtonText()}
                </Button>
              </Box>

              {/* Security Notice */}
              <Box
                sx={{
                  mt: 8,
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Security fontSize="small" />
                  All payments are secured with 256-bit SSL encryption
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

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
