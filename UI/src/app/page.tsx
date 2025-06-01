"use client";

import React from "react";
import {
  Box,
  Button,
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

const brands = [
  {
    title: "DESI KING",
    image: "/Brand Desi King.jpg",
  },
  {
    title: "GOLDEN GRAINS",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
  {
    title: "DOUGH DELIGHTS",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
  {
    title: "GOLDEN DROPS",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
  {
    title: "BOOM NUTS",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
  {
    title: "WAKE N BAKE",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
  {
    title: "SWEET SYMPHONY",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
  {
    title: "ANI SALTS",
    image: "/placeholder.jpg",
    coming_soon: true,
  },
];

const Home: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  return (
    <div>
      <Container
        sx={{
          mt: 3,
          mx: 6,
          mb: 6,
          justifySelf: "center",
          maxWidth: "1500px !important",
        }}
      >
        <Box
          sx={{
            mt: 15,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
          >
            Featured Products
          </Typography>
          <Grid container spacing={1} height={600}>
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
                        mb: 3,
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
                        mb: 3,
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
                    backgroundImage: 'url("/Raw Turmeric.jpg")',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
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
                      mb: 3,
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
                        mb: 3,
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
                        mb: 3,
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
          </Grid>
        </Box>
        <Box
          sx={{
            mt: 15,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
          >
            Products Categories
          </Typography>
          <AllProducts items={product_categories} route="products" />
        </Box>
        <Box
          sx={{
            mt: 15,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 8, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
          >
            Brands
          </Typography>
          <AllProducts items={brands} />
        </Box>
        <Box
          sx={{
            mt: 15,
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
                    variant="h4"
                    sx={{
                      color: "primary.main",
                    }}
                    fontFamily={michroma.style.fontFamily}
                    fontWeight={600}
                    textAlign={"center"}
                  >
                    From India to The World
                  </Typography>
                  <Grid container spacing={8} sx={{ mt: "64px !important" }}>
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
            mt: 15,
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
                variant="h4"
                sx={{ color: "primary.main" }}
                fontFamily={michroma.style.fontFamily}
                fontWeight={600}
              >
                Why Choose Us
              </Typography>
              <Grid container spacing={8} sx={{ mt: "64px !important" }}>
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
            mt: 15,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 8, mt: 4, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
          >
            Our Testimonials
          </Typography>
          <Testimonials items={testimonialData} />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
