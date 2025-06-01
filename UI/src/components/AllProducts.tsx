import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { michroma } from "@/app/layout";
import { useRouter } from "next/navigation";

interface Category {
  title: string;
  image: string;
  coming_soon?: boolean;
}

interface AllProductsProps {
  items: Category[];
  route: string;
}

export default function AllProducts({ items }: AllProductsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
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

  const nextSlide = () => {
    if (currentSlide + cardsPerView < items.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <Box
      role="region"
      aria-label="Fish category carousel"
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: "40px",
      }}
    >
      <IconButton
        onClick={prevSlide}
        aria-label="Previous category"
        disabled={currentSlide === 0}
        sx={{
          position: "absolute",
          left: "16px",
          zIndex: 1,
          bgcolor: "transparent",
          color: "primary.main",
          border: "1px solid",
          borderColor: "primary.main",
          "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
          "&:focus": {
            outline: "none",
          },
          "&:disabled": {
            bgcolor: "#E0E0E0",
            border: "none",
          },
        }}
      >
        <ArrowBack />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`,
          transition: "transform 0.3s ease-in-out",
          width: "100%",
          gap: "8px",
        }}
      >
        {items.map((category, index) => (
          <Card
            key={index}
            role="group"
            aria-label={`${category.title} category`}
            sx={{
              minWidth: `${100 / cardsPerView - (1 / cardsPerView) * 2}%`,
              flexShrink: 0,
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              opacity: category.coming_soon ? 0.5 : 1,
              pointerEvents: category.coming_soon ? "none" : "auto",
              boxShadow: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!category.coming_soon) {
                router.push("/products");
              }
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={category.image}
              alt={category.title}
              sx={{
                "&:hover": !category.coming_soon
                  ? {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    }
                  : {},
              }}
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
                fontFamily={michroma.style.fontFamily}
                sx={{ mb: 0 }}
                color="primary.main"
              >
                {category.title}
              </Typography>
            </CardContent>
            {category.coming_soon && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#FFF",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Coming soon
              </Box>
            )}
          </Card>
        ))}
      </Box>
      <IconButton
        onClick={nextSlide}
        aria-label="Next category"
        disabled={currentSlide + cardsPerView >= items.length}
        sx={{
          position: "absolute",
          right: "16px",
          zIndex: 1,
          bgcolor: "transparent",
          color: "primary.main",
          border: "1px solid",
          borderColor: "primary.main",
          "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
          "&:focus": {
            outline: "none",
          },
          "&:disabled": {
            bgcolor: "#E0E0E0",
            border: "none",
          },
        }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
}
