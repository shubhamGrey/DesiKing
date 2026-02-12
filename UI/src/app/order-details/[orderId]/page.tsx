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
  ShoppingCart,
  Receipt,
  Savings,
  Label,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNotification } from "@/components/NotificationProvider";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";
import { isLoggedIn, getUserId, isAdmin } from "@/utils/auth";
import { processApiResponse } from "@/utils/apiErrorHandling";
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
  hsnCode?: string;
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

// Shipment Tracking Interfaces - Updated to match backend API response
interface ShipmentSummary {
  AWBNO: string;
  REF_NO: string;
  BOOKING_DATE: string;
  ORIGIN: string;
  DESTINATION: string;
  PRODUCT: string;
  SERVICE_TYPE: string;
  CURRENT_STATUS: string;
  CURRENT_CITY: string;
  EVENTDATE: string;
  EVENTTIME: string;
  TRACKING_CODE: string;
  NDR_REASON: string;
}

interface TrackingDetail {
  CURRENT_CITY: string;
  CURRENT_STATUS: string;
  EVENTDATE: string;
  EVENTTIME: string;
  TRACKING_CODE: string;
}

interface ShipmentTrackingData {
  SummaryTrack: ShipmentSummary | null;
  LstDetails: TrackingDetail[];
  ResponseStatus: {
    errorCode: string | null;
    message: string;
    status: string | null;
    errors: string | null;
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
  status: string,
): string | undefined => {
  if (["paid", "failed"].includes(status)) {
    return addDays(createdDate, 1);
  }
  return undefined;
};

const getEstimatedPackedDate = (
  createdDate: string,
  status: string,
): string | undefined => {
  if (["paid", "failed"].includes(status)) {
    return addDays(createdDate, 2);
  }
  return undefined;
};

const getEstimatedShippedDate = (
  createdDate: string,
  status: string,
): string | undefined => {
  if (["paid", "failed"].includes(status)) {
    return addDays(createdDate, 3);
  }
  return undefined;
};

const getEstimatedOutForDeliveryDate = (
  createdDate: string,
  status: string,
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
  shipmentData?: ShipmentTrackingData,
) => {
  const timeline = [
    {
      status: "Order Placed",
      timestamp: order.createdDate,
      description: "Your order has been placed successfully",
      location: "Online",
    },
  ];

  // Add basic order events first
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
  if (shipmentData?.LstDetails && shipmentData.LstDetails.length > 0) {
    console.log("Processing LstDetails for timeline:", shipmentData.LstDetails);
    // Add shipment tracking events
    shipmentData.LstDetails.forEach((event: TrackingDetail) => {
      console.log("Processing tracking event:", event);
      // Parse and format the date from DD/MM/YYYY to proper format
      const [day, month, year] = event.EVENTDATE.split("/");
      const eventDateTime = new Date(
        `${year}-${month}-${day} ${event.EVENTTIME}`,
      );

      const trackingEvent = {
        status: event.CURRENT_STATUS || "Shipment Update",
        timestamp: eventDateTime.toISOString(),
        description: `Package ${
          event.CURRENT_STATUS?.toLowerCase() || "status updated"
        } at ${event.CURRENT_CITY || "location"}`,
        location: event.CURRENT_CITY || "In Transit",
      };

      console.log("Adding tracking event to timeline:", trackingEvent);
      timeline.push(trackingEvent);
    });
  } else {
    console.log(
      "No LstDetails found or empty array:",
      shipmentData?.LstDetails,
    );
  }

  // Sort timeline by timestamp (most recent first)
  return timeline.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};

const OrderDetailsContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useNotification();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [trackingData, setTrackingData] = useState<ShipmentTrackingData | null>(
    null,
  );
  const [trackingLoading, setTrackingLoading] = useState(false);

  const orderId = params?.orderId as string;

  // Fetch product details function with enhanced error handling
  const fetchProductDetails = async (
    productId: string,
  ): Promise<Product | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Use our enhanced API response processing
      const data = await processApiResponse<Product>(response);
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  // Fetch shipment tracking data function
  const fetchTrackingData = async (
    trackingNumber: string,
  ): Promise<ShipmentTrackingData | null> => {
    try {
      setTrackingLoading(true);
      console.log(`Fetching tracking data for: ${trackingNumber}`);

      // Get access token
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        console.error("No access token found");
        return null;
      }

      // Call the existing shipment track API (GET method with awbNo in path)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Shipment/track/${trackingNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(`Tracking API response status: ${response.status}`);

      if (!response.ok) {
        console.error(`API returned status: ${response.status}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the API response (it comes wrapped in ApiResponseModel)
      const apiResponse = await response.json();
      console.log("API response received:", apiResponse);

      // Check if the API call was successful
      if (apiResponse.info?.code === "200" && apiResponse.data) {
        console.log("Tracking data is valid, setting state");
        // Extract the actual tracking data from the API response
        const trackingData = apiResponse.data;

        // Map the API response to our interface (note the property name differences)
        const mappedData: ShipmentTrackingData = {
          SummaryTrack: trackingData.summaryTrack, // API returns lowercase
          LstDetails: trackingData.lstDetails, // API returns lowercase
          ResponseStatus: trackingData.responseStatus, // API returns lowercase
        };

        console.log("Mapped tracking data:", mappedData);
        return mappedData;
      } else {
        console.error("API returned non-success response:", apiResponse.info);
        showError("No tracking information available for this shipment.");
        return null;
      }
    } catch (error) {
      console.error(
        `Error fetching tracking data for ${trackingNumber}:`,
        error,
      );

      // Show more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          showError("Session expired. Please refresh the page and try again.");
        } else if (error.message.includes("404")) {
          showError("Tracking information not found for this shipment.");
        } else if (error.message.includes("500")) {
          showError(
            "Server error while fetching tracking data. Please try again later.",
          );
        } else {
          showError(
            "Unable to fetch tracking information. Please check your internet connection and try again.",
          );
        }
      }
      return null;
    } finally {
      setTrackingLoading(false);
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
          },
        );

        // Use our enhanced API response processing
        const ordersResult = await processApiResponse<any>(orderResponse);

        if (ordersResult) {
          // We now get the order data directly from processApiResponse
          const specificOrder = ordersResult;

          // Fetch product details for all order items
          const uniqueProductIds: string[] = Array.from(
            new Set(
              specificOrder.orderItems.map(
                (item: any) => item.productId as string,
              ),
            ),
          );

          const productPromises = uniqueProductIds.map(
            async (productId: string) => {
              const product = await fetchProductDetails(productId);
              return { productId, product };
            },
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
            },
          );

          // Calculate totals using simplified logic
          const subtotal = itemsData.reduce(
            (sum: number, item: any) => sum + item.totalPrice,
            0,
          );
          const totalDiscountAmount = itemsData.reduce(
            (sum: number, item: any) =>
              sum + item.discountAmount * item.quantity,
            0,
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
              specificOrder.status,
            ),
            packedDate: getEstimatedPackedDate(
              specificOrder.createdDate,
              specificOrder.status,
            ),
            shippedDate: getEstimatedShippedDate(
              specificOrder.createdDate,
              specificOrder.status,
            ),
            outForDeliveryDate: getEstimatedOutForDeliveryDate(
              specificOrder.createdDate,
              specificOrder.status,
            ),
            deliveredDate:
              specificOrder.status === "paid"
                ? getEstimatedDeliveredDate(specificOrder.createdDate)
                : undefined,
            expectedDeliveryDate: getExpectedDeliveryDate(
              specificOrder.createdDate,
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
            shippingCharges: 100,
            discount: totalDiscountAmount, // Total discount amount
            tax: taxAmount, // 5% tax on subtotal
            totalAmount: subtotal + taxAmount + 100, // Final total (subtotal + tax + shipping)
            currency: specificOrder.currency || "INR",
            returnPolicyEndDate: getReturnPolicyEndDate(
              specificOrder.createdDate,
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

          // Set initial order details
          setOrderDetails(mappedOrderDetails);

          // Fetch tracking data if tracking number is available
          const trackingNumber = mappedOrderDetails.trackingNumber;
          if (trackingNumber) {
            console.log(`Attempting to fetch tracking for: ${trackingNumber}`);

            // Try to fetch tracking data for any tracking number
            // This will work for both real tracking numbers and generated ones
            const trackingResult = await fetchTrackingData(trackingNumber);

            if (trackingResult) {
              console.log(
                "Successfully received tracking data, updating timeline",
              );
              setTrackingData(trackingResult);

              // Update order details with enhanced timeline including tracking data
              const enhancedTimeline = generateOrderTimeline(
                specificOrder,
                trackingResult,
              );
              setOrderDetails((prevDetails) =>
                prevDetails
                  ? { ...prevDetails, timeline: enhancedTimeline }
                  : null,
              );
            } else {
              console.log("No tracking data received or API call failed");
            }
          } else {
            console.log("No tracking number available for this order");
          }
        } else {
          throw new Error("No order data received from server");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);

        // Provide more specific error messages
        let errorMessage = "Failed to load order details";

        if (error instanceof Error) {
          if (
            error.message.includes("401") ||
            error.message.includes("Authentication")
          ) {
            errorMessage = "Session expired. Please log in again.";
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("user_role");
            router.push("/login");
            return;
          } else if (
            error.message.includes("404") ||
            error.message.includes("Not Found")
          ) {
            errorMessage =
              "Order not found. Please check the order ID and try again.";
          } else if (
            error.message.includes("403") ||
            error.message.includes("Forbidden")
          ) {
            errorMessage = "You don't have permission to view this order.";
          } else if (
            error.message.includes("Network") ||
            error.message.includes("fetch")
          ) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (error.message !== "Failed to load order details") {
            errorMessage = `Error: ${error.message}`;
          }
        }

        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        (status.label === "Delivered" && orderDetails?.deliveredDate),
    );

    return { statuses, currentStatusIndex };
  };

  const getHSNCode = (product: string, category: string) => {
    // Map products to HSN codes based on the invoice image and GST guidelines
    // This method can be enhanced to use category or dedicated HSN table in future

    const productNameLower = product.toLowerCase();
    const categoryNameLower = category?.toLowerCase() ?? "";

    // Use category information if available and relevant
    if (!categoryNameLower) {
      if (
        categoryNameLower.includes("spice") ||
        categoryNameLower.includes("masala")
      ) {
        // Return spice-specific HSN based on product name
        if (productNameLower.includes("cinnamon")) return "0906";
        if (productNameLower.includes("turmeric")) return "091030";
        if (productNameLower.includes("pepper")) return "0904";
        if (productNameLower.includes("cardamom")) return "0908";
        if (productNameLower.includes("clove")) return "0907";
        return "0906"; // Default for spices
      }
    }

    // Default HSN for spices and condiments
    return "0906";
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
          name: "Agro Nexis India Overseas Pvt. Ltd.",
          address: "Plot G29/1 Mehrauli, New Delhi - 110030",
          gstin: "07ABCCA5210G1Z6", // Replace with actual GSTIN
          email: "vijay@agronexis.com",
          phone: "+91-9582222963",
          website: "www.agronexis.com",
        },

        // Invoice Details (Rule 46 compliance)
        invoice: {
          number: `ANIOPL/${new Date().getFullYear()}-${(
            new Date().getFullYear() + 1
          )
            .toString()
            .slice(-2)}/${orderDetails.orderNumber}`,
          date: new Date().toLocaleDateString("en-IN"),
          dueDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("en-IN"),
          financialYear: `${new Date().getFullYear()}-${(
            new Date().getFullYear() + 1
          )
            .toString()
            .slice(-2)}`,
          orderNumber: orderDetails.orderNumber,
          orderDate: new Date(orderDetails.createdDate).toLocaleDateString(
            "en-IN",
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
              "Maharashtra",
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
                orderDetails.deliveryAddress.state || "Maharashtra",
              ),
            }
          : null,

        // Items with HSN/SAC codes (Rule 46 compliance)
        items: orderDetails.items.map((item, index) => ({
          slNo: index + 1,
          description: item.productName,
          hsnCode: getHSNCode(item.productName, "powdered spices"), //item.hsnCode,
          quantity: item.quantity,
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
              "Maharashtra",
          )})`,
        },

        // Payment Details
        payment: {
          method: orderDetails.paymentInfo.method,
          transactionId: orderDetails.paymentInfo.transactionId,
          paymentDate: new Date(
            orderDetails.paymentInfo.paymentDate,
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
        },
      );

      // First check if response is ok
      if (!response.ok) {
        // Try to parse error response in the new API format
        try {
          const errorData = await response.json();
          if (
            errorData &&
            typeof errorData === "object" &&
            "info" in errorData
          ) {
            // Handle the new API error format
            throw new Error(
              errorData.info.message ||
                `HTTP ${response.status}: ${response.statusText}`,
            );
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Check content type to determine how to handle the response
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Handle JSON response (new API format)
        const jsonResponse = await response.json();

        // Check if it's the new API response format
        if (
          jsonResponse &&
          typeof jsonResponse === "object" &&
          "info" in jsonResponse
        ) {
          if (!jsonResponse.info.isSuccess) {
            throw new Error(
              jsonResponse.info.message || "Failed to generate invoice",
            );
          }

          // Check if the response contains a PDF URL or base64 data
          if (jsonResponse.data && jsonResponse.data.pdfUrl) {
            // Open PDF URL in new window
            const newWindow = window.open(jsonResponse.data.pdfUrl, "_blank");
            if (!newWindow) {
              showError(
                "Popup blocked. Please allow popups for this site to view the invoice.",
              );
            } else {
              showSuccess("GST-compliant invoice opened in new window!");
            }
            return;
          } else if (
            jsonResponse.data &&
            (jsonResponse.data.pdfBase64 || jsonResponse.data.fileContents)
          ) {
            // Convert base64 to blob and open
            // Handle both pdfBase64 and fileContents fields
            const base64Data =
              jsonResponse.data.pdfBase64 || jsonResponse.data.fileContents;
            const fileName =
              jsonResponse.data.fileDownloadName ||
              `GST_Invoice_${invoiceData.invoice.number.replace(
                /\//g,
                "_",
              )}.pdf`;

            try {
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: "application/pdf" });
              const url = window.URL.createObjectURL(blob);

              const newWindow = window.open(url, "_blank");
              if (!newWindow) {
                // Fallback: download the file
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
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
              return;
            } catch {
              throw new Error(
                "Failed to decode PDF data. The file may be corrupted.",
              );
            }
          } else {
            throw new Error(
              "Invoice data not found in response. Please contact support.",
            );
          }
        }

        // Handle legacy JSON response format
        throw new Error(
          "Invoice service is currently unavailable. Please try again later.",
        );
      } else if (contentType && contentType.includes("application/pdf")) {
        // Handle PDF blob response (legacy format)
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
            "_",
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
      } else {
        throw new Error(
          `Unexpected response type: ${contentType}. Expected PDF or JSON.`,
        );
      }
    } catch (error) {
      console.error("Error generating GST invoice:", error);

      // Provide more specific error messages based on error type
      let errorMessage = "Failed to generate GST invoice. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("HTTP 401")) {
          errorMessage =
            "Authentication expired. Please log in again and try downloading the invoice.";
          // Optionally redirect to login
          // router.push("/login");
        } else if (error.message.includes("HTTP 403")) {
          errorMessage = "You don't have permission to access this invoice.";
        } else if (error.message.includes("HTTP 404")) {
          errorMessage =
            "Invoice not found. This order may not have an invoice available yet.";
        } else if (error.message.includes("HTTP 500")) {
          errorMessage =
            "Server error while generating invoice. Please try again in a few minutes.";
        } else if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Invoice generation failed: ${error.message}`;
        }
      }

      showError(errorMessage);
    }
  };

  const handleDownloadShipmentLabel = async () => {
    if (!orderDetails?.trackingNumber) {
      showError("Tracking number not available for this order");
      return;
    }

    try {
      // Show loading state
      showSuccess("Generating shipment label...");

      // Get access token
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        showError("Authentication token not found. Please log in again.");
        return;
      }

      // Call the existing shipment label API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Shipment/label/${orderDetails.trackingNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(`Shipment label API response status: ${response.status}`);

      if (!response.ok) {
        console.error(`API returned status: ${response.status}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the API response
      const apiResponse = await response.json();
      console.log("Shipment label API response:", apiResponse);

      // Check if the API call was successful
      if (apiResponse.info?.code === "200" && apiResponse.data) {
        console.log("Shipment label data received successfully");

        // Check if the response contains label data
        if (apiResponse.data.labelUrl) {
          // Open label URL in new window
          const newWindow = window.open(apiResponse.data.labelUrl, "_blank");
          if (!newWindow) {
            showError(
              "Popup blocked. Please allow popups for this site to view the label.",
            );
          } else {
            showSuccess("Shipment label opened in new window!");
          }
          return;
        } else if (
          apiResponse.data.labelBase64 ||
          apiResponse.data.fileContents
        ) {
          // Convert base64 to blob and open
          const base64Data =
            apiResponse.data.labelBase64 || apiResponse.data.fileContents;
          const fileName =
            apiResponse.data.fileName ||
            `Shipment_Label_${orderDetails.trackingNumber}.pdf`;

          try {
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const newWindow = window.open(url, "_blank");
            if (!newWindow) {
              // Fallback: download the file
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
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
            return;
          } catch {
            throw new Error(
              "Failed to decode label data. The file may be corrupted.",
            );
          }
        } else {
          throw new Error(
            "Label data not found in response. Please contact support.",
          );
        }
      } else {
        console.error("API returned non-success response:", apiResponse.info);
        showError("No shipment label available for this tracking number.");
        return;
      }
    } catch (error) {
      console.error("Error generating shipment label:", error);

      // Provide more specific error messages based on error type
      let errorMessage = "Failed to generate shipment label. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("HTTP 401")) {
          errorMessage =
            "Authentication expired. Please log in again and try downloading the label.";
        } else if (error.message.includes("HTTP 403")) {
          errorMessage =
            "You don't have permission to access this shipment label.";
        } else if (error.message.includes("HTTP 404")) {
          errorMessage =
            "Shipment label not found. This order may not have a label available yet.";
        } else if (error.message.includes("HTTP 500")) {
          errorMessage =
            "Server error while generating label. Please try again in a few minutes.";
        } else if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Label generation failed: ${error.message}`;
        }
      }

      showError(errorMessage);
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
      <Box sx={{ mb: 4, mt: 7 }}>
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
            {isAdmin() && (
              <Button
                variant="outlined"
                startIcon={<Label />}
                onClick={handleDownloadShipmentLabel}
                sx={{ display: { xs: "none", sm: "flex" } }}
                color="secondary"
              >
                Shipment Label
              </Button>
            )}
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
                      orderDetails.expectedDeliveryDate,
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
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadInvoice}
            sx={{ flex: 1, minWidth: "140px" }}
          >
            View Invoice
          </Button>
          {isAdmin() && (
            <Button
              variant="outlined"
              startIcon={<Label />}
              onClick={handleDownloadShipmentLabel}
              color="secondary"
              sx={{ flex: 1, minWidth: "140px" }}
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
                      orderDetails.expectedDeliveryDate,
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
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: "2px solid",
                      borderColor: "primary.main",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Typography variant="caption" color="primary.main">
                    Loading tracking data...
                  </Typography>
                </Box>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {trackingData && trackingData.SummaryTrack && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: "primary.50",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  color="primary.main"
                  sx={{ mb: 1 }}
                >
                  📦 Shipment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      AWB Number
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {trackingData.SummaryTrack.AWBNO}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Current Status
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color="primary.main"
                    >
                      {trackingData.SummaryTrack.CURRENT_STATUS}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Origin
                    </Typography>
                    <Typography variant="body2">
                      {trackingData.SummaryTrack.ORIGIN}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Destination
                    </Typography>
                    <Typography variant="body2">
                      {trackingData.SummaryTrack.DESTINATION}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* {trackingData &&
              trackingData.LstDetails &&
              trackingData.LstDetails.length > 0 &&
              !trackingData.SummaryTrack && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: "info.50",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="info.main"
                    sx={{ mb: 1 }}
                  >
                    📦 Tracking Events Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trackingData.LstDetails.length} tracking event(s) found for
                    this shipment.
                  </Typography>
                </Box>
              )} */}

            <Box sx={{ position: "relative" }}>
              {/* Continuous vertical line */}
              {/* {orderDetails.timeline.length > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "28px",
                    top: "24px",
                    bottom: "24px",
                    width: "2px",
                    backgroundColor: "grey.300",
                    zIndex: 1,
                  }}
                />
              )} */}

              {orderDetails.timeline.map((event, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    position: "relative",
                    py: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      borderRadius: 1,
                    },
                  }}
                >
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      width: index === 0 ? 16 : 12,
                      height: index === 0 ? 16 : 12,
                      borderRadius: "50%",
                      backgroundColor:
                        index === 0 ? "success.main" : "primary.main",
                      border: index === 0 ? "4px solid" : "3px solid",
                      borderColor: "background.paper",
                      boxShadow:
                        index === 0
                          ? "0 0 0 2px rgba(76, 175, 80, 0.3)"
                          : "0 0 0 1px rgba(0,0,0,0.1)",
                      position: "relative",
                      zIndex: 2,
                      mt: 0.5,
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* Content */}
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 0.5,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color={index === 0 ? "success.main" : "text.primary"}
                        sx={{ flex: 1, minWidth: "200px" }}
                      >
                        {event.status}
                      </Typography>
                      <Chip
                        label={(() => {
                          const formatted = formatDateTime(event.timestamp);
                          return typeof formatted === "object"
                            ? `${formatted.date} at ${formatted.time}`
                            : formatted;
                        })()}
                        size="small"
                        variant={index === 0 ? "filled" : "outlined"}
                        color={index === 0 ? "success" : "default"}
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: index === 0 ? 600 : 400,
                        }}
                      />
                    </Box>

                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: index === 0 ? 500 : 400,
                          color:
                            index === 0 ? "success.dark" : "text.secondary",
                        }}
                      >
                        {event.description}
                      </Typography>
                      {event.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocalShipping
                            sx={{
                              fontSize: 14,
                              color:
                                index === 0 ? "success.main" : "text.secondary",
                            }}
                          />
                          <Typography
                            variant="caption"
                            color={
                              index === 0 ? "success.main" : "text.secondary"
                            }
                            fontWeight="500"
                          >
                            📍 {event.location}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>

            {!trackingData &&
              orderDetails.trackingNumber &&
              orderDetails.trackingNumber.startsWith("DK") && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Real-time tracking will be available once your order is
                    shipped and assigned a tracking number.
                  </Typography>
                </Alert>
              )}
          </AccordionDetails>
        </Accordion>
      </Card>

      {/* Order Items and Summary */}
      <Card
        sx={{
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Standard Header */}
          <Box
            sx={{
              p: 3,
              backgroundColor: "background.default",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCart color="primary" />
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Order Items & Summary
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
              {/* First Column - Product Details */}
              <Grid size={{ xs: 12, lg: 8 }}>
                {orderDetails.items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 2,
                      mb: 2,
                      backgroundColor: "white",
                    }}
                  >
                    {/* Mobile Layout */}
                    <Box sx={{ display: { xs: "block", sm: "none" } }}>
                      {/* Mobile Header with Quantity and Title */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            flexShrink: 0,
                          }}
                        >
                          {item.quantity}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          sx={{ lineHeight: 1.3, flex: 1 }}
                        >
                          {item.productName}
                        </Typography>
                      </Box>

                      {/* Mobile Product Image and Basic Info */}
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Avatar
                          src={item.productImage}
                          variant="rounded"
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: "grey.100",
                            border: "1px solid",
                            borderColor: "divider",
                            flexShrink: 0,
                          }}
                        >
                          <Inventory2 sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack spacing={0.5} sx={{ mb: 1 }}>
                            <Chip
                              label={item.brandName}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                alignSelf: "flex-start",
                              }}
                            />
                            {item.weight && (
                              <Chip
                                label={item.weight}
                                size="small"
                                sx={{
                                  fontSize: "0.7rem",
                                  alignSelf: "flex-start",
                                }}
                              />
                            )}
                          </Stack>
                          {item.sku && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              SKU: {item.sku}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Mobile Price Information */}
                      <Box
                        sx={{
                          backgroundColor: "grey.50",
                          p: 1.5,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Unit Price:
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            {item.isDiscounted &&
                              item.discountAmount &&
                              item.discountAmount > 0 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {getCurrencySymbol(
                                    orderDetails.currency || "INR",
                                  )}
                                  {(item.price + item.discountAmount).toFixed(
                                    2,
                                  )}
                                </Typography>
                              )}
                            <Typography variant="body2" fontWeight="600">
                              {getCurrencySymbol(
                                orderDetails.currency || "INR",
                              )}
                              {item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            color="primary.main"
                          >
                            {getCurrencySymbol(orderDetails.currency || "INR")}
                            {item.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>

                        {item.isDiscounted &&
                          item.discountAmount &&
                          item.discountAmount > 0 && (
                            <Box
                              sx={{
                                mt: 1,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Chip
                                label={`You saved ${getCurrencySymbol(
                                  orderDetails.currency || "INR",
                                )}${(
                                  item.discountAmount * item.quantity
                                ).toFixed(2)}`}
                                size="small"
                                color="success"
                                sx={{ fontSize: "0.65rem" }}
                              />
                            </Box>
                          )}
                      </Box>
                    </Box>

                    {/* Desktop Layout */}
                    <Box
                      sx={{
                        display: { xs: "none", sm: "flex" },
                        gap: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Quantity Badge */}
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: "primary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.quantity}
                      </Box>

                      {/* Product Image */}
                      <Avatar
                        src={item.productImage}
                        variant="rounded"
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "grey.100",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Inventory2 sx={{ fontSize: 30 }} />
                      </Avatar>

                      {/* Product Details */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{ mb: 1 }}
                        >
                          {item.productName}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mb: 2 }}
                        >
                          <Chip
                            label={item.brandName}
                            size="small"
                            sx={{ fontSize: "0.75rem" }}
                          />
                          {item.weight && (
                            <Chip
                              label={item.weight}
                              size="small"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                          {item.sku && (
                            <Chip
                              label={`SKU: ${item.sku}`}
                              size="small"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                        </Stack>

                        {/* Price Information */}
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Unit Price:
                            </Typography>
                            <Typography variant="body1" fontWeight="600">
                              {getCurrencySymbol(
                                orderDetails.currency || "INR",
                              )}
                              {item.price.toFixed(2)}
                            </Typography>
                            {item.isDiscounted &&
                              item.discountAmount &&
                              item.discountAmount > 0 && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {getCurrencySymbol(
                                    orderDetails.currency || "INR",
                                  )}
                                  {(item.price + item.discountAmount).toFixed(
                                    2,
                                  )}
                                </Typography>
                              )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity}
                            </Typography>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography
                                variant="h6"
                                fontWeight="600"
                                color="primary.main"
                              >
                                {getCurrencySymbol(
                                  orderDetails.currency || "INR",
                                )}
                                {item.totalPrice.toFixed(2)}
                              </Typography>
                              {item.isDiscounted &&
                                item.discountAmount &&
                                item.discountAmount > 0 && (
                                  <Chip
                                    label={`You saved ${getCurrencySymbol(
                                      orderDetails.currency || "INR",
                                    )}${(
                                      item.discountAmount * item.quantity
                                    ).toFixed(2)}`}
                                    size="small"
                                    color="success"
                                    sx={{ fontSize: "0.7rem", mt: 0.5 }}
                                  />
                                )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Grid>

              {/* Second Column - Order Summary */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                    position: { xs: "static", lg: "sticky" },
                    top: 20,
                    backgroundColor: "white",
                    mt: { xs: 2, lg: 0 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <Receipt color="primary" />
                    <Typography variant="h6" fontWeight="600">
                      Order Summary
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Subtotal ({orderDetails.items.length} items)
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {getCurrencySymbol(orderDetails.currency || "INR")}
                        {orderDetails.subtotal}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Shipping & Handling
                      </Typography>
                      {orderDetails.shippingCharges === 0 ? (
                        <Chip
                          label="FREE"
                          size="small"
                          color="success"
                          sx={{ fontWeight: "bold" }}
                        />
                      ) : (
                        <Typography variant="body1" fontWeight="600">
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {orderDetails.shippingCharges}
                        </Typography>
                      )}
                    </Box>

                    {orderDetails.discount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Discount Applied
                        </Typography>
                        <Typography
                          variant="body1"
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
                      <Typography variant="body2" color="text.secondary">
                        Tax & Fees
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {getCurrencySymbol(orderDetails.currency || "INR")}
                        {orderDetails.tax}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        border: "1px solid",
                        borderColor: "primary.main",
                        borderRadius: 1,
                        backgroundColor: "primary.50",
                      }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        Order Total
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
                          p: 2,
                          backgroundColor: "success.main",
                          borderRadius: 1,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Savings />
                        <Typography variant="body2" fontWeight="600">
                          You saved{" "}
                          {getCurrencySymbol(orderDetails.currency || "INR")}
                          {orderDetails.discount.toFixed(2)} on this order!
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
                          "Tracking number",
                        )
                      }
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
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
                          "Transaction ID",
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
                        orderDetails.paymentInfo.paymentDate,
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
