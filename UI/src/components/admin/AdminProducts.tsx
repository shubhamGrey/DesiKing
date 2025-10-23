"use client";

import { Refresh, Visibility } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
import React from "react";
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
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
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
                        {/* Brand name needs to be fetched separately or included in product response */}
                        Brand
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
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProducts;
