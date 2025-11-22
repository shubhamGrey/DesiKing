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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { michroma } from "@/styles/fonts";
import { BrandFormData } from "@/types/product";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string): boolean => {
  return imageSrc.includes("cloud.agronexis.com");
};

const AddBrand: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const brandId =
    typeof window !== "undefined" ? sessionStorage.getItem("brandId") : null;
  const [uploadedImage, setuploadedImage] = useState<File | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State to force re-render

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("brandId"); // Clear brandId on unmount
    };
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      logoUrl: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (brandId) {
      setIsEditMode(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Brand/${brandId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          // Handle both direct data and wrapped response
          const data = response.data || response;
          console.log("Brand data received:", data);
          
          setValue("name", data.name || "");
          setValue("code", data.code || "");
          setValue("description", data.description || "");
          setValue("metaTitle", data.metaTitle || "");
          setValue("metaDescription", data.metaDescription || "");
          setValue("isActive", data.isActive ?? true);
          setValue("logoUrl", data.logoUrl || "");
        })
        .catch((error: unknown) => {
          console.error("Error fetching brand:", error);
        });
    }
  }, [brandId, setValue]);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setuploadedImage(files[0]);
      setValue("logoUrl", ""); // Clear logoUrl when a new image is uploaded
    }
  };

  const removeImage = () => {
    setuploadedImage(null);
    setValue("logoUrl", ""); // Clear logoUrl when the image is removed
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

  const onSubmit = async (data: BrandFormData) => {
    try {
      let logoUrl = data.logoUrl;

      if (uploadedImage) {
        logoUrl = await uploadViaApi(uploadedImage);
      }

      const finalData = {
        ...data,
        logoUrl,
        id: brandId ?? undefined, // Use existing ID if editing
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/Brand`;

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
          brandId ? "Failed to update brand" : "Failed to add brand"
        );
      }

      setToastOpen(true);
      router.push("/admin");
    } catch (error) {
      console.error(
        brandId ? "Error updating brand:" : "Error adding brand:",
        error
      );
      alert(
        brandId
          ? "An error occurred while updating the brand. Please try again."
          : "An error occurred while adding the brand. Please try again."
      );
    } finally {
      sessionStorage.removeItem("brandId"); // Clear brandId after submission
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
                sessionStorage.removeItem("brandId");
                router.push("/admin");
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
              Admin
            </Link>
            <Typography variant="body1" color="text.primary">
              {isEditMode ? "Edit Brand" : "Add Brand"}
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
              {isEditMode ? "Edit Brand" : "Add Brand"}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  sessionStorage.removeItem("brandId");
                  router.push("/admin");
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
                {isEditMode ? "Update Brand" : "Save Brand"}
              </Button>
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? "Update the brand information below."
              : "Fill in the brand information below to add a new brand to your catalog."}
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
                        rules={{ required: "Brand name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Brand Name"
                            placeholder="e.g., Everest"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Brand Code"
                            placeholder="e.g., EVR"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            label="Brand Description"
                            placeholder="Describe the brand, its history, and values..."
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
                    Brand Logo
                  </Typography>
                  {uploadedImage || getValues("logoUrl") ? (
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
                              : getValues("logoUrl") ?? "" // Ensure fallback to an empty string
                          }
                          alt="Brand Logo"
                          width={400}
                          height={312}
                          unoptimized={
                            !uploadedImage && getValues("logoUrl")
                              ? shouldUnoptimizeImage(getValues("logoUrl")!)
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
                    Brand Settings
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
            ? "Brand updated successfully!"
            : "Brand added successfully!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddBrand;
