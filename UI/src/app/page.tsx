"use client";

import React from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Carousal from "@/components/Carousal";
import Purity from "../../public/Purity.png";
import Quality from "../../public/Quality.png";
import Taste from "../../public/Taste.png";
import Globe from "../../public/Globe.png";
import FeaturedProducts from "@/components/FeaturedProducts";
import theme from "@/styles/theme";
import AchievementsCard from "@/components/AchievementsCard";
import { Diversity1, Public, WorkspacePremium } from "@mui/icons-material";

const carousalImages = [
  { image: Purity },
  { image: Quality },
  { image: Taste },
  { image: Globe },
];

const Home: React.FC = () => {
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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Container
        component="main"
        sx={{
          px: "0px !important",
          minHeight: "60vh",
          maxWidth: "100% !important",
        }}
      >
        <Carousal items={carousalImages} />
        <Box sx={{ mt: 15 }}>
          <Typography
            variant="h2"
            sx={{ mb: 3, color: theme.palette.primary.main }}
            fontFamily={"Playfair Display, serif"}
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
        <Box sx={{ mt: 15 }}>
          <Box
            style={{
              backgroundImage: 'url("/Customer Feedback.jpg")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: isMobile ? "100vh" : "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack direction={"column"} alignItems="center" spacing={15}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.primary.contrastText,
                }}
                fontFamily={"Playfair Display, serif"}
                fontStyle={"italic"}
                fontWeight={600}
                textAlign={"center"}
              >
                From India to The World
              </Typography>
              <Grid container spacing={2} sx={{ p: 2, mx: 3 }}>
                {achievements.map((achievement, index) => (
                  <Grid
                    size={{ xs: 12, md: 4 }}
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
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
