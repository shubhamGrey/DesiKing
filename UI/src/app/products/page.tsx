import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Our Products | DesiKing - Premium Spices Collection",
  description:
    "Explore our extensive collection of premium spices and organic products. From traditional garam masala to exotic whole spices, find authentic flavors at DesiKing.",
  keywords:
    "spice collection, premium spices, organic products, whole spices, ground spices, masala, DesiKing, authentic spices, Indian spices",
  openGraph: {
    title: "Our Products | DesiKing - Premium Spices Collection",
    description:
      "Explore our extensive collection of premium spices and organic products. From traditional garam masala to exotic whole spices, find authentic flavors at DesiKing.",
    images: [
      {
        url: "/DesiKing.png",
        width: 1200,
        height: 630,
        alt: "DesiKing Premium Spices Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Products | DesiKing - Premium Spices Collection",
    description:
      "Explore our extensive collection of premium spices and organic products. From traditional garam masala to exotic whole spices, find authentic flavors at DesiKing.",
    images: ["/DesiKing.png"],
  },
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
