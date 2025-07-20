"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  Alert,
  Snackbar,
  Chip,
  Avatar,
  FormControl,
} from "@mui/material";
import {
  CreditCard,
  AccountBalance,
  Payment,
  PhoneAndroid,
  LocalAtm,
  Security,
  Public,
} from "@mui/icons-material";
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

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  // Comprehensive payment methods for Indian and International customers
  const paymentMethods = {
    indian: [
      {
        id: "upi",
        name: "UPI",
        description:
          "Pay instantly using Google Pay, PhonePe, Paytm, or any UPI app",
        icon: <PhoneAndroid />,
        popular: true,
        fees: "No extra charges",
        supported: ["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"],
      },
      {
        id: "cards",
        name: "Credit/Debit Cards",
        description: "Visa, Mastercard, RuPay, American Express",
        icon: <CreditCard />,
        popular: true,
        fees: "No extra charges",
        supported: ["Visa", "Mastercard", "RuPay", "Amex"],
      },
      {
        id: "netbanking",
        name: "Net Banking",
        description: "All major Indian banks supported",
        icon: <AccountBalance />,
        popular: false,
        fees: "No extra charges",
        supported: ["SBI", "HDFC", "ICICI", "Axis", "PNB", "50+ more banks"],
      },
      {
        id: "wallets",
        name: "Digital Wallets",
        description: "Paytm, PhonePe, Amazon Pay, and more",
        icon: <Payment />,
        popular: false,
        fees: "No extra charges",
        supported: ["Paytm", "PhonePe", "Amazon Pay", "MobiKwik", "Freecharge"],
      },
      {
        id: "cod",
        name: "Cash on Delivery",
        description: "Pay when your order is delivered",
        icon: <LocalAtm />,
        popular: true,
        fees: "₹40 handling charges for orders below ₹500",
        supported: ["Cash", "Card on delivery (select areas)"],
      },
    ],
    international: [
      {
        id: "paypal",
        name: "PayPal",
        description: "Pay securely with your PayPal account",
        icon: <Security />,
        popular: true,
        fees: "Standard PayPal fees apply",
        supported: ["PayPal Balance", "Linked Cards", "Bank Account"],
      },
      {
        id: "stripe",
        name: "Credit/Debit Cards",
        description: "Visa, Mastercard, American Express worldwide",
        icon: <CreditCard />,
        popular: true,
        fees: "Standard processing fees apply",
        supported: ["Visa", "Mastercard", "Amex", "Discover"],
      },
      {
        id: "applepay",
        name: "Apple Pay",
        description: "Quick and secure payment with Touch ID or Face ID",
        icon: <PhoneAndroid />,
        popular: false,
        fees: "No extra charges",
        supported: ["iPhone", "iPad", "Mac", "Apple Watch"],
      },
      {
        id: "googlepay_intl",
        name: "Google Pay",
        description: "Pay with Google Pay (International)",
        icon: <PhoneAndroid />,
        popular: false,
        fees: "No extra charges",
        supported: ["Android", "Chrome", "Google Account"],
      },
      {
        id: "crypto",
        name: "Cryptocurrency",
        description: "Bitcoin, Ethereum, and other cryptocurrencies",
        icon: <Public />,
        popular: false,
        fees: "Network fees apply",
        supported: ["Bitcoin", "Ethereum", "USDT", "USDC"],
      },
    ],
  };

  const [selectedRegion, setSelectedRegion] = useState<
    "indian" | "international"
  >("indian");

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
      }
    }
  }, []);

  // Helper function to handle COD orders
  const handleCODOrder = async () => {
    try {
      setIsLoading(true);

      const orderData: OrderCreateRequest = {
        userId: userId,
        totalAmount: subtotal,
        currency: "INR",
        brandId: cartItems[0].brandId,
        status: "created",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(orderData, "COD");

      setAlertMessage("Order placed successfully! You will pay on delivery.");
      setAlertSeverity("success");
      setShowAlert(true);

      clearCart();

      setTimeout(() => {
        router.push(
          `/payment-result?status=success&order_id=${result.orderId}&payment_method=cod`
        );
      }, 2000);
    } catch (error: any) {
      console.error("COD order error:", error);
      setAlertMessage("Failed to place order. Please try again.");
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle Razorpay orders
  const handleRazorpayOrder = async () => {
    try {
      setIsLoading(true);
      const orderData: OrderCreateRequest = {
        userId: userId,
        totalAmount: subtotal,
        currency: "INR",
        brandId: cartItems[0].brandId,
        status: "created",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(orderData, "RAZORPAY");
      setOrderId(result.orderId ?? result.data?.id ?? "");
      setShowRazorpay(true);
    } catch (error: any) {
      console.error("Razorpay order error:", error);
      setAlertMessage("Failed to create order. Please try again.");
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to show coming soon message
  const showComingSoonMessage = (methodName: string) => {
    setAlertMessage(
      `${methodName} integration coming soon! Please select another payment method.`
    );
    setAlertSeverity("error");
    setShowAlert(true);
  };

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      setAlertMessage("Please fill in all required fields correctly");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    // Handle Cash on Delivery
    if (paymentMethod === "cod") {
      await handleCODOrder();
      return;
    }

    // Handle International Payment Methods
    if (selectedRegion === "international") {
      const methodMessages: Record<string, string> = {
        paypal: "PayPal",
        stripe: "Stripe",
        applepay: "Apple Pay",
        googlepay_intl: "Google Pay International",
        crypto: "Cryptocurrency payment",
      };

      const methodName = methodMessages[paymentMethod];
      if (methodName) {
        showComingSoonMessage(methodName);
        return;
      }
    }

    // Handle Indian Payment Methods via Razorpay
    if (
      selectedRegion === "indian" &&
      ["upi", "cards", "netbanking", "wallets"].includes(paymentMethod)
    ) {
      await handleRazorpayOrder();
      return;
    }

    // Fallback for unknown payment methods
    setAlertMessage(
      "Selected payment method is not supported yet. Please choose another option."
    );
    setAlertSeverity("error");
    setShowAlert(true);
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
        `/payment-result?status=success&order_id=${paymentData.razorpay_order_id}&payment_id=${paymentData.razorpay_payment_id}&signature=${paymentData.razorpay_signature}`
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

    // Handle specific payment methods with appropriate button text
    switch (paymentMethod) {
      case "cod":
        return "Place Order (Cash on Delivery)";
      case "upi":
        return "Pay with UPI";
      case "cards":
        return "Pay with Card";
      case "netbanking":
        return "Pay with Net Banking";
      case "wallets":
        return "Pay with Wallet";
      case "paypal":
        return "Pay with PayPal";
      case "stripe":
        return "Pay with Credit/Debit Card";
      case "applepay":
        return "Pay with Apple Pay";
      case "googlepay_intl":
        return "Pay with Google Pay";
      case "crypto":
        return "Pay with Cryptocurrency";
      default:
        return "Pay Now";
    }
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
    <Box sx={{ mt: isMobile ? 8 : 12, mb: 6, px: isMobile ? 2 : 4 }}>
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
                fontFamily={michroma.style.fontFamily}
                color="primary.main"
                sx={{ mb: 3 }}
              >
                Payment Method
              </Typography>

              {/* Region Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Select your region:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="India"
                    icon={<Public />}
                    onClick={() => setSelectedRegion("indian")}
                    color={selectedRegion === "indian" ? "primary" : "default"}
                    variant={
                      selectedRegion === "indian" ? "filled" : "outlined"
                    }
                    clickable
                  />
                  <Chip
                    label="International"
                    icon={<Public />}
                    onClick={() => setSelectedRegion("international")}
                    color={
                      selectedRegion === "international" ? "primary" : "default"
                    }
                    variant={
                      selectedRegion === "international" ? "filled" : "outlined"
                    }
                    clickable
                  />
                </Stack>
              </Box>

              {/* Payment Methods */}
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethods[selectedRegion].map((method) => (
                    <Box key={method.id} sx={{ mb: 2 }}>
                      <FormControlLabel
                        value={method.id}
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              width: "100%",
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor:
                                  paymentMethod === method.id
                                    ? "primary.main"
                                    : "grey.200",
                                color:
                                  paymentMethod === method.id
                                    ? "white"
                                    : "grey.600",
                                width: 32,
                                height: 32,
                              }}
                            >
                              {method.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body1" fontWeight={500}>
                                  {method.name}
                                </Typography>
                                {method.popular && (
                                  <Chip
                                    label="Popular"
                                    size="small"
                                    color="success"
                                    variant="filled"
                                    sx={{ height: 20, fontSize: "0.75rem" }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {method.description}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="primary.main"
                              >
                                {method.fees}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{
                          width: "100%",
                          margin: 0,
                          padding: 2,
                          border: "1px solid",
                          borderColor:
                            paymentMethod === method.id
                              ? "primary.main"
                              : "grey.300",
                          borderRadius: 2,
                          backgroundColor:
                            paymentMethod === method.id
                              ? "primary.50"
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              paymentMethod === method.id
                                ? "primary.100"
                                : "grey.50",
                          },
                        }}
                      />

                      {/* Supported Methods */}
                      {paymentMethod === method.id && (
                        <Box
                          sx={{
                            mt: 1,
                            ml: 4,
                            p: 2,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1, display: "block" }}
                          >
                            Supported options:
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {method.supported.map((option) => (
                              <Chip
                                key={`${method.id}-${option}`}
                                label={option}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: 24 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </RadioGroup>
              </FormControl>

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

              {/* Special Offers */}
              {selectedRegion === "indian" && (
                <Box
                  sx={{ mt: 2, p: 2, bgcolor: "success.50", borderRadius: 1 }}
                >
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={500}
                  >
                    💳 Special Offers:
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    • Get 5% cashback on UPI payments above ₹1000
                  </Typography>
                  <br />
                  <Typography variant="caption" color="success.main">
                    • No convenience fee on net banking
                  </Typography>
                </Box>
              )}

              {selectedRegion === "international" && (
                <Box
                  sx={{ mt: 2, p: 2, bgcolor: "warning.50", borderRadius: 1 }}
                >
                  <Typography
                    variant="body2"
                    color="warning.main"
                    fontWeight={500}
                  >
                    🌍 International Payments:
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    • Currency conversion rates applied at checkout
                  </Typography>
                  <br />
                  <Typography variant="caption" color="warning.main">
                    • Additional duties/taxes may apply based on destination
                  </Typography>
                </Box>
              )}
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
  );
};

export default Cart;
