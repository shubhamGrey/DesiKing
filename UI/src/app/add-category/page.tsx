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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { michroma } from "@/styles/fonts";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string): boolean => {
  return imageSrc.includes("cloud.agronexis.com");
};

interface CategoryFormData {
  name: string;
  description: string;
  brandId?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  imageUrl?: string;
}

interface Brand {
  name: string;
  id: string;
  isActive: boolean;
}

interface FormattedBrand {
  label: string;
  value: string;
}

const AddCategory: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const categoryId =
    typeof window !== "undefined" ? sessionStorage.getItem("categoryId") : null;
  const [uploadedImage, setuploadedImage] = useState<File | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [brands, setBrands] = useState<FormattedBrand[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State to force re-render

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      imageUrl: "",
      isActive: true,
      brandId: "",
    },
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Brand`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res): Promise<Brand[]> => res.json())
      .then((data: Brand[]) => {
        const formattedBrands: FormattedBrand[] = data
          .filter((brand) => brand.isActive)
          .map((brand) => ({
            label: brand.name,
            value: brand.id,
          }));
        setBrands(formattedBrands);
      })
      .catch((error: unknown) => {
        console.error("Error fetching brands:", error);
      });

    if (categoryId) {
      setIsEditMode(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Category/${categoryId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data: CategoryFormData) => {
          setValue("name", data.name);
          setValue("description", data.description);
          setValue("metaTitle", data.metaTitle ?? "");
          setValue("metaDescription", data.metaDescription ?? "");
          setValue("isActive", data.isActive ?? false);
          setValue("brandId", data.brandId ?? "");
          setValue("imageUrl", data.imageUrl ?? ""); // Ensure imageUrl is set
        })
        .catch((error: unknown) => {
          console.error("Error fetching category:", error);
        });
    }
  }, [categoryId, setValue]);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setuploadedImage(files[0]);
      setValue("imageUrl", ""); // Clear imageUrl when a new image is uploaded
    }
  };

  const removeImage = () => {
    setuploadedImage(null);
    setValue("imageUrl", ""); // Clear imageUrl when the image is removed
    setRefreshKey((prev) => prev + 1); // Increment refreshKey to trigger re-render
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
    return data.previewUrl;
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      let imageUrl = data.imageUrl;

      if (uploadedImage) {
        imageUrl = await uploadViaApi(uploadedImage);
      }

      const finalData = {
        ...data,
        imageUrl,
        id: categoryId ?? undefined, // Use existing ID if editing
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/Category`;

      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error(
          categoryId ? "Failed to update category" : "Failed to add category"
        );
      }

      setToastOpen(true);
      router.push("/");
    } catch (error) {
      console.error(
        categoryId ? "Error updating category:" : "Error adding category:",
        error
      );
      alert(
        categoryId
          ? "An error occurred while updating the category. Please try again."
          : "An error occurred while adding the category. Please try again."
      );
    } finally {
      sessionStorage.removeItem("categoryId"); // Clear categoryId after submission
    }
  };

  return (
    <>
      <Container sx={{ mt: isMobile ? 8 : 12, mb: 6, px: isMobile ? 2 : 4 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Link
              component="button"
              variant="body1"
              onClick={() => {
                sessionStorage.removeItem("categoryId");
                router.push("/");
              }}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Product Categories
            </Link>
            <Typography variant="body1" color="text.primary">
              {isEditMode ? "Edit Category" : "Add Category"}
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
              {isEditMode ? "Edit Category" : "Add Category"}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  sessionStorage.removeItem("categoryId");
                  router.push("/");
                }}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "secondary.main",
                    color: "secondary.main",
                  },
                }}
              >
                Cancel
              </Button>
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
                {isEditMode ? "Update Category" : "Save Category"}
              </Button>
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? "Update the category information below."
              : "Fill in the category information below to add a new product category to your catalog."}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
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
                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="brandId"
                        control={control}
                        rules={{ required: "Brand is required" }}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.brandId}
                          >
                            <InputLabel>Brand</InputLabel>
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              label="Brand"
                            >
                              {brands.map((brand) => (
                                <MenuItem key={brand.value} value={brand.value}>
                                  {brand.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.brandId && (
                              <Typography variant="caption" color="error">
                                {errors.brandId.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
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
                  {uploadedImage || getValues("imageUrl") ? (
                    <Box key={refreshKey}>
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
                              : getValues("imageUrl") ?? "" // Ensure fallback to an empty string
                          }
                          alt="Category Image"
                          width={400}
                          height={312}
                          unoptimized={
                            !uploadedImage && getValues("imageUrl")
                              ? shouldUnoptimizeImage(getValues("imageUrl")!)
                              : false
                          }
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
          {isEditMode
            ? "Category updated successfully!"
            : "Category added successfully!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddCategory;
