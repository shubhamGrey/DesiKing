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
import type { Brand, AdminComponentProps } from "@/types/admin";

interface AdminBrandsProps extends AdminComponentProps {
  brands: Brand[];
  brandsLoading: boolean;
  brandsError: string | null;
  onRefreshBrands: () => void;
  formatDate: (dateString: string) => string;
}

const AdminBrands: React.FC<AdminBrandsProps> = ({
  brands,
  brandsLoading,
  brandsError,
  onRefreshBrands,
  formatDate,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleViewBrand = (brandId: string) => {
    sessionStorage.setItem("brandId", brandId);
    router.push("/add-brand");
  };

  const handleDeleteClick = (brandId: string) => {
    setBrandToDelete(brandId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      setDeleting(true);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brand/${brandToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }

      onRefreshBrands();
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
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
            Brand Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                sessionStorage.removeItem("brandId");
                router.push("/add-brand");
              }}
            >
              Add Brand
            </Button>
            <Button
              variant="outlined"
              onClick={onRefreshBrands}
              disabled={brandsLoading}
              startIcon={
                brandsLoading ? <CircularProgress size={20} /> : <Refresh />
              }
            >
              Refresh Brands
            </Button>
          </Box>
        </Box>

        {brandsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {brandsError}
          </Alert>
        )}

        {brandsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : brands.length === 0 ? (
          <Alert severity="info">No brands found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Brand ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {brand.id?.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {brand.name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {brand.code || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {brand.description || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(brand.createdDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={brand.isActive ? "Active" : "Inactive"}
                        color={brand.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewBrand(brand.id)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(brand.id)}
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
          <DialogTitle id="delete-dialog-title">Delete Brand</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this brand? This action cannot
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

export default AdminBrands;
