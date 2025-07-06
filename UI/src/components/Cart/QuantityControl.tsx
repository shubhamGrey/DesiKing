"use client";
import React from "react";
import { Button, Typography, Box, useMediaQuery } from "@mui/material";
import theme from "@/styles/theme";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  itemName: string;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  itemName,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={isMobile ? 0 : 1}
      sx={{ m: 0, pb: 1 }}
    >
      <Button
        onClick={onDecrease}
        aria-label={`Decrease quantity of ${itemName}`}
        disabled={quantity <= 1}
        variant="outlined"
        sx={{
          minWidth: isMobile ? "20px" : "32px",
          height: isMobile ? "20px" : "32px",
          borderRadius: "50%",
          padding: 0,
          fontSize: isMobile ? "12px" : "16px",
          opacity: quantity > 1 ? 1 : 0.5,
        }}
      >
        −
      </Button>
      <Typography
        aria-label={`Quantity: ${quantity}`}
        sx={{
          fontSize: isMobile ? "12px" : "16px",
          fontWeight: 500,
          minWidth: "24px",
          textAlign: "center",
        }}
      >
        {quantity}
      </Typography>
      <Button
        onClick={onIncrease}
        aria-label={`Increase quantity of ${itemName}`}
        variant="outlined"
        sx={{
          minWidth: isMobile ? "20px" : "32px",
          height: isMobile ? "20px" : "32px",
          borderRadius: "50%",
          padding: 0,
          fontSize: isMobile ? "12px" : "16px",
        }}
      >
        +
      </Button>
    </Box>
  );
};
