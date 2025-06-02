import theme from "@/styles/theme";
import { Box, Grid, Stack, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";

const HomeGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const images = {
    box1: ["/VerticleSpice1.jpg", "/VerticleSpice4.jpg", "/VerticleSpice3.jpg"],
    box2: ["/VerticleSpice6.jpg", "/VerticleSpice2.jpg", "/VerticleSpice5.jpg"],
    box3: [
      "/HorizontalSpice3.jpg",
      "/HorizontalSpice1.jpg",
      "/HorizontalSpice6.jpg",
    ],
    box4: [
      "/HorizontalSpice4.jpg",
      "/HorizontalSpice5.jpg",
      "/HorizontalSpice2.jpg",
    ],
    box5: [
      "/HorizontalSpice9.jpg",
      "/HorizontalSpice8.jpg",
      "/HorizontalSpice7.jpg",
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.box1.length);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <>
      {!isMobile ? (
        <Grid container spacing={1} height={800}>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component="div"
                className="image-slider"
                sx={{
                  height: "100%",
                  width: "100%",
                  backgroundImage: `url(${images.box1[currentIndex]})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "center",
                  transition: "background-image 1s ease-in-out",
                }}
              />
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  backgroundImage: `url(${images.box2[currentIndex]})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-image 1s ease-in-out",
                }}
              />
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack direction={"column"} spacing={1} height="100%" width="100%">
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundImage: `url(${images.box3[currentIndex]})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    transition: "background-image 1s ease-in-out",
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundImage: `url(${images.box4[currentIndex]})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    transition: "background-image 1s ease-in-out",
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundImage: `url(${images.box5[currentIndex]})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    transition: "background-image 1s ease-in-out",
                  }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1} height={800}>
          {Object.entries(images).map((item) => (
            <Grid
              key={item[0]}
              size={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  component="div"
                  className="image-slider"
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundImage: `url(${item[1][currentIndex]})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    transition: "background-image 1s ease-in-out",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default HomeGrid;
