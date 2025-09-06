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
import { Control, Controller, useWatch } from "react-hook-form";
import { michroma } from "@/styles/fonts";
import { ProductFormData } from "@/types/product";

interface PricingAndSKUDetailsProps {
  control: Control<ProductFormData>;
  pricesAndSkuFields: Array<{ id: string }>;
  weights: Array<{ label: string; value: string }>;
  currencies: Array<{ label: string; value: string }>;
  appendPricesAndSku: (pricesAndSku: {
    id?: string;
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
    createdDate?: string;
    modifiedDate?: string | null;
    isActive?: boolean;
    isDeleted?: boolean;
  }) => void;
  removePricesAndSku: (index: number) => void;
  updatePricesAndSku: (index: number, field: string, value: any) => void;
}

const PricingAndSKUDetails: React.FC<PricingAndSKUDetailsProps> = ({
  control,
  pricesAndSkuFields,
  weights,
  currencies,
  appendPricesAndSku,
  removePricesAndSku,
  updatePricesAndSku,
}) => {
  // Watch the entire pricesAndSkus array to get actual form values
  const watchedPricesAndSkus =
    useWatch({
      control,
      name: "pricesAndSkus",
    }) || [];

  const handleAddEntry = () => {
    // Add new pricesAndSkus entry - do not include id for new entries
    appendPricesAndSku({
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
    console.log(`DEBUG handleRemoveEntry called with index: ${index}`);
    console.log("Current watchedPricesAndSkus:", watchedPricesAndSkus);
    console.log("Current pricesAndSkuFields:", pricesAndSkuFields);

    const entryToRemove = pricesAndSkuFields[index];
    console.log("Entry to remove:", entryToRemove);

    // Check if this entry has an ID (existing entry) or not (new entry)
    if (entryToRemove.id && entryToRemove.id !== "") {
      // For existing entries with ID: mark as deleted instead of removing
      console.log(
        `Marking entry ${index} as deleted (ID: ${entryToRemove.id})`
      );
      updatePricesAndSku(index, "isDeleted", true);
    } else {
      // For new entries without ID: physically remove from array
      console.log(`Physically removing new entry ${index}`);
      removePricesAndSku(index);
    }
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
          {(pricesAndSkuFields ?? []).map((field, index) => {
            // Check if this entry is marked as deleted using watched form values
            const watchedEntry = watchedPricesAndSkus[index] || {};
            const isDeleted = watchedEntry.isDeleted === true;

            console.log(
              `DEBUG PricingAndSKU: Index ${index}, isDeleted:`,
              isDeleted,
              "watchedEntry:",
              watchedEntry
            );

            return (
              <Box
                key={field.id || `new-${index}`}
                sx={{
                  mb: isDeleted ? 0 : 3,
                  display: isDeleted ? "none" : "block",
                }}
              >
                {/* Hidden field for ID to preserve existing IDs during edit */}
                <Controller
                  name={`pricesAndSkus.${index}.id`}
                  control={control}
                  defaultValue={field.id || ""}
                  render={({ field: formField }) => {
                    return (
                      <input
                        type="hidden"
                        {...formField}
                        value={formField.value || ""}
                      />
                    );
                  }}
                />
                {/* Hidden fields for other system fields */}
                <Controller
                  name={`pricesAndSkus.${index}.createdDate`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input type="hidden" {...field} value={field.value || ""} />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.modifiedDate`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input type="hidden" {...field} value={field.value || ""} />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.isActive`}
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? "true" : "false"}
                    />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.isDeleted`}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? "true" : "false"}
                    />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.isDiscounted`}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? "true" : "false"}
                    />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.discountedAmount`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={field.value || "0"}
                    />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.weightValue`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={field.value || "0"}
                    />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.weightUnit`}
                  control={control}
                  render={({ field }) => (
                    <input type="hidden" {...field} value={field.value || ""} />
                  )}
                />
                <Controller
                  name={`pricesAndSkus.${index}.currencyCode`}
                  control={control}
                  render={({ field }) => (
                    <input type="hidden" {...field} value={field.value || ""} />
                  )}
                />
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
                              <MenuItem
                                key={currency.value}
                                value={currency.value}
                              >
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
                      disabled={
                        pricesAndSkuFields.filter((f) => !(f as any)?.isDeleted)
                          .length === 1
                      }
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
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PricingAndSKUDetails;
