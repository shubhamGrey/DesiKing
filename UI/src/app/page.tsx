import React from "react";
import { Box, Container } from "@mui/material";
import Carousal from "@/components/Carousal";
import Purity from "@/public/images/Purity.png";
import Quality from "@/public/images/Quality.png";
import Taste from "@/public/images/Taste.png";
import Globe from "@/public/images/Globe.png";
import BrandRadialTree from "@/components/BrandRadialTree";

const carousalImages = [
  { image: Purity },
  { image: Quality },
  { image: Taste },
  { image: Globe },
];

const Home: React.FC = () => {
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
        <Box>
          <BrandRadialTree />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
