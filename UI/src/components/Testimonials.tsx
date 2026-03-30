// UI/src/components/Testimonials.tsx
"use client";
import { Box, Typography, useMediaQuery } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import Image, { StaticImageData } from "next/image";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import theme from "@/styles/theme";

interface TestimonialsProps {
  items: {
    image: StaticImageData;
    name: string;
    review: string;
    occupation: string;
    rating?: number;
  }[];
}

const cardVariants = {
  enter: { x: 80, opacity: 0 },
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
  exit: {
    x: -80,
    opacity: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 20, delay: i * 0.08 },
  }),
};

const quoteVariants = {
  hidden: { scale: 0, rotate: -20, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 0.08,
    transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 },
  },
};

const Testimonials = ({ items }: TestimonialsProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const cardsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(items.length / cardsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleItems = items.slice(
    currentIndex * cardsPerPage,
    currentIndex * cardsPerPage + cardsPerPage
  );

  return (
    <Box sx={{ width: "100%", py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 3, md: 4 },
          justifyContent: "center",
          alignItems: "stretch",
          px: { xs: 2, md: 4 },
          minHeight: { xs: "auto", md: "280px" },
        }}
      >
        <AnimatePresence mode="wait">
          {visibleItems.map((item, index) => (
            <motion.div
              key={`${currentIndex}-${index}`}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                flex: isMobile ? "1 1 auto" : "0 1 45%",
                maxWidth: isMobile ? "100%" : "500px",
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "20px",
                padding: isMobile ? "24px" : "32px",
                position: "relative",
                boxShadow: "0 10px 40px rgba(31, 79, 64, 0.08)",
                border: "1px solid rgba(31, 79, 64, 0.06)",
              }}
              whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(31,79,64,0.14)" }}
            >
              {/* Animated quote icon */}
              <motion.div
                variants={quoteVariants}
                initial="hidden"
                animate="visible"
                style={{ position: "absolute", top: 16, right: 20 }}
              >
                <FormatQuoteIcon
                  sx={{
                    fontSize: { xs: 40, md: 50 },
                    color: "rgba(31, 79, 64, 1)",
                    transform: "rotate(180deg)",
                  }}
                />
              </motion.div>

              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Stars */}
                <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                  {Array.from({ length: item.rating ?? 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={starVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <StarIcon sx={{ fontSize: 18, color: "#E85D04" }} />
                    </motion.div>
                  ))}
                </Box>

                {/* Review */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontStyle: "italic",
                    lineHeight: 1.8,
                    mb: 3,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    flex: 1,
                  }}
                >
                  &ldquo;{item.review}&rdquo;
                </Typography>

                {/* Author */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    pt: 2,
                    borderTop: "1px solid rgba(31, 79, 64, 0.08)",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 56, md: 64 },
                      height: { xs: 56, md: 64 },
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #1B4D3E",
                      boxShadow: "0 4px 12px rgba(31, 79, 64, 0.15)",
                      flexShrink: 0,
                    }}
                  >
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "primary.dark", fontSize: { xs: "1rem", md: "1.1rem" } }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: { xs: "0.85rem", md: "0.9rem" } }}
                    >
                      {item.occupation}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Dot indicators */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 4 }}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.div
            key={index}
            onClick={() => setCurrentIndex(index)}
            animate={{
              width: index === currentIndex ? 28 : 10,
              backgroundColor:
                index === currentIndex ? "#1B4D3E" : "rgba(31, 79, 64, 0.2)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ height: 10, borderRadius: 5, cursor: "pointer" }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;
