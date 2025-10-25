import React from "react";
import { Grid, TextField, Card, CardContent, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { michroma } from "@/styles/fonts";
import { ProductFormData } from "@/types/product";

const ProductDetails = ({
  control,
  manufacturingDate,
  setManufacturingDate,
}: {
  control: Control<ProductFormData>;
  manufacturingDate: Date | null;
  setManufacturingDate: (date: Date | null) => void;
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
        Product Details
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Origin"
                size="small"
                placeholder="Enter origin"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="shelfLife"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Shelf Life"
                size="small"
                placeholder="Enter shelf life in days"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            label="Manufacturing Date"
            value={manufacturingDate}
            onChange={(newValue) => setManufacturingDate(newValue)}
            slotProps={{
              textField: { fullWidth: true, size: "small" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="hsnCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="HSN Code"
                size="small"
                placeholder="Enter product hsn code"
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="ingredients"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Ingredients"
                size="small"
                placeholder="Enter ingredients separated by commas"
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="storageInstructions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={2}
                label="Storage Instructions"
                placeholder="Enter storage instructions"
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="nutritionalInfo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Nutritional Information (100gm)"
                placeholder="Enter nutritional information"
              />
            )}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ProductDetails;
