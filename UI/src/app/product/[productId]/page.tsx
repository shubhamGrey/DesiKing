"use client";
import { michroma } from "@/app/layout";
import AdditionalDetails from "@/components/Product Details/AdditionalDetails";
import ProductDetails from "@/components/Product Details/ProductDetails";
import ProductShowcase from "@/components/Product Details/ProductShowcase";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
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
}

const ProductDetailsComponent = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const { productId } = useParams() as { productId: string };

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching product: ${response.statusText}`);
        }
        const data: Product = await response.json();
        setSelectedProduct(data);

        // Fetch similar products
        const similarResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/category/${data.categoryId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!similarResponse.ok) {
          throw new Error(
            `Error fetching similar products: ${similarResponse.statusText}`
          );
        }
        const similarData: Product[] = await similarResponse.json();
        setSimilarProducts(
          similarData.filter((product) => product.id !== data.id)
        );
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!selectedProduct) {
    return (
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{ height: 200, backgroundColor: "grey.300", borderRadius: 2 }}
          />
          <Box
            sx={{
              height: 20,
              width: "60%",
              backgroundColor: "grey.300",
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              height: 20,
              width: "80%",
              backgroundColor: "grey.300",
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              height: 20,
              width: "40%",
              backgroundColor: "grey.300",
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>
    );
  }

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
            [{similarProducts.length}]
          </Typography>
        </Typography>
        <ProductShowcase
          productSections={similarProducts.map((product) => ({
            key: product.id,
            title: product.name,
            description: product.description,
            image: product.imageUrls[0] || "",
          }))}
        />
      </Box>
    </>
  );
};

export default ProductDetailsComponent;
