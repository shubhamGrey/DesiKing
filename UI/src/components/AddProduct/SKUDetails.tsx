import React from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Control, Controller, FieldValues } from "react-hook-form";
import { michroma } from "@/app/layout";

interface SKUDetailsProps {
  control: Control<FieldValues>; // Replace 'any' with the appropriate type for your control object
  skuFields: Array<{
    id: string;
    sku: string;
    weight: string;
    barcode: string;
  }>;
  appendSku: (sku: { sku: string; weight: string; barcode: string }) => void;
  removeSku: (index: number) => void;
}

const SKUDetails: React.FC<SKUDetailsProps> = ({
  control,
  skuFields,
  appendSku,
  removeSku,
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
            SKU Details
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={() => appendSku({ sku: "", weight: "", barcode: "" })}
            size="small"
          >
            Add SKU
          </Button>
        </Box>
        {skuFields.map((field, index) => (
          <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
            <Grid size={4}>
              <Controller
                name={`sku.${index}.sku`}
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
            <Grid size={4}>
              <Controller
                name={`sku.${index}.weight`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Weight"
                    fullWidth
                    size="small"
                    placeholder="e.g., 500g"
                  />
                )}
              />
            </Grid>
            <Grid size={3}>
              <Controller
                name={`sku.${index}.barcode`}
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
            <Grid size={1}>
              <IconButton
                onClick={() => removeSku(index)}
                sx={{ color: "secondary.main" }}
                disabled={skuFields.length === 1}
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

export default SKUDetails;
