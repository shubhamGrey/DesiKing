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
