"use client";
import { Box, IconButton, Slide, Stack, useMediaQuery } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
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
      // handleNextPage();
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
        height: isMobile ? "200px" : "450px",
        justifyContent: "center",
        position: "relative",
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
            >
              <Box
                key={`card-${index}`}
                sx={{
                  display: currentPage === index ? "block" : "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Image
                  src={item.image}
                  alt={`Carousal Image ${index + 1}`}
                  fill
                  style={{
                    // objectFit: "cover",
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
        direction="column"
        spacing={0}
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {Array.from({ length: Math.ceil(items.length / cardsPerPage) }).map(
          (_, index) => (
            <IconButton
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                cursor: "pointer",
              }}
            >
              <RadioButtonUncheckedIcon
                fontSize="medium"
                sx={{
                  color:
                    index === currentPage
                      ? "primary.contrastText"
                      : "primary.main",
                  transform: "rotate(90deg)",
                }}
              />
            </IconButton>
          )
        )}
      </Stack>
    </Box>
  );
};

export default Carousal;
