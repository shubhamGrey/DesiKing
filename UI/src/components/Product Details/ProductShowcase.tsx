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

const productSections = [
  {
    title: "Red Chilli Powder",
    key: "Red Chilli Powder",
    description:
      "AGRO NEXIS Red Chili Powder is crafted from premium quality dried red chilies, delivering a vibrant color and fiery heat to your dishes. \
      Finely ground to retain its natural pungency and aroma, this chili powder is perfect for adding spice and depth to a variety of cuisines. \
      It is a staple ingredient for those who love bold and spicy flavors.",
    image: "/RedChili1.avif",
  },
  {
    title: "Cumin Powder",
    key: "Cumin Powder",
    description:
      "AGRO NEXIS Cumin Powder is made from handpicked cumin seeds, expertly ground to preserve their distinctive warm, earthy aroma and slightly bitter taste. \
      This versatile spice enhances the flavor profile of countless dishes and is valued for its digestive benefits.",
    image: "/Cumin1.jpg",
  },
  {
    title: "Garam Masala Powder",
    key: "Garam Masala Powder",
    description:
      "AGRO NEXIS Garam Masala is a signature blend of premium, hand-selected spices, expertly ground to deliver a rich, aromatic flavor profile. \
          This traditional Indian spice mix enhances the taste and aroma of a wide variety of dishes, making it an essential addition to any kitchen. \
          Perfect for curries, gravies, and marinades, our Garam Masala is crafted to preserve the freshness and natural oils of each spice.",
    image: "/GaramMasala1.jpg",
  },
  {
    title: "Coriander Powder",
    key: "Coriander Powder",
    description:
      "AGRO NEXIS Coriander Powder is produced from select coriander seeds, ground to a fine powder to capture their fresh, citrusy aroma and mild flavor. \
      This spice is a must-have for adding a subtle, sweet undertone to your recipes and is known for its digestive properties.",
    image: "/Coriander1.jpg",
  },
];

export default function ProductShowcase() {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const product = productSections[selectedIndex];

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
                key={item.key}
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
            src={product.image}
            alt={product.key}
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
                {product.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description}
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
            >
              <Typography variant="body1">Read More</Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
