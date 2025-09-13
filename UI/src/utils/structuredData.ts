import { Product } from "@/types/product";

export const generateProductStructuredData = (
  product: Product,
  baseUrl: string = ""
) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription || product.description,
    image: product.imageUrls?.map((url) => `${baseUrl}${url}`) || [],
    brand: {
      "@type": "Brand",
      name: "DesiKing",
    },
    manufacturer: {
      "@type": "Organization",
      name: "DesiKing",
    },
    offers:
      product.pricesAndSkus?.length > 0
        ? {
            "@type": "AggregateOffer",
            lowPrice: Math.min(...product.pricesAndSkus.map((p) => p.price)),
            highPrice: Math.max(...product.pricesAndSkus.map((p) => p.price)),
            priceCurrency: product.pricesAndSkus[0]?.currencyCode || "INR",
            availability: product.isActive
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${baseUrl}/product/${product.id}`,
          }
        : undefined,
    category: product.categoryName,
    additionalProperty: [
      ...(product.keyFeatures || []).map((feature: string) => ({
        "@type": "PropertyValue",
        name: "Feature",
        value: feature,
      })),
      ...(product.certifications || []).map((cert: string) => ({
        "@type": "PropertyValue",
        name: "Certification",
        value: cert,
      })),
      ...(product.origin
        ? [
            {
              "@type": "PropertyValue",
              name: "Origin",
              value: product.origin,
            },
          ]
        : []),
      ...(product.shelfLife
        ? [
            {
              "@type": "PropertyValue",
              name: "Shelf Life",
              value: product.shelfLife,
            },
          ]
        : []),
    ].filter(Boolean),
    mpn: product.id,
    sku: product.pricesAndSkus?.[0]?.skuNumber || product.id,
  };
};

export const generateBreadcrumbStructuredData = (
  breadcrumbs: Array<{ name: string; url: string }>,
  baseUrl: string = ""
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
};

export const generateOrganizationStructuredData = (baseUrl: string = "") => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DesiKing",
    description:
      "Premium quality spices and organic products. Authentic flavors, guaranteed freshness, and exceptional quality.",
    url: baseUrl,
    logo: `${baseUrl}/DesiKing.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      // Add social media links here when available
    ],
  };
};
