"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Skeleton, Grid } from "@mui/material";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  thumbnailUrl?: string;
  categoryId?: string;
}

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!categoryId) { setIsLoading(false); return; }
    setIsLoading(true);
    fetch(`${apiUrl}/Product/category/${categoryId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.info?.isSuccess) {
          setProducts((json.data || []).filter((p: Product) => p.id !== currentProductId).slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [categoryId, currentProductId, apiUrl]);

  if (!isLoading && products.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        You Might Also Like
      </Typography>
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          : products.map((product) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
                <Card
                  component={Link}
                  href={`/product/${product.id}`}
                  sx={{ textDecoration: "none", height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.thumbnailUrl || "/placeholder.png"}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {product.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}
