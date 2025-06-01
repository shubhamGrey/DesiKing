"use client";
import {
  Box,
  IconButton,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentPage, setCurrentPage] = React.useState(0);
  const [slideDirection, setSlideDirection] = React.useState<
    "left" | "right" | "up" | "down" | undefined
  >("right");

  const cardsPerPage = isMobile ? 1 : 2; // Show 1 item per slider in mobile view, 2 otherwise
  const autoSlideInterval = 5000; // 5 seconds

  const handleNextPage = React.useCallback(() => {
    setSlideDirection(isMobile ? "up" : "left");
    setCurrentPage((prevPage) =>
      prevPage >= Math.ceil(items.length / cardsPerPage) - 1 ? 0 : prevPage + 1
    );
  }, [items.length, cardsPerPage, isMobile]);

  const handleDotClick = (pageIndex: number) => {
    setSlideDirection(
      isMobile
        ? pageIndex > currentPage
          ? "up"
          : "down"
        : pageIndex > currentPage
        ? "left"
        : "right"
    );
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
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
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
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  width: isMobile ? "91%" : "45%",
                  p: 2,
                  position: "absolute",
                  left: isMobile ? 0 : `${(index % cardsPerPage) * 50}%`,
                  bottom: isMobile ? "20%" : 0,
                  transition: isMobile ? "bottom 0.5s ease" : "left 0.5s ease",
                }}
              >
                <Stack direction={"row"} spacing={2}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={isMobile ? 50 : 150}
                    height={isMobile ? 50 : 150}
                    style={{
                      borderRadius: "50%",
                      // marginBottom: "16px",
                      minWidth: isMobile ? "50px" : "150px",
                    }}
                  />
                  <Box>
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      color={theme.palette.text.primary}
                      sx={{ mb: 2, mt: isMobile ? 0 : 2 }}
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
              width: isMobile ? "100%" : "2px",
              height: isMobile ? "2px" : "100%",
              backgroundColor: theme.palette.divider,
              position: "absolute",
              left: isMobile ? "50%" : "1px",
              transform: "translateX(-50%)",
              top: 0,
            }}
          />
          <Box
            sx={{
              width: isMobile ? "100%" : "2px",
              height: isMobile ? "2px" : "100%",
              backgroundColor: theme.palette.divider,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: isMobile ? "50px" : "0",
            }}
          />
          {!isMobile && (
            <Box
              sx={{
                width: "2px",
                height: "100%",
                backgroundColor: theme.palette.divider,
                position: "absolute",
                right: "1px",
                transform: "translateX(-50%)",
                top: 0,
              }}
            />
          )}
        </Box>
      </Box>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={0}
        sx={{ mt: isMobile ? -3 : 3 }}
        style={
          isMobile
            ? {
                position: "absolute",
                right: isMobile ? -20 : 10,
                top: "50%",
                transform: "translateY(-50%)",
              }
            : {}
        }
      >
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
                  transform: isMobile ? "rotate(90deg)" : "",
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
