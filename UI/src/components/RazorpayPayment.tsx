"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import { PaymentFormData, RazorpayPaymentData } from "@/types/razorpay";
import {
  initializeRazorpayPayment,
  formatAmountForRazorpay,
} from "@/utils/razorpayUtils";
import { michroma } from "@/styles/fonts";

interface RazorpayPaymentProps {
  open: boolean;
  onClose: () => void;
  orderAmount: number;
  orderId: string;
  formData: PaymentFormData;
  onPaymentSuccess: (paymentData: RazorpayPaymentData) => void;
  onPaymentError: (error: string) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  open,
  onClose,
  orderAmount,
  orderId,
  formData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError("");

      const orderData = {
        id: orderId,
        amount: formatAmountForRazorpay(orderAmount),
        currency: "INR",
      };

      await initializeRazorpayPayment(
        orderData,
        formData,
        (paymentData: RazorpayPaymentData) => {
          setIsProcessing(false);
          onPaymentSuccess(paymentData);
          onClose();
        },
        (error: any) => {
          setIsProcessing(false);
          const errorMessage =
            error?.message ?? "Payment failed. Please try again.";
          setError(errorMessage);
          onPaymentError(errorMessage);
        }
      );
    } catch (error: any) {
      setIsProcessing(false);
      const errorMessage =
        error?.message ?? "Failed to initialize payment. Please try again.";
      setError(errorMessage);
      onPaymentError(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            boxShadow: "none",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "8px",
            p: 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: michroma.style.fontFamily,
          fontWeight: 600,
          color: "primary.main",
          fontSize: "1.25rem",
          mb: 2,
        }}
      >
        Complete Payment
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 0 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Review your order details:
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 3,
              backgroundColor: "grey.50",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Order Amount:
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                ₹{orderAmount.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                Total:
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color="primary.main"
                fontFamily={michroma.style.fontFamily}
              >
                ₹{orderAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Billing Information:
          </Typography>
          <Box sx={{ pl: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Name:</strong> {formData.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Email:</strong> {formData.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Mobile:</strong> {formData.mobile}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong> {formData.address}, {formData.city},{" "}
              {formData.state} - {formData.zipCode}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: "info.50",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "info.200",
          }}
        >
          <Typography variant="body2" color="info.main">
            🔒 You will be redirected to Razorpay secure payment gateway to
            complete your transaction.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={isProcessing}
          variant="outlined"
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              borderColor: "secondary.main",
              color: "secondary.main",
            },
            minWidth: 100,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          disabled={isProcessing}
          startIcon={
            isProcessing ? (
              <Skeleton
                variant="circular"
                width={16}
                height={16}
                animation="pulse"
              />
            ) : null
          }
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "secondary.main" },
            minWidth: 140,
            fontWeight: 600,
          }}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RazorpayPayment;
