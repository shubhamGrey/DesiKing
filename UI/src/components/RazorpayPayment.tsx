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
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { PaymentFormData, RazorpayPaymentData } from "@/types/razorpay";
import {
  initializeRazorpayPayment,
  formatAmountForRazorpay,
} from "@/utils/razorpayUtils";

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
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Complete Payment
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Review your order details:
          </Typography>

          <Box
            sx={{ mt: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Order Amount:</Typography>
              <Typography variant="body2" fontWeight={600}>
                ₹{orderAmount.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight={600}>
                Total:
              </Typography>
              <Typography variant="body1" fontWeight={600} color="primary.main">
                ₹{orderAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Billing Information:
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {formData.name}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {formData.email}
          </Typography>
          <Typography variant="body2">
            <strong>Mobile:</strong> {formData.mobile}
          </Typography>
          <Typography variant="body2">
            <strong>Address:</strong> {formData.address}, {formData.city},{" "}
            {formData.state} - {formData.zipCode}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to Razorpay secure payment gateway to
            complete your transaction.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={isProcessing} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={16} /> : null}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "secondary.main" },
            minWidth: 120,
          }}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RazorpayPayment;
