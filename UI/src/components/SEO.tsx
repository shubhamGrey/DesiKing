import Head from "next/head";
import { Product } from "@/types/product";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  product?: Product;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "DesiKing - Premium Quality Spices",
  description = "Discover premium quality spices and organic products at DesiKing. Authentic flavors, guaranteed freshness, and exceptional quality.",
  keywords = ["spices", "organic", "premium", "authentic", "fresh", "DesiKing"],
  image = "/DesiKing.png",
  url,
  type = "website",
  product,
  noindex = false,
}) => {
  // If product is provided, use its SEO data
  const finalTitle = product?.metaTitle || title;
  const finalDescription = product?.metaDescription || description;
  const finalImage = product?.imageUrls?.[0] || image;
  const finalKeywords = product
    ? [
        product.name,
        ...(product.keyFeatures || []),
        ...(product.certifications || []),
        ...keywords,
      ]
    : keywords;

  const structuredData = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        description: finalDescription,
        image: finalImage,
        brand: {
          "@type": "Brand",
          name: "DesiKing",
        },
        offers:
          product.pricesAndSkus?.length > 0
            ? {
                "@type": "AggregateOffer",
                lowPrice: Math.min(
                  ...product.pricesAndSkus.map((p) => p.price)
                ),
                highPrice: Math.max(
                  ...product.pricesAndSkus.map((p) => p.price)
                ),
                priceCurrency: product.pricesAndSkus[0]?.currencyCode || "INR",
                availability: "https://schema.org/InStock",
              }
            : undefined,
        additionalProperty: [
          ...(product.keyFeatures || []).map((feature) => ({
            "@type": "PropertyValue",
            name: "Feature",
            value: feature,
          })),
          ...(product.certifications || []).map((cert) => ({
            "@type": "PropertyValue",
            name: "Certification",
            value: cert,
          })),
        ],
      }
    : null;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(", ")} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content="DesiKing" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="DesiKing" />
      <link rel="canonical" href={url} />

      {/* Structured Data for Products */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/DesiKing.png" />
    </Head>
  );
};

export default SEO;
