"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  useMediaQuery,
  Avatar,
  Stack,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  NavigateNext,
  Home,
  LocalShipping,
  CheckCircle,
  Schedule,
  Download,
  Star,
  ArrowBack,
  ContentCopy,
  Phone,
  Email,
  Inventory2,
  Support,
  ExpandMore,
  Help,
  Event,
  AccessTime,
  CreditCard,
  DeliveryDining,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNotification } from "@/components/NotificationProvider";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";
import { isLoggedIn, getUserId } from "@/utils/auth";
import Cookies from "js-cookie";
import { Product } from "@/types/product";
import { getCurrencySymbol } from "@/utils/currencyUtils";

// Styled Components
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[300],
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background: theme.palette.primary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    background: theme.palette.success.main,
  }),
}));

function ColorlibStepIcon(props: any) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <CheckCircle />,
    2: <Inventory2 />,
    3: <LocalShipping />,
    4: <DeliveryDining />,
    5: <CheckCircle />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brandName: string;
  quantity: number;
  price: number; // Final price (discounted or original)
  discountAmount?: number; // Actual discount amount
  totalPrice: number;
  isDiscounted?: boolean; // Whether the item has a discount
  weight?: string;
  sku?: string;
  categoryName?: string;
}

interface DeliveryAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface PaymentInfo {
  method: string;
  transactionId: string;
  paymentDate: string;
  amount: number;
  status: string;
}

interface OrderTimeline {
  status: string;
  timestamp: string;
  description: string;
  location?: string;
}

// Shipment Tracking Interfaces
interface ShipmentSummary {
  awbNo: string;
  refNo: string;
  bookingDate: string;
  origin: string;
  destination: string;
  product: string;
  serviceType: string;
  currentStatus: string;
  currentCity: string;
  eventDate: string;
  eventTime: string;
  trackingCode: string;
  ndrReason?: string;
}

interface TrackingDetail {
  currentCity: string;
  currentStatus: string;
  eventDate: string;
  eventTime: string;
  trackingCode: string;
}

interface ShipmentTrackingData {
  summaryTrack: ShipmentSummary;
  lstDetails: TrackingDetail[];
  responseStatus: {
    status: string;
    message: string;
  };
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status:
    | "Order Placed"
    | "Processing"
    | "Packed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  createdDate: string;
  processingDate?: string;
  packedDate?: string;
  shippedDate?: string;
  outForDeliveryDate?: string;
  deliveredDate?: string;
  expectedDeliveryDate?: string;
  trackingNumber?: string;
  courierCompany?: string;
  courierPhone?: string;
  deliveryAgent?: string;
  deliveryAgentPhone?: string;
  shippingMethod?: string;
  deliveryInstructions?: string;
  totalAmount: number;
  subtotal: number;
  shippingCharges: number;
  discount: number;
  tax: number;
  currency: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  billingAddress?: DeliveryAddress;
  paymentInfo: PaymentInfo;
  timeline: OrderTimeline[];
  returnPolicyEndDate?: string;
  helplineNumber?: string;
}

// Helper functions for date calculations and mapping
const mapOrderStatus = (status: string): OrderDetails["status"] => {
  switch (status.toLowerCase()) {
    case "created":
      return "Order Placed";
    case "paid":
      return "Delivered";
    case "failed":
      return "Cancelled";
    default:
      return "Processing";
  }
};

const addDays = (date: string, days: number): string => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
};

const getEstimatedProcessingDate = (
  createdDate: string,
  status: string
): string | undefined => {
  if (["paid", "failed"].includes(status)) {
    return addDays(createdDate, 1);
  }
  return undefined;
};

const getEstimatedPackedDate = (
  createdDate: string,
  status: string
): string | undefined => {
  if (["paid", "failed"].includes(status)) {
    return addDays(createdDate, 2);
  }
  return undefined;
};

const getEstimatedShippedDate = (
  createdDate: string,
  status: string
): string | undefined => {
  if (["paid", "failed"].includes(status)) {
    return addDays(createdDate, 3);
  }
  return undefined;
};

const getEstimatedOutForDeliveryDate = (
  createdDate: string,
  status: string
): string | undefined => {
  if (status === "paid") {
    return addDays(createdDate, 5);
  }
  return undefined;
};

const getEstimatedDeliveredDate = (createdDate: string): string => {
  return addDays(createdDate, 6);
};

const getExpectedDeliveryDate = (createdDate: string): string => {
  return addDays(createdDate, 7);
};

const getReturnPolicyEndDate = (createdDate: string): string => {
  return addDays(createdDate, 15); // 15 days return policy
};

const generateOrderTimeline = (
  order: any,
  shipmentData?: ShipmentTrackingData
) => {
  const timeline = [
    {
      status: "Order Placed",
      timestamp: order.createdDate,
      description: "Your order has been placed successfully",
      location: "Online",
    },
  ];

  // Add shipment tracking details to timeline if available
  if (shipmentData?.lstDetails && shipmentData.lstDetails.length > 0) {
    // Add shipment tracking events, sorted by event date (most recent first)
    const sortedShipmentEvents = [...shipmentData.lstDetails].sort((a, b) => {
      const dateA = new Date(`${a.eventDate} ${a.eventTime}`);
      const dateB = new Date(`${b.eventDate} ${b.eventTime}`);
      return dateB.getTime() - dateA.getTime();
    });

    // Insert shipment events after order placed
    sortedShipmentEvents.forEach((event) => {
      const eventDateTime = `${event.eventDate} ${event.eventTime}`;
      timeline.push({
        status: event.currentStatus || "Shipment Update",
        timestamp: eventDateTime,
        description: `Package ${
          event.currentStatus?.toLowerCase() || "status updated"
        }`,
        location: event.currentCity || "In Transit",
      });
    });
  }

  if (order.status === "paid") {
    timeline.push(
      {
        status: "Payment Confirmed",
        timestamp: order.createdDate,
        description: `Payment of ₹${order.totalAmount} received and confirmed`,
        location: "Payment Gateway",
      },
      {
        status: "Order Processing",
        timestamp: addDays(order.createdDate, 1),
        description: "Order is being prepared for shipment",
        location: "DesiKing Warehouse",
      },
      {
        status: "Quality Check",
        timestamp: addDays(order.createdDate, 2),
        description: "Products passed quality inspection",
        location: "DesiKing Warehouse",
      },
      {
        status: "Packed",
        timestamp: addDays(order.createdDate, 2),
        description: "Order packed and ready for shipment",
        location: "DesiKing Warehouse",
      },
      {
        status: "Shipped",
        timestamp: addDays(order.createdDate, 3),
        description: "Package handed over to delivery partner",
        location: "Shipping Hub",
      },
      {
        status: "Out for Delivery",
        timestamp: addDays(order.createdDate, 5),
        description: "Package is out for delivery",
        location: "Local Delivery Hub",
      },
      {
        status: "Delivered",
        timestamp: addDays(order.createdDate, 6),
        description: "Order delivered successfully",
        location: "Customer Address",
      }
    );
  } else if (order.status === "failed") {
    timeline.push({
      status: "Payment Failed",
      timestamp: order.createdDate,
      description: "Payment could not be processed",
      location: "Payment Gateway",
    });
  }

  return timeline;
};

const OrderDetailsContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useNotification();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const orderId = params?.orderId as string;

  // Fetch product details function (similar to profile page)
  const fetchProductDetails = async (
    productId: string
  ): Promise<Product | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const rawData = await response.json();
      const data: Product = rawData.data ? rawData.data : rawData;
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  // Enhanced fetch function with real API call
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // Check authentication
        if (!isLoggedIn()) {
          router.push("/login");
          return;
        }

        // Get access token
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          showError("Authentication token not found. Please log in again.");
          router.push("/login");
          return;
        }

        // Get user ID from cookies
        const userId = getUserId();
        if (!userId) {
          showError("User ID not found. Please log in again.");
          router.push("/login");
          return;
        }

        // Fetch the specific order by ID
        const orderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout/order/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!orderResponse.ok) {
          if (orderResponse.status === 401) {
            showError("Session expired. Please log in again.");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("user_role");
            router.push("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }

        const ordersResult = await orderResponse.json();

        if (ordersResult.info?.isSuccess && ordersResult.data) {
          // We now get a single order directly, not an array
          const specificOrder = ordersResult.data;

          // Fetch product details for all order items
          const uniqueProductIds: string[] = Array.from(
            new Set(
              specificOrder.orderItems.map(
                (item: any) => item.productId as string
              )
            )
          );

          const productPromises = uniqueProductIds.map(
            async (productId: string) => {
              const product = await fetchProductDetails(productId);
              return { productId, product };
            }
          );

          const productResults = await Promise.all(productPromises);
          const productMap: Record<string, Product> = {};
          productResults.forEach(({ productId, product }) => {
            if (product) {
              productMap[productId as string] = product;
            }
          });

          // Calculate totals from items
          const itemsData = specificOrder.orderItems.map(
            (item: any, index: number) => {
              const product = productMap[item.productId];
              const productPriceInfo = product?.pricesAndSkus?.[0];

              // Simplified calculation using product table data
              const productPrice = productPriceInfo?.price || 0;
              const discountedAmount = productPriceInfo?.discountedAmount || 0;
              const isDiscounted = productPriceInfo?.isDiscounted || false;

              // Calculate actual discount amount (price - discounted amount)
              const discountAmount = isDiscounted
                ? productPrice - discountedAmount
                : 0;
              const finalPrice = isDiscounted ? discountedAmount : productPrice;

              return {
                id: item.id,
                productId: item.productId,
                productName: product?.name || `Product ${index + 1}`,
                productImage:
                  product?.thumbnailUrl ||
                  product?.imageUrls?.[0] ||
                  "/DesiKing.png",
                brandName: "DesiKing",
                quantity: item.quantity,
                price: finalPrice, // Final price (discounted or original)
                discountAmount: discountAmount, // Actual discount amount
                totalPrice: finalPrice * item.quantity,
                isDiscounted: isDiscounted,
                weight: product?.pricesAndSkus?.[0]?.weightValue
                  ? `${product.pricesAndSkus[0].weightValue}${product.pricesAndSkus[0].weightUnit}`
                  : "N/A",
                sku: product?.pricesAndSkus?.[0]?.skuNumber || "N/A",
                categoryName: product?.categoryName || "Spices",
              };
            }
          );

          // Calculate totals using simplified logic
          const subtotal = itemsData.reduce(
            (sum: number, item: any) => sum + item.totalPrice,
            0
          );
          const totalDiscountAmount = itemsData.reduce(
            (sum: number, item: any) =>
              sum + item.discountAmount * item.quantity,
            0
          );
          const taxAmount = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax on final subtotal

          // Map the API order data to our OrderDetails interface
          const mappedOrderDetails: OrderDetails = {
            id: specificOrder.id,
            orderNumber: specificOrder.receiptId || specificOrder.id,
            status: mapOrderStatus(specificOrder.status),
            createdDate: specificOrder.createdDate,
            // Add processing and delivery dates based on order status and created date
            processingDate: getEstimatedProcessingDate(
              specificOrder.createdDate,
              specificOrder.status
            ),
            packedDate: getEstimatedPackedDate(
              specificOrder.createdDate,
              specificOrder.status
            ),
            shippedDate: getEstimatedShippedDate(
              specificOrder.createdDate,
              specificOrder.status
            ),
            outForDeliveryDate: getEstimatedOutForDeliveryDate(
              specificOrder.createdDate,
              specificOrder.status
            ),
            deliveredDate:
              specificOrder.status === "paid"
                ? getEstimatedDeliveredDate(specificOrder.createdDate)
                : undefined,
            expectedDeliveryDate: getExpectedDeliveryDate(
              specificOrder.createdDate
            ),
            trackingNumber:
              specificOrder.docketNumber ||
              `DK${specificOrder.id.slice(-8).toUpperCase()}`,
            courierCompany: "DesiKing Express Delivery",
            courierPhone: "+91-1800-DESI-KING",
            deliveryAgent: "Assigned Delivery Partner",
            deliveryAgentPhone: "+91-98765-43210",
            shippingMethod: "Standard Delivery",
            deliveryInstructions:
              "Please call before delivery. Ring the doorbell.",
            subtotal: subtotal, // Final subtotal after discounts
            shippingCharges: 0, // Free shipping
            discount: totalDiscountAmount, // Total discount amount
            tax: taxAmount, // 5% tax on subtotal
            totalAmount: subtotal + taxAmount, // Final total (subtotal + tax)
            currency: specificOrder.currency || "INR",
            returnPolicyEndDate: getReturnPolicyEndDate(
              specificOrder.createdDate
            ),
            helplineNumber: "+91-1800-DESI-KING",
            deliveryAddress: specificOrder.shippingAddress
              ? {
                  name:
                    specificOrder.shippingAddress.fullName || "Customer Name",
                  address:
                    [
                      specificOrder.shippingAddress.addressLine,
                      specificOrder.shippingAddress.landMark,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address not available",
                  city: specificOrder.shippingAddress.city || "City",
                  state: specificOrder.shippingAddress.stateCode || "State",
                  pincode: specificOrder.shippingAddress.pinCode || "000000",
                  phone:
                    specificOrder.shippingAddress.phoneNumber ||
                    "+91-0000000000",
                }
              : {
                  name: "Customer Name",
                  address: "Address not available",
                  city: "City",
                  state: "State",
                  pincode: "000000",
                  phone: "+91-0000000000",
                },
            billingAddress: specificOrder.billingAddress
              ? {
                  name:
                    specificOrder.billingAddress.fullName || "Customer Name",
                  address:
                    [
                      specificOrder.billingAddress.addressLine,
                      specificOrder.billingAddress.landMark,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address not available",
                  city: specificOrder.billingAddress.city || "City",
                  state: specificOrder.billingAddress.stateCode || "State",
                  pincode: specificOrder.billingAddress.pinCode || "000000",
                  phone:
                    specificOrder.billingAddress.phoneNumber ||
                    "+91-0000000000",
                }
              : specificOrder.shippingAddress
              ? {
                  name:
                    specificOrder.shippingAddress.fullName || "Customer Name",
                  address:
                    [
                      specificOrder.shippingAddress.addressLine,
                      specificOrder.shippingAddress.landMark,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address not available",
                  city: specificOrder.shippingAddress.city || "City",
                  state: specificOrder.shippingAddress.stateCode || "State",
                  pincode: specificOrder.shippingAddress.pinCode || "000000",
                  phone:
                    specificOrder.shippingAddress.phoneNumber ||
                    "+91-0000000000",
                }
              : {
                  name: "Customer Name",
                  address: "Address not available",
                  city: "City",
                  state: "State",
                  pincode: "000000",
                  phone: "+91-0000000000",
                },
            paymentInfo: {
              method: specificOrder.transaction?.paymentMethod
                ? specificOrder.transaction.paymentMethod === "RAZORPAY"
                  ? "Online Payment (Razorpay)"
                  : specificOrder.transaction.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : specificOrder.transaction.paymentMethod
                : "Online Payment",
              transactionId:
                specificOrder.transaction?.razorpayPaymentId ||
                specificOrder.razorpayOrderId ||
                `TXN${specificOrder.id.slice(-8)}`,
              paymentDate:
                specificOrder.transaction?.paidAt || specificOrder.createdDate,
              amount:
                specificOrder.transaction?.totalAmount ||
                specificOrder.totalAmount,
              status: specificOrder.transaction?.status || "Pending",
            },
            timeline: generateOrderTimeline(specificOrder, undefined),
            items: itemsData,
          };

          setOrderDetails(mappedOrderDetails);
        } else {
          throw new Error(
            ordersResult.info?.message || "Failed to fetch order data"
          );
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        showError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, showError, router]);

  // Helper functions
  const getStatusSteps = () => {
    const statuses = [
      { label: "Order Placed", key: "createdDate" },
      { label: "Packed", key: "packedDate" },
      { label: "Shipped", key: "shippedDate" },
      { label: "Delivered", key: "deliveredDate" },
    ];

    const currentStatusIndex = statuses.findIndex(
      (status) =>
        status.label === orderDetails?.status ||
        (status.label === "Packed" && orderDetails?.packedDate) ||
        (status.label === "Shipped" &&
          (orderDetails?.shippedDate || orderDetails?.outForDeliveryDate)) ||
        (status.label === "Delivered" && orderDetails?.deliveredDate)
    );

    return { statuses, currentStatusIndex };
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(`${label} copied to clipboard`);
  };

  const handleDownloadInvoice = async () => {
    if (!orderDetails) {
      showError("Order details not available");
      return;
    }

    try {
      // Show loading state
      showSuccess("Generating GST-compliant invoice...");

      // Prepare GST-compliant invoice data
      const invoiceData = {
        // Supplier Details (Rule 46 compliance)
        supplier: {
          name: "DesiKing Private Limited",
          address: "Premium Spices District, Mumbai, Maharashtra, 400001",
          gstin: "27AABCD1234E1Z5", // Replace with actual GSTIN
          panNumber: "AABCD1234E",
          email: "invoices@desiking.com",
          phone: "+91-1800-DESI-KING",
          website: "www.desiking.com",
        },

        // Invoice Details (Rule 46 compliance)
        invoice: {
          number: `DK/${new Date().getFullYear()}-${(
            new Date().getFullYear() + 1
          )
            .toString()
            .slice(-2)}/${orderDetails.orderNumber}`,
          date: new Date().toLocaleDateString("en-IN"),
          dueDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-IN"),
          financialYear: `${new Date().getFullYear()}-${(
            new Date().getFullYear() + 1
          )
            .toString()
            .slice(-2)}`,
          orderNumber: orderDetails.orderNumber,
          orderDate: new Date(orderDetails.createdDate).toLocaleDateString(
            "en-IN"
          ),
        },

        // Customer Details (Rule 46 compliance)
        customer: {
          name:
            orderDetails.billingAddress?.name ||
            orderDetails.deliveryAddress?.name ||
            "Customer",
          address:
            orderDetails.billingAddress?.address ||
            orderDetails.deliveryAddress?.address ||
            "Address not provided",
          city:
            orderDetails.billingAddress?.city ||
            orderDetails.deliveryAddress?.city ||
            "City",
          state:
            orderDetails.billingAddress?.state ||
            orderDetails.deliveryAddress?.state ||
            "State",
          pincode:
            orderDetails.billingAddress?.pincode ||
            orderDetails.deliveryAddress?.pincode ||
            "000000",
          phone:
            orderDetails.billingAddress?.phone ||
            orderDetails.deliveryAddress?.phone ||
            "+91-0000000000",
          email: "customer@email.com", // You can collect this during checkout
          gstin: null, // For B2C customers, this will be null
          stateCode: getStateCode(
            orderDetails.billingAddress?.state ||
              orderDetails.deliveryAddress?.state ||
              "Maharashtra"
          ),
        },

        // Delivery Address (if different)
        deliveryAddress: orderDetails.deliveryAddress
          ? {
              name: orderDetails.deliveryAddress.name,
              address: orderDetails.deliveryAddress.address,
              city: orderDetails.deliveryAddress.city,
              state: orderDetails.deliveryAddress.state,
              pincode: orderDetails.deliveryAddress.pincode,
              phone: orderDetails.deliveryAddress.phone,
              stateCode: getStateCode(
                orderDetails.deliveryAddress.state || "Maharashtra"
              ),
            }
          : null,

        // Items with HSN/SAC codes (Rule 46 compliance)
        items: orderDetails.items.map((item, index) => ({
          slNo: index + 1,
          description: item.productName,
          hsnCode: "09109990", // HSN for spices - replace with actual HSN per product
          quantity: item.quantity,
          unit: "KG", // or appropriate unit
          rate: item.price,
          taxableValue: item.price * item.quantity,
          discountAmount: item.discountAmount
            ? item.discountAmount * item.quantity
            : 0,

          // GST Calculations
          cgstRate: isIntraState(orderDetails.billingAddress?.state) ? 2.5 : 0,
          sgstRate: isIntraState(orderDetails.billingAddress?.state) ? 2.5 : 0,
          igstRate: isIntraState(orderDetails.billingAddress?.state) ? 0 : 5,

          cgstAmount: isIntraState(orderDetails.billingAddress?.state)
            ? (item.price * item.quantity * 2.5) / 100
            : 0,
          sgstAmount: isIntraState(orderDetails.billingAddress?.state)
            ? (item.price * item.quantity * 2.5) / 100
            : 0,
          igstAmount: isIntraState(orderDetails.billingAddress?.state)
            ? 0
            : (item.price * item.quantity * 5) / 100,

          totalAmount: item.totalPrice + (item.price * item.quantity * 5) / 100,
        })),

        // Tax Summary
        taxSummary: {
          totalTaxableValue: orderDetails.subtotal,
          totalDiscount: orderDetails.discount,

          // GST totals based on place of supply
          totalCGST: isIntraState(orderDetails.billingAddress?.state)
            ? (orderDetails.subtotal * 2.5) / 100
            : 0,
          totalSGST: isIntraState(orderDetails.billingAddress?.state)
            ? (orderDetails.subtotal * 2.5) / 100
            : 0,
          totalIGST: isIntraState(orderDetails.billingAddress?.state)
            ? 0
            : (orderDetails.subtotal * 5) / 100,

          totalTax: (orderDetails.subtotal * 5) / 100,
          shippingCharges: orderDetails.shippingCharges,
          grandTotal: orderDetails.totalAmount,

          placeOfSupply: `${
            orderDetails.billingAddress?.state ||
            orderDetails.deliveryAddress?.state ||
            "Maharashtra"
          } (${getStateCode(
            orderDetails.billingAddress?.state ||
              orderDetails.deliveryAddress?.state ||
              "Maharashtra"
          )})`,
        },

        // Payment Details
        payment: {
          method: orderDetails.paymentInfo.method,
          transactionId: orderDetails.paymentInfo.transactionId,
          paymentDate: new Date(
            orderDetails.paymentInfo.paymentDate
          ).toLocaleDateString("en-IN"),
          status: orderDetails.paymentInfo.status,
          amountPaid: orderDetails.paymentInfo.amount,
        },

        // Additional Details
        terms: [
          "This is a computer-generated invoice and does not require a physical signature.",
          "Goods once sold will not be taken back.",
          "All disputes are subject to Mumbai jurisdiction only.",
          "Payment due within 30 days of invoice date.",
        ],

        // E-invoice details (if applicable)
        eInvoice: {
          irn: null, // Will be populated if e-invoicing is required
          qrCode: null, // Base64 QR code from IRP
          ackNo: null,
          ackDate: null,
        },
      };

      // Call backend API to generate GST-compliant PDF
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoice/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
          body: JSON.stringify({
            orderId: orderDetails.id,
            invoiceData: invoiceData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle PDF by opening in new window
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open PDF in new window/tab
      const newWindow = window.open(url, "_blank");

      if (!newWindow) {
        // Fallback: If popup is blocked, download the file
        const link = document.createElement("a");
        link.href = url;
        link.download = `GST_Invoice_${invoiceData.invoice.number.replace(
          /\//g,
          "_"
        )}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess("GST-compliant invoice downloaded successfully!");
      } else {
        showSuccess("GST-compliant invoice opened in new window!");
      }

      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error generating GST invoice:", error);
      showError(
        `Failed to generate GST invoice: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again.`
      );
    }
  };

  // Helper function to determine if transaction is intra-state
  const isIntraState = (customerState?: string): boolean => {
    const companyState = "Maharashtra"; // Your company's state
    return (customerState || "Maharashtra") === companyState;
  };

  // Helper function to get state code for GST
  const getStateCode = (stateName?: string): string => {
    const stateCodes: Record<string, string> = {
      "Andaman and Nicobar Islands": "35",
      "Andhra Pradesh": "28",
      "Arunachal Pradesh": "12",
      Assam: "18",
      Bihar: "10",
      Chandigarh: "04",
      Chhattisgarh: "22",
      "Dadra and Nagar Haveli and Daman and Diu": "26",
      Delhi: "07",
      Goa: "30",
      Gujarat: "24",
      Haryana: "06",
      "Himachal Pradesh": "02",
      "Jammu and Kashmir": "01",
      Jharkhand: "20",
      Karnataka: "29",
      Kerala: "32",
      Ladakh: "38",
      Lakshadweep: "31",
      "Madhya Pradesh": "23",
      Maharashtra: "27",
      Manipur: "14",
      Meghalaya: "17",
      Mizoram: "15",
      Nagaland: "13",
      Odisha: "21",
      Puducherry: "34",
      Punjab: "03",
      Rajasthan: "08",
      Sikkim: "11",
      "Tamil Nadu": "33",
      Telangana: "36",
      Tripura: "16",
      "Uttar Pradesh": "09",
      Uttarakhand: "05",
      "West Bengal": "19",
    };

    return stateCodes[stateName || "Maharashtra"] || "27";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Out for Delivery":
        return "warning";
      case "Shipped":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "primary";
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 2 : 3 }}
      >
        <Stack spacing={3}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="rectangular" width="100%" height={300} />
          <Skeleton variant="rectangular" width="100%" height={250} />
        </Stack>
      </Container>
    );
  }

  if (!orderDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="h6">Order not found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            The order you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/profile")}
            sx={{ mt: 2 }}
          >
            View All Orders
          </Button>
        </Alert>
      </Container>
    );
  }

  const { statuses, currentStatusIndex } = getStatusSteps();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 2 : 3 }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{
            mb: 2,
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          Back to Orders
        </Button>

        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => router.push("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => router.push("/profile")}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Profile
          </Link>
          <Typography variant="body2" color="text.primary">
            Order Details
          </Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontFamily={michroma.style.fontFamily}
              color="primary.main"
              sx={{ mb: 1 }}
            >
              Order Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Order #
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {orderDetails.orderNumber}
              </Typography>
              <IconButton
                size="small"
                onClick={() =>
                  copyToClipboard(orderDetails.orderNumber, "Order number")
                }
                sx={{ ml: 0.5 }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadInvoice}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              View Invoice
            </Button>
          </Box>
        </Box>

        {/* Status and Actions */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            mb: 3,
          }}
        >
          <Chip
            label={orderDetails.status}
            color={getStatusColor(orderDetails.status) as any}
            icon={
              orderDetails.status === "Delivered" ? (
                <CheckCircle />
              ) : orderDetails.status === "Out for Delivery" ? (
                <LocalShipping />
              ) : (
                <Schedule />
              )
            }
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              height: 36,
              "& .MuiChip-icon": { fontSize: "1.1rem" },
            }}
          />
          {orderDetails.expectedDeliveryDate &&
            orderDetails.status !== "Delivered" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Expected by{" "}
                  {(() => {
                    const formatted = formatDateTime(
                      orderDetails.expectedDeliveryDate
                    );
                    return typeof formatted === "object"
                      ? formatted.date
                      : formatted;
                  })()}
                </Typography>
              </Box>
            )}
        </Box>
      </Box>

      {/* Order Progress Stepper */}
      <Card
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: "background.default",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          color="primary.main"
          sx={{ mb: 3 }}
        >
          Order Progress
        </Typography>
        <Stepper
          alternativeLabel
          activeStep={currentStatusIndex}
          connector={<ColorlibConnector />}
        >
          {statuses.map((status) => (
            <Step key={status.label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <Typography variant="caption" fontWeight="500">
                  {status.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {orderDetails.expectedDeliveryDate &&
          orderDetails.status !== "Delivered" && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Expected Delivery:{" "}
                <Typography
                  component="span"
                  color="primary.main"
                  fontWeight="600"
                >
                  {(() => {
                    const formatted = formatDateTime(
                      orderDetails.expectedDeliveryDate
                    );
                    return typeof formatted === "object"
                      ? `${formatted.date} by ${formatted.time}`
                      : formatted;
                  })()}
                </Typography>
              </Typography>
            </Box>
          )}
      </Card>

      {/* Order Timeline */}
      <Card sx={{ mb: 4, border: "1px solid", borderColor: "divider" }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ backgroundColor: "background.default" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Event color="primary" />
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Detailed Timeline
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {orderDetails.timeline.map((event, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body1" fontWeight="600">
                          {event.status}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(() => {
                            const formatted = formatDateTime(event.timestamp);
                            return typeof formatted === "object"
                              ? `${formatted.date} ${formatted.time}`
                              : formatted;
                          })()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                        {event.location && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            📍 {event.location}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Card>

      {/* Order Items */}
      <Card sx={{ mb: 4, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              backgroundColor: "background.default",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight="600" color="primary.main">
              Order Items ({orderDetails.items.length})
            </Typography>
          </Box>

          {orderDetails.items.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                p: 3,
                borderBottom:
                  index < orderDetails.items.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                {/* Product Image */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Avatar
                    src={item.productImage}
                    variant="rounded"
                    sx={{
                      width: { xs: 100, sm: 80 },
                      height: { xs: 100, sm: 80 },
                      bgcolor: "grey.100",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Inventory2 />
                  </Avatar>
                </Grid>

                {/* Product Details */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    {item.productName}
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Brand: {item.brandName}
                    </Typography>
                    {item.weight && (
                      <Typography variant="body2" color="text.secondary">
                        Weight: {item.weight}
                      </Typography>
                    )}
                    {item.sku && (
                      <Typography variant="body2" color="text.secondary">
                        SKU: {item.sku}
                      </Typography>
                    )}
                    {item.categoryName && (
                      <Chip
                        label={item.categoryName}
                        size="small"
                        variant="outlined"
                        sx={{ width: "fit-content", mt: 0.5 }}
                      />
                    )}
                  </Stack>
                </Grid>

                {/* Quantity and Price */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Quantity
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {item.quantity}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Price
                    </Typography>

                    {/* Total Price Only - Simplified Display */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "flex-start", sm: "flex-end" },
                        gap: 1,
                      }}
                    >
                      {/* Final Total Price */}
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        color={
                          item.isDiscounted ? "success.main" : "primary.main"
                        }
                      >
                        {getCurrencySymbol(orderDetails.currency || "INR")}
                        {item.totalPrice.toFixed(2)}
                      </Typography>

                      {/* Discount Badge */}
                      {item.isDiscounted &&
                        item.discountAmount &&
                        item.discountAmount > 0 && (
                          <Chip
                            label={`Saved ${getCurrencySymbol(
                              orderDetails.currency || "INR"
                            )}${item.discountAmount.toFixed(2)}`}
                            size="small"
                            color="success"
                            sx={{
                              fontSize: "0.75rem",
                              height: "20px",
                            }}
                          />
                        )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Order Total Summary */}
          <Box sx={{ p: 3, mx: 3, backgroundColor: "background.default" }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  {/* Return Policy Notice */}
                  {orderDetails.returnPolicyEndDate && (
                    <Alert severity="info" variant="outlined">
                      <Typography variant="body2">
                        Return window expires on{" "}
                        {(() => {
                          const formatted = formatDateTime(
                            orderDetails.returnPolicyEndDate
                          );
                          return typeof formatted === "object"
                            ? formatted.date
                            : formatted;
                        })()}
                      </Typography>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadInvoice}
                    >
                      Invoice
                    </Button>
                    {orderDetails.status === "Delivered" && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Star />}
                        onClick={() =>
                          showSuccess("Rating feature coming soon!")
                        }
                      >
                        Rate
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    sx={{ mb: 2 }}
                  >
                    Order Summary
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">
                        {getCurrencySymbol(orderDetails.currency || "INR")}
                        {orderDetails.subtotal}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Shipping:</Typography>
                      <Typography
                        variant="body2"
                        color={
                          orderDetails.shippingCharges === 0
                            ? "success.main"
                            : "text.primary"
                        }
                      >
                        {orderDetails.shippingCharges === 0
                          ? "FREE"
                          : `${getCurrencySymbol(
                              orderDetails.currency || "INR"
                            )}${orderDetails.shippingCharges}`}
                      </Typography>
                    </Box>
                    {orderDetails.discount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">Discount:</Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="600"
                        >
                          -{getCurrencySymbol(orderDetails.currency || "INR")}
                          {orderDetails.discount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Tax:</Typography>
                      <Typography variant="body2">
                        {getCurrencySymbol(orderDetails.currency || "INR")}
                        {orderDetails.tax}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        Total:
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        color="primary.main"
                      >
                        {getCurrencySymbol(orderDetails.currency || "INR")}
                        {orderDetails.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                    {orderDetails.discount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                          p: 1,
                          backgroundColor: "success.50",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "success.200",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="600"
                        >
                          🎉 You saved:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="600"
                        >
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {orderDetails.discount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Information Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Delivery Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <LocalShipping color="primary" />
                <Typography variant="h6" fontWeight="600" color="primary.main">
                  Delivery Information
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Delivery Address
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {orderDetails.deliveryAddress.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderDetails.deliveryAddress.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderDetails.deliveryAddress.city},{" "}
                    {orderDetails.deliveryAddress.state} -{" "}
                    {orderDetails.deliveryAddress.pincode}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Shipping Method
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {orderDetails.shippingMethod}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Tracking Information
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="500">
                      {orderDetails.trackingNumber}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        copyToClipboard(
                          orderDetails.trackingNumber || "",
                          "Tracking number"
                        )
                      }
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Courier: {orderDetails.courierCompany}
                  </Typography>
                  {orderDetails.courierPhone && (
                    <Typography variant="body2" color="text.secondary">
                      📞 {orderDetails.courierPhone}
                    </Typography>
                  )}
                </Box>

                {orderDetails.deliveryAgent && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Delivery Agent
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {orderDetails.deliveryAgent}
                    </Typography>
                    {orderDetails.deliveryAgentPhone && (
                      <Typography variant="body2" color="text.secondary">
                        📞 {orderDetails.deliveryAgentPhone}
                      </Typography>
                    )}
                  </Box>
                )}

                {orderDetails.deliveryInstructions && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Delivery Instructions
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "background.default",
                        p: 1.5,
                        borderRadius: 1,
                        fontStyle: "italic",
                      }}
                    >
                      &quot;{orderDetails.deliveryInstructions}&quot;
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <CreditCard color="primary" />
                <Typography variant="h6" fontWeight="600" color="primary.main">
                  Payment Information
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Payment Method
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {orderDetails.paymentInfo.method}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Transaction ID
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight="500">
                      {orderDetails.paymentInfo.transactionId}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        copyToClipboard(
                          orderDetails.paymentInfo.transactionId,
                          "Transaction ID"
                        )
                      }
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Payment Date
                  </Typography>
                  <Typography variant="body2">
                    {(() => {
                      const formatted = formatDateTime(
                        orderDetails.paymentInfo.paymentDate
                      );
                      return typeof formatted === "object"
                        ? `${formatted.date} at ${formatted.time}`
                        : formatted;
                    })()}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Amount Paid
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="success.main"
                  >
                    {getCurrencySymbol(orderDetails.currency || "INR")}
                    {orderDetails.paymentInfo.amount}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={orderDetails.paymentInfo.status}
                    color="success"
                    size="small"
                    icon={<CheckCircle />}
                  />
                </Box>

                {orderDetails.billingAddress && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Billing Address
                    </Typography>
                    {/* Check if billing address is same as shipping address */}
                    {orderDetails.billingAddress.address ===
                      orderDetails.deliveryAddress.address &&
                    orderDetails.billingAddress.name ===
                      orderDetails.deliveryAddress.name &&
                    orderDetails.billingAddress.pincode ===
                      orderDetails.deliveryAddress.pincode ? (
                      <Box>
                        {/* Show actual shipping address data */}
                        <Typography variant="body2" fontWeight="500">
                          {orderDetails.deliveryAddress.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {orderDetails.deliveryAddress.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {orderDetails.deliveryAddress.city},{" "}
                          {orderDetails.deliveryAddress.state} -{" "}
                          {orderDetails.deliveryAddress.pincode}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body2">
                          {orderDetails.billingAddress.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {orderDetails.billingAddress.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {orderDetails.billingAddress.city},{" "}
                          {orderDetails.billingAddress.state} -{" "}
                          {orderDetails.billingAddress.pincode}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Help color="primary" />
            Need Help with Your Order?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We&apos;re here to help! Choose how you&apos;d like to get
            assistance:
          </Typography>

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Phone />}
              onClick={() => {
                window.open(`tel:${orderDetails.helplineNumber}`);
                setHelpDialogOpen(false);
              }}
            >
              Call Helpline: {orderDetails.helplineNumber}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Email />}
              onClick={() => {
                window.open("mailto:support@desiking.com");
                setHelpDialogOpen(false);
              }}
            >
              Send Email
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Support />}
              onClick={() => {
                showSuccess("Live chat will open soon!");
                setHelpDialogOpen(false);
              }}
            >
              Start Live Chat
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const OrderDetailsPage: React.FC = () => (
  <Suspense
    fallback={
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    }
  >
    <OrderDetailsContent />
  </Suspense>
);

export default OrderDetailsPage;
