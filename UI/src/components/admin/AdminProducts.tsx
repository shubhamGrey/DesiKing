"use client";

import { Delete, Refresh, Visibility } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { Product, AdminComponentProps } from "@/types/admin";

interface AdminProductsProps extends AdminComponentProps {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  onRefreshProducts: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
}

const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  productsLoading,
  productsError,
  onRefreshProducts,
  formatCurrency,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleViewProduct = (productId: string) => {
    sessionStorage.setItem("productId", productId);
    router.push("/add-product");
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh the products list
      onRefreshProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Product Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                sessionStorage.removeItem("productId");
                router.push("/add-product");
              }}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              onClick={onRefreshProducts}
              disabled={productsLoading}
              startIcon={
                productsLoading ? <CircularProgress size={20} /> : <Refresh />
              }
            >
              Refresh Products
            </Button>
          </Box>
        </Box>

        {productsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {productsError}
          </Alert>
        )}

        {productsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">No products found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>MRP</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Final price</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.id?.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.categoryName || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.brandName || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.pricesAndSkus &&
                        product.pricesAndSkus.length > 0
                          ? formatCurrency(product.pricesAndSkus[0].price)
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.pricesAndSkus &&
                        product.pricesAndSkus.length > 0
                          ? `${product.pricesAndSkus[0].discountPercentage}%`
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {product.pricesAndSkus &&
                        product.pricesAndSkus.length > 0 &&
                        product.pricesAndSkus[0].discountedAmount
                          ? formatCurrency(
                              product.pricesAndSkus[0].discountedAmount
                            )
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 100 }}>
                      <Typography variant="body2">
                        {/* Stock quantity is not in the Product model, showing active status instead */}
                        {product.isActive ? "In Stock" : "Out of Stock"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive ? "Active" : "Inactive"}
                        color={product.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={deleting}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminProducts;
