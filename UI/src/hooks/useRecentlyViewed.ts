import { useCallback } from "react";

const STORAGE_KEY = "desikingRecentlyViewed";
const MAX_ITEMS = 8;

interface RecentProduct {
  id: string;
  name: string;
  thumbnailUrl?: string;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const getRecentlyViewed = useCallback((): RecentProduct[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const trackView = useCallback((product: Omit<RecentProduct, "viewedAt">) => {
    if (typeof window === "undefined") return;
    try {
      const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
      const updated = [{ ...product, viewedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, [getRecentlyViewed]);

  return { getRecentlyViewed, trackView };
}
