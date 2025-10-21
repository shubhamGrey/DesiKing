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
  Print,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNotification } from "@/components/NotificationProvider";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";
import { isLoggedIn, getUserId, isAdmin } from "@/utils/auth";
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
  AWBNO: string;
  REF_NO?: string;
  BOOKING_DATE: string;
  ORIGIN: string;
  NO_OF_PIECES: string;
  PINCODE: string;
  DESTINATION: string;
  PRODUCT: string;
  SERVICE_TYPE: string;
  CURRENT_STATUS: string;
  CURRENT_CITY: string;
  EVENTDATE: string;
  EVENTTIME: string;
  TRACKING_CODE: string;
  NDR_REASON?: string;
}

interface TrackingDetail {
  CURRENT_CITY: string;
  CURRENT_STATUS: string;
  EVENTDATE: string;
  EVENTTIME: string;
  TRACKING_CODE: string;
}

interface ShipmentTrackingData {
  summaryTrack: ShipmentSummary | null;
  lstDetails: TrackingDetail[];
  ResponseStatus: {
    ErrorCode: string | null;
    Message: string;
    StackTrace: string | null;
    Errors: string | null;
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
  docketNumber?: string;
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

  // Add payment confirmation only if order is paid
  if (order.status === "paid") {
    timeline.push({
      status: "Payment Confirmed",
      timestamp: order.createdDate,
      description: `Payment of ₹${order.totalAmount} received and confirmed`,
      location: "Payment Gateway",
    });
  } else if (order.status === "failed") {
    timeline.push({
      status: "Payment Failed",
      timestamp: order.createdDate,
      description: "Payment could not be processed",
      location: "Payment Gateway",
    });
  }

  // Add shipment tracking details to timeline if available
  if (shipmentData?.lstDetails && shipmentData.lstDetails.length > 0) {
    // Add shipment tracking events, sorted by event date (chronologically, oldest first for timeline)
    const sortedShipmentEvents = [...shipmentData.lstDetails].sort((a, b) => {
      const dateA = new Date(`${a.EVENTDATE} ${a.EVENTTIME}`);
      const dateB = new Date(`${b.EVENTDATE} ${b.EVENTTIME}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Add real shipment events from tracking API
    sortedShipmentEvents.forEach((event) => {
      const eventDateTime = `${event.EVENTDATE} ${event.EVENTTIME}`;
      timeline.push({
        status: event.CURRENT_STATUS || "Shipment Update",
        timestamp: eventDateTime,
        description: `${event.CURRENT_STATUS || "Package status updated"}`,
        location: event.CURRENT_CITY || "In Transit",
      });
    });
  }

  // Sort the entire timeline in reverse chronological order (most recent first)
  timeline.sort((a, b) => {
    // Handle different date formats properly
    let dateA, dateB;

    // Check if timestamp contains date format from tracking API (DD/MM/YYYY HH:mm:ss)
    if (a.timestamp.includes("/")) {
      // Parse DD/MM/YYYY HH:mm:ss format
      const [datePart, timePart] = a.timestamp.split(" ");
      const [day, month, year] = datePart.split("/");
      dateA = new Date(`${year}-${month}-${day}T${timePart}`);
    } else {
      // Standard ISO format from order dates
      dateA = new Date(a.timestamp);
    }

    if (b.timestamp.includes("/")) {
      // Parse DD/MM/YYYY HH:mm:ss format
      const [datePart, timePart] = b.timestamp.split(" ");
      const [day, month, year] = datePart.split("/");
      dateB = new Date(`${year}-${month}-${day}T${timePart}`);
    } else {
      // Standard ISO format from order dates
      dateB = new Date(b.timestamp);
    }

    return dateB.getTime() - dateA.getTime();
  });

  return timeline;
};

const OrderDetailsContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useNotification();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [shipmentTracking, setShipmentTracking] =
    useState<ShipmentTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const orderId = params?.orderId as string;

  // Fetch shipment tracking data
  const fetchShipmentTracking = async (docketNumber: string) => {
    try {
      setTrackingLoading(true);

      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        console.warn("Access token not found for tracking");
        return null;
      }

      const trackingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment/track/${docketNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!trackingResponse.ok) {
        console.warn(`Tracking API returned ${trackingResponse.status}`);
        return null;
      }

      const trackingResult = await trackingResponse.json();

      // Handle the new API response format
      if (trackingResult.ResponseStatus?.Message === "SUCCESS") {
        return trackingResult as ShipmentTrackingData;
      }

      // Fallback for old API format
      if (trackingResult.info?.isSuccess && trackingResult.data) {
        return trackingResult.data as ShipmentTrackingData;
      }

      return null;
    } catch (error) {
      console.warn("Error fetching shipment tracking:", error);
      return null;
    } finally {
      setTrackingLoading(false);
    }
  };

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
            trackingNumber: specificOrder.docketNumber,
            docketNumber: specificOrder.docketNumber,
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

          // Fetch shipment tracking data if docket number is available
          if (specificOrder.docketNumber) {
            const trackingData = await fetchShipmentTracking(
              specificOrder.docketNumber
            );
            if (trackingData) {
              setShipmentTracking(trackingData);
              // Update timeline with real tracking data
              const updatedTimeline = generateOrderTimeline(
                specificOrder,
                trackingData
              );
              setOrderDetails((prev) =>
                prev ? { ...prev, timeline: updatedTimeline } : null
              );
            }
          }
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

    let date: Date;

    // Check if timestamp contains date format from tracking API (DD/MM/YYYY HH:mm:ss)
    if (dateString.includes("/") && dateString.includes(" ")) {
      // Parse DD/MM/YYYY HH:mm:ss format
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");
      date = new Date(`${year}-${month}-${day}T${timePart}`);
    } else {
      // Standard ISO format from order dates
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return { date: "Invalid Date", time: "Invalid Date" };
    }

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

  // Environment validation utility
  const validateEnvironment = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const isDev = process.env.NODE_ENV === "development";

    console.log("Environment validation:", {
      apiUrl,
      isDev,
      origin: typeof window !== "undefined" ? window.location.origin : "SSR",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "SSR",
    });

    return {
      apiUrl: apiUrl || "",
      isDev,
      isProduction: process.env.NODE_ENV === "production",
    };
  };

  const handleDownloadInvoice = async () => {
    if (!orderDetails) {
      showError("Order details not available");
      return;
    }

    try {
      // Validate environment first
      const env = validateEnvironment();

      // Show loading state
      showSuccess("Generating GST-compliant invoice...");

      // Get access token with validation
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        showError("Authentication token not found. Please log in again.");
        return;
      }

      // Get API URL with fallback
      if (!env.apiUrl) {
        showError("API configuration not found. Please contact support.");
        console.error(
          "NEXT_PUBLIC_API_URL not configured for environment:",
          env
        );
        return;
      }

      console.log("Generating invoice for order:", orderDetails.id);
      console.log("Environment:", env);

      // Prepare GST-compliant invoice data matching Tax Invoice structure
      const invoiceData = {
        // Supplier Details (hardcoded as per requirement)
        Supplier: {
          Name: "Braves Enterprise",
          Address: "Munilanq Village, West Jamila Hills",
          Gstin: "17MEZPS7848B1ZD",
          PanNumber: "MEZPS7848B",
          Email: "braves@enterprise.com",
          Phone: "+91-9876543210",
          Website: "www.bravesenterprise.com",
        },

        // Invoice Details (using actual order data)
        Invoice: {
          Number: orderDetails.orderNumber || `INV-${Date.now()}`,
          Date: new Date(orderDetails.createdDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          DueDate: new Date(
            new Date(orderDetails.createdDate).getTime() +
              30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          FinancialYear: `${new Date(
            orderDetails.createdDate
          ).getFullYear()}-${(
            new Date(orderDetails.createdDate).getFullYear() + 1
          )
            .toString()
            .slice(-2)}`,
          OrderNumber: orderDetails.orderNumber,
          OrderDate: new Date(orderDetails.createdDate).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }
          ),
        },

        // Customer Details (using actual delivery/billing address data)
        Customer: {
          Name:
            orderDetails.deliveryAddress?.name ||
            orderDetails.billingAddress?.name ||
            "Customer Name",
          Address:
            orderDetails.deliveryAddress?.address ||
            orderDetails.billingAddress?.address ||
            "Address not available",
          City:
            orderDetails.deliveryAddress?.city ||
            orderDetails.billingAddress?.city ||
            "City",
          State:
            orderDetails.deliveryAddress?.state ||
            orderDetails.billingAddress?.state ||
            "State",
          Pincode:
            orderDetails.deliveryAddress?.pincode ||
            orderDetails.billingAddress?.pincode ||
            "000000",
          Phone:
            orderDetails.deliveryAddress?.phone ||
            orderDetails.billingAddress?.phone ||
            "+91-0000000000",
          Email: "customer@email.com", // Could be enhanced with actual user email if available
          Gstin: null, // Most customers won't have GSTIN
          StateCode: getStateCode(
            orderDetails.deliveryAddress?.state ||
              orderDetails.billingAddress?.state ||
              "Delhi"
          ),
        },

        // Delivery Address (using actual delivery address data)
        DeliveryAddress: orderDetails.deliveryAddress
          ? {
              Name: orderDetails.deliveryAddress.name,
              Address: orderDetails.deliveryAddress.address,
              City: orderDetails.deliveryAddress.city,
              State: orderDetails.deliveryAddress.state,
              Pincode: orderDetails.deliveryAddress.pincode,
              Phone: orderDetails.deliveryAddress.phone,
              StateCode: getStateCode(orderDetails.deliveryAddress.state),
            }
          : null,

        // Items with HSN/SAC codes (using actual order items data)
        Items: orderDetails.items.map((item, index) => {
          const getHsnCode = (productName: string, categoryName?: string) => {
            // Use category information if available
            if (categoryName) {
              const categoryLower = categoryName.toLowerCase();
              if (
                categoryLower.includes("spice") ||
                categoryLower.includes("masala")
              ) {
                if (productName.toLowerCase().includes("cinnamon"))
                  return "0906";
                if (productName.toLowerCase().includes("turmeric"))
                  return "091030";
                if (productName.toLowerCase().includes("pepper")) return "0904";
                if (productName.toLowerCase().includes("cardamom"))
                  return "0908";
                if (productName.toLowerCase().includes("clove")) return "0907";
                return "0906"; // Default for spices
              }
              if (categoryLower.includes("herb")) return "0910";
              if (categoryLower.includes("oil")) return "1515";
              if (categoryLower.includes("tea")) return "0902";
            }

            // Product name based mapping
            if (productName.toLowerCase().includes("cinnamon")) return "0906";
            if (
              productName.toLowerCase().includes("turmeric") ||
              productName.toLowerCase().includes("ladong")
            )
              return "091030";
            if (
              productName.toLowerCase().includes("pepper") ||
              productName.toLowerCase().includes("black")
            )
              return "0904";
            if (
              productName.toLowerCase().includes("bayleaf") ||
              productName.toLowerCase().includes("bay")
            )
              return "0910";
            if (productName.toLowerCase().includes("cardamom")) return "0908";
            if (productName.toLowerCase().includes("clove")) return "0907";
            if (productName.toLowerCase().includes("nutmeg")) return "0908";
            if (productName.toLowerCase().includes("ginger")) return "0910";

            return "0906"; // Default HSN for spices
          };

          const rate = item.price;
          const quantity = item.quantity;
          const taxableValue = rate * quantity;

          // Use 5% IGST (interstate transaction from Meghalaya to other states)
          const igstRate = 5;
          const igstAmount = (taxableValue * igstRate) / 100;
          const totalAmount = taxableValue + igstAmount;

          return {
            SlNo: index + 1,
            Description: item.productName,
            HsnCode: getHsnCode(item.productName, item.categoryName),
            Quantity: quantity,
            Unit: item.weight
              ? item.weight.replace(/[0-9.]/g, "") || "kgs"
              : "kgs", // Extract unit from weight
            Rate: rate,
            TaxableValue: taxableValue,
            DiscountAmount: item.discountAmount
              ? item.discountAmount * quantity
              : 0,

            // GST Calculations - Using IGST for interstate (as per Tax Invoice image)
            CgstRate: 0, // No CGST for interstate
            SgstRate: 0, // No SGST for interstate
            IgstRate: igstRate,
            CgstAmount: 0,
            SgstAmount: 0,
            IgstAmount: igstAmount,
            TotalAmount: totalAmount,
          };
        }),

        // Tax Summary (calculated from actual order data)
        TaxSummary: {
          TotalTaxableValue: orderDetails.subtotal,
          TotalDiscount: orderDetails.discount || 0,

          // GST totals - Using IGST for interstate transaction
          TotalCGST: 0,
          TotalSGST: 0,
          TotalIGST: orderDetails.tax || (orderDetails.subtotal * 5) / 100, // Use actual tax or calculate 5%

          TotalTax: orderDetails.tax || (orderDetails.subtotal * 5) / 100,
          ShippingCharges: orderDetails.shippingCharges || 0,
          GrandTotal: orderDetails.totalAmount,

          PlaceOfSupply: `${
            orderDetails.deliveryAddress?.state ||
            orderDetails.billingAddress?.state ||
            "Delhi"
          } (${getStateCode(
            orderDetails.deliveryAddress?.state ||
              orderDetails.billingAddress?.state ||
              "Delhi"
          )})`,
        },

        // Payment Details (using actual payment information)
        Payment: {
          Method: orderDetails.paymentInfo?.method || "Online Payment",
          TransactionId:
            orderDetails.paymentInfo?.transactionId ||
            orderDetails.docketNumber ||
            "N/A",
          PaymentDate: orderDetails.paymentInfo?.paymentDate
            ? new Date(orderDetails.paymentInfo.paymentDate).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                }
              )
            : new Date(orderDetails.createdDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              }),
          Status: orderDetails.paymentInfo?.status || "Paid",
          AmountPaid:
            orderDetails.paymentInfo?.amount || orderDetails.totalAmount,
        },

        // Terms (matching Tax Invoice footer)
        Terms: ["This is a Computer Generated Invoice"],

        // E-invoice details (if applicable)
        EInvoice: {
          Irn: null,
          QrCode: null,
          AckNo: null,
          AckDate: null,
        },
      };

      // Validate invoice data before sending to catch potential 500 error causes
      const validationErrors = [];

      if (!invoiceData.Invoice?.Number) {
        validationErrors.push("Missing invoice number");
      }

      if (!invoiceData.Customer?.Name) {
        validationErrors.push("Missing customer name");
      }

      if (!invoiceData.Items || invoiceData.Items.length === 0) {
        validationErrors.push("No items in invoice");
      }

      if (
        invoiceData.Items?.some(
          (item: any) => !item.Description || !item.Rate || !item.Quantity
        )
      ) {
        validationErrors.push("Some items have missing required fields");
      }

      if (!invoiceData.TaxSummary?.GrandTotal) {
        validationErrors.push("Missing grand total");
      }

      if (validationErrors.length > 0) {
        console.error("Invoice validation errors:", validationErrors);
        throw new Error(
          `Invoice data validation failed: ${validationErrors.join(", ")}`
        );
      }

      console.log("Invoice data validation passed. Sending request...");
      console.log("Invoice summary:", {
        invoiceNumber: invoiceData.Invoice.Number,
        customerName: invoiceData.Customer.Name,
        itemsCount: invoiceData.Items.length,
        grandTotal: invoiceData.TaxSummary.GrandTotal,
      });

      // Call backend API to generate GST-compliant PDF
      // Use the complete invoice data approach since we have all the data
      const response = await fetch(`${env.apiUrl}/invoice/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/pdf, application/json",
        },
        body: JSON.stringify({
          InvoiceData: invoiceData,
        }),
      });

      console.log("API Response status:", response.status);
      console.log(
        "API Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        // Get detailed error information for 500 errors
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorDetails = null;

        try {
          const errorText = await response.text();
          console.error("API Error response body:", errorText);

          // Try to parse as JSON for structured error
          try {
            errorDetails = JSON.parse(errorText);
            console.error("Parsed API Error:", errorDetails);
            errorMessage =
              errorDetails.message ||
              errorDetails.info?.message ||
              errorMessage;
          } catch {
            // If not JSON, use the text response
            errorDetails = { rawResponse: errorText };
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }

        // For 500 errors, provide more specific debugging info
        if (response.status === 500) {
          console.error("Server Error (500) Details:", {
            url: `${env.apiUrl}/invoice/generate`,
            method: "POST",
            orderId: orderDetails.id,
            requestPayload: {
              InvoiceData: {
                invoiceDataKeys: Object.keys(invoiceData),
                itemsCount: invoiceData.Items?.length || 0,
                hasCustomer: !!invoiceData.Customer,
                hasTaxSummary: !!invoiceData.TaxSummary,
              },
            },
            errorDetails,
            timestamp: new Date().toISOString(),
          });

          errorMessage = `Server error (500): ${errorMessage}. Please check the server logs for details.`;
        }

        throw new Error(errorMessage);
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);

      if (!contentType || !contentType.includes("application/pdf")) {
        // If not PDF, try to get error message from JSON response
        const textResponse = await response.text();
        console.error("Expected PDF but got:", contentType, textResponse);
        throw new Error("Server did not return a PDF file. Please try again.");
      }

      // Handle PDF response
      const blob = await response.blob();
      console.log("PDF blob size:", blob.size);

      if (blob.size === 0) {
        throw new Error("Received empty PDF file. Please try again.");
      }

      const url = window.URL.createObjectURL(blob);

      // Enhanced download handling for production
      const downloadPDF = () => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `GST_Invoice_${invoiceData.Invoice.Number.replace(
          /[\/\\]/g,
          "_"
        )}.pdf`;

        // Ensure link is in DOM for some browsers
        document.body.appendChild(link);

        // Force download
        link.style.display = "none";
        link.click();

        // Cleanup
        document.body.removeChild(link);

        showSuccess("GST-compliant invoice downloaded successfully!");
      };

      // Try to open in new window first, fallback to download
      try {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");

        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === "undefined"
        ) {
          // Popup was blocked, use direct download
          console.log("Popup blocked, using direct download");
          downloadPDF();
        } else {
          // Check if window actually opened
          setTimeout(() => {
            try {
              if (newWindow.closed) {
                downloadPDF();
              } else {
                showSuccess("GST-compliant invoice opened in new window!");
              }
            } catch {
              console.log("Could not check window status, assuming success");
              showSuccess("GST-compliant invoice opened!");
            }
          }, 1000);
        }
      } catch (windowError) {
        console.log("Window.open failed, using direct download:", windowError);
        downloadPDF();
      }

      // Clean up the blob URL after a longer delay for production
      setTimeout(() => {
        try {
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.log("Could not revoke blob URL:", error);
        }
      }, 5000);
    } catch (error) {
      console.error("Error generating GST invoice:", error);

      // Enhanced error logging for debugging 500 errors
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        });
      }

      // Log request details for debugging
      console.error("Request details for debugging:", {
        orderId: orderDetails.id,
        orderNumber: orderDetails.orderNumber,
        totalAmount: orderDetails.totalAmount,
        itemsCount: orderDetails.items?.length || 0,
        hasValidItems:
          orderDetails.items?.every((item) => item.productId && item.price) ||
          false,
        environment: validateEnvironment(),
        timestamp: new Date().toISOString(),
      });

      // Enhanced error messages for production debugging
      let userMessage = "Failed to generate GST invoice.";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        userMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error instanceof Error) {
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          userMessage = "Session expired. Please log in again.";
          // Optionally redirect to login
          // router.push("/login");
        } else if (error.message.includes("500")) {
          userMessage = `Server error (500): The server encountered an internal error while generating your invoice. This has been logged for investigation. Please try again in a few minutes or contact support with order #${orderDetails.orderNumber}.`;
        } else if (error.message.includes("timeout")) {
          userMessage = "Request timed out. Please try again.";
        } else {
          userMessage = `${error.message}`;
        }
      }

      // For production, also log to external service if available
      if (process.env.NODE_ENV === "production") {
        console.error("PRODUCTION ERROR - Invoice Generation Failed:", {
          orderNumber: orderDetails.orderNumber,
          error: error instanceof Error ? error.message : String(error),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
      }

      showError(userMessage);
    }
  };

  const handleDownloadShipmentLabel = async () => {
    if (!orderDetails) {
      showError("Order details not available");
      return;
    }

    if (!orderDetails.docketNumber) {
      showError("Docket number not available for this order");
      return;
    }

    try {
      // Show loading state
      showSuccess("Generating shipment label...");

      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        showError("Authentication token not found. Please log in again.");
        return;
      }

      // Call backend API to generate shipment label
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment/label/${orderDetails.docketNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showError("Session expired. Please log in again.");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is PDF or JSON
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/pdf")) {
        // Handle PDF response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Open PDF in new window/tab
        const newWindow = window.open(url, "_blank");

        if (!newWindow) {
          // Fallback: If popup is blocked, download the file
          const link = document.createElement("a");
          link.href = url;
          link.download = `Shipment_Label_${orderDetails.docketNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showSuccess("Shipment label downloaded successfully!");
        } else {
          showSuccess("Shipment label opened in new window!");
        }

        // Clean up the blob URL after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // Handle JSON response with FileUrl
        const result = await response.json();

        // Check if we have the expected response structure
        if (result.data && result.data.FileUrl) {
          // Extract FileUrl from API response
          const fileUrl = result.data.FileUrl;

          // Open label PDF directly from S3 URL
          const newWindow = window.open(fileUrl, "_blank");

          if (!newWindow) {
            // Fallback: If popup is blocked, try to download the file
            try {
              const link = document.createElement("a");
              link.href = fileUrl;
              link.target = "_blank";
              link.download = `Shipment_Label_${
                result.data.AwbNo || orderDetails.docketNumber
              }.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showSuccess("Shipment label download initiated!");
            } catch {
              // If download fails, show the URL to user
              showError(
                `Please copy this URL to download the label: ${fileUrl}`
              );
            }
          } else {
            showSuccess("Shipment label opened in new window!");
          }
        } else if (result.data && result.data.ResponseStatus) {
          // Handle response with ResponseStatus structure
          const responseStatus = result.data.ResponseStatus;

          if (responseStatus.Message === "Success" && result.data.FileUrl) {
            // Success case with FileUrl
            const fileUrl = result.data.FileUrl;
            const newWindow = window.open(fileUrl, "_blank");

            if (!newWindow) {
              try {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.target = "_blank";
                link.download = `Shipment_Label_${
                  result.data.AwbNo || orderDetails.docketNumber
                }.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccess("Shipment label download initiated!");
              } catch {
                showError(
                  `Please copy this URL to download the label: ${fileUrl}`
                );
              }
            } else {
              showSuccess("Shipment label opened successfully!");
            }
          } else if (responseStatus.ErrorCode) {
            // Error in response
            showError(
              responseStatus.Message || "Failed to generate shipment label"
            );
          } else {
            showError("Shipment label URL not found in response");
          }
        } else if (result.info && result.info.message) {
          // Handle standard API response format
          showError(result.info.message);
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (error) {
      console.error("Error generating shipment label:", error);
      showError(
        `Failed to generate shipment label: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again.`
      );
    }
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
            {/* {isAdmin() && orderDetails.docketNumber && ( */}
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handleDownloadShipmentLabel}
              sx={{
                display: { xs: "none", sm: "flex" },
                borderColor: "warning.main",
                color: "warning.main",
                "&:hover": {
                  borderColor: "warning.dark",
                  backgroundColor: "warning.50",
                },
              }}
            >
              Shipment Label
            </Button>
            {/* )} */}
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

        {/* Mobile Action Buttons */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            gap: 1,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadInvoice}
            size="small"
            fullWidth={isMobile}
          >
            View Invoice
          </Button>
          {isAdmin() && orderDetails.docketNumber && (
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handleDownloadShipmentLabel}
              size="small"
              fullWidth={isMobile}
              sx={{
                borderColor: "warning.main",
                color: "warning.main",
                "&:hover": {
                  borderColor: "warning.dark",
                  backgroundColor: "warning.50",
                },
              }}
            >
              Shipment Label
            </Button>
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
              {trackingLoading && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
                >
                  <Skeleton variant="circular" width={16} height={16} />
                  <Typography variant="caption" color="text.secondary">
                    Loading tracking data...
                  </Typography>
                </Box>
              )}
              {shipmentTracking && (
                <Chip
                  label="Real-time tracking"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {shipmentTracking && (
              <Box sx={{ mb: 3, p: 2, bgcolor: "primary.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                  📦 Current Shipment Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Location:{" "}
                      <strong>
                        {shipmentTracking.lstDetails?.[0]?.CURRENT_CITY ||
                          shipmentTracking.summaryTrack?.CURRENT_CITY ||
                          "In Transit"}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:{" "}
                      <strong>
                        {shipmentTracking.lstDetails?.[0]?.CURRENT_STATUS ||
                          shipmentTracking.summaryTrack?.CURRENT_STATUS ||
                          "Processing"}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tracking Code:{" "}
                      <strong>
                        {shipmentTracking.lstDetails?.[0]?.TRACKING_CODE ||
                          shipmentTracking.summaryTrack?.TRACKING_CODE ||
                          orderDetails.trackingNumber}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Update:{" "}
                      <strong>
                        {shipmentTracking.lstDetails?.[0]
                          ? `${shipmentTracking.lstDetails[0].EVENTDATE} ${shipmentTracking.lstDetails[0].EVENTTIME}`
                          : shipmentTracking.summaryTrack?.EVENTDATE ||
                            "Check back later"}
                      </strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
            <List>
              {orderDetails.timeline.map((event, index) => {
                // Check if this is a real tracking event vs estimated event
                const isRealTrackingEvent = shipmentTracking?.lstDetails?.some(
                  (detail) => detail.CURRENT_STATUS === event.status
                );

                return (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: isRealTrackingEvent
                            ? "success.main"
                            : index === 0
                            ? "primary.main"
                            : "grey.400",
                          border: isRealTrackingEvent ? "2px solid" : "none",
                          borderColor: isRealTrackingEvent
                            ? "success.light"
                            : "none",
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color={
                                isRealTrackingEvent
                                  ? "success.main"
                                  : "text.primary"
                              }
                            >
                              {event.status}
                            </Typography>
                            {isRealTrackingEvent && (
                              <Chip
                                label="Live"
                                size="small"
                                color="success"
                                variant="filled"
                                sx={{ height: 18, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontWeight: isRealTrackingEvent ? 500 : 400,
                              color: isRealTrackingEvent
                                ? "text.primary"
                                : "text.secondary",
                            }}
                          >
                            {event.description}
                          </Typography>
                          {event.location && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontStyle: "italic",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              📍 {event.location}
                              {isRealTrackingEvent && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="success.main"
                                  sx={{ fontWeight: 600, ml: 1 }}
                                >
                                  (Real-time update)
                                </Typography>
                              )}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Detailed Shipment Information */}
            {shipmentTracking?.summaryTrack && (
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                  📋 Detailed Shipment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      AWB Number
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {shipmentTracking.summaryTrack.AWBNO}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Origin
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {shipmentTracking.summaryTrack.ORIGIN}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Destination
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {shipmentTracking.summaryTrack.DESTINATION}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Service Type
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {shipmentTracking.summaryTrack.SERVICE_TYPE} -{" "}
                      {shipmentTracking.summaryTrack.PRODUCT}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Booking Date
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {shipmentTracking.summaryTrack.BOOKING_DATE}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Pieces
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {shipmentTracking.summaryTrack.NO_OF_PIECES} piece(s)
                    </Typography>
                  </Grid>
                  {shipmentTracking.summaryTrack.NDR_REASON && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="error.main">
                        NDR Reason
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        color="error.main"
                      >
                        {shipmentTracking.summaryTrack.NDR_REASON}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Refresh Tracking Button */}
            {orderDetails.docketNumber && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    if (orderDetails.docketNumber) {
                      const trackingData = await fetchShipmentTracking(
                        orderDetails.docketNumber
                      );
                      if (trackingData) {
                        setShipmentTracking(trackingData);
                        // Update timeline with fresh tracking data
                        const fetchOrderDetails = async () => {
                          try {
                            const accessToken = Cookies.get("access_token");
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
                            const ordersResult = await orderResponse.json();
                            if (
                              ordersResult.info?.isSuccess &&
                              ordersResult.data
                            ) {
                              const updatedTimeline = generateOrderTimeline(
                                ordersResult.data,
                                trackingData
                              );
                              setOrderDetails((prev) =>
                                prev
                                  ? { ...prev, timeline: updatedTimeline }
                                  : null
                              );
                              showSuccess("Tracking information updated!");
                            }
                          } catch (error) {
                            console.error("Error refreshing tracking:", error);
                          }
                        };
                        fetchOrderDetails();
                      } else {
                        showError(
                          "Unable to fetch latest tracking information"
                        );
                      }
                    }
                  }}
                  disabled={trackingLoading}
                  startIcon={
                    trackingLoading ? (
                      <Skeleton variant="circular" width={16} height={16} />
                    ) : (
                      <LocalShipping />
                    )
                  }
                >
                  {trackingLoading ? "Updating..." : "Refresh Tracking"}
                </Button>
              </Box>
            )}
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
                p: { xs: 2, sm: 3 },
                borderBottom:
                  index < orderDetails.items.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <Grid container spacing={3}>
                {/* Left Side - Product Details */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                      height: "100%",
                    }}
                  >
                    {/* Product Image */}
                    <Avatar
                      src={item.productImage}
                      variant="rounded"
                      sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        bgcolor: "grey.100",
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    >
                      <Inventory2 />
                    </Avatar>

                    {/* Product Information */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ mb: 1.5, color: "text.primary" }}
                      >
                        {item.productName}
                      </Typography>

                      <Stack spacing={1.5}>
                        {/* Brand and Category Row */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          <Chip
                            label={`Brand: ${item.brandName}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: "0.75rem" }}
                          />
                          {item.categoryName && (
                            <Chip
                              label={item.categoryName}
                              size="small"
                              variant="filled"
                              color="secondary"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                        </Box>

                        {/* Product Specifications */}
                        <Box
                          sx={{
                            bgcolor: "grey.50",
                            borderRadius: 1,
                            p: 1.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                            sx={{
                              mb: 1,
                              display: "block",
                              textTransform: "uppercase",
                            }}
                          >
                            Product Details
                          </Typography>
                          <Stack spacing={0.8}>
                            {item.weight && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Weight:
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                  {item.weight}
                                </Typography>
                              </Box>
                            )}

                            {item.sku && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  SKU:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="500"
                                  sx={{
                                    fontFamily: "monospace",
                                    fontSize: "0.75rem",
                                    bgcolor: "background.paper",
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                  }}
                                >
                                  {item.sku}
                                </Typography>
                              </Box>
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Product ID:
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="500"
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: "0.75rem",
                                  color: "primary.main",
                                }}
                              >
                                #{item.productId.slice(-8).toUpperCase()}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Quantity Ordered:
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="600"
                                color="primary.main"
                              >
                                {item.quantity}{" "}
                                {item.quantity === 1 ? "unit" : "units"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Side - Price Details */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{
                        mb: 2,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      💰 Pricing Breakdown
                    </Typography>

                    <Stack spacing={2}>
                      {/* Original Unit Price (if discounted) */}
                      {item.isDiscounted &&
                      item.discountAmount &&
                      item.discountAmount > 0 ? (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              bgcolor: "grey.50",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Original Price:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                                fontWeight: "500",
                              }}
                            >
                              {getCurrencySymbol(
                                orderDetails.currency || "INR"
                              )}
                              {(item.totalPrice + item.discountAmount).toFixed(
                                2
                              )}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              bgcolor: "success.50",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="success.main"
                              fontWeight="600"
                            >
                              Discounted Price:
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="700"
                              color="success.main"
                            >
                              {getCurrencySymbol(
                                orderDetails.currency || "INR"
                              )}
                              {item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Unit Price:
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            color="text.primary"
                          >
                            {getCurrencySymbol(orderDetails.currency || "INR")}
                            {item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      )}

                      {/* Quantity Calculation */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Price × {item.quantity} qty:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Discount Applied */}
                      {item.isDiscounted &&
                        item.discountAmount &&
                        item.discountAmount > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              bgcolor: "success.50",
                              border: "1px solid",
                              borderColor: "success.200",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="success.main"
                              fontWeight="600"
                            >
                              Discount Applied:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="success.main"
                            >
                              -
                              {getCurrencySymbol(
                                orderDetails.currency || "INR"
                              )}
                              {item.discountAmount.toFixed(2)}
                            </Typography>
                          </Box>
                        )}

                      {/* Item Subtotal (before tax) */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Item Subtotal:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {item.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Tax (5% GST) */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          bgcolor: "warning.50",
                          border: "1px solid",
                          borderColor: "warning.200",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="warning.main"
                          fontWeight="600"
                        >
                          GST (5%):
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="warning.main"
                        >
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {(() => {
                            const taxAmount =
                              Math.round(item.totalPrice * 0.05 * 100) / 100;
                            return taxAmount.toFixed(2);
                          })()}
                        </Typography>
                      </Box>

                      <Divider sx={{ borderStyle: "dashed" }} />

                      {/* Final Total (including tax) */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          bgcolor: "primary.main",
                          color: "white",
                          p: 2,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="700">
                          Item Total (incl. GST):
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {(() => {
                            const taxAmount =
                              Math.round(item.totalPrice * 0.05 * 100) / 100;
                            const totalWithTax = item.totalPrice + taxAmount;
                            return totalWithTax.toFixed(2);
                          })()}
                        </Typography>
                      </Box>

                      {/* Savings Summary */}
                      {item.isDiscounted &&
                        item.discountAmount &&
                        item.discountAmount > 0 && (
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 1,
                              bgcolor: "success.100",
                              borderRadius: 1,
                              border: "2px solid",
                              borderColor: "success.300",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="success.dark"
                              fontWeight="700"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              🎉 You saved{" "}
                              {getCurrencySymbol(
                                orderDetails.currency || "INR"
                              )}
                              {item.discountAmount.toFixed(2)} on this item!
                            </Typography>
                          </Box>
                        )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
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
                      {orderDetails.docketNumber}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        copyToClipboard(
                          orderDetails.trackingNumber || "",
                          "Docket number"
                        )
                      }
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {orderDetails.billingAddress && (
                  <Box>
                    <Divider sx={{ my: 1.5 }} />
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", mb: 1 }}
                        >
                          Same as delivery address
                        </Typography>
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
                      <Box>
                        <Typography variant="body2" fontWeight="500">
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
                      </Box>
                    )}
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
