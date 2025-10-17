"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import type { EnhancedCartItem } from "@/contexts/CartContext";

export const useEnhancedCart = () => {
  const { items, getEnhancedItems, ...cartContext } = useCart();
  const [enhancedItems, setEnhancedItems] = useState<EnhancedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnhancedItems = async () => {
      if (items.length === 0) {
        setEnhancedItems([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const enhanced = await getEnhancedItems();
        setEnhancedItems(enhanced);
      } catch (err) {
        console.error("❌ Error loading enhanced cart items:", err);
        setError("Failed to load product details");
        // Fallback to basic cart items
        setEnhancedItems(
          items.map((item) => ({
            ...item,
            productDetails: {
              name: item.name,
              description: "",
              imageUrls: [item.image],
              thumbnailUrl: item.image,
              pricesAndSkus: [],
              categoryName: "",
              brandName: "",
              ingredients: "",
              nutritionalInfo: "",
              keyFeatures: [],
              uses: [],
              origin: "",
              shelfLife: "",
              storageInstructions: "",
              certifications: [],
            },
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEnhancedItems();
  }, [items, getEnhancedItems]);

  // Calculate total from enhanced items when available
  const enhancedTotal =
    enhancedItems.length > 0
      ? enhancedItems.reduce((total, item) => {
          const pricing = item.productDetails?.pricesAndSkus?.[0];
          // Use discounted price if available, otherwise use original price
          const price =
            pricing?.isDiscounted && pricing?.discountedAmount
              ? pricing.discountedAmount
              : pricing?.price || item.price || 0;
          return total + price * item.quantity;
        }, 0)
      : cartContext.total;

  return {
    ...cartContext,
    items,
    enhancedItems,
    total: enhancedTotal,
    isLoading,
    error,
    refreshEnhancedItems: async () => {
      const enhanced = await getEnhancedItems();
      setEnhancedItems(enhanced);
    },
  };
};
