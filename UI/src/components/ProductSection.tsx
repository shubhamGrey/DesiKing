"use client";
import theme from "@/styles/theme";
import { Close } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Michroma } from "next/font/google";
import Image from "next/image";
import React from "react";

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

interface ProductDetails {
  item: {
    category: string;
    category_image: string;
    products: {
      id: number;
      name: string;
      description: string;
      image: string;
      key_features?: string[];
      uses?: string[];
    }[];
  };
}

const ProductSection = ({ item }: ProductDetails) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedProduct, setSelectedProduct] = React.useState<null | {
    id: number;
    name: string;
    description: string;
    image: string;
    key_features?: string[];
    uses?: string[];
  }>(null);

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const cardsPerView = 4;

  const nextSlide = () => {
    if (currentSlide + cardsPerView < item.products.length) {
      setCurrentSlide(currentSlide + cardsPerView);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - cardsPerView);
    }
  };

  return (
    <Box sx={{ mx: 3, my: 10 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "primary.main" }}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={michroma.style.fontFamily}
        >
          {item.category}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container spacing={4}>
          {item.products.map((product) => (
            <Grid size={{ xs: 6, md: 3 }} key={product.id}>
              <Card
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: 2,
                  cursor: "pointer",
                  minHeight: "200px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s ease-in-out",
                  },
                }}
                elevation={0}
              >
                <CardActionArea
                  disableRipple
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardMedia
                    component="img"
                    height="100%"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#f8f3ea",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      gutterBottom
                      sx={{ mb: 0 }}
                    >
                      {product.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedProduct && (
        <Box sx={{ m: isMobile ? 0 : 8, mt: 8 }}>
          <Grid container spacing={8}>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ position: "relative", height: isMobile ? "400px" : "auto" }}
            >
              <Image
                src={selectedProduct.image}
                alt={selectedProduct?.name}
                fill={true}
                style={{ borderRadius: 8 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent={"space-between"}
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="h4"
                  fontWeight={600}
                  sx={{ mb: 2 }}
                  fontFamily={michroma.style.fontFamily}
                  color="primary.main"
                >
                  {selectedProduct.name}
                </Typography>
                <Close
                  fontSize="medium"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    position: "absolute",
                    right: 24,
                  }}
                  onClick={() => setSelectedProduct(null)}
                />
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.primary", mb: 2 }}
                textAlign={"justify"}
              >
                {selectedProduct.description}
              </Typography>
              {selectedProduct.key_features && (
                <>
                  <Typography
                    variant="h5"
                    sx={{ color: "primary.main" }}
                    textAlign={"left"}
                  >
                    Key Features:
                  </Typography>

                  <ul>
                    {selectedProduct.key_features.map((feature, index) => (
                      <li key={index}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {selectedProduct.uses && (
                <>
                  <Typography
                    variant="h5"
                    sx={{ color: "primary.main" }}
                    textAlign={"left"}
                  >
                    Uses:
                  </Typography>

                  <ul>
                    {selectedProduct.uses?.map((use, index) => (
                      <li key={index}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {use}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductSection;
