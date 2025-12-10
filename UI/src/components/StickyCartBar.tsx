"use client";

import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import theme from "@/styles/theme";

interface StickyCartBarProps {
  price: number;
  onAddToCart: () => void;
  currencySymbol?: string;
}

const StickyCartBar = ({ price, onAddToCart, currencySymbol = "₹" }: StickyCartBarProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
        borderTop: "2px solid",
        borderColor: "primary.main",
      }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          Price
        </Typography>
        <Typography variant="h5" color="primary.main" fontWeight={700}>
          {currencySymbol}{price.toFixed(2)}
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="large"
        startIcon={<ShoppingCartOutlined />}
        onClick={onAddToCart}
        sx={{
          minWidth: "160px",
          minHeight: "48px", // Touch-friendly height
          fontSize: "1rem",
          fontWeight: 700,
          borderRadius: "10px",
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        Add to Cart
      </Button>
    </Box>
  );
};

export default StickyCartBar;
