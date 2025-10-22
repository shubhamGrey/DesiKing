import React from "react";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled, useMediaQuery } from "@mui/system";
import Image from "next/image";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getCurrencySymbol } from "@/utils/currencyUtils";

import { ProductFormData } from "@/types/product";

// Styled components for consistent theme
const ProductImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: theme.palette.primary.main,
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.secondary.main,
  },
});

const ProductDetails = ({
  selectedProduct,
}: {
  selectedProduct: ProductFormData;
}) => {
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  const [selectedPacket, setSelectedPacket] = React.useState("100gm");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentImage, setCurrentImage] = React.useState(0);
  const { addItem } = useCart();
  const router = useRouter();

  const handleImageChange = (index: number) => {
    setCurrentImage(index);
  };

  // Helper function to get selected SKU data
  const getSelectedSkuData = () => {
    const selectedSku = selectedProduct?.pricesAndSkus.find(
      (sku) => sku.weightValue + sku.weightUnit === selectedPacket
    );
    return {
      price: selectedSku?.price || 0,
      sku: selectedSku?.skuNumber || "",
      weightValue: selectedSku?.weightValue || "",
      weightUnit: selectedSku?.weightUnit || "",
      currencyCode: selectedSku?.currencyCode || "USD",
    };
  };

  const handleAddToCart = () => {
    const isLoggedIn = Boolean(Cookies.get("access_token"));
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const skuData = getSelectedSkuData();

    // Validate required data
    if (!selectedProduct.id) {
      alert("Error: Product information is incomplete");
      return;
    }

    if (skuData.price <= 0) {
      alert("Error: Product price information is missing");
      return;
    }

    const cartItemToAdd = {
      id: crypto.randomUUID(), // Generate a proper GUID
      name: selectedProduct.name || "Unknown Product",
      price: skuData.price,
      image:
        typeof selectedProduct.imageUrls?.[0] === "string"
          ? selectedProduct.imageUrls[0]
          : "/ProductBackground.png", // Fallback to default product image
      productId: selectedProduct.id,
      brandId: selectedProduct.brandId ?? "",
      quantity: selectedQuantity,
      sku: skuData.sku,
      maxQuantity: 99, // You can adjust this based on inventory
    };

    // Add item to cart
    addItem(cartItemToAdd);
  };

  const handleBuyNow = () => {
    const isLoggedIn = Boolean(Cookies.get("access_token"));
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const skuData = getSelectedSkuData();

    // Validate required data
    if (!selectedProduct.id) {
      alert("Error: Product information is incomplete");
      return;
    }

    if (skuData.price <= 0) {
      alert("Error: Product price information is missing");
      return;
    }

    const cartItemToAdd = {
      id: crypto.randomUUID(), // Generate a proper GUID
      name: selectedProduct.name || "Unknown Product",
      price: skuData.price,
      image:
        typeof selectedProduct.imageUrls?.[0] === "string"
          ? selectedProduct.imageUrls[0]
          : "/ProductBackground.png", // Fallback to default product image
      productId: selectedProduct.id,
      brandId: selectedProduct.brandId ?? "",
      quantity: selectedQuantity,
      sku: skuData.sku,
      maxQuantity: 99, // You can adjust this based on inventory
    };

    // Add to cart and redirect to cart page
    addItem(cartItemToAdd);

    router.push("/cart");
  };

  return (
    <Grid container spacing={isMobile ? 4 : 8}>
      {/* Product Images Section */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            minHeight: isMobile ? "auto" : "600px",
          }}
          component={ProductImageContainer}
        >
          <Box
            sx={{
              height: isMobile ? "350px" : "500px",
              width: "100%",
              position: "relative",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              overflow: "hidden",
              mb: 2,
            }}
          >
            <Image
              src={
                typeof selectedProduct?.imageUrls?.[currentImage] === "string"
                  ? selectedProduct.imageUrls[currentImage]
                  : "/ProductBackground.png"
              }
              alt={`Product Image ${currentImage + 1}`}
              fill
              unoptimized={
                typeof selectedProduct?.imageUrls?.[currentImage] ===
                  "string" &&
                selectedProduct.imageUrls[currentImage].includes(
                  "cloud.agronexis.com"
                )
              }
              style={{
                borderRadius: 8,
                objectFit: "contain",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            sx={{
              justifyContent: "center",
              flexWrap: "wrap",
              maxWidth: "100%",
            }}
          >
            {selectedProduct?.imageUrls?.map((image, index) => (
              <Box
                key={`thumbnail-${index}`}
                onClick={() => handleImageChange(index)}
                sx={{
                  border: "2px solid",
                  borderColor:
                    currentImage === index ? "primary.main" : "transparent",
                  cursor: "pointer",
                  borderRadius: "4px",
                  overflow: "hidden",
                  position: "relative",
                  width: isMobile ? "50px" : "60px",
                  height: isMobile ? "50px" : "60px",
                  backgroundColor: "#f5f5f5",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={
                    typeof image === "string" ? image : "/ProductBackground.png"
                  }
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  unoptimized={
                    typeof image === "string" &&
                    image.includes("cloud.agronexis.com")
                  }
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
          mt: isMobile ? 2 : 0,
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ my: isMobile ? 1 : 2 }}
            color="text.main"
          >
            [{selectedProduct?.categoryName}]
          </Typography>
          <Box>
            <Stack
              direction="column"
              spacing={2}
              alignItems="start"
              justifyContent={"center"}
              sx={{ mb: isMobile ? 6 : 12 }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 2 }}
                fontFamily={michroma.style.fontFamily}
                color="primary.main"
              >
                {selectedProduct?.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <StyledRating name="rating" defaultValue={5} readOnly />
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
              {/* Move selectedSKU declaration above JSX */}
              {(() => {
                const selectedSKU = selectedProduct?.pricesAndSkus.find(
                  (sku) => sku.weightValue + sku.weightUnit === selectedPacket
                );

                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h5" sx={{ color: "secondary.main" }}>
                      <span style={{ textDecoration: "line-through" }}>
                        {getCurrencySymbol(selectedSKU?.currencyCode || "")}
                        {selectedSKU?.price}
                      </span>
                    </Typography>
                    {"  "}
                    <Typography variant="h5" sx={{ color: "primary.main" }}>
                      <span>
                        {getCurrencySymbol(selectedSKU?.currencyCode || "")}
                        {selectedSKU?.discountedAmount}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", my: "8px !important" }}
                    >
                      ({selectedPacket})
                    </Typography>
                  </Stack>
                );
              })()}
            </Stack>
          </Box>
        </Box>
        <Box>
          <Box>
            {/* Packets section */}
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
              {["100gm", "500gm", "1Kg"].map((size, ind) => (
                <Button
                  key={size}
                  onClick={() => {
                    setSelectedPacket(size);
                  }}
                  disabled={ind > 0}
                  sx={{
                    width: 64,
                    borderColor:
                      selectedPacket == size ? "transparent" : "primary.main",
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

            {/* Quantity section */}
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
            <Tooltip title="Add to Cart" arrow>
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
                onClick={handleAddToCart}
                aria-label="Add to Cart"
              >
                <AddShoppingCartIcon />
              </Button>
            </Tooltip>
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
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
