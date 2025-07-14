import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import {
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import theme from "@/styles/theme";
import { useRouter } from "next/navigation";

export default function ProductShowcase({
  productSections,
}: {
  productSections: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const product = productSections[selectedIndex];
  const router = useRouter();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setSelectedIndex((prev) => (prev + 1) % productSections.length),
    onSwipedRight: () =>
      setSelectedIndex(
        (prev) => (prev - 1 + productSections.length) % productSections.length
      ),
  });

  return (
    <Box sx={{ display: "flex", p: 4 }} {...(isMobile ? swipeHandlers : {})}>
      {/* Sidebar */}
      {!isMobile && (
        <Box sx={{ minWidth: 280, mr: 6 }}>
          <List>
            {productSections.map((item, index) => (
              <ListItemButton
                key={item.id}
                selected={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
                sx={{ borderBottom: "1px solid #E0E0E0", height: 80 }}
              >
                <ListItemText>
                  <Typography
                    variant="body1"
                    fontWeight={index === selectedIndex ? "bold" : "normal"}
                    color={
                      index === selectedIndex ? "primary.main" : "text.primary"
                    }
                  >
                    {item.title}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <IconButton
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              }}
              onClick={() =>
                setSelectedIndex(
                  (prev) =>
                    (prev - 1 + productSections.length) % productSections.length
                )
              }
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              }}
              onClick={() =>
                setSelectedIndex((prev) => (prev + 1) % productSections.length)
              }
            >
              <KeyboardArrowRight />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Grid container spacing={2}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            component="img"
            src={product?.image}
            alt={product?.title}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
              height: { xs: 300, md: 400 },
            }}
          />
        </Grid>

        {/* Text Section */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Box>
              <Typography variant="h5" color="text.primary" gutterBottom>
                {product?.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product?.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<KeyboardArrowRight />}
              sx={{
                mt: 2,
                boxShadow: "none",
                color: "primary.contrastText",
                backgroundColor: "primary.main",
                width: "fit-content",
              }}
              onClick={() => {
                router.push(`/product/${productSections[selectedIndex].id}`); // Adjust the route as needed
              }}
            >
              <Typography variant="body1">Read More</Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
