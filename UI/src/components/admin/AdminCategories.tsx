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
import type { Category, Brand, AdminComponentProps } from "@/types/admin";

interface AdminCategoriesProps extends AdminComponentProps {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  brands: Brand[];
  onRefreshCategories: () => void;
  formatDate: (dateString: string) => string;
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  categoriesLoading,
  categoriesError,
  brands,
  onRefreshCategories,
  formatDate,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleViewCategory = (categoryId: string) => {
    sessionStorage.setItem("categoryId", categoryId);
    router.push("/add-category");
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/${categoryToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      onRefreshCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
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
            Category Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                sessionStorage.removeItem("categoryId");
                router.push("/add-category");
              }}
            >
              Add Category
            </Button>
            <Button
              variant="outlined"
              onClick={onRefreshCategories}
              disabled={categoriesLoading}
              startIcon={
                categoriesLoading ? <CircularProgress size={20} /> : <Refresh />
              }
            >
              Refresh Categories
            </Button>
          </Box>
        </Box>

        {categoriesError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {categoriesError}
          </Alert>
        )}

        {categoriesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Alert severity="info">No categories found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Category ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {category.id?.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {category.name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {category.description || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {category.brandName || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(category.createdDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.isActive ? "Active" : "Inactive"}
                        color={category.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewCategory(category.id)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(category.id)}
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
          <DialogTitle id="delete-dialog-title">Delete Category</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this category? This action cannot
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

export default AdminCategories;
