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
      console.error("❌ Product ID is missing");
      alert("Error: Product information is incomplete");
      return;
    }

    if (skuData.price <= 0) {
      console.error("❌ Product price is invalid:", skuData.price);
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
      console.error("❌ Product ID is missing");
      alert("Error: Product information is incomplete");
      return;
    }

    if (skuData.price <= 0) {
      console.error("❌ Product price is invalid:", skuData.price);
      alert("Error: Product price information is missing");
      return;
    }

    const cartItemToAdd = {
      id: crypto.randomUUID(), // Generate a proper GUID
      name: selectedProduct.name || "Unknown Product",
      price: skuData.price,
      image:
        typeof selectedProduct.imageUrls?.[0] === "string"
          ? selectedProduct.imageUrls?.[0]
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
            position: "relative",
            width: "100%",
            height: isMobile ? "400px" : "600px",
          }}
          component={ProductImageContainer}
        >
          <Box sx={{ height: "100%", width: "100%", mb: "80px !important" }}>
            <Image
              src={
                typeof selectedProduct?.imageUrls?.[currentImage] === "string"
                  ? selectedProduct?.imageUrls?.[currentImage]
                  : ""
              }
              alt={`Product Image ${currentImage + 1}`}
              height={isMobile ? 300 : 500}
              width={isMobile ? 300 : 500}
              unoptimized={
                typeof selectedProduct?.imageUrls?.[currentImage] ===
                  "string" &&
                selectedProduct?.imageUrls?.[currentImage].includes(
                  "cloud.agronexis.com"
                )
              }
              style={{
                borderRadius: 8,
                objectFit: "cover",
                position: "relative",
                height: "95%",
                width: "100%",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            sx={{ position: "absolute", bottom: 0 }}
          >
            {selectedProduct?.imageUrls?.map((image, index) => (
              <Box
                key={`thumbnail-${image}-${index}`}
                onClick={() => handleImageChange(index)}
                sx={{
                  border: "2px solid",
                  borderColor:
                    currentImage === index ? "primary.main" : "transparent",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={typeof image === "string" ? image : ""}
                  alt={`Thumbnail ${index + 1}`}
                  width={60}
                  height={60}
                  unoptimized={
                    typeof image === "string" &&
                    image?.includes("cloud.agronexis.com")
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
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ my: 2 }} color="text.main">
            [{selectedProduct?.categoryName}]
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
                  {getCurrencySymbol(
                    selectedProduct?.pricesAndSkus.find(
                      (sku) =>
                        sku.weightValue + sku.weightUnit === selectedPacket
                    )?.currencyCode || ""
                  )}
                  {
                    selectedProduct?.pricesAndSkus.find(
                      (sku) =>
                        sku.weightValue + sku.weightUnit === selectedPacket
                    )?.price
                  }
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
              {["100gm", "500gm", "1Kg"].map((size) => (
                <Button
                  key={size}
                  onClick={() => {
                    setSelectedPacket(size);
                  }}
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
