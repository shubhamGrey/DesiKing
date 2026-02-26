"use client";
import { Box, Slide, Stack, useMediaQuery } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import React, { useEffect } from "react";
import theme from "@/styles/theme";

interface CarousalProps {
  items: {
    image: StaticImageData;
  }[];
}

const Carousal = ({ items }: CarousalProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentPage, setCurrentPage] = React.useState(0);
  const [slideDirection, setSlideDirection] = React.useState<
    "left" | "right" | undefined
  >("right");

  const cardsPerPage = 1;
  const autoSlideInterval = 5000; // 5 seconds

  const handleNextPage = React.useCallback(() => {
    setSlideDirection("left");
    setCurrentPage((prevPage) =>
      prevPage >= Math.ceil(items.length / cardsPerPage) - 1 ? 0 : prevPage + 1
    );
  }, [items.length, cardsPerPage]);

  const handleDotClick = (pageIndex: number) => {
    setSlideDirection(pageIndex > currentPage ? "left" : "right");
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextPage();
    }, autoSlideInterval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [currentPage, items.length, handleNextPage]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        height: isMobile ? "250px" : "500px",
        justifyContent: "center",
        position: "relative",
        borderRadius: { xs: 0, md: "0 0 24px 24px" },
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(to top, rgba(31, 79, 64, 0.6) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {items.map((item, index) => (
            <Slide
              key={index}
              direction={slideDirection}
              in={index === currentPage}
              mountOnEnter
              unmountOnExit
              timeout={{ enter: 600, exit: 400 }}
            >
              <Box
                key={`card-${index}`}
                sx={{
                  display: currentPage === index ? "block" : "none",
                  width: "100%",
                  height: "100%",
                  animation:
                    index === currentPage ? "fadeIn 0.6s ease-out" : "none",
                }}
              >
                <Image
                  src={item.image}
                  alt={`Carousal Image ${index + 1}`}
                  fill
                  priority={index === 0}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </Slide>
          ))}
        </Box>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: isMobile ? 16 : 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          padding: "8px 16px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        {Array.from({ length: Math.ceil(items.length / cardsPerPage) }).map(
          (_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                cursor: "pointer",
                width: index === currentPage ? 24 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor:
                  index === currentPage
                    ? "secondary.main"
                    : "rgba(255, 255, 255, 0.5)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor:
                    index === currentPage
                      ? "secondary.main"
                      : "rgba(255, 255, 255, 0.8)",
                  transform: "scale(1.1)",
                },
              }}
            />
          )
        )}
      </Stack>
    </Box>
  );
};

export default Carousal;
