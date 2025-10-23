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

export default AdminBrands;
