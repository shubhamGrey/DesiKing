"use client";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Michroma } from "next/font/google";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
                  minHeight: "273px",
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
                  // onClick={() => setSelectedProduct(product)}
                  onClick={() => {
                    router.push("/product/" + product.id);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="217px"
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
    </Box>
  );
};

export default ProductSection;
