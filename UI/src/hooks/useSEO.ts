import { usePathname } from "next/navigation";
import { Product } from "@/types/product";

interface UseSEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "product";
  product?: Product;
  noindex?: boolean;
}

export const useSEO = (options: UseSEOOptions = {}) => {
  const pathname = usePathname();
  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname}`
      : undefined;

  return {
    ...options,
    url: currentUrl,
  };
};

// Helper function to generate page-specific SEO data
export const getPageSEO = (page: string) => {
  const seoData: Record<string, UseSEOOptions> = {
    home: {
      title: "DesiKing - Premium Quality Spices & Organic Products",
      description:
        "Discover premium quality spices and organic products at DesiKing. Authentic flavors, guaranteed freshness, and exceptional quality delivered to your doorstep.",
      keywords: [
        "spices",
        "organic",
        "premium",
        "authentic",
        "fresh",
        "DesiKing",
        "Indian spices",
        "garam masala",
        "turmeric",
        "chili powder",
      ],
    },
    products: {
      title: "Our Products | DesiKing - Premium Spices Collection",
      description:
        "Explore our extensive collection of premium spices and organic products. From traditional garam masala to exotic whole spices, find authentic flavors at DesiKing.",
      keywords: [
        "spice collection",
        "premium spices",
        "organic products",
        "whole spices",
        "ground spices",
        "masala",
        "DesiKing",
      ],
    },
    about: {
      title: "About Us | DesiKing - Our Story & Mission",
      description:
        "Learn about DesiKing's journey in delivering premium quality spices. Our commitment to authenticity, freshness, and customer satisfaction.",
      keywords: [
        "about DesiKing",
        "spice company",
        "premium quality",
        "authentic spices",
        "company story",
      ],
    },
    contact: {
      title: "Contact Us | DesiKing - Get In Touch",
      description:
        "Get in touch with DesiKing for any queries about our premium spices and products. We're here to help you with your culinary journey.",
      keywords: [
        "contact DesiKing",
        "customer support",
        "spice inquiry",
        "get in touch",
      ],
    },
    cart: {
      title: "Shopping Cart | DesiKing",
      description:
        "Review your selected premium spices and products before checkout. Secure shopping experience at DesiKing.",
      keywords: [
        "shopping cart",
        "checkout",
        "spice purchase",
        "DesiKing cart",
      ],
      noindex: true,
    },
    checkout: {
      title: "Checkout | DesiKing",
      description:
        "Complete your purchase of premium spices securely at DesiKing. Fast and reliable delivery guaranteed.",
      keywords: [
        "checkout",
        "secure payment",
        "spice delivery",
        "DesiKing purchase",
      ],
      noindex: true,
    },
    profile: {
      title: "My Profile | DesiKing",
      description:
        "Manage your DesiKing account, view order history, and update your preferences.",
      keywords: [
        "user profile",
        "account",
        "order history",
        "DesiKing account",
      ],
      noindex: true,
    },
  };

  return (
    seoData[page] || {
      title: "DesiKing - Premium Quality Spices",
      description:
        "Discover premium quality spices and organic products at DesiKing.",
      keywords: ["spices", "organic", "premium", "DesiKing"],
    }
  );
};
