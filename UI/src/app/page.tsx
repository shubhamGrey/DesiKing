"use client";

import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Skeleton,
  Chip,
  Button,
} from "@mui/material";
import AchievementsCard from "@/components/AchievementsCard";
import {
  Diversity1,
  Public,
  WorkspacePremium,
  HandshakeOutlined,
  HealthAndSafetyOutlined,
  SoupKitchenOutlined,
  LocalFireDepartment,
  Restaurant,
  Spa,
  ArrowForward,
} from "@mui/icons-material";
import ChooseUs from "@/components/ChooseUs";
import theme from "@/styles/theme";
import Testimonials from "@/components/Testimonials";
import CertificateScroll from "@/components/CertificateScroll";
import Chef from "../../public/Chef.jpg";
import Cook from "../../public/Home Cook.jpg";
import Blogger from "../../public/Food Blogger.jpg";
import AllProducts from "@/components/AllProducts";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Category, FormattedCategory, Product } from "@/types/product";
import { usePageTracking } from "@/hooks/useAnalytics";
import { getCurrencySymbol } from "@/utils/currencyUtils";
import Carousal from "@/components/Carousal";
import Image from "next/image";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
import LottieIcon from "@/components/LottieIcon";
import Purity from "../../public/Hero Banner 1.png";
import Quality from "../../public/Hero Banner 2.png";
import Taste from "../../public/Hero Banner 3.png";
import Globe from "../../public/Hero Banner 4.png";
import Hero from "../../public/Hero Banner 5.png";

const carousalImages = [
  { image: Purity },
  { image: Quality },
  { image: Taste },
  { image: Globe },
  { image: Hero },
];

// Categories to showcase on homepage with products
const showcaseCategories = [
  "Immunity Boosters",
  "Digestive Aids",
  "Daily Uses",
];

// Category icons and colors for visual appeal
const categoryConfig: Record<
  string,
  {
    icon: React.ReactNode;
    lottieIcon: string;
    gradient: string;
    bgColor: string;
  }
> = {
  "Immunity Boosters": {
    icon: <Spa sx={{ fontSize: 28 }} />,
    lottieIcon: "/lottie/leaf.json",
    gradient: "linear-gradient(135deg, #1B4D3E 0%, #2D7A5E 100%)",
    bgColor: "rgba(27, 77, 62, 0.08)",
  },
  "Digestive Aids": {
    icon: <Restaurant sx={{ fontSize: 28 }} />,
    lottieIcon: "/lottie/fork.json",
    gradient: "linear-gradient(135deg, #E85D04 0%, #F48C06 100%)",
    bgColor: "rgba(232, 93, 4, 0.08)",
  },
  "Daily Uses": {
    icon: <LocalFireDepartment sx={{ fontSize: 28 }} />,
    lottieIcon: "/lottie/fire.json",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
    bgColor: "rgba(124, 58, 237, 0.08)",
  },
};

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (
  imageSrc: string | undefined | null
): boolean => {
  return imageSrc?.includes("cloud.desikingspices.com") ?? false;
};
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
      "Taking the taste of India to plates across the globe with trusted international partnerships.",
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
    rating: 5,
  },
  {
    image: Chef,
    name: "Raj Patel",
    review:
      "I have been using their spices for years and they never disappoint. The freshness and aroma are unbeatable. Highly recommend!",
    occupation: "Professional Chef",
    rating: 5,
  },
  {
    image: Blogger,
    name: "Priya Mehta",
    review:
      "These spices have transformed my dishes! They add a depth of flavor that I haven't found anywhere else. Will definitely be a repeat customer.",
    occupation: "Food Blogger",
    rating: 5,
  },
];

const chooseUs = [
  {
    name: "Uncompromised Purity",
    icon: <HandshakeOutlined fontSize="large" />,
    lottieIcon: "/lottie/leaf.json",
    iconBg: "rgba(61, 152, 70, 0.15)",
    description:
      "We source only the finest raw spices, ensuring that every product is free from additives, fillers and artificial colors.",
  },
  {
    name: "Hygienic Processing",
    icon: <HealthAndSafetyOutlined fontSize="large" />,
    lottieIcon: "/lottie/star.json",
    iconBg: "rgba(156, 86, 244, 0.12)",
    description:
      "Our state-of-the-art processing facilities adhere to the highest hygiene standards and safety protocols, ensuring that every spice is safe and healthy.",
  },
  {
    name: "Bold, Authentic Flavors",
    icon: <SoupKitchenOutlined fontSize="large" />,
    lottieIcon: "/lottie/chili.json",
    iconBg: "rgba(213, 0, 0, 0.12)",
    description:
      "Each spice is carefully selected and processed to retain its natural oils and flavors, delivering an authentic taste experience that transports you to the heart of Indian cuisine.",
  },
  {
    name: "Global Reach, Local Trust",
    icon: <Public fontSize="large" />,
    lottieIcon: "/lottie/fork.json",
    iconBg: "rgba(248, 231, 28, 0.18)",
    description:
      "We serve both domestic and international markets, offering world-class products rooted in Indian tradition.",
  },
];

const Home: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  // Analytics hooks
  usePageTracking(); // Automatically track page views
  // Note: Global click tracking is handled by GlobalClickTracker component

  const [productCategories, setProductCategories] = React.useState<
    FormattedCategory[]
  >([]);

  const [upcomingpProductCategories, setUpcomingpProductCategories] =
    React.useState<FormattedCategory[]>([]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Products grouped by category for showcase
  const [productsByCategory, setProductsByCategory] = React.useState<
    Record<string, Product[]>
  >({});

  const handleDeleteCategoryByType = React.useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  }, []);

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

    // Fetch products and group by showcase categories
    const fetchProducts = async () => {
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

        // Keywords for categorizing products (analyze name, description, uses, ingredients)
        const categoryKeywords: Record<string, string[]> = {
          "Immunity Boosters": [
            "turmeric",
            "haldi",
            "ginger",
            "adrak",
            "tulsi",
            "giloy",
            "ashwagandha",
            "immunity",
            "health",
            "antioxidant",
            "vitamin",
            "amla",
            "neem",
            "moringa",
            "black pepper",
            "kali mirch",
          ],
          "Digestive Aids": [
            "jeera",
            "cumin",
            "ajwain",
            "carom",
            "hing",
            "asafoetida",
            "fennel",
            "saunf",
            "digestive",
            "stomach",
            "acidity",
            "triphala",
            "mint",
            "pudina",
            "ginger",
            "sonth",
          ],
          "Daily Uses": [
            "salt",
            "namak",
            "garam masala",
            "chilli",
            "mirchi",
            "coriander",
            "dhaniya",
            "mustard",
            "sarson",
            "curry",
            "biryani",
            "tandoori",
            "kitchen",
            "cooking",
            "masala",
            "powder",
            "spice",
          ],
        };

        // Function to check if product matches a category based on keywords
        const matchesCategory = (
          product: Product,
          keywords: string[]
        ): boolean => {
          const searchText = [
            product.name,
            product.description,
            ...(product.uses || []),
            product.ingredients,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return keywords.some((keyword) =>
            searchText.includes(keyword.toLowerCase())
          );
        };

        // Group products by showcase categories using keyword matching
        const grouped: Record<string, Product[]> = {};
        const usedProductIds = new Set<string>(); // Avoid duplicates across categories

        showcaseCategories.forEach((categoryName) => {
          const keywords = categoryKeywords[categoryName] || [];
          const matchingProducts = products.filter(
            (product) =>
              product.isActive &&
              !usedProductIds.has(product.id) &&
              matchesCategory(product, keywords)
          );

          // Take first 4 matching products and mark them as used
          const selected = matchingProducts.slice(0, 4);
          selected.forEach((p) => usedProductIds.add(p.id));
          grouped[categoryName] = selected;
        });

        setProductsByCategory(grouped);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsByCategory({});
      }
    };

    // Execute fetch operation
    const fetchData = async () => {
      await Promise.all([fetchCategories(), fetchProducts()]);
      setIsLoading(false);
    };

    fetchData();

    return () => {
      // Cleanup function if needed
      setProductCategories([]);
      setUpcomingpProductCategories([]);
      setProductsByCategory({});
    };
  }, []);

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <Container
      sx={{
        mt: 3,
        mx: { xs: 0, md: 6 },
        mb: 6,
        px: isMobile ? 2 : 2,
        justifySelf: "center",
        maxWidth: "1500px !important",
        overflow: "hidden",
      }}
    >
      {/* Product Categories Skeleton */}
      <Box sx={{ mt: isMobile ? 4 : 8 }}>
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
      <Box sx={{ mt: isMobile ? 8 : 15, overflow: "hidden" }}>
        <Grid container spacing={isMobile ? 4 : 6}>
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
        <Carousal items={carousalImages} />
        <SkeletonLoader />
      </>
    );
  }

  return (
    <>
      <Carousal items={carousalImages} />
      <Container
        sx={{
          mt: 3,
          mx: { xs: 0, md: 6 },
          mb: 6,
          px: isMobile ? 2 : 2,
          justifySelf: "center",
          maxWidth: "1500px !important",
          overflow: "hidden",
        }}
      >
        {/* Shop by Category Sections */}
        {showcaseCategories.map((categoryName) => {
          const products = productsByCategory[categoryName] || [];
          if (products.length === 0) return null;

          const config = categoryConfig[categoryName];

          return (
            <AnimatedSection key={categoryName}>
              <Box
                sx={{
                  mt: isMobile ? 4 : 6,
                  mb: isMobile ? 2 : 4,
                  p: isMobile ? 2 : 3,
                  borderRadius: 3,
                  backgroundColor: config?.bgColor || "rgba(0,0,0,0.02)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: config?.gradient || "primary.main",
                    borderRadius: "12px 12px 0 0",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: isMobile ? 2 : 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: isMobile ? 40 : 48,
                        height: isMobile ? 40 : 48,
                        borderRadius: 2,
                        background: config?.gradient || "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <LottieIcon
                        src={config?.lottieIcon}
                        fallback={config?.icon}
                        size={40}
                      />
                    </Box>
                    <AnimatedItem>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          color: "text.primary",
                          fontWeight: 700,
                        }}
                      >
                        {categoryName}
                      </Typography>
                    </AnimatedItem>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                    onClick={() => router.push("/products")}
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    {isMobile ? "All" : "View All"}
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: isMobile ? 1.5 : 2.5,
                    overflowX: "auto",
                    pb: 1,
                    scrollSnapType: "x mandatory",
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "rgba(0,0,0,0.05)",
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: 3,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.3)",
                      },
                    },
                  }}
                >
                  {products.map((product) => {
                    const defaultSku = product.pricesAndSkus?.[0];
                    const price =
                      defaultSku?.discountedAmount || defaultSku?.price || 0;
                    const originalPrice = defaultSku?.price || 0;
                    const hasDiscount =
                      defaultSku?.isDiscounted && defaultSku?.discountedAmount;
                    const currencySymbol = getCurrencySymbol(
                      defaultSku?.currencyCode || "INR"
                    );

                    return (
                      <Card
                        key={product.id}
                        sx={{
                          minWidth: isMobile ? 165 : 240,
                          maxWidth: isMobile ? 165 : 240,
                          borderRadius: 3,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          scrollSnapAlign: "start",
                          border: "1px solid rgba(0,0,0,0.06)",
                          backgroundColor: "#fff",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.02)",
                            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                            "& .product-image": {
                              transform: "scale(1.1)",
                            },
                          },
                          flexShrink: 0,
                        }}
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: isMobile ? 130 : 180,
                            backgroundColor: "#f5f5f5",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            className="product-image"
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              transition: "transform 0.4s ease",
                            }}
                          >
                            <Image
                              src={
                                product.thumbnailUrl ||
                                product.imageUrls?.[0] ||
                                "/placeholder-image.jpg"
                              }
                              alt={product.name}
                              fill
                              unoptimized={shouldUnoptimizeImage(
                                product.thumbnailUrl || product.imageUrls?.[0]
                              )}
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                          {hasDiscount && (
                            <Chip
                              label={`${defaultSku.discountPercentage}% OFF`}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                background:
                                  "linear-gradient(135deg, #E85D04 0%, #F48C06 100%)",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                height: 24,
                                boxShadow: "0 2px 8px rgba(232,93,4,0.4)",
                                "& .MuiChip-label": {
                                  px: 1.5,
                                },
                              }}
                            />
                          )}
                          {product.isPremium && (
                            <Chip
                              label="Premium"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                background:
                                  "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                                color: "#1a1a1a",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                height: 22,
                                boxShadow: "0 2px 8px rgba(255,215,0,0.4)",
                              }}
                            />
                          )}
                        </Box>
                        <CardContent
                          sx={{
                            p: isMobile ? 1.5 : 2,
                            "&:last-child": { pb: isMobile ? 1.5 : 2 },
                          }}
                        >
                          <Typography
                            variant={isMobile ? "body2" : "subtitle1"}
                            sx={{
                              fontWeight: 600,
                              mb: 0.75,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "text.primary",
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant={isMobile ? "subtitle1" : "h6"}
                              sx={{ fontWeight: 800, color: "primary.main" }}
                            >
                              {currencySymbol}
                              {price.toFixed(2)}
                            </Typography>
                            {hasDiscount && (
                              <Typography
                                variant="caption"
                                sx={{
                                  textDecoration: "line-through",
                                  color: "text.disabled",
                                  fontWeight: 500,
                                }}
                              >
                                {currencySymbol}
                                {originalPrice.toFixed(2)}
                              </Typography>
                            )}
                          </Box>
                          {defaultSku && (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                backgroundColor: "rgba(27, 77, 62, 0.1)",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "primary.main", fontWeight: 600 }}
                              >
                                {defaultSku.weightValue}
                                {defaultSku.weightUnit}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            </AnimatedSection>
          );
        })}

        {/* Product Categories Section */}
        <Box
          sx={{
            mt: isMobile ? 4 : 8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: isMobile ? 3 : 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 40 : 60,
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #1B4D3E)",
                  borderRadius: 2,
                }}
              />
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ color: "primary.main" }}
                fontWeight={700}
                textAlign="center"
              >
                Product Categories
              </Typography>
              <Box
                sx={{
                  width: isMobile ? 40 : 60,
                  height: 3,
                  background: "linear-gradient(90deg, #1B4D3E, transparent)",
                  borderRadius: 2,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              Explore our premium spice collections
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: 2,
              pb: 2,
              pt: 1,
              px: 1,
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: 3,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.15)",
                borderRadius: 3,
              },
            }}
          >
            {productCategories.map((category, index) => (
              <Card
                key={index}
                role="group"
                aria-label={`${category.title} category`}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  minWidth: isMobile ? "85%" : "calc(33.333% - 16px)",
                  flex: isMobile ? "0 0 auto" : 1,
                  height: isMobile ? "230px" : "420px",
                  flexShrink: 0,
                  overflow: "hidden",
                  border: "1px solid rgba(27, 77, 62, 0.08)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 40px rgba(27, 77, 62, 0.15)",
                    "& .category-image": {
                      transform: "scale(1.08)",
                    },
                    "& .category-overlay": {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => {
                  router.push("/products");
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: isMobile ? 178 : 360,
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    className="category-image"
                    component="img"
                    height={isMobile ? 178 : 360}
                    image={encodeURI(category.image)}
                    alt={category.title}
                    sx={{
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <Box
                    className="category-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to top, rgba(27, 77, 62, 0.8) 0%, transparent 50%)",
                      opacity: 0,
                      transition: "opacity 0.4s ease",
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2,
                    borderTop: "3px solid",
                    borderImage: "linear-gradient(90deg, #1B4D3E, #E85D04) 1",
                  }}
                >
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: isMobile ? 3 : 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 40 : 60,
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #E85D04)",
                  borderRadius: 2,
                }}
              />
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ color: "primary.main" }}
                fontWeight={700}
                textAlign="center"
              >
                Upcoming Categories
              </Typography>
              <Box
                sx={{
                  width: isMobile ? 40 : 60,
                  height: 3,
                  background: "linear-gradient(90deg, #E85D04, transparent)",
                  borderRadius: 2,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              Exciting new spice collections coming soon
            </Typography>
          </Box>
          <AllProducts
            items={upcomingpProductCategories}
            onDelete={(categoryId) => handleDeleteCategoryByType(categoryId)}
          />
        </Box>
        <CertificateScroll />

        <Box
          sx={{
            mt: isMobile ? 8 : 15,
            overflow: "hidden",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid container spacing={isMobile ? 4 : 6}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction={"column"} alignItems="center" spacing={isMobile ? 4 : 8}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: isMobile ? 30 : 50,
                          height: 3,
                          background:
                            "linear-gradient(90deg, transparent, #1B4D3E)",
                          borderRadius: 2,
                        }}
                      />
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ color: "primary.main" }}
                        fontWeight={700}
                        textAlign="center"
                      >
                        From India to The World
                      </Typography>
                      <Box
                        sx={{
                          width: isMobile ? 30 : 50,
                          height: 3,
                          background:
                            "linear-gradient(90deg, #1B4D3E, transparent)",
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", textAlign: "center" }}
                    >
                      Our journey of excellence
                    </Typography>
                  </Box>
                  <Grid
                    container
                    spacing={isMobile ? 2 : 8}
                    sx={{ mt: isMobile ? 2 : "64px !important" }}
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
                    width: isMobile ? "280px" : "min(100%, 550px)",
                    height: isMobile ? "280px" : "min(100%, 550px)",
                    aspectRatio: "1 / 1",
                    backgroundImage: 'url("/Achievement.jpg")',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                    boxShadow: "0 20px 60px rgba(27, 77, 62, 0.2)",
                    border: "4px solid rgba(27, 77, 62, 0.1)",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 30px 80px rgba(27, 77, 62, 0.25)",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Box
          sx={{
            mt: isMobile ? 8 : 15,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
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
            overflow: "hidden",
          }}
        >
          <Grid container spacing={isMobile ? 4 : 6}>
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
                  borderRadius: 3,
                  boxShadow: "0 20px 60px rgba(232, 93, 4, 0.15)",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 30px 80px rgba(232, 93, 4, 0.2)",
                  },
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ py: 1, maxWidth: "100%", overflow: "hidden" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: isMobile ? 3 : 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: isMobile ? 30 : 50,
                      height: 3,
                      background:
                        "linear-gradient(90deg, transparent, #E85D04)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{ color: "primary.main" }}
                    fontWeight={700}
                    textAlign="center"
                  >
                    Why Choose Us
                  </Typography>
                  <Box
                    sx={{
                      width: isMobile ? 30 : 50,
                      height: 3,
                      background:
                        "linear-gradient(90deg, #E85D04, transparent)",
                      borderRadius: 2,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", textAlign: "center" }}
                >
                  What makes us different
                </Typography>
              </Box>
              <Stack
                spacing={isMobile ? 2 : 3}
                sx={{ mt: 4, px: 0, py: 1, width: "100%" }}
              >
                {chooseUs.map((item, index) => (
                  <ChooseUs
                    key={index}
                    name={item.name}
                    icon={item.icon}
                    lottieIcon={item.lottieIcon}
                    iconBg={item.iconBg}
                    description={item.description}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            mt: isMobile ? 8 : 15,
            p: isMobile ? 2 : 4,
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(27, 77, 62, 0.04) 0%, transparent 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: isMobile ? 3 : 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 40 : 60,
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #1B4D3E)",
                  borderRadius: 2,
                }}
              />
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ color: "primary.main" }}
                fontWeight={700}
                textAlign="center"
              >
                Our Testimonials
              </Typography>
              <Box
                sx={{
                  width: isMobile ? 40 : 60,
                  height: 3,
                  background: "linear-gradient(90deg, #1B4D3E, transparent)",
                  borderRadius: 2,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              What our customers say about us
            </Typography>
          </Box>
          <Testimonials items={testimonialData} />
        </Box>
      </Container>
    </>
  );
};

export default Home;
