"use client";
import React, { useState } from "react";
import { CartItem } from "../../components/Cart/CartItem";
import { OrderSummary } from "../../components/Cart/OrderSummary";
import { Box, Button, Typography, Stack, useMediaQuery } from "@mui/material";
import { michroma } from "@/app/layout";
import theme from "@/styles/theme";
import RecommendationsAndWishlist from "@/components/Cart/RecommendationsAndWishlist";

interface CartItemType {
  id: number;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      id: 1,
      name: "Apple AirPods Pro",
      color: "White",
      price: 249.99,
      quantity: 1,
      image:
        "https://images.pexels.com/photos/4812923/pexels-photo-4812923.jpeg",
    },
    {
      id: 2,
      name: "Apple AirPods Max",
      color: "Silver",
      price: 549.99,
      quantity: 1,
      image:
        "https://images.pexels.com/photos/4812923/pexels-photo-4812923.jpeg",
    },
    {
      id: 3,
      name: "Apple HomePod mini",
      color: "Silver",
      price: 99.99,
      quantity: 1,
      image:
        "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    },
  ]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [discount, setDiscount] = useState(0);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyPromoCode = (promoCode: string) => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal() * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const total = () => {
    return subtotal() - discount;
  };

  const itemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          padding: "40px 24px",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 400px" },
          gap: { xs: "32px", md: "48px" },
          mt: 3,
        }}
      >
        <Box
          sx={{
            boxShadow: "none",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction={"row"} spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  color="primary.main"
                  fontFamily={michroma.style.fontFamily}
                  fontWeight={600}
                >
                  Cart{" "}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    ml: "16px !important",
                    mt: "16px !important",
                  }}
                >
                  ({itemCount()} products)
                </Typography>
              </Stack>
              <Button variant="text" color="secondary" onClick={clearCart}>
                Clear cart
              </Button>
            </Box>

            {!isMobile && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: "24px",
                  padding: "8px 0",
                  borderBottom: "1px solid #e9ecef",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#888888", // Updated color
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Typography variant="body1" color="primary.main">
                  Product
                </Typography>
                <Typography variant="body1" color="primary.main" align="center">
                  Count
                </Typography>
                <Typography variant="body1" color="primary.main" align="center">
                  Price
                </Typography>
              </Box>
            )}

            <Box role="list" sx={{ display: "flex", flexDirection: "column" }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  color={item.color}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <OrderSummary
          subtotal={subtotal()}
          discount={discount}
          total={total()}
          onApplyPromoCode={applyPromoCode}
        />
      </Box>
      <RecommendationsAndWishlist />
    </Box>
  );
};

export default Cart;
