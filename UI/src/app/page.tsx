"use client";

import React, { useEffect, Suspense } from "react";
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
  IconButton,
  Skeleton,
} from "@mui/material";
import AchievementsCard from "@/components/AchievementsCard";
import {
  Diversity1,
  Public,
  WorkspacePremium,
  HandshakeOutlined,
  HealthAndSafetyOutlined,
  SoupKitchenOutlined,
  Edit,
  Delete,
  Add,
} from "@mui/icons-material";
import ChooseUs from "@/components/ChooseUs";
import { michroma } from "@/styles/fonts";
import Testimonials from "@/components/Testimonials";
import Chef from "../../public/Chef.jpg";
import Cook from "../../public/Home Cook.jpg";
import Blogger from "../../public/Food Blogger.jpg";
import theme from "@/styles/theme";
import AllProducts from "@/components/AllProducts";
import { useRouter } from "next/navigation";
import HomeGrid from "@/components/HomeGrid";
import Image from "next/image";
import ConfirmationModal from "@/components/ConfirmationModal";
import { UserSessionManager } from "@/utils/userSession";
import { useCart } from "@/contexts/CartContext";
import Cookies from "js-cookie";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string): boolean => {
  return imageSrc.includes("cloud.agronexis.com");
};

// Define the Category type
type Category = {
  id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
};

type FormattedCategory = {
  id: string;
  title: string;
  image: string;
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

const featuredProducts = [
  {
    id: 1,
    title: "Lakhadong Turmeric Powder",
    image: "/Lokadong Turmeric powder feature.jpg",
    description: "Pure organic turmeric for health benefits.",
    link: "/products/organic-turmeric",
    basePrice: 149,
  },
  {
    id: 2,
    title: "Turmeric Powder",
    image: "/Turmeric powder feature.jpg",
    description: "Pure organic turmeric for health benefits.",
    link: "/products/organic-turmeric",
    basePrice: 129,
  },
  {
    id: 3,
    title: "Red Chili Powder",
    image: "/Red chilli feature.jpg",
    description: "Spicy and flavorful red chili powder.",
    link: "/products/red-chili",
    basePrice: 119,
  },
  {
    id: 4,
    title: "Garam Masala",
    image: "/Garam masala feature.jpg",
    description: "A blend of rich and aromatic spices.",
    link: "/products/garam-masala",
    basePrice: 179,
  },
  {
    id: 5,
    title: "Cumin seeds",
    image: "/Jeera feature.jpg",
    description: "Aromatic cumin for your dishes.",
    link: "/products/cumin",
    basePrice: 159,
  },
  {
    id: 6,
    title: "Black Pepper",
    image: "/Kali mirch feature.jpg",
    description: "Fresh and aromatic black pepper.",
    link: "/products/black-pepper",
    basePrice: 299,
  },
];

const Home: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { addItem } = useCart();

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

  const handleDeleteCategoryByType = React.useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  }, []);

  const handleOrderNow = React.useCallback(
    (product: any) => {
      // Check if user is logged in
      const userProfile = UserSessionManager.getUserProfile();

      if (!userProfile) {
        // Redirect to login page with return URL
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      // Add item to cart
      const cartItem = {
        id: `${product.id}-250g`, // Unique ID with default weight
        name: `${product.title} - 250g`,
        price: product.basePrice ?? 149,
        productId: product.id.toString(),
        brandId: "default-brand-id",
        image: product.image,
        quantity: 1,
      };

      addItem(cartItem);

      // Redirect to cart page
      router.push("/cart");
    },
    [router, addItem]
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Category`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res): Promise<Category[]> => res.json())
      .then((data: Category[]) => {
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
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      // Cleanup function if needed
      setProductCategories([]);
      setUpcomingpProductCategories([]);
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
            Featured Products
          </Typography>
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
            {!isMobile ? (
              featuredProducts.map((product) => (
                <Grid
                  key={product.id}
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Box
                    sx={{
                      height: "fit-content",
                      width: "100%",
                      transition: "transform 0.3s ease-in-out",
                      borderRadius: "8px",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={200}
                      height={200}
                      unoptimized={shouldUnoptimizeImage(product.image)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />
                    <Button
                      variant="outlined"
                      sx={{
                        color: "primary.main",
                        border: "2px solid",
                        borderColor: "primary.main",
                        width: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          color: "primary.contrastText",
                          border: "2px solid",
                          borderColor: "primary.main",
                          backgroundColor: "primary.main",
                        },
                      }}
                      onClick={() => {
                        handleOrderNow(product);
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Order Now
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid
                size={{ xs: 12, md: 12 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack
                  direction={"column"}
                  spacing={4}
                  height="100%"
                  width="100%"
                >
                  {featuredProducts.map((product) => (
                    <Stack
                      key={product.id}
                      direction={"row"}
                      spacing={3}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        borderRadius: "8px",
                        position: "relative",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 4, md: 4 }}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={100}
                            height={100}
                            unoptimized={shouldUnoptimizeImage(product.image)}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 8, md: 8 }}>
                          <Box>
                            <Typography
                              variant="h6"
                              color="text.primary"
                              sx={{ mb: 0.5 }}
                            >
                              {product.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 4 }}
                            >
                              {product.description}
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundClip: "primary.main",
                                color: "primary.contrastText",
                                position: "absolute",
                                right: 16,
                                bottom: 16,
                                boxShadow: "none",
                              }}
                              onClick={() => {
                                handleOrderNow(product);
                              }}
                            >
                              Order Now
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Stack>
                  ))}
                </Stack>
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
            {Cookies.get("user_role") === "Admin" && (
              <IconButton
                color="primary"
                onClick={() => router.push("/add-category")}
                sx={{
                  border: "2px solid",
                  borderColor: "primary.main",
                  borderRadius: "50%",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            )}
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
                {Cookies.get("user_role") === "Admin" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 2,
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: "50%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        sessionStorage.setItem("categoryId", category.id);
                        router.push("/add-category");
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      sx={{
                        border: "2px solid",
                        borderColor: "error.main",
                        borderRadius: "50%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "error.main",
                          color: "error.contrastText",
                          borderColor: "error.main",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDeleteCategoryByType(category.id);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
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
            Our Story
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
              src="https://www.youtube.com/embed/vwXHoR_T2EU?autoplay=1&mute=1&controls=0&loop=1&playlist=vwXHoR_T2EU"
              title="Agro Nexis - Our Story"
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
        </Box>
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
