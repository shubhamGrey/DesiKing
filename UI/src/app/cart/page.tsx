"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
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
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import type { EnhancedCartItem } from "@/contexts/CartContext";
import { getCurrencySymbol } from "@/utils/currencyUtils";
import AddressManager, { AddressResponse } from "@/components/AddressManager";
import { getUserId, isLoggedIn } from "@/utils/auth";

// API response interfaces for dropdowns
interface CountryResponse {
  countryName: string;
  countryCode: string;
}

interface StateResponse {
  stateName: string;
  stateCode: string;
  countryCode: string;
}

// Local AddressFormData interface (previously imported from AddressForm)
interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  landMark?: string;
  city: string;
  pinCode: string;
  stateCode: string;
  countryCode: string;
  addressType: "SHIPPING" | "BILLING";
}

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
    enhancedItems,
    total: subtotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useEnhancedCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  // Form data state
  const [formData, setFormData] = useState<
    PaymentFormData & { country: string }
  >({
    name: "",
    email: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN", // Default to India
  });

  const [billingData, setBillingData] = useState<
    PaymentFormData & { country: string }
  >({
    name: "",
    email: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN", // Default to India
  });

  const [formErrors, setFormErrors] = useState<
    Partial<PaymentFormData & { country: string }>
  >({});
  const [billingErrors, setBillingErrors] = useState<
    Partial<PaymentFormData & { country: string }>
  >({});
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<string>("INR");

  // Address management states for shipping
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponse | null>(null);
  const [useManualAddress, setUseManualAddress] = useState(true); // Default to manual

  // Address management states for billing
  const [showBillingAddressManager, setShowBillingAddressManager] =
    useState(false);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<AddressResponse | null>(null);
  const [useManualBillingAddress, setUseManualBillingAddress] = useState(true);

  // Dropdown data states
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [states, setStates] = useState<StateResponse[]>([]);
  const [billingStates, setBillingStates] = useState<StateResponse[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingBillingStates, setLoadingBillingStates] = useState(false); // Default to manual
  const [isProcessing, setIsProcessing] = useState(false); // For save address operations

  // Calculate subtotal using original prices for discount display
  const originalSubtotal = useMemo(() => {
    if (enhancedItems.length > 0) {
      return enhancedItems.reduce((total, item) => {
        const pricing = item.productDetails?.pricesAndSkus?.[0];
        const originalPrice = pricing?.price || item.price || 0;
        return total + originalPrice * item.quantity;
      }, 0);
    }
    return subtotal;
  }, [enhancedItems, subtotal]);

  // Calculate taxes - 5% of final subtotal (after discount)
  const taxes = subtotal * 0.05;

  // Calculate total discount from enhanced items
  const totalDiscount = useMemo(() => {
    if (enhancedItems.length > 0) {
      return enhancedItems.reduce((discount, item) => {
        const pricing = item.productDetails?.pricesAndSkus?.[0];
        if (pricing && pricing.isDiscounted && pricing.discountedAmount) {
          // Calculate actual discount: original price - discounted price
          const actualDiscountPerUnit =
            pricing.price - pricing.discountedAmount;
          return discount + actualDiscountPerUnit * item.quantity;
        }
        return discount;
      }, 0);
    }
    return 0;
  }, [enhancedItems]);

  const orderTotal = subtotal + taxes;

  // Helper function to save address
  const saveAddress = async (addressData: AddressFormData): Promise<string> => {
    try {
      const payload = {
        id: "00000000-0000-0000-0000-000000000000",
        userId: getUserId(),
        fullName: addressData.fullName,
        phoneNumber: addressData.phoneNumber,
        addressLine: addressData.addressLine,
        landMark: addressData.landMark || "",
        city: addressData.city,
        pinCode: addressData.pinCode,
        stateCode: addressData.stateCode,
        countryCode: addressData.countryCode,
        addressType: addressData.addressType,
        isActive: true,
        isDeleted: false,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Address save API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }

      const result: any = await response.json();

      if (result.info?.code !== "200") {
        throw new Error(result.info?.message || "Failed to save address");
      }

      console.log("✅ Address saved successfully:", result.data);
      return result.data;
    } catch (error) {
      console.error("❌ Error saving address:", error);
      throw error;
    }
  };

  // Helper function to format form data to AddressFormData
  const formatAddressData = (
    formData: any,
    addressType: "SHIPPING" | "BILLING"
  ): AddressFormData => {
    return {
      fullName: formData.name || "",
      phoneNumber: formData.mobile || "",
      addressLine: formData.address || "",
      landMark: formData.landmark || "",
      city: formData.city || "",
      pinCode: formData.zipCode || "",
      stateCode: formData.state || "",
      countryCode: formData.country || "IN",
      addressType,
    };
  };

  // Handle address selection from existing addresses
  const handleAddressSelect = (address: AddressResponse) => {
    setSelectedAddress(address);
    setUseManualAddress(false);
    setShowAddressManager(false);
  };

  // Handle billing address selection from existing addresses
  const handleBillingAddressSelect = (address: AddressResponse) => {
    setSelectedBillingAddress(address);
    setUseManualBillingAddress(false);
    setShowBillingAddressManager(false);
  };

  // Validate shipping address only
  const validateShippingAddress = (): boolean => {
    const errors: Partial<PaymentFormData & { country: string }> = {};

    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.mobile))
      errors.mobile = "Mobile number must be 10 digits starting with 6-9";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.zipCode))
      errors.zipCode = "Pincode must be 6 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate billing address only
  const validateBillingAddress = (): boolean => {
    const billingErrs: Partial<PaymentFormData & { country: string }> = {};

    if (!billingData.name.trim()) billingErrs.name = "Full name is required";
    if (!billingData.mobile.trim())
      billingErrs.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(billingData.mobile))
      billingErrs.mobile = "Mobile number must be 10 digits starting with 6-9";
    if (!billingData.address.trim())
      billingErrs.address = "Address is required";
    if (!billingData.city.trim()) billingErrs.city = "City is required";
    if (!billingData.country.trim())
      billingErrs.country = "Country is required";
    if (!billingData.state.trim()) billingErrs.state = "State is required";
    if (!billingData.zipCode.trim())
      billingErrs.zipCode = "Pincode is required";
    else if (!/^\d{6}$/.test(billingData.zipCode))
      billingErrs.zipCode = "Pincode must be 6 digits";

    setBillingErrors(billingErrs);
    return Object.keys(billingErrs).length === 0;
  };

  // Handle save shipping address
  const handleSaveShippingAddress = async () => {
    if (!validateShippingAddress()) {
      setAlertMessage("Please fill in all required fields correctly.");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    try {
      setIsProcessing(true);
      const shippingAddress = formatAddressData(formData, "SHIPPING");
      await saveAddress(shippingAddress);
      setAlertMessage("Shipping address saved successfully!");
      setAlertSeverity("success");
      setShowAlert(true);
    } catch (error: any) {
      setAlertMessage(
        `Failed to save shipping address: ${
          error.message || "Please try again."
        }`
      );
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle save billing address
  const handleSaveBillingAddress = async () => {
    if (!validateBillingAddress()) {
      setAlertMessage("Please fill in all required fields correctly.");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    try {
      setIsProcessing(true);
      const billingAddress = formatAddressData(billingData, "BILLING");
      await saveAddress(billingAddress);
      setAlertMessage("Billing address saved successfully!");
      setAlertSeverity("success");
      setShowAlert(true);
    } catch (error: any) {
      setAlertMessage(
        `Failed to save billing address: ${
          error.message || "Please try again."
        }`
      );
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Partial<PaymentFormData & { country: string }> = {};
    const billingErrs: Partial<PaymentFormData & { country: string }> = {};

    // Validate shipping address - either selected address or manual form
    if (useManualAddress) {
      if (!formData.name.trim()) errors.name = "Full name is required";
      if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
      else if (!/^[6-9]\d{9}$/.test(formData.mobile))
        errors.mobile = "Mobile number must be 10 digits starting with 6-9";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.country.trim()) errors.country = "Country is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.zipCode.trim()) errors.zipCode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.zipCode))
        errors.zipCode = "Pincode must be 6 digits";
    } else if (!selectedAddress) {
      errors.name = "Please select a shipping address";
    }

    // Validate billing address if different billing is enabled
    if (useDifferentBilling) {
      if (useManualBillingAddress) {
        if (!billingData.name.trim())
          billingErrs.name = "Full name is required";
        if (!billingData.mobile.trim())
          billingErrs.mobile = "Mobile number is required";
        else if (!/^[6-9]\d{9}$/.test(billingData.mobile))
          billingErrs.mobile =
            "Mobile number must be 10 digits starting with 6-9";
        if (!billingData.address.trim())
          billingErrs.address = "Address is required";
        if (!billingData.city.trim()) billingErrs.city = "City is required";
        if (!billingData.country.trim())
          billingErrs.country = "Country is required";
        if (!billingData.state.trim()) billingErrs.state = "State is required";
        if (!billingData.zipCode.trim())
          billingErrs.zipCode = "Pincode is required";
        else if (!/^\d{6}$/.test(billingData.zipCode))
          billingErrs.zipCode = "Pincode must be 6 digits";
      } else if (!selectedBillingAddress) {
        billingErrs.name = "Please select a billing address";
      }
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

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Common/GetCountries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle both direct array response and wrapped response
      const countries = Array.isArray(result) ? result : result.data || [];
      setCountries(countries);
      console.log("✅ Countries loaded:", countries);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch states based on selected country
  const fetchStates = async (countryCode: string) => {
    if (!countryCode) {
      setStates([]);
      return;
    }

    try {
      setLoadingStates(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Common/GetStates/${countryCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle both direct array response and wrapped response
      const states = Array.isArray(result) ? result : result.data || [];
      setStates(states);
      console.log("✅ States loaded:", states);
    } catch (error) {
      console.error("Failed to fetch states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch billing states based on selected billing country
  const fetchBillingStates = async (countryCode: string) => {
    if (!countryCode) {
      setBillingStates([]);
      return;
    }

    try {
      setLoadingBillingStates(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Common/GetStates/${countryCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle both direct array response and wrapped response
      const billingStates = Array.isArray(result) ? result : result.data || [];
      setBillingStates(billingStates);
      console.log("✅ Billing states loaded:", billingStates);
    } catch (error) {
      console.error("Failed to fetch billing states:", error);
    } finally {
      setLoadingBillingStates(false);
    }
  };

  // Handle country change for shipping
  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    const country = event.target.value;
    setFormData((prev) => ({
      ...prev,
      country,
      state: "", // Reset state when country changes
    }));
    if (formErrors.state) {
      setFormErrors((prev) => ({ ...prev, state: undefined }));
    }
  };

  // Handle state change for shipping
  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const state = event.target.value;
    setFormData((prev) => ({ ...prev, state }));
    if (formErrors.state) {
      setFormErrors((prev) => ({ ...prev, state: undefined }));
    }
  };

  // Handle country change for billing
  const handleBillingCountryChange = (event: SelectChangeEvent<string>) => {
    const country = event.target.value;
    setBillingData((prev) => ({
      ...prev,
      country,
      state: "", // Reset state when country changes
    }));
    if (billingErrors.state) {
      setBillingErrors((prev) => ({ ...prev, state: undefined }));
    }
  };

  // Handle state change for billing
  const handleBillingStateChange = (event: SelectChangeEvent<string>) => {
    const state = event.target.value;
    setBillingData((prev) => ({ ...prev, state }));
    if (billingErrors.state) {
      setBillingErrors((prev) => ({ ...prev, state: undefined }));
    }
  };

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === "undefined") {
      return;
    }

    if (!isLoggedIn()) {
      // Redirect to login if no user profile exists
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
    }
  }, [router]);

  // Update displayCurrency based on enhanced items
  useEffect(() => {
    if (enhancedItems.length > 0) {
      const firstItemWithPricing = enhancedItems.find(
        (item) =>
          "productDetails" in item &&
          item.productDetails?.pricesAndSkus &&
          item.productDetails.pricesAndSkus.length > 0
      );

      if (firstItemWithPricing && "productDetails" in firstItemWithPricing) {
        const currency =
          firstItemWithPricing.productDetails?.pricesAndSkus?.[0]?.currencyCode;
        if (currency && currency !== displayCurrency) {
          setDisplayCurrency(currency);
        }
      }
    }
  }, [enhancedItems, displayCurrency]);

  // Load countries when component mounts
  useEffect(() => {
    fetchCountries();
  }, []);

  // Load states when shipping country changes
  useEffect(() => {
    if (formData.country) {
      fetchStates(formData.country);
    }
  }, [formData.country]);

  // Load billing states when billing country changes
  useEffect(() => {
    if (billingData.country) {
      fetchBillingStates(billingData.country);
    }
  }, [billingData.country]);

  // Helper function to handle Razorpay orders
  const handleRazorpayOrder = async () => {
    try {
      setIsLoading(true);

      // Validate that we have a userId
      const currentUserId = getUserId();
      if (!currentUserId) {
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
        userId: currentUserId,
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
  const handlePaymentSuccess = async (paymentData: RazorpayPaymentData) => {
    try {
      setAlertMessage("Payment successful! Saving your details...");
      setAlertSeverity("success");
      setShowAlert(true);

      // Save shipping address (only if manually entered, not selected)
      if (getUserId() && useManualAddress && formData.name) {
        try {
          const shippingAddress = formatAddressData(formData, "SHIPPING");
          await saveAddress(shippingAddress);
          console.log("✅ Shipping address saved successfully");
        } catch (error) {
          console.error("❌ Failed to save shipping address:", error);
          // Don't block the flow for address saving failure
        }
      }

      // Save billing address if different from shipping (only if manually entered, not selected)
      if (
        getUserId() &&
        useDifferentBilling &&
        useManualBillingAddress &&
        billingData.name
      ) {
        try {
          const billingAddress = formatAddressData(billingData, "BILLING");
          await saveAddress(billingAddress);
          console.log("✅ Billing address saved successfully");
        } catch (error) {
          console.error("❌ Failed to save billing address:", error);
          // Don't block the flow for address saving failure
        }
      }

      // Clear cart after successful payment and address saving
      clearCart();

      setAlertMessage("Payment successful! Redirecting...");
      setTimeout(() => {
        router.push(
          `/payment-result?status=success&order_id=${
            paymentData.razorpay_order_id
          }&payment_id=${paymentData.razorpay_payment_id}&signature=${
            paymentData.razorpay_signature
          }&user_id=${getUserId()}&total_amount=${orderTotal}&currency=INR`
        );
      }, 2000);
    } catch (error) {
      console.error("Error in post-payment processing:", error);
      // Still proceed with payment success flow
      clearCart();
      setAlertMessage("Payment successful! Redirecting...");
      setTimeout(() => {
        router.push(
          `/payment-result?status=success&order_id=${
            paymentData.razorpay_order_id
          }&payment_id=${paymentData.razorpay_payment_id}&signature=${
            paymentData.razorpay_signature
          }&user_id=${getUserId()}&total_amount=${orderTotal}&currency=INR`
        );
      }, 2000);
    }
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
    <Container maxWidth="xl" sx={{ pb: 4, pt: 8 }}>
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
          <Grid size={{ xs: 12, md: 8 }}>
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
                {(enhancedItems.length > 0 ? enhancedItems : cartItems).map(
                  (item) => {
                    // Use enhanced product details if available
                    const isEnhanced = "productDetails" in item;
                    const enhancedItem = isEnhanced
                      ? (item as EnhancedCartItem)
                      : null;
                    const productDetails = enhancedItem?.productDetails;
                    const displayName =
                      productDetails?.name || item.name || "Unknown Product";
                    const displayImage =
                      productDetails?.thumbnailUrl ||
                      (productDetails?.imageUrls &&
                      productDetails.imageUrls.length > 0
                        ? productDetails.imageUrls[0]
                        : null) ||
                      item.image ||
                      "/ProductBackground.png";

                    // Get price from enhanced product details if available, fallback to cart item price
                    const displayPrice =
                      productDetails?.pricesAndSkus &&
                      productDetails.pricesAndSkus.length > 0
                        ? productDetails.pricesAndSkus[0].price
                        : item.price;

                    return (
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
                            src={displayImage}
                            alt={displayName}
                            width={isMobile ? 50 : 60}
                            height={isMobile ? 50 : 60}
                            unoptimized={shouldUnoptimizeImage(displayImage)}
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
                              {displayName}
                            </Typography>
                            {/* Show category if available from product details */}
                            {productDetails?.categoryName && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  display: "block",
                                }}
                              >
                                {productDetails.categoryName}
                              </Typography>
                            )}
                            {/* Mobile-only total price */}
                            {isMobile && (
                              <Typography
                                fontWeight={600}
                                color="primary.main"
                                sx={{ fontSize: "0.875rem", mt: 0.5 }}
                              >
                                Total: {getCurrencySymbol(displayCurrency)}{" "}
                                {((displayPrice || 0) * item.quantity).toFixed(
                                  2
                                )}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, sm: 2 },
                            justifyContent: {
                              xs: "space-between",
                              sm: "flex-end",
                            },
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
                                {getCurrencySymbol(displayCurrency)}
                                {((displayPrice || 0) * item.quantity).toFixed(
                                  2
                                )}
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
                    );
                  }
                )}
              </Stack>
            </Paper>

            {/* Shipping Details Card */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
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
                Shipping Address
              </Typography>

              {/* Address Selection Options */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant={!useManualAddress ? "contained" : "outlined"}
                  onClick={() => setShowAddressManager(true)}
                  sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}
                >
                  Select Existing Address
                </Button>
                <Button
                  variant={useManualAddress ? "contained" : "outlined"}
                  onClick={() => {
                    setUseManualAddress(true);
                    setSelectedAddress(null);
                  }}
                >
                  Enter New Address
                </Button>
              </Box>

              {/* Selected Address Display */}
              {selectedAddress && !useManualAddress && (
                <Box
                  sx={{
                    p: 2,
                    border: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: 1,
                    backgroundColor: "primary.50",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="primary.main"
                  >
                    Shipping Address:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedAddress.fullAddress}
                  </Typography>
                </Box>
              )}

              {/* Manual Address Form - Only show when useManualAddress is true */}
              {useManualAddress && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Full Name*"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
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
                        helperText={
                          formErrors.mobile || "10-digit mobile number"
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
                    <Grid size={{ xs: 12 }}>
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
                        placeholder="City*"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
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
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!formErrors.state}
                      >
                        <InputLabel>State *</InputLabel>
                        <Select
                          value={formData.state}
                          onChange={handleStateChange}
                          label="State *"
                          disabled={loadingStates || !formData.country}
                          sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                          }}
                        >
                          {!formData.country ? (
                            <MenuItem disabled>
                              Please select a country first
                            </MenuItem>
                          ) : loadingStates ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Loading states...
                            </MenuItem>
                          ) : states.length === 0 ? (
                            <MenuItem disabled>No states available</MenuItem>
                          ) : (
                            states.map((state) => (
                              <MenuItem
                                key={state.stateCode}
                                value={state.stateCode}
                              >
                                {state.stateName}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {formErrors.state && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {formErrors.state}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!formErrors.country}
                      >
                        <InputLabel>Country *</InputLabel>
                        <Select
                          value={formData.country}
                          onChange={handleCountryChange}
                          label="Country *"
                          disabled={loadingCountries}
                          sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                          }}
                        >
                          {loadingCountries ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Loading countries...
                            </MenuItem>
                          ) : (
                            countries.map((country) => (
                              <MenuItem
                                key={country.countryCode}
                                value={country.countryCode}
                              >
                                {country.countryName}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {formErrors.country && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {formErrors.country}
                          </Typography>
                        )}
                      </FormControl>
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

                    {/* Save Shipping Address Button */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          onClick={handleSaveShippingAddress}
                          sx={{ mt: 2 }}
                          disabled={isProcessing}
                        >
                          Save Address
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

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
                          country: "IN",
                        });
                        setBillingErrors({});
                        setSelectedBillingAddress(null);
                        setUseManualBillingAddress(true);
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
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary.main"
                    fontFamily={michroma.style.fontFamily}
                    sx={{ mb: 3 }}
                  >
                    Billing Address
                  </Typography>

                  {/* Address Selection Options */}
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant={
                        !useManualBillingAddress ? "contained" : "outlined"
                      }
                      onClick={() => setShowBillingAddressManager(true)}
                      sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}
                    >
                      Select Existing Address
                    </Button>
                    <Button
                      variant={
                        useManualBillingAddress ? "contained" : "outlined"
                      }
                      onClick={() => {
                        setUseManualBillingAddress(true);
                        setSelectedBillingAddress(null);
                      }}
                    >
                      Enter New Address
                    </Button>
                  </Box>

                  {/* Selected Address Display */}
                  {!useManualBillingAddress && selectedBillingAddress && (
                    <Box
                      sx={{
                        p: 2,
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: 1,
                        backgroundColor: "primary.50",
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.main"
                      >
                        Billing Address:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {selectedBillingAddress.fullAddress}
                      </Typography>
                    </Box>
                  )}

                  {/* Manual Address Form */}
                  {useManualBillingAddress && (
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
                      <Grid size={{ xs: 12 }}>
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
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!billingErrors.state}
                        >
                          <InputLabel>State *</InputLabel>
                          <Select
                            value={billingData.state}
                            onChange={handleBillingStateChange}
                            label="State *"
                            disabled={
                              loadingBillingStates || !billingData.country
                            }
                            sx={{
                              backgroundColor: "white",
                              borderRadius: 1,
                            }}
                          >
                            {!billingData.country ? (
                              <MenuItem disabled>
                                Please select a country first
                              </MenuItem>
                            ) : loadingBillingStates ? (
                              <MenuItem disabled>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Loading states...
                              </MenuItem>
                            ) : billingStates.length === 0 ? (
                              <MenuItem disabled>No states available</MenuItem>
                            ) : (
                              billingStates.map((state) => (
                                <MenuItem
                                  key={state.stateCode}
                                  value={state.stateCode}
                                >
                                  {state.stateName}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                          {billingErrors.state && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, ml: 1.5 }}
                            >
                              {billingErrors.state}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!billingErrors.country}
                        >
                          <InputLabel>Country *</InputLabel>
                          <Select
                            value={billingData.country}
                            onChange={handleBillingCountryChange}
                            label="Country *"
                            disabled={loadingCountries}
                            sx={{
                              backgroundColor: "white",
                              borderRadius: 1,
                            }}
                          >
                            {loadingCountries ? (
                              <MenuItem disabled>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Loading countries...
                              </MenuItem>
                            ) : (
                              countries.map((country) => (
                                <MenuItem
                                  key={country.countryCode}
                                  value={country.countryCode}
                                >
                                  {country.countryName}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                          {billingErrors.country && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, ml: 1.5 }}
                            >
                              {billingErrors.country}
                            </Typography>
                          )}
                        </FormControl>
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
                          helperText={
                            billingErrors.zipCode || "6-digit pincode"
                          }
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

                      {/* Save Billing Address Button */}
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: "right" }}>
                          <Button
                            variant="contained"
                            onClick={handleSaveBillingAddress}
                            sx={{ mt: 2 }}
                            disabled={isProcessing}
                          >
                            Save Address
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Payment Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
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
                  {getCurrencySymbol(displayCurrency)}
                  {orderTotal.toFixed(2)}
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="#84a897">Subtotal</Typography>
                  <Typography>
                    {getCurrencySymbol(displayCurrency)}
                    {originalSubtotal.toFixed(2)}
                  </Typography>
                </Box>

                {/* Only show discount row if there are actual discounts */}
                {totalDiscount > 0 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="#84a897">Discount</Typography>
                    <Typography color="#4caf50">
                      -{getCurrencySymbol(displayCurrency)}
                      {totalDiscount.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="#84a897">Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="#84a897">Taxes</Typography>
                  <Typography>
                    {getCurrencySymbol(displayCurrency)}
                    {taxes.toFixed(2)}
                  </Typography>
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
                  <Typography>
                    {getCurrencySymbol(displayCurrency)}
                    {orderTotal.toFixed(2)}
                  </Typography>
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

        {/* Address Manager Dialog */}
        <Dialog
          open={showAddressManager}
          onClose={() => setShowAddressManager(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Select an Address</DialogTitle>
          <DialogContent>
            <AddressManager
              userId={getUserId() || ""}
              onAddressSelect={handleAddressSelect}
              showSelectionMode={true}
              selectedAddressId={selectedAddress?.id}
              hideAddNewButton={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddressManager(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Billing Address Manager Dialog */}
        <Dialog
          open={showBillingAddressManager}
          onClose={() => setShowBillingAddressManager(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Select a Billing Address</DialogTitle>
          <DialogContent>
            <AddressManager
              userId={getUserId() || ""}
              onAddressSelect={handleBillingAddressSelect}
              showSelectionMode={true}
              selectedAddressId={selectedBillingAddress?.id}
              hideAddNewButton={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowBillingAddressManager(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Cart;
