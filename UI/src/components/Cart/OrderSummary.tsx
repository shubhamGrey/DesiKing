"use client";
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  onApplyPromoCode: (code: string) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  total,
  onApplyPromoCode,
}) => {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    onApplyPromoCode(promoCode);
  };

  const handlePromoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPromoCode(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        borderRadius: 2,
        p: 4,
        height: "fit-content",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        color="primary.contrastText"
        mb={3}
      >
        Promo code
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          color: "primary.main",
          padding: "10px 12px",
          borderRadius: "50px",
          backgroundColor: "primary.contrastText",
          height: "40px",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type here..."
          value={promoCode}
          onChange={handlePromoInputChange}
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
        <Button
          onClick={handleApplyPromo}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: "500",
            color: "primary.contrastText",
            backgroundColor: "primary.main",
            borderRadius: "50px",
            width: "50%",
          }}
        >
          Apply
        </Button>
      </Box>

      <Divider sx={{ mb: 3, borderColor: "primary.contrastText" }} />

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="primary.contrastText">
          Subtotal
        </Typography>
        <Typography variant="body2" color="primary.contrastText">
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="primary.contrastText">
          Discount
        </Typography>
        <Typography variant="body2" color="primary.contrastText">
          -${discount.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ my: 3, borderColor: "primary.contrastText" }} />

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="600" color="primary.contrastText">
          Total
        </Typography>
        <Typography variant="h6" fontWeight="600" color="primary.contrastText">
          ${total.toFixed(2)}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          textTransform: "none",
          fontWeight: "500",
          py: 2,
          color: "primary.main",
          backgroundColor: "primary.contrastText",
          borderRadius: 2,
        }}
      >
        Continue to checkout
      </Button>
    </Box>
  );
};
