"use client";
import theme from "@/styles/theme";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Michroma } from "next/font/google";
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

interface ProductDetails {
  item: {
    categoryName: string;
    categoryId: string;
    products: {
      id: string;
      name: string;
      description: string;
      brandId: string;
      categoryId: string;
      categoryName: string;
      manufacturingDate: string;
      createdDate: string;
      modifiedDate: string | null;
      isActive: boolean;
      isDeleted: boolean;
      metaTitle: string;
      metaDescription: string;
      imageUrls: string[];
      keyFeatures: string[];
      uses: string[];
      origin: string;
      shelfLife: string;
      storageInstructions: string;
      certifications: string[];
      isPremium: boolean;
      isFeatured: boolean;
      ingredients: string;
      nutritionalInfo: string;
      thumbnailUrl?: string;
    }[];
  };
}

const ProductSection = ({ item }: ProductDetails) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          {item.categoryName}
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
                  minHeight: isMobile ? "224px" : "273px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s ease-in-out",
                  },
                  position: "relative",
                }}
                elevation={0}
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
                        e.stopPropagation();
                        sessionStorage.setItem("productId", product.id);
                        router.push("/add-product");
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
                        e.stopPropagation();
                        console.log("Delete product:", product.id);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                <CardActionArea
                  disableRipple
                  onClick={() => {
                    router.push("/product/" + product.id);
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "172px" : "217px"}
                    image={product.thumbnailUrl}
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
                      variant={isMobile ? "body2" : "body1"}
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
