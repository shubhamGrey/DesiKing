"use client";
import ProductSection from "@/components/ProductSection";
import { Box, Typography, useMediaQuery, Fab, Skeleton } from "@mui/material";
import Image from "next/image";
import DesiKing from "../../../public/DesiKing.png";
import theme from "@/styles/theme";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Product, ProductFormData } from "@/types/product";

interface CategorizedProducts {
  [key: string]: {
    categoryId: string;
    categoryName: string;
    products: ProductFormData[];
  };
}

const Products = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [productsList, setProductsList] = useState<
    CategorizedProducts[keyof CategorizedProducts][]
  >([]);
  const [loading, setLoading] = useState(true);

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
          products: category.products
            .filter((product) => typeof product.id === "string" && product.id !== undefined)
            .map((product) => ({
              ...product,
              id: product.id as string, // Ensure id is string
            }))
            .sort((a, b) => {
              // Premium products first, then by name ascending
              if (a.isPremium === b.isPremium) {
                return b.name.localeCompare(a.name);
              }
              return a.isPremium ? -1 : 1;
            }),
        };
      });
      setProductsList(sortedArray);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Hero section skeleton */}
        <Box
          sx={{
            height: 400,
            backgroundColor: "grey.100",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            px: 2,
          }}
        >
          {/* Logo skeleton */}
          <Skeleton
            variant="rectangular"
            width="30%"
            height={120}
            sx={{ borderRadius: 2 }}
          />
          {/* Tagline skeleton */}
          <Skeleton variant="text" width="50%" height={24} />
        </Box>

        {/* Product sections skeleton */}
        <Box sx={{ px: 2, py: 4 }}>
          {[1, 2, 3].map((section) => (
            <Box key={section} sx={{ mb: 6 }}>
              {/* Section header */}
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>

              {/* Product cards grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {[1, 2, 3, 4, 5].map((card) => (
                  <Box
                    key={card}
                    sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2 }}
                  >
                    {/* Product image */}
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={120}
                      sx={{ borderRadius: 1, mb: 2 }}
                    />
                    {/* Product name */}
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    {/* Price */}
                    <Skeleton
                      variant="text"
                      width="50%"
                      height={24}
                      sx={{ mb: 2 }}
                    />
                    {/* Button */}
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={36}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* FAB skeleton */}
        <Skeleton
          variant="circular"
          width={56}
          height={56}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
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
        <ProductSection key={category.categoryId} item={category} onProductDeleted={fetchProducts} />
      ))}
      {Cookies.get("user_role") === "Admin" && (
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
      )}
    </>
  );
};

export default Products;
