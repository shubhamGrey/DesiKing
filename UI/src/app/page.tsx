"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Skeleton,
  Tooltip,
  IconButton,
} from "@mui/material";
import AchievementsCard from "@/components/AchievementsCard";
import {
  Diversity1,
  Public,
  WorkspacePremium,
  HandshakeOutlined,
  HealthAndSafetyOutlined,
  SoupKitchenOutlined,
  Add,
  Remove,
} from "@mui/icons-material";
import ChooseUs from "@/components/ChooseUs";
import { michroma } from "@/styles/fonts";
import Testimonials from "@/components/Testimonials";
import CertificateScroll from "@/components/CertificateScroll";
import Chef from "../../public/Chef.jpg";
import Cook from "../../public/Home Cook.jpg";
import Blogger from "../../public/Food Blogger.jpg";
import theme from "@/styles/theme";
import AllProducts from "@/components/AllProducts";
import { useRouter } from "next/navigation";
import HomeGrid from "@/components/HomeGrid";
import Image from "next/image";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useCart } from "@/contexts/CartContext";
import Cookies from "js-cookie";
import { Category, FormattedCategory, Product } from "@/types/product";
import { usePageTracking } from "@/hooks/useAnalytics";
import { getCurrencySymbol } from "@/utils/currencyUtils";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string | undefined | null): boolean => {
  if (!imageSrc) return false;
  return imageSrc.includes("cloud.agronexis.com");
};

// Interface for featured products UI display
interface FeaturedProduct {
  id: string;
  title: string;
  imageUrls: string[];
  description: string;
  pricesAndSkus: Array<{
    id: string;
    price: number;
    discountedAmount?: number;
    weightValue?: number;
    weightUnit?: string;
    skuNumber: string;
    currencyCode?: string;
  }>;
  brandId: string;
}

const achievements = [
  {
    value: "500+",
    name: "Happy Customers",
    icon: <Diversity1 fontSize="large" />,
    description:
      "Serving smiles across homes and kitchens with every pack of spice we deliver.",
  },
  {
    value: "4+",
    name: "Countries served",
    icon: <Public fontSize="large" />,
    description:
      "Taking the taste of India to plates across the globe with trusted international patnerships.",
  },
  {
    value: "3+",
    name: "Years of excellence",
    icon: <WorkspacePremium fontSize="large" />,
    description:
      "From farm to fork - thousands of kilos of flavourful spices delivered with care and quality.",
  },
];

const testimonialData = [
  {
    image: Cook,
    name: "Anjali Sharma",
    review:
      "The spices from this company are simply amazing! The quality is top-notch and the flavors are authentic. I love using them in my cooking.",
    occupation: "Home Cook",
  },
  {
    image: Chef,
    name: "Raj Patel",
    review:
      "I have been using their spices for years and they never disappoint. The freshness and aroma are unbeatable. Highly recommend!",
    occupation: "Professional Chef",
  },
  {
    image: Blogger,
    name: "Priya Mehta",
    review:
      "These spices have transformed my dishes! They add a depth of flavor that I haven't found anywhere else. Will definitely be a repeat customer.",
    occupation: "Food Blogger",
  },
];

const chooseUs = [
  {
    name: "Uncompromised Purity",
    icon: <HandshakeOutlined fontSize="large" />,
    description:
      "We source only the finest raw spices, ensuring that every product is free from additives, fillers and artificial colors.",
  },
  {
    name: "Hygenic Processing",
    icon: <HealthAndSafetyOutlined fontSize="large" />,
    description:
      "Our state-of-the-art processing facilities adhere to the highest hygiene standards and safety protocols, ensuring that every spice is safe and healthy.",
  },
  {
    name: "Bold, Authentic Flavors",
    icon: <SoupKitchenOutlined fontSize="large" />,
    description:
      "Each spice is carefully selected and processed to retain its natural oils and flavors, delivering an authentic taste experience that transports you to the heart of Indian cuisine.",
  },
  {
    name: "Global Reach, Local Trust",
    icon: <Public fontSize="large" />,
    description:
      "We serve both domestic and international markets, offering world-class products rooted in Indian tradition.",
  },
];

// Featured products will be loaded from API

const Home: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { addItem } = useCart();

  // Analytics hooks
  usePageTracking(); // Automatically track page views
  // Note: Global click tracking is handled by GlobalClickTracker component

  const [productCategories, setProductCategories] = React.useState<
    FormattedCategory[]
  >([]);

  const [upcomingpProductCategories, setUpcomingpProductCategories] =
    React.useState<FormattedCategory[]>([]);

  const [featuredProducts, setFeaturedProducts] = React.useState<
    FeaturedProduct[]
  >([]);

  // Track selected packet size and image for each product
  const [selectedPackets, setSelectedPackets] = React.useState<Record<string, number>>({});
  const [currentImages, setCurrentImages] = React.useState<Record<string, number>>({});
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleDeleteCategoryByType = React.useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  }, []);

  const handleAddToCart = React.useCallback(
    (product: FeaturedProduct) => {
      // Check if user is logged in using simple cookie check
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        // Redirect to login page with return URL
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      // Get selected packet index or default to 0
      const selectedIndex = selectedPackets[product.id] || 0;
      const selectedSku = product.pricesAndSkus[selectedIndex];
      const weightLabel = `${selectedSku.weightValue}${selectedSku.weightUnit}`;
      const quantity = quantities[product.id] || 1;

      // Add item to cart
      const cartItem = {
        id: crypto.randomUUID(), // Generate a proper GUID
        name: `${product.title} - ${weightLabel}`,
        price: selectedSku.discountedAmount || selectedSku.price,
        productId: product.id.toString(),
        brandId: product.brandId,
        image: product.imageUrls[currentImages[product.id] || 0],
        quantity: quantity,
        sku: selectedSku.skuNumber,
      };

      addItem(cartItem);
    },
    [router, addItem, selectedPackets, currentImages]
  );

  const confirmDelete = React.useCallback(() => {
    if (selectedCategoryId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Category/${selectedCategoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(() => {
          setProductCategories((prev) =>
            prev.filter((cat) => cat.id !== selectedCategoryId)
          );
          setUpcomingpProductCategories((prev) =>
            prev.filter((cat) => cat.id !== selectedCategoryId)
          );
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
        })
        .finally(() => {
          setIsModalOpen(false);
          setSelectedCategoryId(null);
        });
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Product`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products: Product[] = await response.json();

        // Filter products where isFeatured is true and map to FeaturedProduct interface
        const featured: FeaturedProduct[] = products
          .filter((product) => product.isFeatured && product.isActive)
          .slice(0, 6) // Limit to 6 products for the UI
          .map((product) => ({
            id: product.id,
            title: product.name,
            imageUrls: product.imageUrls || ["/placeholder-image.jpg"],
            description: product.description,
            pricesAndSkus: product.pricesAndSkus || [],
            brandId: product.brandId,
          }));

        setFeaturedProducts(featured);
        
        // Initialize selected packets, images, and quantities
        const initialPackets: Record<string, number> = {};
        const initialImages: Record<string, number> = {};
        const initialQuantities: Record<string, number> = {};
        featured.forEach(product => {
          initialPackets[product.id] = 0;
          initialImages[product.id] = 0;
          initialQuantities[product.id] = 1;
        });
        setSelectedPackets(initialPackets);
        setCurrentImages(initialImages);
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Keep empty array on error
        setFeaturedProducts([]);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Category`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Category[] = await response.json();
        const formattedActiveCategory: FormattedCategory[] = data
          .filter((cat) => cat.isActive)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((cat) => ({
            id: cat.id,
            title: cat.name,
            image: cat.imageUrl,
          }));

        const formattedUpcomingCategory: FormattedCategory[] = data
          .filter((cat) => !cat.isActive)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((cat) => ({
            id: cat.id,
            title: cat.name,
            image: cat.imageUrl,
          }));

        setProductCategories(formattedActiveCategory);
        setUpcomingpProductCategories(formattedUpcomingCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Execute both fetch operations
    const fetchData = async () => {
      await Promise.all([fetchFeaturedProducts(), fetchCategories()]);
      setIsLoading(false);
    };

    fetchData();

    return () => {
      // Cleanup function if needed
      setProductCategories([]);
      setUpcomingpProductCategories([]);
      setFeaturedProducts([]);
    };
  }, []);

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <Container
      sx={{
        mt: 3,
        mx: 6,
        mb: 6,
        px: isMobile ? 3 : 2,
        justifySelf: "center",
        maxWidth: "1500px !important",
      }}
    >
      {/* Featured Products Skeleton */}
      <Box sx={{ mt: isMobile ? 8 : 15 }}>
        <Skeleton
          variant="text"
          width={isMobile ? 200 : 300}
          height={isMobile ? 32 : 40}
          sx={{ mb: isMobile ? 3 : 8, mx: "auto" }}
        />
        <Grid
          container
          columnSpacing={4}
          rowSpacing={isMobile ? 4 : 8}
          sx={{
            width: "70%",
            display: "flex",
            mx: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              key={index}
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{ borderRadius: "8px", mb: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: "4px" }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Product Categories Skeleton */}
      <Box sx={{ mt: isMobile ? 8 : 15 }}>
        <Skeleton
          variant="text"
          width={isMobile ? 200 : 300}
          height={isMobile ? 32 : 40}
          sx={{ mb: isMobile ? 3 : 8, mx: "auto" }}
        />
        <Box sx={{ display: "flex", width: "100%", pb: 1, gap: 2 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ width: "100%" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={isMobile ? 178 : 394}
                sx={{ borderRadius: "8px", mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={52}
                sx={{ borderRadius: "0 0 8px 8px" }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Upcoming Categories Skeleton */}
      <Box sx={{ mt: isMobile ? 8 : 15 }}>
        <Skeleton
          variant="text"
          width={isMobile ? 200 : 300}
          height={isMobile ? 32 : 40}
          sx={{ mb: isMobile ? 3 : 8, mx: "auto" }}
        />
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 2 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={120}
                sx={{ borderRadius: "8px", mb: 1 }}
              />
              <Skeleton variant="text" width="80%" height={20} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Achievements Skeleton */}
      <Box sx={{ mt: isMobile ? 8 : 15 }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton
              variant="text"
              width={isMobile ? 200 : 300}
              height={isMobile ? 32 : 40}
              sx={{ mb: 4, mx: "auto" }}
            />
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={100}
                  sx={{ borderRadius: "8px" }}
                />
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton
              variant="circular"
              width="100%"
              height={isMobile ? 380 : 500}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Video Skeleton */}
      <Box sx={{ mt: isMobile ? 8 : 15 }}>
        <Skeleton
          variant="text"
          width={isMobile ? 150 : 200}
          height={isMobile ? 32 : 40}
          sx={{ mb: 4, mx: "auto" }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={isMobile ? 200 : 400}
          sx={{ borderRadius: "8px" }}
        />
      </Box>
    </Container>
  );

  if (isLoading) {
    return (
      <>
        <HomeGrid />
        <SkeletonLoader />
      </>
    );
  }

  return (
    <>
      <HomeGrid />
      <Container
        sx={{
          mt: 3,
          mx: 6,
          mb: 6,
          px: isMobile ? 3 : 2,
          justifySelf: "center",
          maxWidth: "1500px !important",
        }}
      >
        <Box
          sx={{
            mt: isMobile ? 4 : 8,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ mb: isMobile ? 2 : 4, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={isMobile ? "left" : "center"}
          >
            Featured Products
          </Typography>
          <Grid
            container
            columnSpacing={isMobile ? 2 : 3}
            rowSpacing={isMobile ? 3 : 4}
            sx={{
              width: isMobile ? "100%" : "80%",
              display: "flex",
              mx: "auto",
              justifyContent: "center",
              alignItems: "stretch",
              mb: 4,
            }}
          >
            {!isMobile ? (
              featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Grid
                    key={product.id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                    sx={{
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        transition: "box-shadow 0.3s ease-in-out",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: "divider",
                        p: 2,
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      {/* Left Side - Image */}
                      <Box
                        sx={{
                          position: "relative",
                          width: "45%",
                          minHeight: "200px",
                          overflow: "hidden",
                          borderRadius: "8px",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <Image
                          src={product.imageUrls[currentImages[product.id] || 0]}
                          alt={product.title}
                          fill
                          unoptimized={shouldUnoptimizeImage(product.imageUrls[currentImages[product.id] || 0])}
                          style={{
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>

                      {/* Right Side - Product Details */}
                      <Box
                        sx={{
                          width: "55%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Product Title */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: "text.primary",
                          }}
                        >
                          {product.title}
                        </Typography>

                        {/* Packet Size Selector */}
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ mb: 0.5, display: "block", color: "text.secondary" }}>
                            Select Size:
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {product.pricesAndSkus.slice(0, 4).map((sku, index) => (
                              <Button
                                key={sku.id}
                                size="small"
                                variant={selectedPackets[product.id] === index ? "contained" : "outlined"}
                                onClick={() => {
                                  setSelectedPackets(prev => ({ ...prev, [product.id]: index }));
                                  setCurrentImages(prev => ({ ...prev, [product.id]: index % product.imageUrls.length }));
                                }}
                                sx={{
                                  minWidth: "55px",
                                  fontSize: "0.7rem",
                                  py: 0.5,
                                }}
                              >
                                {sku.weightValue}{sku.weightUnit}
                              </Button>
                            ))}
                          </Box>
                        </Box>

                        {/* Price Display */}
                        <Box sx={{ mb: 1.5 }}>
                          {(() => {
                            const selectedSku = product.pricesAndSkus[selectedPackets[product.id] || 0];
                            return (
                              <Box>
                                {selectedSku?.discountedAmount ? (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                      {getCurrencySymbol(selectedSku.currencyCode || "INR")}{selectedSku.price}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600 }}>
                                      {getCurrencySymbol(selectedSku.currencyCode || "INR")}{selectedSku.discountedAmount}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600 }}>
                                    {getCurrencySymbol(selectedSku?.currencyCode || "INR")}{selectedSku?.price || 0}
                                  </Typography>
                                )}
                              </Box>
                            );
                          })()}
                        </Box>

                        {/* Quantity Selector */}
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ mb: 0.5, display: "block", color: "text.secondary" }}>
                            Quantity:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setQuantities(prev => ({
                                  ...prev,
                                  [product.id]: Math.max(1, (prev[product.id] || 1) - 1)
                                }));
                              }}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: "4px",
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ minWidth: "40px", textAlign: "center", fontWeight: 600 }}>
                              {quantities[product.id] || 1}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setQuantities(prev => ({
                                  ...prev,
                                  [product.id]: (prev[product.id] || 1) + 1
                                }));
                              }}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: "4px",
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Add to Cart Button */}
                        <Button
                          variant="contained"
                          size="medium"
                          fullWidth
                          sx={{
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            py: 0.75,
                            "&:hover": {
                              backgroundColor: "primary.dark",
                            },
                          }}
                          onClick={() => {
                            handleAddToCart(product);
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            Add to Cart
                          </Typography>
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid
                  size={{ xs: 12 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    textAlign="center"
                  >
                    No featured products available at the moment.
                  </Typography>
                </Grid>
              )
            ) : (
              <Grid
                size={{ xs: 12, md: 12 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {featuredProducts.length > 0 ? (
                  <Stack
                    direction={"column"}
                    spacing={2}
                    height="100%"
                    width="100%"
                  >
                    {featuredProducts.map((product) => (
                      <Stack
                        key={product.id}
                        direction={"row"}
                        spacing={2}
                        sx={{
                          display: "flex",
                          alignItems: "stretch",
                          padding: 2,
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          minHeight: "140px",
                        }}
                      >
                        <Grid
                          container
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <Grid size={{ xs: 4, md: 4 }}>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                height: "100px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <Image
                                src={product.imageUrls[currentImages[product.id] || 0]}
                                alt={product.title}
                                fill
                                unoptimized={shouldUnoptimizeImage(
                                  product.imageUrls[currentImages[product.id] || 0]
                                )}
                                style={{
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 8, md: 8 }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                justifyContent: "space-between",
                                pl: 1,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.primary"
                                  sx={{
                                    mb: 0.5,
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {product.title}
                                </Typography>
                                <Tooltip
                                  title={product.description}
                                  arrow
                                  placement="top"
                                  enterDelay={500}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      mb: 1,
                                      display: "-webkit-box",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      cursor: "help",
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {product.description}
                                  </Typography>
                                </Tooltip>
                              </Box>
                              
                              {/* Packet Size Selector - Mobile */}
                              <Box sx={{ mb: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                {product.pricesAndSkus.slice(0, 4).map((sku, index) => (
                                  <Button
                                    key={sku.id}
                                    size="small"
                                    variant={selectedPackets[product.id] === index ? "contained" : "outlined"}
                                    onClick={() => {
                                      setSelectedPackets(prev => ({ ...prev, [product.id]: index }));
                                      setCurrentImages(prev => ({ ...prev, [product.id]: index % product.imageUrls.length }));
                                    }}
                                    sx={{
                                      minWidth: "50px",
                                      fontSize: "0.65rem",
                                      py: 0.25,
                                      px: 1,
                                    }}
                                  >
                                    {sku.weightValue}{sku.weightUnit}
                                  </Button>
                                ))}
                              </Box>

                              {/* Price Display - Mobile */}
                              <Box sx={{ mb: 1 }}>
                                {(() => {
                                  const selectedSku = product.pricesAndSkus[selectedPackets[product.id] || 0];
                                  return (
                                    <Box>
                                      {selectedSku?.discountedAmount ? (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                          <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                            {getCurrencySymbol(selectedSku.currencyCode || "INR")}{selectedSku.price}
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                                            {getCurrencySymbol(selectedSku.currencyCode || "INR")}{selectedSku.discountedAmount}
                                          </Typography>
                                        </Box>
                                      ) : (
                                        <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                                          {getCurrencySymbol(selectedSku?.currencyCode || "INR")}{selectedSku?.price || 0}
                                        </Typography>
                                      )}
                                    </Box>
                                  );
                                })()}
                              </Box>

                              {/* Quantity Selector - Mobile */}
                              <Box sx={{ mb: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setQuantities(prev => ({
                                      ...prev,
                                      [product.id]: Math.max(1, (prev[product.id] || 1) - 1)
                                    }));
                                  }}
                                  sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: "4px",
                                    p: 0.5,
                                  }}
                                >
                                  <Remove sx={{ fontSize: "0.9rem" }} />
                                </IconButton>
                                <Typography variant="caption" sx={{ minWidth: "30px", textAlign: "center", fontWeight: 600 }}>
                                  {quantities[product.id] || 1}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setQuantities(prev => ({
                                      ...prev,
                                      [product.id]: (prev[product.id] || 1) + 1
                                    }));
                                  }}
                                  sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: "4px",
                                    p: 0.5,
                                  }}
                                >
                                  <Add sx={{ fontSize: "0.9rem" }} />
                                </IconButton>
                              </Box>

                              <Box>
                                <Button
                                  variant="contained"
                                  size="small"
                                  fullWidth
                                  sx={{
                                    backgroundColor: "primary.main",
                                    color: "primary.contrastText",
                                    fontSize: "0.7rem",
                                    py: 0.5,
                                    boxShadow: "none",
                                    "&:hover": {
                                      backgroundColor: "primary.dark",
                                    },
                                  }}
                                  onClick={() => {
                                    handleAddToCart(product);
                                  }}
                                >
                                  Add to Cart
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 8 }}
                  >
                    No featured products available at the moment.
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </Box>
        <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: isMobile ? 3 : 8,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "primary.main" }}
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
              textAlign="center"
              flexGrow={1}
            >
              Product Categories
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              pb: 1,
            }}
          >
            {productCategories.map((category, index) => (
              <Card
                key={index}
                role="group"
                aria-label={`${category.title} category`}
                sx={{
                  position: "relative", // Added for positioning buttons
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  height: isMobile ? "230px" : "450px",
                  mr: index === productCategories.length - 1 ? 0 : 2,
                }}
                onClick={() => {
                  router.push("/products");
                }}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? 178 : 394}
                  image={encodeURI(category.image)}
                  alt={category.title}
                  sx={{
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                />
                <CardContent
                  sx={{
                    backgroundColor: "#f8f3ea",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pb: "16px !important", // Ensure padding is consistent
                  }}
                >
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    gutterBottom
                    sx={{ mb: 0 }}
                    color="text.primary"
                  >
                    {category.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
        <ConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Category"
          message="Are you sure you want to delete this category?"
        />
        <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={isMobile ? "left" : "center"}
          >
            Upcoming Categories
          </Typography>
          <AllProducts
            items={upcomingpProductCategories}
            onDelete={(categoryId) => handleDeleteCategoryByType(categoryId)}
          />
        </Box>
        <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid container spacing={8}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction={"column"} alignItems="center" spacing={15}>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
                    fontFamily={michroma.style.fontFamily}
                    fontWeight={600}
                    textAlign={isMobile ? "left" : "center"}
                  >
                    From India to The World
                  </Typography>
                  <Grid
                    container
                    spacing={isMobile ? 4 : 8}
                    sx={{ mt: "64px !important" }}
                  >
                    {achievements.map((achievement, index) => (
                      <Grid
                        size={12}
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AchievementsCard
                          key={index}
                          value={achievement.value}
                          name={achievement.name}
                          icon={achievement.icon}
                          description={achievement.description}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    height: isMobile ? "380px" : "100%",
                    width: "100%",
                    backgroundImage: 'url("/Achievement.jpg")',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <CertificateScroll />
        {/* <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={isMobile ? "left" : "center"}
          >
            Product Catelog
          </Typography>
          <Box
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              width: "100vw", // Updated to take the entire screen width
              left: "50%", // Center align
              transform: "translateX(-50%)", // Center align
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/bPThecBVp-A?autoplay=1&mute=1&controls=0&loop=1&playlist=bPThecBVp-A"
              title="Agro Nexis - Product Catelog"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </Box>
        </Box> */}
        <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Grid container spacing={8}>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  height: isMobile ? "400px" : "100%",
                  width: "100%",
                  backgroundImage: 'url("/Chooseus.jpg")',
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
                fontFamily={michroma.style.fontFamily}
                fontWeight={600}
                textAlign={isMobile ? "left" : "center"}
              >
                Why Choose Us
              </Typography>
              <Grid
                container
                spacing={isMobile ? 4 : 8}
                sx={{ mt: "64px !important" }}
              >
                {chooseUs.map((item, index) => (
                  <Grid
                    size={12}
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChooseUs
                      key={index}
                      name={item.name}
                      icon={item.icon}
                      description={item.description}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={isMobile ? "left" : "center"}
          >
            Our Testimonials
          </Typography>
          <Testimonials items={testimonialData} />
        </Box>
      </Container>
    </>
  );
};

export default Home;
