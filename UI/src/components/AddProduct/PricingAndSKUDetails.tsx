import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";
import { michroma } from "@/styles/fonts";
import { ProductFormData } from "@/types/product";

interface PricingAndSKUDetailsProps {
  control: Control<ProductFormData>;
  pricesAndSkuFields: Array<{ id: string }>;
  weights: Array<{ label: string; value: string }>;
  currencies: Array<{ label: string; value: string }>;
  appendPricesAndSku: (pricesAndSku: {
    id: string;
    price: number;
    isDiscounted: boolean;
    discountPercentage: number;
    discountedAmount: number;
    skuNumber: string;
    weightId: string;
    weightValue: number;
    weightUnit: string;
    currencyCode: string;
    currencyId: string;
    barcode: string;
    createdDate: string;
    modifiedDate: string | null;
    isActive: boolean;
    isDeleted: boolean;
  }) => void;
  removePricesAndSku: (index: number) => void;
}

const PricingAndSKUDetails: React.FC<PricingAndSKUDetailsProps> = ({
  control,
  pricesAndSkuFields,
  weights,
  currencies,
  appendPricesAndSku,
  removePricesAndSku,
}) => {

  const handleAddEntry = () => {
    // Add new pricesAndSkus entry with all fields
    appendPricesAndSku({
      id: "",
      price: 0,
      isDiscounted: false,
      discountPercentage: 0,
      discountedAmount: 0,
      skuNumber: "",
      weightId: "",
      weightValue: 0,
      weightUnit: "",
      currencyCode: currencies.length > 0 ? currencies[0].label : "",
      currencyId: currencies.length > 0 ? currencies[0].value : "",
      barcode: "",
      createdDate: "",
      modifiedDate: null,
      isActive: true,
      isDeleted: false,
    });
  };

  const handleRemoveEntry = (index: number) => {
    // Remove pricesAndSku entry
    removePricesAndSku(index);
  };

  return (
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
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontFamily={michroma.style.fontFamily}
              color="primary.main"
            >
              Pricing & SKU Details
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={handleAddEntry}
              size="small"
              disabled={(pricesAndSkuFields?.length ?? 0) >= 5}
            >
              Add Entry
            </Button>
          </Box>

          {/* Data Rows */}
          {(pricesAndSkuFields ?? []).map((field, index) => (
            <Box key={field.id} sx={{ mb: 3 }}>
              {/* First Row: Pricing Information */}
              <Grid container spacing={2} sx={{ mb: 1 }}>
                {/* Price Amount */}
                <Grid size={2.5}>
                  <Controller
                    name={`pricesAndSkus.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Amount"
                        fullWidth
                        size="small"
                        placeholder="Enter price amount"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                {/* Currency */}
                <Grid size={2.5}>
                  <Controller
                    name={`pricesAndSkus.${index}.currencyId`}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Currency</InputLabel>
                        <Select {...field} label="Currency">
                          {currencies.map((currency) => (
                            <MenuItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                {/* Weight Value */}
                <Grid size={3}>
                  <Controller
                    name={`pricesAndSkus.${index}.weightId`}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Weight</InputLabel>
                        <Select {...field} label="Weight">
                          {weights.map((weight) => (
                            <MenuItem key={weight.value} value={weight.value}>
                              {weight.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                {/* Discount Percentage */}
                <Grid size={3}>
                  <Controller
                    name={`pricesAndSkus.${index}.discountPercentage`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Discount %"
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Enter discount percentage"
                      />
                    )}
                  />
                </Grid>
                {/* Delete Button */}
                <Grid size={1}>
                  <IconButton
                    onClick={() => handleRemoveEntry(index)}
                    sx={{ color: "secondary.main" }}
                    disabled={pricesAndSkuFields.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
              {/* Second Row: Product Identification */}
              <Grid container spacing={2}>
                {/* SKU */}
                <Grid size={5}>
                  <Controller
                    name={`pricesAndSkus.${index}.skuNumber`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="SKU"
                        fullWidth
                        size="small"
                        placeholder="e.g., SKU12345"
                      />
                    )}
                  />
                </Grid>
                {/* Barcode */}
                <Grid size={6}>
                  <Controller
                    name={`pricesAndSkus.${index}.barcode`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Barcode"
                        fullWidth
                        size="small"
                        placeholder="e.g., 123456789012"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PricingAndSKUDetails;
