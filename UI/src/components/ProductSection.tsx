"use client";
import theme from "@/styles/theme";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { Michroma } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Cookies from "js-cookie";

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

import { ProductFormData } from "@/types/product";

interface ProductSectionProps {
  item: {
    categoryName: string;
    categoryId: string;
    products: ProductFormData[];
  };
  onProductDeleted?: () => void;
}

const ProductSection = ({ item, onProductDeleted }: ProductSectionProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { addItem } = useCart();

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productNameToDelete, setProductNameToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // State for product selection (packet size, images, quantities)
  const [selectedPackets, setSelectedPackets] = useState<Record<string, number>>({});
  const [currentImages, setCurrentImages] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // State for success/error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Initialize packet selections on component mount
  React.useEffect(() => {
    const initialPackets: Record<string, number> = {};
    const initialQuantities: Record<string, number> = {};
    
    item.products.forEach((product) => {
      if (product.id) {
        initialPackets[product.id] = 0; // Select first packet by default
        initialQuantities[product.id] = 1;
      }
    });
    
    setSelectedPackets(initialPackets);
    setQuantities(initialQuantities);
  }, [item.products]);

  // Function to handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Product/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Show success message
      setSnackbarMessage("Product deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Call the callback to refresh the product list
      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setSnackbarMessage("Failed to delete product. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      setProductNameToDelete("");
    }
  };

  // Function to handle dialog close
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    setProductNameToDelete("");
  };

  // Function to handle add to cart
  const handleAddToCart = (product: ProductFormData) => {
    // Check if user is logged in
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      // Redirect to login page with return URL
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    const productId = product.id || "";
    if (!productId) {
      setSnackbarMessage("Product ID is missing.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Get selected packet index or default to 0
    const selectedIndex = selectedPackets[productId] || 0;
    const selectedSku = product.pricesAndSkus?.[selectedIndex];

    if (!selectedSku) {
      setSnackbarMessage("Please select a product size.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const weightLabel = `${selectedSku.weightValue}${selectedSku.weightUnit}`;
    const quantity = quantities[productId] || 1;

    // Add item to cart
    const cartItem = {
      id: crypto.randomUUID(),
      name: `${product.name} - ${weightLabel}`,
      price: selectedSku.discountedAmount || selectedSku.price,
      productId: productId,
      brandId: product.brandId || "",
      image: product.imageUrls?.[currentImages[productId] || 0] || "/placeholder-image.jpg",
      quantity: quantity,
      sku: selectedSku.skuNumber,
    };

    addItem(cartItem as any);

    // Show success message
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ mx: 3, my: 10 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "primary.main" }}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={michroma.style.fontFamily}
        >
          {item.categoryName}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 8,
        }}
      >
        <Grid container spacing={2}>
          {item.products.map((product) => {
            const productId = product.id || "";
            return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={productId}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "auto",
                  transition: "box-shadow 0.3s ease-in-out",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 2,
                  backgroundColor: "#f8f3ea",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {/* Top Side - Image */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: isMobile ? "150px" : "200px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    marginBottom: 2,
                  }}
                  onClick={() => {
                    router.push("/product/" + productId);
                  }}
                >
                  {/* Premium Badge */}
                  {product.isPremium && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src="/premium symbol.png"
                        alt="Premium Quality"
                        width={isMobile ? 50 : 60}
                        height={isMobile ? 40 : 48}
                      />
                    </Box>
                  )}
                  <Image
                    src={(product.imageUrls?.[currentImages[productId] || 0] as string) || product.thumbnailUrl || "/placeholder-image.jpg"}
                    alt={product.name}
                    fill
                    style={{
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>

                {/* Bottom Side - Product Details */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Product Title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      marginBottom: 1,
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Packet Size & Quantity Side by Side */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", marginBottom: 1, flexWrap: "wrap" }}>
                    {/* Packet Size Selector */}
                    {product.pricesAndSkus && product.pricesAndSkus.length > 0 && (
                      <Box sx={{ flex: 1, minWidth: "140px" }}>
                        <Typography variant="caption" sx={{ mb: 0.5, display: "block", color: "text.secondary", fontWeight: 600 }}>
                          Select Size:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {product.pricesAndSkus.map((sku, index) => (
                            <Chip
                              key={index}
                              label={`${sku.weightValue}${sku.weightUnit}`}
                              onClick={() => {
                                setSelectedPackets(prev => ({ ...prev, [productId]: index }));
                                setCurrentImages(prev => ({ ...prev, [productId]: index % (product.imageUrls?.length || 1) }));
                              }}
                              variant={selectedPackets[productId] === index ? "filled" : "outlined"}
                              size="small"
                              sx={{
                                cursor: "pointer",
                                backgroundColor: selectedPackets[productId] === index ? "primary.main" : "transparent",
                                color: selectedPackets[productId] === index ? "primary.contrastText" : "text.primary",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Quantity Selector */}
                    <Box sx={{ flex: 1, minWidth: "120px" }}>
                      <Typography variant="caption" sx={{ mb: 0.5, display: "block", color: "text.secondary", fontWeight: 600 }}>
                        Quantity:
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Button
                          size="small"
                          onClick={() => {
                            const currentQty = quantities[productId] || 1;
                            if (currentQty > 1) {
                              setQuantities(prev => ({ ...prev, [productId]: currentQty - 1 }));
                            }
                          }}
                          variant="outlined"
                          sx={{ minWidth: "32px", p: 0.5 }}
                        >
                          −
                        </Button>
                        <Typography variant="body2" sx={{ minWidth: "30px", textAlign: "center", fontWeight: 600 }}>
                          {quantities[productId] || 1}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => {
                            const currentQty = quantities[productId] || 1;
                            setQuantities(prev => ({ ...prev, [productId]: currentQty + 1 }));
                          }}
                          variant="outlined"
                          sx={{ minWidth: "32px", p: 0.5 }}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Price Display */}
                  {product.pricesAndSkus && product.pricesAndSkus.length > 0 && (
                    <Box sx={{ marginBottom: 1.5 }}>
                      {(() => {
                        const selectedIndex = selectedPackets[productId] || 0;
                        const selectedSku = product.pricesAndSkus[selectedIndex];
                        const hasDiscount = selectedSku && selectedSku.discountedAmount;
                        return (
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
                              ₹{hasDiscount ? selectedSku.discountedAmount : selectedSku?.price}
                            </Typography>
                            {hasDiscount && (
                              <Typography
                                variant="body2"
                                sx={{ textDecoration: "line-through", color: "text.secondary" }}
                              >
                                ₹{selectedSku.price}
                              </Typography>
                            )}
                          </Box>
                        );
                      })()}
                    </Box>
                  )}

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    size="medium"
                    fullWidth
                    sx={{
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      py: 0.75,
                      fontWeight: 600,
                      mt: 1,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Product Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &quot;{productNameToDelete}&quot;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductSection;
