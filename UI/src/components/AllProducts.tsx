import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Category {
  title: string;
  image: string;
}

interface AllProductsProps {
  items: Category[];
  route?: string;
}

export default function AllProducts({ items }: AllProductsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (isSmallScreen) {
      setCardsPerView(1);
    } else if (isMediumScreen) {
      setCardsPerView(2);
    } else {
      setCardsPerView(4);
    }
  }, [isSmallScreen, isMediumScreen]);

  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextIndex = prev + 1;
        return nextIndex >= items.length - cardsPerView + 1 ? 0 : nextIndex;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [items.length, cardsPerView]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`,
          transition: "transform 0.3s ease-in-out",
          width: "100%",
          gap: 2,
          pb: 1,
        }}
      >
        {items.map((category) => (
          <Card
            key={category.title}
            aria-label={`${category.title} category`}
            sx={{
              minWidth: `${100 / cardsPerView - (1 / cardsPerView) * 4}%`,
              flexShrink: 0,
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              opacity: 1,
              pointerEvents: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              height: 240,
            }}
          >
            <CardMedia
              component="img"
              height="184"
              image={category.image}
              alt={category.title}
            />
            <CardContent
              sx={{
                backgroundColor: "#f8f3ea",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pb: "16px !important", // Ensure padding is consistent
              }}
            >
              <Typography
                variant="body1"
                gutterBottom
                sx={{ mb: 0 }}
                color="text.primary"
              >
                {category.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </section>
  );
}
