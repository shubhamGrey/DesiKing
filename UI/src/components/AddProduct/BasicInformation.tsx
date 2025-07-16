import React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { michroma } from "@/app/layout";
import { ProductFormData } from "@/types/product";

interface BasicInformationProps {
  control: Control<ProductFormData>;
  errors: Record<string, any>;
  brands: { value: string; label: string }[];
  categories: { value: string; label: string }[];
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  control,
  errors,
  brands,
  categories,
}) => (
  <Card
    sx={{
      mb: 4,
      backgroundColor: "transparent",
      boxShadow: "none",
      border: "1px solid",
      borderColor: "primary.main",
      borderRadius: "8px",
    }}
    elevation={0}
  >
    <CardContent>
      <Typography
        variant="h6"
        fontFamily={michroma.style.fontFamily}
        color="primary.main"
        sx={{ mb: 3 }}
      >
        Basic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Product name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Product Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
                placeholder="Enter product name"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="brand"
            control={control}
            rules={{ required: "Brand is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Brand"
                error={!!errors.brand}
                helperText={errors.brand?.message}
                size="small"
                placeholder="Select a brand"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.value} value={brand.value}>
                    {brand.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Category"
                error={!!errors.category}
                helperText={errors.category?.message}
                size="small"
                placeholder="Select a category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Product Description"
                error={!!errors.description}
                helperText={errors.description?.message}
                size="small"
                placeholder="Enter product description"
              />
            )}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default BasicInformation;
