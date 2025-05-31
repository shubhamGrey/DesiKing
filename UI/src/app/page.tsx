"use client";

import React from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import FeaturedProducts from "@/components/FeaturedProducts";
import theme from "@/styles/theme";
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

const achievements = [
  {
    value: "500+",
    name: "Happy Customers",
    icon: <Diversity1 sx={{ height: "2.5em", width: "2.5em" }} />,
    description:
      "Serving smiles across homes and kitchens with every pack of spice we deliver.",
  },
  {
    value: "4+",
    name: "Countries served",
    icon: <Public sx={{ height: "2.5em", width: "2.5em" }} />,
    description:
      "Taking the taste of India to plates across the globe with trusted international patnerships.",
  },
  {
    value: "3+",
    name: "Years of excellence",
    icon: <WorkspacePremium sx={{ height: "2.5em", width: "2.5em" }} />,
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
    icon: <HandshakeOutlined sx={{ height: "2.5em", width: "2.5em" }} />,
    description:
      "We source only the finest raw spices, ensuring that every product is free from additives, fillers and artificial colors.",
  },
  {
    name: "Hygenic Processing",
    icon: <HealthAndSafetyOutlined sx={{ height: "2.5em", width: "2.5em" }} />,
    description:
      "Our state-of-the-art processing facilities adhere to the highest hygiene standards and safety protocols, ensuring that every spice is safe and healthy.",
  },
  {
    name: "Bold, Authentic Flavors",
    icon: <SoupKitchenOutlined sx={{ height: "2.5em", width: "2.5em" }} />,
    description:
      "Each spice is carefully selected and processed to retain its natural oils and flavors, delivering an authentic taste experience that transports you to the heart of Indian cuisine.",
  },
  {
    name: "Global Reach, Local Trust",
    icon: <Public sx={{ height: "2.5em", width: "2.5em" }} />,
    description:
      "We serve both domestic and international markets, offering world-class products rooted in Indian tradition.",
  },
];

const Home: React.FC = () => {
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
            variant="h3"
            sx={{ mb: 3, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontStyle={"italic"}
            fontWeight={600}
            textAlign={"center"}
          >
            Featured Products
          </Typography>
          <Box sx={{ p: 2 }}>
            <FeaturedProducts />
          </Box>
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
                <Stack
                  direction={"column"}
                  alignItems="center"
                  spacing={15}
                  sx={{
                    mt: 4,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: "primary.main",
                    }}
                    fontFamily={michroma.style.fontFamily}
                    fontStyle={"italic"}
                    fontWeight={600}
                    textAlign={"center"}
                  >
                    From India to The World
                  </Typography>
                  <Grid container spacing={10} style={{ marginTop: "80px" }}>
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
                    height: "100%",
                    width: "100%",
                    backgroundImage: 'url("/Achievement.jpg")',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
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
                  height: "100%",
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
                variant="h3"
                sx={{ mb: 10, mt: 4, color: "primary.main" }}
                fontFamily={michroma.style.fontFamily}
                fontStyle={"italic"}
                fontWeight={600}
              >
                Why Choose Us
              </Typography>
              {chooseUs.map((item, index) => (
                <ChooseUs
                  key={index}
                  name={item.name}
                  icon={item.icon}
                  description={item.description}
                />
              ))}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            mt: 15,
          }}
        >
          <Typography
            variant="h3"
            sx={{ mb: 10, mt: 4, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontStyle={"italic"}
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
