"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Grid } from "@mui/material";
import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface RecentProduct {
  id: string;
  name: string;
  thumbnailUrl?: string;
  viewedAt: number;
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<RecentProduct[]>([]);
  const { getRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const all = getRecentlyViewed();
    setItems(excludeId ? all.filter((p) => p.id !== excludeId) : all);
  }, [excludeId, getRecentlyViewed]);

  if (items.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Recently Viewed
      </Typography>
      <Grid container spacing={2}>
        {items.slice(0, 4).map((product) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
            <Card
              component={Link}
              href={`/product/${product.id}`}
              sx={{ textDecoration: "none" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={product.thumbnailUrl || "/placeholder.png"}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
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
