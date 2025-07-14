import React from "react";
import { Grid, TextField, Card, CardContent, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { michroma } from "@/app/layout";

const SEOInformation = ({ control }: { control: Control<any> }) => (
  <Card
    sx={{
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
        SEO Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller
            name="metaTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Meta Title"
                size="small"
                placeholder="SEO title for search engines"
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="metaDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Meta Description"
                size="small"
                placeholder="SEO description for search engines"
              />
            )}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SEOInformation;
