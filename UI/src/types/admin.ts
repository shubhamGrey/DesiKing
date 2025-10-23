// Backend API Response Interfaces
export interface ApiResponseInfo {
  isSuccess: boolean;
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  info: ApiResponseInfo;
  data: T;
  id: string;
}

// Product interfaces based on backend ProductResponseModel
export interface ProductPrice {
  id: string;
  currencyId: string;
  currencyCode: string;
  price: number;
  createdDate: string;
  modifiedDate?: string;
  isDiscounted: boolean;
  discountPercentage: number;
  discountedAmount?: number;
  weightId?: string;
  weightValue?: number;
  weightUnit?: string;
  skuNumber: string;
  barcode?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  categoryName: string;
  manufacturingDate: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle?: string;
  metaDescription?: string;
  imageUrls: string[];
  keyFeatures: string[];
  uses: string[];
  origin?: string;
  shelfLife?: string;
  storageInstructions?: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  ingredients?: string;
  nutritionalInfo?: string;
  thumbnailUrl?: string;
  pricesAndSkus: ProductPrice[];
}

// Category interfaces based on backend CategoryResponseModel
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  brandId: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Brand interfaces based on backend BrandResponseModel
export interface Brand {
  id: string;
  name: string;
  code?: string;
  description?: string;
  logoUrl?: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Order interfaces based on backend OrderByUserResponseModel
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdDate: string;
}

export interface Transaction {
  id: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  userId: string;
  signature?: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
  createdDate: string;
}

export interface DetailedAddress {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  landMark?: string;
  pinCode: string;
  stateCode: string;
  countryCode: string;
  addressType: string;
  createdDate: string;
}

export interface Order {
  id: string;
  userId: string;
  razorpayOrderId?: string;
  receiptId?: string;
  status: string;
  totalAmount: number;
  currency?: string;
  createdDate: string;
  docketNumber?: string;
  orderItems: OrderItem[];
  transaction?: Transaction;
  shippingAddress?: DetailedAddress;
  billingAddress?: DetailedAddress;
}

// Role interface for user management
export interface Role {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  isDeleted: boolean;
}

// User interface for user management
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleId: string;
  roleName?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdDate: string;
  modifiedDate?: string;
  lastLoginDate?: string;
}

// Analytics interfaces
export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  usersGrowth: number;
}

// Navigation interface
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  hasSubItems?: boolean;
}

// Common props for admin components
export interface AdminComponentProps {
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
}
