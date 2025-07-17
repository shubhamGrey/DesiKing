import React from "react";
import {
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { michroma } from "@/styles/fonts";
import { ProductFormData } from "@/types/product";

interface ProductSettingsProps {
  control: Control<ProductFormData>;
  isActive?: boolean;
  setIsActive?: (value: boolean) => void;
  isPremium?: boolean;
  setIsPremium?: (value: boolean) => void;
  isFeatured?: boolean;
  setIsFeatured?: (value: boolean) => void;
}

const ProductSettings: React.FC<ProductSettingsProps> = ({
  control,
  isActive,
  isFeatured,
  isPremium,
  setIsActive,
  setIsFeatured,
  setIsPremium,
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
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          sx={{ mb: 3 }}
        >
          Product Settings
        </Typography>
        <Stack spacing={2}>
          <Controller
            name="isPremium"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={isPremium}
                    onChange={(e) => {
                      const value = e.target.checked;
                      if (setIsPremium) setIsPremium(value);
                      field.onChange(value);
                    }}
                  />
                }
                label="Premium Product"
              />
            )}
          />
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={isFeatured}
                    onChange={(e) => {
                      const value = e.target.checked;
                      if (setIsFeatured) setIsFeatured(value);
                      field.onChange(value);
                    }}
                  />
                }
                label="Featured Product"
              />
            )}
          />
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={isActive}
                    onChange={(e) => {
                      const value = e.target.checked;
                      if (setIsActive) setIsActive(value);
                      field.onChange(value);
                    }}
                  />
                }
                label="Active Product"
              />
            )}
          />
        </Stack>
      </Box>
    </CardContent>
  </Card>
);

export default ProductSettings;
