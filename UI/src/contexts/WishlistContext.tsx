"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { isLoggedIn } from "@/utils/auth";
import Cookies from "js-cookie";

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  thumbnailUrl?: string;
  price: number;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const refreshWishlist = useCallback(async () => {
    if (!isLoggedIn()) { setItems([]); return; }
    setIsLoading(true);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${apiUrl}/Wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.info?.isSuccess) setItems(json.data || []);
    } catch {}
    setIsLoading(false);
  }, [apiUrl]);

  useEffect(() => { refreshWishlist(); }, [refreshWishlist]);

  const isInWishlist = (productId: string) =>
    items.some((item) => item.productId === productId);

  const addToWishlist = async (productId: string) => {
    const token = Cookies.get("access_token");
    await fetch(`${apiUrl}/Wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    await refreshWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    const token = Cookies.get("access_token");
    await fetch(`${apiUrl}/Wishlist/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await refreshWishlist();
  };

  return (
    <WishlistContext.Provider value={{ items, isLoading, isInWishlist, addToWishlist, removeFromWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
