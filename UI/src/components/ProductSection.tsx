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
  IconButton,
} from "@mui/material";
import { Michroma } from "next/font/google";
import Image from "next/image";
import React from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

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
          backgroundImage: `url('${item.category_image}')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          p: 4,
          borderRadius: 4,
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "primary.contrastText" }}
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
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {!isMobile && (
          <IconButton
            onClick={prevSlide}
            aria-label="Previous category"
            disabled={currentSlide === 0}
            sx={{
              position: "relative",
              zIndex: 1,
              bgcolor: "transparent",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
              },
              "&:focus": {
                outline: "none",
              },
              "&:disabled": {
                bgcolor: "#E0E0E0",
                border: "none",
              },
              mr: 2,
            }}
          >
            <ArrowBack />
          </IconButton>
        )}
        {isMobile ? (
          <Grid container spacing={4}>
            {item.products.map((product) => (
              <Grid size={{ xs: 6 }} key={product.id}>
                <Card
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: 2,
                    cursor: "pointer",
                    minHeight: "200px",
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
                        fontFamily={michroma.style.fontFamily}
                      >
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            sx={{
              flexGrow: 1,
              flexWrap: "nowrap",
            }}
          >
            {item.products
              .slice(currentSlide, currentSlide + cardsPerView)
              .map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    width: 350, // Fixed width for each card
                    backgroundColor: "transparent",
                    borderRadius: 2,
                    cursor: "pointer",
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
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                        fontFamily={michroma.style.fontFamily}
                      >
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
          </Stack>
        )}
        {!isMobile && (
          <IconButton
            onClick={nextSlide}
            aria-label="Next category"
            disabled={currentSlide + cardsPerView >= item.products.length}
            sx={{
              position: "relative",
              zIndex: 1,
              bgcolor: "transparent",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
              },
              "&:focus": {
                outline: "none",
              },
              "&:disabled": {
                bgcolor: "#E0E0E0",
                border: "none",
              },
              ml: 2,
            }}
          >
            <ArrowForward />
          </IconButton>
        )}
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
