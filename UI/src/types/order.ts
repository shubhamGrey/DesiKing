export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  brandId: string;
  createdDate: string;
  modifiedDate?: string;
}

export interface Transaction {
  id: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  userId: string;
  signature?: string;
  totalAmount: number;
  currency?: string;
  status?: string; // captured, failed, refunded
  paymentMethod?: string;
  brandId: string;
  paidAt?: string;
  createdDate?: string;
}

export interface Order {
  id: string;
  userId: string;
  razorpayOrderId?: string;
  receiptId?: string;
  totalAmount: number;
  currency?: string;
  status: "created" | "paid" | "failed";
  brandId: string;
  createdDate: string;
  modifiedDate?: string;
  orderItems: OrderItem[];
  transaction?: Transaction;
}

export interface OrdersApiResponse {
  info: {
    isSuccess: boolean;
    code: string;
    message: string;
  };
  data: Order[];
  id: string;
}
