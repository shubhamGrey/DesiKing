"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { NavigateNext, Search as SearchIcon } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";
import theme from "@/styles/theme";
import { michroma } from "@/styles/fonts";

interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  categoryName: string;
  manufacturingDate: string;
  createdDate: string;
  modifiedDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle: string;
  metaDescription: string;
  imageUrls: string[];
  keyFeatures: string[];
  uses: string[];
  origin: string;
  shelfLife: string;
  storageInstructions: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  ingredients: string;
  nutritionalInfo: string;
  thumbnailUrl?: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams?.get("q");
    if (query) {
      setSearchQuery(query);
      searchProducts(query);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: Product[] = await response.json();

      // Filter products based on search query
      const filteredProducts = data.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          product.keyFeatures.some((feature) =>
            feature.toLowerCase().includes(query.toLowerCase())
          ) ||
          product.uses.some((use) =>
            use.toLowerCase().includes(query.toLowerCase())
          )
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            component={NextLink}
            underline="hover"
            color="inherit"
            href="/"
            sx={{ fontFamily: michroma.style.fontFamily }}
          >
            Home
          </Link>
          <Typography
            color="text.primary"
            sx={{ fontFamily: michroma.style.fontFamily }}
          >
            Search Results
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2,
            textAlign: "center",
            mb: 4,
          }}
        >
          <SearchIcon sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontFamily: michroma.style.fontFamily,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Search Results
          </Typography>
          {searchQuery && (
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{ opacity: 0.9 }}
            >
              Showing results for &quot;{searchQuery}&quot;
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Search Results */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
            gap: 3,
          }}
        >
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="text" width={200} height={30} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      ) : (
        <Box>
          {/* Results Count */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: michroma.style.fontFamily,
              mb: 3,
              color: "text.secondary",
            }}
          >
            {(() => {
              if (products.length > 0) {
                const plural = products.length !== 1 ? "s" : "";
                return `Found ${products.length} product${plural}`;
              }
              return "No products found";
            })()}
          </Typography>

          {products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardMedia
                      sx={{
                        height: 200,
                        position: "relative",
                        backgroundColor: "grey.100",
                      }}
                    >
                      {product.thumbnailUrl ?? product.imageUrls[0] ? (
                        <Image
                          src={product.thumbnailUrl ?? product.imageUrls[0]}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "grey.200",
                          }}
                        >
                          <Typography color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      {product.isPremium && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "secondary.main",
                            color: "white",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          PREMIUM
                        </Box>
                      )}
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontFamily: michroma.style.fontFamily,
                          fontSize: "1rem",
                          fontWeight: 600,
                          mb: 1,
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {product.categoryName}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          fontFamily: michroma.style.fontFamily,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            renderNoResultsContent()
          )}
        </Box>
      )}
    </Container>
  );

  function renderNoResultsContent() {
    if (searchQuery) {
      // No Results Found
      return (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "grey.50",
          }}
        >
          <SearchIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: michroma.style.fontFamily,
              mb: 2,
              color: "text.secondary",
            }}
          >
            No Products Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn&apos;t find any products matching &quot;{searchQuery}
            &quot;. Try searching with different keywords or browse our
            categories.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/products")}
            sx={{
              fontFamily: michroma.style.fontFamily,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Browse All Products
          </Button>
        </Paper>
      );
    }

    // No Search Query
    return (
      <Paper
        elevation={1}
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "grey.50",
        }}
      >
        <SearchIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
        <Typography
          variant="h5"
          sx={{
            fontFamily: michroma.style.fontFamily,
            mb: 2,
            color: "text.secondary",
          }}
        >
          Enter a Search Term
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Use the search bar in the header to find products by name,
          description, or category.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/products")}
          sx={{
            fontFamily: michroma.style.fontFamily,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Browse All Products
        </Button>
      </Paper>
    );
  }
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
              gap: 3,
            }}
          >
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton variant="rectangular" width={300} height={40} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
        </Container>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
