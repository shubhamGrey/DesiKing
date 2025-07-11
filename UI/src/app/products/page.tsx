"use client";
import ProductSection from "@/components/ProductSection";
import { Box, Typography, useMediaQuery, Fab, Skeleton } from "@mui/material";
import Image from "next/image";
import DesiKing from "../../../public/DesiKing.png";
import theme from "@/styles/theme";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

interface CategorizedProducts {
  [key: string]: {
    categoryId: string;
    categoryName: string;
    products: Product[];
  };
}

const Products = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [productsList, setProductsList] = useState<
    CategorizedProducts[keyof CategorizedProducts][]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const categorizedProducts: CategorizedProducts = data.reduce(
          (acc: CategorizedProducts, product: Product) => {
            const { categoryId, categoryName } = product;
            acc[categoryId] ??= {
              categoryId,
              categoryName,
              products: [],
            };
            acc[categoryId].products.push(product);
            return acc;
          },
          {}
        );

        const categorizedProductsArray = Object.values(categorizedProducts);

        const sortedArray = categorizedProductsArray.map((category) => {
          return {
            ...category,
            products: category.products.sort((a, b) => {
              // Sort by name in ascending order
              return b.name.localeCompare(a.name);
            }),
          };
        });
        console.log("Sorted Products:", sortedArray);
        setProductsList(sortedArray);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="30%"
          height={200}
          sx={{ marginTop: 4 }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={40}
          sx={{ marginTop: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="90%"
          height={400}
          sx={{ marginTop: 4 }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          backgroundImage: 'url("/ProductBackground.png")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={DesiKing}
          alt="Desi King"
          style={{ width: "30%", height: "30%", marginTop: 32 }}
        />
        <Typography
          variant="body1"
          sx={{ mb: 4, mt: 2 }}
          color="primary.contrastText"
          fontSize={isMobile ? "0.2rem" : "1rem"}
        >
          A legacy of authenticity in every pinch.
        </Typography>
      </Box>
      {productsList?.map((category) => (
        <ProductSection key={category.categoryId} item={category} />
      ))}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => router.push("/add-product")}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default Products;
