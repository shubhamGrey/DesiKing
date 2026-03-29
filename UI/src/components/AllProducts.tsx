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
import { motion } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";

interface AllProductsProps {
  items: FormattedCategory[];
  onDelete?: (id: string) => void; // Added onDelete prop
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

interface TiltCardProps {
  children: React.ReactNode;
  minWidth: string;
}

function TiltCard({ children, minWidth }: TiltCardProps) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = use3DTilt(10);
  return (
    <motion.div
      variants={cardVariants}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        minWidth,
        flexShrink: 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
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
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
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
          <TiltCard
            key={category.id}
            minWidth={`${100 / cardsPerView - (1 / cardsPerView) * 4}%`}
          >
            <Card
              aria-label={`${category.title} category`}
              sx={{
                width: "100%",
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                opacity: 1,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                height: 260,
                border: "1px solid rgba(232, 93, 4, 0.08)",
                transition: "box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 16px 40px rgba(232, 93, 4, 0.2)",
                  "& .category-img": { transform: "scale(1.05)" },
                  "& .category-overlay": { opacity: 1 },
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
          </TiltCard>
        ))}
      </Box>
    </motion.section>
  );
}
