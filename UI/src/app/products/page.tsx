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

const products = [
  {
    id: 1,
    name: "Turmeric Powder",
    description: "High-quality turmeric powder for culinary and medicinal use.",
    image: "/Turmeric.png",
  },
  {
    id: 2,
    name: "Cumin Powder",
    description: "Pure cumin powder, perfect for enhancing flavors in dishes.",
    image: "/Cumin.png",
  },
  {
    id: 3,
    name: "Chili Powder",
    description: "Spicy chili powder to add heat to your recipes.",
    image: "/Chili.png",
  },
  {
    id: 4,
    name: "Coriander Powder",
    description: "Ground coriander seeds for a citrusy flavor in dishes.",
    image: "/Coriander.png",
  },
];

const Products = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedProduct, setSelectedProduct] = React.useState<null | {
    id: number;
    name: string;
    description: string;
    image: string;
  }>(null);

  return (
    <Box sx={{ mx: 3, my: 10 }}>
      <Box
        sx={{
          backgroundImage: 'url("/Product Brand.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          p: 4,
          borderRadius: 4,
          height: "300px",
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
          Powdered Spices
        </Typography>
      </Box>
      <Box sx={{ mt: 10 }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={4}
          justifyContent="center"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                maxWidth: 345,
                backgroundColor: "transparent",
                borderRadius: 2,
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
                  sx={{
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                />
                <CardContent>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {product.name}
                  </Typography>
                  {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {product.description}
                  </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>

      {selectedProduct && (
        <Box sx={{ m: 10 }}>
          <Grid container spacing={10}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Image
                src={selectedProduct.image}
                alt={selectedProduct?.name}
                layout="responsive"
                width={500}
                height={500}
                style={{ borderRadius: 8 }}
              />
            </Grid>
            <Grid size={{ xs: 11, md: 5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{ mb: 2 }}
                fontFamily={michroma.style.fontFamily}
                color="primary.main"
              >
                {selectedProduct.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {selectedProduct.description}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 1, md: 1 }}
              display={"flex"}
              justifyContent={"right"}
            >
              <Close
                fontSize="medium"
                sx={{ color: "primary.main", cursor: "pointer" }}
                onClick={() => setSelectedProduct(null)}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Products;
