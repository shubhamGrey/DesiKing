"use client";
import { michroma } from "@/app/layout";
import AdditionalDetails from "@/components/Product Details/AdditionalDetails";
import ProductDetails from "@/components/Product Details/ProductDetails";
import ProductShowcase from "@/components/Product Details/ProductShowcase";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  key_features?: string[];
  uses?: string[];
  price: string;
  category: string;
  quantity?: string;
  customer_reviews?: string[];
}

const ProductDetailsComponent = () => {
  const [selectedProduct] = React.useState<Product>({
    id: 1,
    name: "Turmeric Powder",
    description:
      "AGRO NEXIS Turmeric Powder is made from the finest turmeric roots, known for its vibrant color and health benefits. \
      Ground to perfection to preserve its natural aroma and flavor, this turmeric powder is ideal for cooking, baking, and health supplements. \
      It adds a warm, earthy flavor to dishes and is rich in curcumin, a powerful antioxidant.",
    images: [
      "/Turmeric1.jpg",
      "/Turmeric2.jpeg",
      "/Turmeric3.jpg",
      "/Turmeric4.jpg",
      "/Turmeric5.jpg",
    ],
    key_features: [
      "100% Pure and Natural",
      "Rich in Curcumin",
      "No Artificial Additives",
      "Packed in a Hygienic Environment",
      "Sourced from Trusted Farmers",
    ],
    uses: [
      "Turmeric powder is versatile and can be used in various dishes such as curries, soups, stews, and even smoothies.",
      "It is commonly used in Indian cuisine for its flavor and color.",
      "In addition to culinary uses, turmeric powder is often added to health drinks and supplements for its potential health benefits.",
    ],
    price: "$10.99",
    category: "Powdered Spices",
    quantity: "100gm",
    customer_reviews: [
      "Excellent quality! The turmeric powder has a rich color and flavor.",
      "I love using this in my cooking. It adds a wonderful aroma and taste to my dishes.",
      "Great product! I appreciate the purity and natural ingredients.",
      "This turmeric powder is a staple in my kitchen. Highly recommend it!",
      "Fast shipping and well-packaged. The quality is top-notch.",
      "I've tried many turmeric powders, and this one is by far the best. The flavor is amazing!",
    ],
  });

  return (
    <>
      <Container sx={{ m: 6, justifySelf: "center" }}>
        <ProductDetails selectedProduct={selectedProduct} />
        <AdditionalDetails selectedProduct={selectedProduct} />
      </Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          mt: 16,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 4,
            color: "primary.main",
            position: "relative",
            display: "inline-block",
          }}
          fontFamily={michroma.style.fontFamily}
        >
          Similar Products
          <Typography
            component="span"
            sx={{
              position: "relative",
              top: -20,
              right: -10,
              fontSize: "0.75rem",
              color: "primary.main",
            }}
          >
            [4]
          </Typography>
        </Typography>
        <ProductShowcase />
      </Box>
    </>
  );
};

export default ProductDetailsComponent;
