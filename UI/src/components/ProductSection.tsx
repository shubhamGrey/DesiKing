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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Michroma } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

interface ProductDetails {
  item: {
    categoryName: string;
    categoryId: string;
    products: {
      id: string;
      name: string;
      description: string;
      brandId: string;
      categoryId: string;
      categoryName: string;
      manufacturingDate: string;
      createdDate: string;
      modifiedDate: string | null;
      isActive: boolean;
      isDeleted: boolean;
      metaTitle: string;
      metaDescription: string;
      imageUrls: string[];
      keyFeatures: string[];
      uses: string[];
      origin: string;
      shelfLife: string;
      storageInstructions: string;
      certifications: string[];
      isPremium: boolean;
      isFeatured: boolean;
      ingredients: string;
      nutritionalInfo: string;
      thumbnailUrl?: string;
    }[];
  };
  onProductDeleted?: () => void; // Callback to refresh the product list
}

const ProductSection = ({ item, onProductDeleted }: ProductDetails) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productNameToDelete, setProductNameToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for success/error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Function to handle delete confirmation
  const handleDeleteClick = (productId: string, productName: string) => {
    setProductToDelete(productId);
    setProductNameToDelete(productName);
    setDeleteDialogOpen(true);
  };

  // Function to handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Product/${productToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container spacing={4}>
          {item.products.map((product) => (
            <Grid size={{ xs: 12, md: 4 }} key={product.id}>
              <Card
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: 2,
                  cursor: "pointer",
                  minHeight: isMobile ? "224px" : "273px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s ease-in-out",
                  },
                  position: "relative",
                }}
                elevation={0}
              >
                {Cookies.get("user_role") === "Admin" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 2,
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: "50%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        sessionStorage.setItem("productId", product.id);
                        router.push("/add-product");
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      sx={{
                        border: "2px solid",
                        borderColor: "error.main",
                        borderRadius: "50%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "error.main",
                          color: "error.contrastText",
                          borderColor: "error.main",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(product.id, product.name);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}

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
                    <img
                      src="/premium symbol.png"
                      alt="Premium Quality"
                      width={isMobile ? 50 : 75}
                      height={isMobile ? 40 : 60}
                    />
                  </Box>
                )}

                <CardActionArea
                  disableRipple
                  onClick={() => {
                    router.push("/product/" + product.id);
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "172px" : "217px"}
                    image={product.thumbnailUrl}
                    alt={product.name}
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#f8f3ea",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      fontWeight={600}
                      gutterBottom
                      sx={{ mb: 0 }}
                    >
                      {product.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
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
            Are you sure you want to delete &quot;{productNameToDelete}&quot;? This action cannot be undone.
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductSection;
