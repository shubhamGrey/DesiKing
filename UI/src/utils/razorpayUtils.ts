import {
  RazorpayOptions,
  RazorpayPaymentData,
  RazorpayOrderData,
  OrderCreateRequest,
  PaymentFormData,
} from "@/types/razorpay";

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create order (both COD and Razorpay)
export const createOrder = async (
  orderData: OrderCreateRequest,
  paymentMethod: "COD" | "RAZORPAY" = "COD"
): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Checkout/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-ID": crypto.randomUUID(),
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: paymentMethod,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (
  orderData: RazorpayOrderData,
  formData: PaymentFormData,
  onSuccess: (paymentData: RazorpayPaymentData) => void,
  onError: (error: any) => void
): Promise<void> => {
  // Load Razorpay script
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    onError(new Error("Failed to load Razorpay script"));
    return;
  }

  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    amount: orderData.amount,
    currency: orderData.currency,
    name: "AgroNexis",
    description: "Purchase from AgroNexis",
    order_id: orderData.id,
    handler: (response: RazorpayPaymentData) => {
      onSuccess(response);
    },
    prefill: {
      name: formData.name,
      email: formData.email,
      contact: formData.mobile,
    },
    notes: {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    },
    theme: {
      color: "#2E7D32", // Your primary color
    },
    modal: {
      ondismiss: () => {
        onError(new Error("Payment cancelled by user"));
      },
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error initializing Razorpay:", error);
    onError(error);
  }
};

// Verify payment on backend
export const verifyPayment = async (
  paymentData: RazorpayPaymentData,
  userId: string,
  totalAmount: number,
  currency: string = "INR"
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Checkout/verify-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-ID": crypto.randomUUID(),
        },
        body: JSON.stringify({
          orderId: paymentData.razorpay_order_id,
          paymentId: paymentData.razorpay_payment_id,
          signature: paymentData.razorpay_signature,
          userId: userId,
          totalAmount: totalAmount,
          currency: currency,
          paymentMethod: "RAZORPAY",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Payment verification failed");
    }

    const result = await response.json();
    return result.data ?? false;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
};

// Format amount for Razorpay (convert to paise)
export const formatAmountForRazorpay = (amount: number): number => {
  return Math.round(amount * 100); // Convert to paise
};

// Format amount for display (convert from paise)
export const formatAmountForDisplay = (amount: number): number => {
  return amount / 100; // Convert from paise to rupees
};
