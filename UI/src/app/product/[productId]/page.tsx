"use client";
import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  useMediaQuery,
  Rating,
  ButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Container, Stack, styled } from "@mui/system";
import Image from "next/image";
import theme from "@/styles/theme";
import {
  FavoriteBorderOutlined,
  ShoppingBagOutlined,
  ArrowRight,
} from "@mui/icons-material";
import { michroma } from "@/app/layout";

interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  key_features?: string[];
  uses?: string[];
  price: string;
  category?: string;
  quantity?: string;
  customer_reviews?: string[];
}

// Styled components for consistent theme
const ProductImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const ProductDetails = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  const [selectedPacket, setSelectedPacket] = React.useState("100gm");
  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: theme.palette.primary.main,
    },
    "& .MuiRating-iconHover": {
      color: theme.palette.secondary.main,
    },
  });

  const [selectedProduct] = React.useState<Product | null>({
    id: 1,
    name: "Turmeric Powder",
    description:
      "AGRO NEXIS Turmeric Powder is made from the finest turmeric roots, known for its vibrant color and health benefits. \
      Ground to perfection to preserve its natural aroma and flavor, this turmeric powder is ideal for cooking, baking, and health supplements. \
      It adds a warm, earthy flavor to dishes and is rich in curcumin, a powerful antioxidant.",
    images: [
      "/Turmeric1.jpg",
      "/Turmeric2.webp",
      "/Turmeric3.png",
      "/Turmeric4.jpg",
      "/Turmeric5.jpg",
    ],
    key_features: [
      "100% Pure and Natural",
      "Rich in Curcumin",
      "No Artificial Additives",
      "Packed in a Hygienic Environment",
      "Sourced from Trusted Farmers",
    ],
    uses: [
      "Turmeric powder is versatile and can be used in various dishes such as curries, soups, stews, and even smoothies.",
      "It is commonly used in Indian cuisine for its flavor and color.",
      "In addition to culinary uses, turmeric powder is often added to health drinks and supplements for its potential health benefits.",
    ],
    price: "$10.99",
    category: "Powdered Spices",
    quantity: "100gm",
    customer_reviews: [
      "Excellent quality! The turmeric powder has a rich color and flavor.",
      "I love using this in my cooking. It adds a wonderful aroma and taste to my dishes.",
      "Great product! I appreciate the purity and natural ingredients.",
      "This turmeric powder is a staple in my kitchen. Highly recommend it!",
      "Fast shipping and well-packaged. The quality is top-notch.",
      "I've tried many turmeric powders, and this one is by far the best. The flavor is amazing!",
    ],
  });

  const [currentImage, setCurrentImage] = React.useState(0);

  const handleImageChange = (index: number) => {
    setCurrentImage(index);
  };

  const [sections, setSections] = React.useState([
    {
      id: "key_features",
      title: "Key Features",
      expanded: false,
    },
    {
      id: "uses",
      title: `${selectedProduct?.name} Uses`,
      expanded: false,
    },
    {
      id: "customer_reviews",
      title: "Customer Reviews",
      expanded: false,
    },
  ]);

  const toggleSection = (id: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const [selectedSection, setSelectedSection] = React.useState<
    keyof Product | null
  >("key_features");

  return (
    <>
      <Container sx={{ m: 6, justifySelf: "center" }}>
        <Grid container spacing={8}>
          {/* Product Images Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              component={ProductImageContainer}
            >
              <img
                src={selectedProduct?.images[currentImage]}
                alt={`Product Image ${currentImage + 1}`}
                style={{
                  width: "100%",
                  height: isMobile ? "400px" : "600px",
                  borderRadius: 8,
                }}
              />
              <Box display="flex" flexDirection="row" gap={1}>
                {selectedProduct?.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => handleImageChange(index)}
                    sx={{
                      border: "2px solid",
                      borderColor:
                        currentImage === index ? "primary.main" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={60}
                      height={60}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                ))}
              </Box>
            </Stack>
          </Grid>

          {/* Product Details Section */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ my: 2 }} color="text.main">
                [{selectedProduct?.category}]
              </Typography>
              <Box>
                <Stack
                  direction="column"
                  spacing={2}
                  alignItems="start"
                  justifyContent={"center"}
                  sx={{ mb: 12 }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                    fontFamily={michroma.style.fontFamily}
                    color="primary.main"
                  >
                    {selectedProduct?.name}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <StyledRating name="rating" defaultValue={2} readOnly />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 1 }}
                    >
                      (10 reviews)
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", my: 2 }}
                    textAlign={"justify"}
                  >
                    {selectedProduct?.description}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" sx={{ color: "primary.main" }}>
                      {selectedProduct?.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", my: "8px !important" }}
                    >
                      ({selectedPacket})
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
            <Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "primary.main", mb: 1, mr: 16.4 }}
                  textAlign={"right"}
                >
                  Packets:
                </Typography>

                <ButtonGroup
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    mr: 2.5,
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  {["100gm", "500gm", "1Kg"].map((size) => (
                    <Button
                      key={size}
                      onClick={() => {
                        setSelectedPacket(size);
                      }}
                      sx={{
                        width: 64,
                        borderColor:
                          selectedPacket == size
                            ? "transparent"
                            : "primary.main",
                        color:
                          selectedPacket == size
                            ? "primary.contrastText"
                            : "primary.main",
                        backgroundColor:
                          selectedPacket == size
                            ? "primary.main"
                            : "primary.transparent",
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </ButtonGroup>
                <Typography
                  variant="body2"
                  sx={{ color: "primary.main", mb: 1, mr: 16 }}
                  textAlign={"right"}
                >
                  Quantity:
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent={"end"}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: "40px",
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "secondary.main",
                        color: "secondary.main",
                      },
                    }}
                    onClick={() => {
                      setSelectedQuantity((prev) => Math.max(prev - 1, 1));
                    }}
                  >
                    -
                  </Button>
                  <Box
                    sx={{
                      width: 75,
                      height: 40,
                      backgroundColor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedQuantity}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: "40px",
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "secondary.main",
                        color: "secondary.main",
                      },
                    }}
                    onClick={() => {
                      setSelectedQuantity((prev) => prev + 1);
                    }}
                  >
                    +
                  </Button>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 1 }}>
                {/* <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 600,
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "secondary.main",
                    },
                  }}
                >
                  <ShoppingBagOutlined fontSize="small" />
                </Button> */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 600,
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "secondary.main",
                    },
                  }}
                >
                  <FavoriteBorderOutlined />
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "secondary.main",
                    },
                    borderRadius: 0,
                  }}
                  fullWidth
                >
                  Add to Cart
                </Button>
              </Stack>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                  borderRadius: 0,
                }}
                fullWidth
              >
                Buy Now
              </Button>
            </Box>
          </Grid>
        </Grid>
        {!isMobile ? (
          <Grid container spacing={2} sx={{ mt: 15 }}>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}
            >
              {sections.map((section) => (
                <Typography
                  key={section.id}
                  sx={{
                    textDecoration:
                      section.id === selectedSection ? "underline" : "none",
                    cursor: "pointer",
                  }}
                  variant="body2"
                  color="text.secondary"
                  onClick={() =>
                    setSelectedSection(section.id as keyof Product)
                  }
                >
                  {section.title}
                </Typography>
              ))}
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                {sections.find((item) => item.id == selectedSection)?.title}
              </Typography>
              {selectedSection &&
                selectedProduct &&
                Array.isArray(selectedProduct[selectedSection]) &&
                selectedProduct[selectedSection].map((item, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <ArrowRight
                      sx={{ fontSize: 16, verticalAlign: "middle" }}
                    />{" "}
                    {item}
                  </Typography>
                ))}
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ mt: 4 }}>
            {sections.map((section) => (
              <Accordion
                key={section.id}
                expanded={section.expanded}
                sx={{ backgroundColor: "transparent" }}
                elevation={0}
                onClick={() => toggleSection(section.id)}
              >
                <AccordionSummary expandIcon={<ArrowRight />}>
                  <Typography variant="h6" color="text.primary">
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {section.id &&
                    selectedProduct &&
                    Array.isArray(
                      selectedProduct[section.id as keyof Product]
                    ) &&
                    selectedProduct[section.id as keyof Product]?.map(
                      (item, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <ArrowRight
                            sx={{ fontSize: 16, verticalAlign: "middle" }}
                          />{" "}
                          {item}
                        </Typography>
                      )
                    )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Container>
      <Box>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mt: 16, mb: 2, color: "primary.main" }}
          fontFamily={michroma.style.fontFamily}
        >
          Similar Products
        </Typography>
      </Box>
    </>
  );
};

export default ProductDetails;
