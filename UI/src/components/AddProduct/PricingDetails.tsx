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
import { michroma } from "@/app/layout";
import { ProductFormData } from "@/types/product";

interface PricingDetailsProps {
  control: Control<ProductFormData>;
  priceFields: Array<{ id: string }>;
  appendPrice: (price: {
    amount: string;
    currency: string;
    isDiscounted: boolean;
    discountPercentage: number;
    discountedAmount: string;
    weight: string;
  }) => void;
  removePrice: (index: number) => void;
}

const PricingDetails: React.FC<PricingDetailsProps> = ({
  control,
  priceFields,
  appendPrice,
  removePrice,
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
            Pricing Details
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={() =>
              appendPrice({
                amount: "",
                currency: "INR",
                isDiscounted: false,
                discountPercentage: 0,
                discountedAmount: "",
                weight: "",
              })
            }
            size="small"
            disabled={priceFields.length >= 5}
          >
            Add Price
          </Button>
        </Box>
        {priceFields.map((field, index) => (
          <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
            <Grid size={3}>
              <Controller
                name={`price.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    fullWidth
                    size="small"
                    placeholder="Enter price amount"
                  />
                )}
              />
            </Grid>
            <Grid size={2}>
              <Controller
                name={`price.${index}.currency`}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Currency</InputLabel>
                    <Select {...field} label="Currency">
                      <MenuItem value="INR">INR</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={3}>
              <Controller
                name={`price.${index}.weight`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Weight"
                    fullWidth
                    size="small"
                    placeholder="Enter weight in grams or kilograms"
                  />
                )}
              />
            </Grid>
            <Grid size={3}>
              <Controller
                name={`price.${index}.discountPercentage`}
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
            <Grid size={1}>
              <IconButton
                onClick={() => removePrice(index)}
                sx={{ color: "secondary.main" }}
                disabled={priceFields.length === 1}
              >
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default PricingDetails;
