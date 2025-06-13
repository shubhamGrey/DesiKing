"use client";

import theme from "@/styles/theme";
import { Add, CloudUpload, Delete, NavigateNext } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { michroma } from "../layout";
import { v4 as uuidv4 } from "uuid";

interface ProductFormData {
  name: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  imageUrl?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AddCategory: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [uploadedImage, setuploadedImage] = useState<File | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      imageUrl: "",
      isActive: true,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setuploadedImage(files[0]);
    }
  };

  const removeImage = () => {
    setuploadedImage(null);
  };

  const uploadViaApi = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.path;
  };

  const onSubmit = async (data: ProductFormData) => {
    if (uploadedImage) {
      try {
        const url = await uploadViaApi(uploadedImage);
        console.log("Image uploaded successfully:", url);

        const finalData = {
          ...data,
          id: uuidv4(),
          imageUrl: url,
        };

        // Here you would typically send the data to your API
        const response = await fetch(`${API_URL}/Category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        });

        if (!response.ok) {
          throw new Error("Failed to add category");
        }

        const result = await response.json();
        console.log("API Response:", result);

        // Show success toast
        setToastOpen(true);
      } catch (error) {
        console.error("Error adding category:", error);
        alert("An error occurred while adding the category. Please try again.");
      }
    }
  };

  return (
    <>
      <Container sx={{ mt: isMobile ? 8 : 12, mb: 6, px: isMobile ? 2 : 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          {/* Breadcrumb */}
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Link
              component="button"
              variant="body1"
              onClick={() => router.push("/products")}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Products
            </Link>
            <Typography variant="body1" color="text.primary">
              Add Category
            </Typography>
          </Breadcrumbs>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
              color="primary.main"
            >
              Add Category
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "secondary.main" },
              }}
            >
              Add Category
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Fill in the category information below to add a new product category
            to your catalog.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid size={{ xs: 12, md: 8 }}>
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
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Category name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Category Name"
                            placeholder="e.g., Powdered Spice"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            label="Category Description"
                            placeholder="Describe the category, its subsequent products, and benefits..."
                            error={!!errors.description}
                            helperText={errors.description?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* SEO */}
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
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="metaTitle"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Meta Title"
                            placeholder="SEO title for search engines"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                            placeholder="SEO description for search engines"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              {/* Product Images */}
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
                    Category Image
                  </Typography>
                  {uploadedImage ? (
                    <Box>
                      {/* Main Preview Image */}
                      <Box
                        sx={{
                          width: "100%",
                          height: "272px",
                          borderRadius: "8px",
                          mb: 3,
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={
                            uploadedImage
                              ? URL.createObjectURL(uploadedImage)
                              : ""
                          }
                          alt={"Category Image"}
                          width={400}
                          height={312}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "secondary.main",
                              color: "white",
                            },
                          }}
                          size="small"
                          onClick={removeImage}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Upload More Images Area - Full Width Row */}
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload-more"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload-more">
                          <Box
                            sx={{
                              width: "100%",
                              height: "80px",
                              border: "2px dashed",
                              borderColor: "primary.main",
                              borderRadius: "8px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              "&:hover": { backgroundColor: "action.hover" },
                            }}
                          >
                            <CloudUpload
                              sx={{
                                fontSize: 24,
                                color: "primary.main",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="primary.main"
                              textAlign="center"
                              fontWeight={500}
                            >
                              Click to upload or drag and drop
                            </Typography>
                          </Box>
                        </label>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image-upload">
                        <Paper
                          sx={{
                            p: 4,
                            textAlign: "center",
                            border: "2px dashed",
                            borderColor: "primary.main",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            height: "312px",
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": { backgroundColor: "action.hover" },
                          }}
                          elevation={0}
                        >
                          <CloudUpload
                            sx={{ fontSize: 48, color: "primary.main" }}
                          />
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, mb: 1 }}
                            color="primary.main"
                          >
                            Click to upload
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            or drag and drop
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            PNG, JPG, JPEG up to 10MB
                          </Typography>
                        </Paper>
                      </label>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Product Settings */}
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
                    Category Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              {...field}
                              checked={field.value}
                              onChange={(event) =>
                                field.onChange(event.target.checked)
                              }
                            />
                          }
                          label="Active"
                        />
                      )}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* Success Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Category added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddCategory;
