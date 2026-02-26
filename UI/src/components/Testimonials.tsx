"use client";
import { Box, Typography, useMediaQuery } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Image, { StaticImageData } from "next/image";
import React, { useEffect } from "react";
import theme from "@/styles/theme";

interface TestimonialsProps {
  items: {
    image: StaticImageData;
    name: string;
    review: string;
    occupation: string;
  }[];
}

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
      {/* Cards Container */}
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
        {visibleItems.map((item, index) => (
          <Box
            key={`${currentIndex}-${index}`}
            sx={{
              flex: { xs: "1 1 auto", md: "0 1 45%" },
              maxWidth: { xs: "100%", md: "500px" },
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              borderRadius: "20px",
              p: { xs: 3, md: 4 },
              position: "relative",
              boxShadow: "0 10px 40px rgba(31, 79, 64, 0.08)",
              border: "1px solid rgba(31, 79, 64, 0.06)",
              transition: "all 0.4s ease",
              animation: "fadeInUp 0.5s ease-out",
              "@keyframes fadeInUp": {
                from: {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 20px 50px rgba(31, 79, 64, 0.12)",
              },
            }}
          >
            {/* Quote Icon */}
            <FormatQuoteIcon
              sx={{
                position: "absolute",
                top: 16,
                right: 20,
                fontSize: { xs: 40, md: 50 },
                color: "rgba(31, 79, 64, 0.08)",
                transform: "rotate(180deg)",
              }}
            />

            {/* Content */}
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              {/* Review Text */}
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

              {/* Author Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  pt: 2,
                  borderTop: "1px solid rgba(31, 79, 64, 0.08)",
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid #1f4f40",
                    boxShadow: "0 4px 12px rgba(31, 79, 64, 0.15)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                {/* Name & Occupation */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "primary.dark",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    {item.occupation}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Dot Indicators */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1.5,
          mt: 4,
        }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: index === currentIndex ? 28 : 10,
              height: 10,
              borderRadius: "5px",
              backgroundColor:
                index === currentIndex
                  ? "primary.main"
                  : "rgba(31, 79, 64, 0.2)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor:
                  index === currentIndex
                    ? "primary.main"
                    : "rgba(31, 79, 64, 0.4)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;
