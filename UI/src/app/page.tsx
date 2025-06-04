"use client";

import React from "react";
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
} from "@mui/material";
import AchievementsCard from "@/components/AchievementsCard";
import {
  Diversity1,
  Public,
  WorkspacePremium,
  HandshakeOutlined,
  HealthAndSafetyOutlined,
  SoupKitchenOutlined,
} from "@mui/icons-material";
import ChooseUs from "@/components/ChooseUs";
import { michroma } from "./layout";
import Testimonials from "@/components/Testimonials";
import Chef from "../../public/Chef.jpg";
import Cook from "../../public/Home Cook.jpg";
import Blogger from "../../public/Food Blogger.jpg";
import theme from "@/styles/theme";
import AllProducts from "@/components/AllProducts";
import { useRouter } from "next/navigation";
import HomeGrid from "@/components/HomeGrid";

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

const product_categories = [
  {
    title: "POWDERED SPICES",
    image: "/Powdered Spices.jpg",
  },
  {
    title: "WHOLE SPICES",
    image: "/Whole spices.jpg",
  },
];

const upcoming_product_categories = [
  {
    title: "CEREALS & GRAINS",
    image: "/Cereals Grains.JPG",
    coming_soon: true,
  },
  {
    title: "FLOURS",
    image: "/Flour.jpg",
    coming_soon: true,
  },
  {
    title: "FATS & OILS",
    image: "/Fats oil.jpeg",
    coming_soon: true,
  },
  {
    title: "FRUITS & NUTS",
    image: "/Fruits Nuts.jpeg",
    coming_soon: true,
  },
  {
    title: "BAKERY PRODUCTS",
    image: "Bakery Products.jpeg",
    coming_soon: true,
  },
  {
    title: "REFINED & RAW SUGARS",
    image: "/Sugar.jpeg",
    coming_soon: true,
  },
  {
    title: "SALTS",
    image: "/Salt.jpg",
    coming_soon: true,
  },
];

const featuredProducts = [
  {
    id: 1,
    title: "Red Chili Powder",
    image: "/Chili.png",
    description: "Spicy and flavorful red chili powder.",
    link: "/products/red-chili",
  },
  {
    id: 2,
    title: "Turmeric Powder",
    image: "/Turmeric.png",
    description: "Pure organic turmeric for health benefits.",
    link: "/products/organic-turmeric",
  },
  {
    id: 3,
    title: "Cumin Powder",
    image: "/Cumin.png",
    description: "Aromatic cumin for your dishes.",
    link: "/products/cumin",
  },
  {
    id: 4,
    title: "Coriander Powder",
    image: "/Coriander.png",
    description: "Fresh and aromatic coriander powder.",
    link: "/products/coriander",
  },
  {
    id: 5,
    title: "Garam Masala",
    image: "/GaramMasala.png",
    description: "A blend of rich and aromatic spices.",
    link: "/products/garam-masala",
  },
];

const Home: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
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
          <Grid container spacing={1} height={isMobile ? "auto" : 600}>
            {!isMobile ? (
              <>
                <Grid
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack
                    direction={"column"}
                    spacing={1}
                    height="100%"
                    width="100%"
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "100%",
                          backgroundImage: 'url("/Chili.png")',
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "center",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            color: "primary.contrastText",
                            border: "1px solid",
                            borderColor: "primary.contrastText",
                            mb: 4,
                            "&:hover": {
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.contrastText",
                              backgroundColor: "primary.contrastText",
                            },
                          }}
                          onClick={() => {
                            router.push("/products");
                          }}
                        >
                          Order Now
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "100%",
                          backgroundImage: 'url("/Cumin.png")',
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "center",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            color: "primary.contrastText",
                            border: "1px solid",
                            borderColor: "primary.contrastText",
                            mb: 4,
                            "&:hover": {
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.contrastText",
                              backgroundColor: "primary.contrastText",
                            },
                          }}
                          onClick={() => {
                            router.push("/products");
                          }}
                        >
                          Order Now
                        </Button>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        backgroundImage: 'url("/GaramMasala.png")',
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "center",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          color: "primary.contrastText",
                          border: "1px solid",
                          borderColor: "primary.contrastText",
                          mb: 4,
                          "&:hover": {
                            color: "primary.main",
                            border: "1px solid",
                            borderColor: "primary.contrastText",
                            backgroundColor: "primary.contrastText",
                          },
                        }}
                        onClick={() => {
                          router.push("/products");
                        }}
                      >
                        Order Now
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack
                    direction={"column"}
                    spacing={1}
                    height="100%"
                    width="100%"
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "100%",
                          backgroundImage: 'url("/Turmeric.png")',
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "center",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            color: "primary.contrastText",
                            border: "1px solid",
                            borderColor: "primary.contrastText",
                            mb: 4,
                            "&:hover": {
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.contrastText",
                              backgroundColor: "primary.contrastText",
                            },
                          }}
                          onClick={() => {
                            router.push("/products");
                          }}
                        >
                          Order Now
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "100%",
                          backgroundImage: 'url("/Coriander.png")',
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "center",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            color: "primary.contrastText",
                            border: "1px solid",
                            borderColor: "primary.contrastText",
                            mb: 4,
                            "&:hover": {
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.contrastText",
                              backgroundColor: "primary.contrastText",
                            },
                          }}
                          onClick={() => {
                            router.push("/products");
                          }}
                        >
                          Order Now
                        </Button>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </>
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
                      height={100}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        borderRadius: "8px",
                        position: "relative",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Box
                        sx={{
                          height: 100,
                          width: 100,
                          borderRadius: "8px",
                          backgroundImage: `url("${product.image}")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      />
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
                            router.push("/products");
                          }}
                        >
                          Order Now
                        </Button>
                      </Box>
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
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ mb: isMobile ? 3 : 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={isMobile ? "left" : "center"}
          >
            Product Categories
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              pb: 1,
            }}
          >
            {product_categories.map((category, index) => (
              <Card
                key={index}
                role="group"
                aria-label={`${category.title} category`}
                sx={{
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  mr: index === product_categories.length - 1 ? 0 : 2,
                }}
                onClick={() => {
                  router.push("/products");
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
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
                    variant="body1"
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
          <AllProducts items={upcoming_product_categories} />
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
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            marginTop: "120px",
            cursor: "pointer",
          }}
          onClick={() => {
            window.open(
              "https://www.youtube.com/watch?v=tYRz6M819nE",
              "_blank"
            );
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/tYRz6M819nE"
            title="Agro Nexis - Our Story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              bgcolor: "rgba(0, 0, 0, 0.8)",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFF",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "primary.contrastText" }}
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
            >
              Our Story
            </Typography>
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
