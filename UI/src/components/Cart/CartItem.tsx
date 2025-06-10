"use client";
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { QuantityControl } from "./QuantityControl";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartItemProps {
  id: number;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  color,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleIncrease = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const totalPrice = (price * quantity).toFixed(2);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr auto",
        gap: 2,
        alignItems: "center",
        padding: 2,
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: "12px",
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            backgroundColor: "#f9f9f9", // Updated background color
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontSize: 16, fontWeight: 600, color: "#555555" }}
          >
            {" "}
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888" }}>
            {" "}
            {color}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <QuantityControl
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          itemName={name}
        />
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
          ${totalPrice}
        </Typography>
      </Box>

      <IconButton
        onClick={handleRemove}
        aria-label={`Remove ${name} from cart`}
        sx={{ color: "secondary.main" }} // Updated remove button color
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
