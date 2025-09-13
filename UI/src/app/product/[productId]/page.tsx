import { Metadata } from "next";
import { Product } from "@/types/product";
import ProductDetailsClient from "./ProductDetailsClient";
import { fetchProductById } from "@/utils/apiHelpers";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;

  try {
    console.log("Fetching metadata for product:", productId);

    const product: Product = await fetchProductById(productId);

    console.log("Product metadata fetched:", {
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      name: product.name,
    });

    return {
      title: product.metaTitle || `${product.name} | DesiKing`,
      description: product.metaDescription || product.description,
      openGraph: {
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description,
        images: product.imageUrls?.[0]
          ? [
              {
                url: product.imageUrls[0],
                width: 1200,
                height: 630,
                alt: product.name,
              },
            ]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description,
        images: product.imageUrls?.[0] ? [product.imageUrls[0]] : [],
      },
      keywords: [
        product.name,
        ...(product.keyFeatures || []),
        ...(product.certifications || []),
        "spices",
        "organic",
        "premium",
        "DesiKing",
      ].join(", "),
    };
  } catch (error) {
    console.error("Error generating metadata for product:", productId, error);

    // Return fallback metadata with the productId for debugging
    return {
      title: `Product ${productId} | DesiKing`,
      description:
        "Discover premium quality spices and products at DesiKing. Authentic flavors, guaranteed freshness, and exceptional quality.",
      keywords:
        "spices, organic, premium, DesiKing, authentic spices, Indian spices",
      openGraph: {
        title: `Product | DesiKing`,
        description:
          "Discover premium quality spices and products at DesiKing.",
        images: [
          {
            url: "/DesiKing.png",
            width: 1200,
            height: 630,
            alt: "DesiKing Premium Spices",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Product | DesiKing",
        description:
          "Discover premium quality spices and products at DesiKing.",
        images: ["/DesiKing.png"],
      },
    };
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <ProductDetailsClient productId={productId} />;
}
