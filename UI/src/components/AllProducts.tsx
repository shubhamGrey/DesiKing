import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FormattedCategory } from "@/types/product";
import { isAdmin } from "@/utils/auth";

interface AllProductsProps {
  items: FormattedCategory[];
  onDelete?: (id: string) => void; // Added onDelete prop
}

export default function AllProducts({ items, onDelete }: AllProductsProps) {
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
        fontFamily: theme.typography.body1.fontFamily,
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
            key={category.id}
            aria-label={`${category.title} category`}
            sx={{
              minWidth: `${100 / cardsPerView - (1 / cardsPerView) * 4}%`,
              flexShrink: 0,
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              opacity: 1,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              height: 260,
              border: "1px solid rgba(232, 93, 4, 0.08)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 16px 40px rgba(232, 93, 4, 0.15)",
                "& .category-img": {
                  transform: "scale(1.05)",
                },
                "& .category-overlay": {
                  opacity: 1,
                },
              },
            }}
          >
            {/* Edit and Delete Icon Buttons */}
            {isAdmin() && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                  zIndex: 2,
                }}
              >
                <IconButton
                  color="primary"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    sessionStorage.setItem("categoryId", category.id);
                    router.push("/add-category");
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid",
                    borderColor: "error.main",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "error.contrastText",
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete(category.id);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
              <CardMedia
                className="category-img"
                component="img"
                height="200"
                image={category.image}
                alt={category.title}
                sx={{
                  transition: "transform 0.5s ease",
                }}
              />
              <Box
                className="category-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to top, rgba(232, 93, 4, 0.6) 0%, transparent 60%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                }}
              />
            </Box>
            <CardContent
              sx={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 1.5,
                borderTop: "3px solid",
                borderImage: "linear-gradient(90deg, #E85D04, #1B4D3E) 1",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                }}
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
