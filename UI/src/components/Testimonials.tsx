"use client";
import { Box, IconButton, Slide, Stack, Typography } from "@mui/material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
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
  const [currentPage, setCurrentPage] = React.useState(0);
  const [slideDirection, setSlideDirection] = React.useState<
    "left" | "right" | undefined
  >("right");

  const cardsPerPage = 2; // Show 2 items per slider
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
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        height: "250px",
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
            position: "relative",
          }}
        >
          {items.map((item, index) => (
            <Slide
              key={index}
              direction={slideDirection}
              in={Math.floor(index / cardsPerPage) === currentPage}
              mountOnEnter
              unmountOnExit
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  width: "45%",
                  p: 2,
                  position: "absolute",
                  left: `${(index % cardsPerPage) * 50}%`,
                  transition: "left 0.5s ease",
                }}
              >
                <Stack direction={"row"} spacing={2}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={150}
                    height={150}
                    style={{
                      borderRadius: "50%",
                      marginBottom: "16px",
                      minWidth: "150px",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      color={theme.palette.text.primary}
                      sx={{ mb: 2, mt: 2 }}
                      textAlign={"justify"}
                    >
                      {item.review}
                    </Typography>
                    <Typography
                      variant="h6"
                      color={theme.palette.primary.dark}
                      textAlign={"right"}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.primary}
                      textAlign={"right"}
                    >
                      {item.occupation}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Slide>
          ))}
          <Box
            sx={{
              width: "2px",
              height: "100%",
              backgroundColor: theme.palette.divider,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </Box>
      </Box>
      <Stack direction="row" spacing={0} sx={{ mt: 2 }}>
        {Array.from({ length: Math.ceil(items.length / cardsPerPage) }).map(
          (_, index) => (
            <IconButton
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                cursor: "pointer",
                p: 0,
              }}
            >
              <HorizontalRuleIcon
                fontSize="large"
                sx={{
                  color:
                    index === currentPage
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                }}
              />
            </IconButton>
          )
        )}
      </Stack>
    </Box>
  );
};

export default Testimonials;
