import theme from "@/styles/theme";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

const HomeGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxIndex, setBoxIndex] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const boxes: Array<keyof typeof images> = [
    "box1",
    "box2",
    "box3",
    "box4",
    "box5",
  ];
  const images = {
    box1: [
      "/Turmeric1.jpg",
      "/Turmeric2.webp",
      "/Turmeric3.png",
      "/Turmeric4.jpg",
      "/Turmeric5.jpg",
    ],
    box2: [
      "/RedChili1.avif",
      "/RedChili2.webp",
      "/RedChili2.jpg",
      "/RedChili4.jpg",
      "/RedChili5.webp",
    ],
    box3: [
      "/Cumin1.jpg",
      "/Cumin2.jpg",
      "/Cumin3.jpg",
      "/Cumin4.jpg",
      "/Cumin5.jpg",
    ],
    box4: [
      "/GaramMasala1.jpg",
      "/GaramMasala2.jpg",
      "/GaramMasala3.jpg",
      "/GaramMasala4.webp",
      "/GaramMasala5.jpg",
    ],
    box5: [
      "/Coriander1.jpg",
      "/Coriander2.jpg",
      "/Coriander3.jpg",
      "/Coriander4.jpeg",
      "/Coriander5.webp",
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.box1.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.box1.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setBoxIndex((prevIndex) => (prevIndex + 1) % boxes.length),
    onSwipedRight: () =>
      setBoxIndex((prevIndex) =>
        prevIndex === 0 ? boxes.length - 1 : prevIndex - 1
      ),
  });

  const getBoxLabel = () => {
    switch (boxes[boxIndex]) {
      case "box1":
        return "Organic Turmeric";
      case "box2":
        return "Red Chili";
      case "box3":
        return "Cumin";
      case "box4":
        return "Coriander";
      case "box5":
        return "Garam Masala";
      default:
        return "";
    }
  };

  return (
    <>
      {!isMobile ? (
        <Grid container spacing={1} height={800}>
          <Grid
            size={{ xs: 12, md: 6 }}
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
            </Stack>
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
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
        <Grid container spacing={1} height={400}>
          <Grid
            size={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box {...swipeHandlers} sx={{ height: "100%", width: "100%" }}>
              {boxes.map((box, idx) => (
                <Box
                  key={box}
                  sx={{
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    position: "relative",
                    display: boxIndex === idx ? "block" : "none",
                  }}
                >
                  <Box
                    component="div"
                    className="image-slider"
                    sx={{
                      height: "100%",
                      width: "100%",
                      backgroundImage: `url(${images[box][currentIndex]})`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "start",
                      transition: "background-image 1s ease-in-out",
                    }}
                  >
                    <Stack
                      direction="column"
                      spacing={2}
                      sx={{ p: 3, width: 170 }}
                    >
                      <Typography variant="h4" color="primary.contrastText">
                        {getBoxLabel()}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "primary.contrastText",
                          color: "primary.main",
                          fontWeight: 600,
                          boxShadow: "none",
                        }}
                        onClick={() => {
                          router.push("/products");
                        }}
                      >
                        View Product
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomeGrid;
