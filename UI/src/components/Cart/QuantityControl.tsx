"use client";
import React from "react";

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
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        onClick={onDecrease}
        aria-label={`Decrease quantity of ${itemName}`}
        disabled={quantity <= 1}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid #cccccc", // Updated border color
          backgroundColor: "white",
          cursor: quantity > 1 ? "pointer" : "not-allowed",
          fontSize: "16px",
          color: "#555555", // Updated text color
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: quantity > 1 ? 1 : 0.5,
        }}
      >
        −
      </button>
      <span
        aria-label={`Quantity: ${quantity}`}
        style={{
          fontSize: "16px",
          fontWeight: "500",
          minWidth: "24px",
          textAlign: "center",
        }}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        aria-label={`Increase quantity of ${itemName}`}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid #cccccc", // Updated border color
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555555", // Updated text color
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>
  );
};
