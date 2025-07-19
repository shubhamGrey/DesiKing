// Razorpay payment types and interfaces
export interface RazorpayOrderData {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface RazorpayPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentData) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface OrderCreateRequest {
  id?: string;
  userId: string;
  totalAmount: number;
  currency: string;
  brandId: string;
  status: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface PaymentFormData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}
