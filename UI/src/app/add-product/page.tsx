"use client";

import theme from "@/styles/theme";
import { Add, CloudUpload, Delete, NavigateNext } from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { michroma } from "../layout";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discountedPrice?: number;
  sku: string;
  stock: number;
  weight: string;
  keyFeatures: { feature: string }[];
  uses: { use: string }[];
  ingredients?: string;
  origin: string;
  shelfLife: string;
  storageInstructions: string;
  nutritionalInfo?: string;
  certifications: string[];
  tags: string[];
  isPremium: boolean;
  isFeatured: boolean;
  status: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
}

const categories = [
  { value: "powdered-spices", label: "Powdered Spices" },
  { value: "whole-spices", label: "Whole Spices" },
  { value: "cereals-grains", label: "Cereals & Grains" },
  { value: "flours", label: "Flours" },
  { value: "fats-oils", label: "Fats & Oils" },
  { value: "fruits-nuts", label: "Fruits & Nuts" },
  { value: "bakery-products", label: "Bakery Products" },
  { value: "sugars", label: "Refined & Raw Sugars" },
  { value: "salts", label: "Salts" },
];

const subcategories = {
  "powdered-spices": [
    "Turmeric Powder",
    "Red Chili Powder",
    "Coriander Powder",
    "Cumin Powder",
    "Garam Masala",
  ],
  "whole-spices": [
    "Turmeric Roots",
    "Cumin Seeds",
    "Coriander Seeds",
    "Dry Red Chilies",
    "Bay Leaves",
    "Cloves",
    "Cardamom",
    "Cinnamon",
  ],
};

const certificationOptions = [
  "Premium",
  "FSSAI Certified",
  "ISO 22000",
  "HACCP",
  "Non-GMO",
  "Gluten-Free",
  "Vegan",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Brand {
  name: string;
  id: string;
  isActive: boolean; // Added isActive property
}

interface FormattedBrand {
  label: string;
  value: string;
}

interface Category {
  name: string;
  id: string;
  isActive: boolean; // Added isActive property
}

interface FormattedCategory {
  label: string;
  value: string;
}

const AddProduct: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [brands, setBrands] = useState<FormattedBrand[]>([]);
  const [categories, setCategories] = useState<FormattedCategory[]>([]);

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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res): Promise<Category[]> => res.json())
      .then((data: Category[]) => {
        const formattedCategories: FormattedCategory[] = data
          .filter((cat) => cat.isActive)
          .map((cat) => ({
            label: cat.name,
            value: cat.id,
          }));
        setCategories(formattedCategories);
      })
      .catch((error: unknown) => {
        console.error("Error fetching categories:", error);
      });

    return () => {
      // Cleanup if necessary
      setBrands([]);
      setCategories([]);
    };
  }, []);

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
      category: "",
      brand: "",
      price: 0,
      sku: "",
      stock: 0,
      weight: "",
      keyFeatures: [{ feature: "" }],
      uses: [{ use: "" }],
      origin: "",
      shelfLife: "",
      storageInstructions: "",
      certifications: [],
      tags: [],
      isPremium: false,
      isFeatured: false,
      status: "draft",
    },
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "keyFeatures",
  });

  const {
    fields: useFields,
    append: appendUse,
    remove: removeUse,
  } = useFieldArray({
    control,
    name: "uses",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCertificationToggle = (certification: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(certification)
        ? prev.filter((c) => c !== certification)
        : [...prev, certification]
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
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

  const uploadAllImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map((file) => uploadViaApi(file));
    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (uploadedImages.length > 0) {
      try {
        const imageUrls = await uploadAllImages(uploadedImages);

        const finalData = {
          ...data,
          certifications: selectedCertifications,
          tags,
          imageUrls, // Array of all uploaded image URLs
        };

        console.log("Final Data to Submit:", finalData);

        // Here you would typically send the data to your API
        const response = await fetch(`${API_URL}/Product`, {
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
              Add Product
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
              Add Product
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
              Add Product
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Fill in the product information below to add a new spice to your
            catalog.
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
                        rules={{ required: "Product name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Product Name"
                            placeholder="e.g., Premium Turmeric Powder"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="category"
                        control={control}
                        rules={{ required: "Category is required" }}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.category}
                          >
                            <InputLabel>Category</InputLabel>
                            <Select {...field} label="Category">
                              {categories.map((cat) => (
                                <MenuItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.category && (
                              <Typography variant="caption" color="error">
                                {errors.category.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="brand"
                        rules={{ required: "Brand is required" }}
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.brand}
                          >
                            <InputLabel>Brand</InputLabel>
                            <Select {...field} label="Brand">
                              {brands.map((brand) => (
                                <MenuItem key={brand.value} value={brand.value}>
                                  {brand.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.brand && (
                              <Typography variant="caption" color="error">
                                {errors.brand.message}
                              </Typography>
                            )}
                          </FormControl>
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
                            label="Product Description"
                            placeholder="Describe the product, its quality, and benefits..."
                            error={!!errors.description}
                            helperText={errors.description?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
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
                    Pricing & Inventory
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="price"
                        control={control}
                        rules={{ required: "Price is required", min: 0 }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="number"
                            label="Price"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="discountedPrice"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="number"
                            label="Discounted Price (Optional)"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="weight"
                        control={control}
                        rules={{ required: "Weight is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Weight/Package Size"
                            placeholder="e.g., 100g, 500g, 1kg"
                            error={!!errors.weight}
                            helperText={errors.weight?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="sku"
                        control={control}
                        rules={{ required: "SKU is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="SKU"
                            placeholder="e.g., TUR-100G-001"
                            error={!!errors.sku}
                            helperText={errors.sku?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="stock"
                        control={control}
                        rules={{
                          required: "Stock quantity is required",
                          min: 0,
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="number"
                            label="Stock Quantity"
                            error={!!errors.stock}
                            helperText={errors.stock?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Product Details */}
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
                            size="small"
                            label="Origin"
                            placeholder="e.g., India, Kerala"
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
                            size="small"
                            label="Shelf Life"
                            placeholder="e.g., 24 months"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="ingredients"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Ingredients"
                            placeholder="List all ingredients..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                            placeholder="How to store the product properly..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="nutritionalInfo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={3}
                            label="Nutritional Information (Optional)"
                            placeholder="Nutritional values per 100g..."
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Key Features */}
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
                      Key Features
                    </Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={() => appendFeature({ feature: "" })}
                      size="small"
                    >
                      Add Feature
                    </Button>
                  </Box>
                  {featureFields.map((field, index) => (
                    <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 10 }}>
                        <Controller
                          name={`keyFeatures.${index}.feature`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              placeholder="e.g., 100% Pure and Natural"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 2 }}>
                        <IconButton
                          onClick={() => removeFeature(index)}
                          sx={{ color: "secondary.main" }}
                          disabled={featureFields.length === 1}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>

              {/* Uses */}
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
                      Product Uses
                    </Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={() => appendUse({ use: "" })}
                      size="small"
                    >
                      Add Use
                    </Button>
                  </Box>
                  {useFields.map((field, index) => (
                    <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 10 }}>
                        <Controller
                          name={`uses.${index}.use`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              placeholder="e.g., Perfect for curries and traditional dishes"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 2 }}>
                        <IconButton
                          onClick={() => removeUse(index)}
                          sx={{ color: "secondary.main" }}
                          disabled={useFields.length === 1}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
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
                    Product Images
                  </Typography>
                  {uploadedImages.length > 0 ? (
                    <Box>
                      {/* Main Preview Image */}
                      <Box
                        sx={{
                          width: "100%",
                          height: "300px",
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
                          src={URL.createObjectURL(
                            uploadedImages[selectedImageIndex]
                          )}
                          alt={`Product ${selectedImageIndex + 1}`}
                          width={400}
                          height={300}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            cursor: "pointer",
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
                          onClick={() => removeImage(selectedImageIndex)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Upload More Images Area - Full Width Row */}
                      <Box sx={{ mb: 3 }}>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload-more"
                          multiple
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

                      {/* Thumbnail Images Row */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: isMobile
                            ? "repeat(auto-fit, minmax(80px, 1fr))"
                            : `repeat(${Math.min(
                                uploadedImages.length,
                                6
                              )}, 1fr)`,
                          gap: 1.5,
                          width: "100%",
                        }}
                      >
                        {uploadedImages.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              border: "2px solid",
                              borderColor:
                                selectedImageIndex === index
                                  ? "primary.main"
                                  : "#e0e0e0",
                              borderRadius: "8px",
                              overflow: "hidden",
                              cursor: "pointer",
                              width: "100%",
                              aspectRatio: "1 / 1", // Ensures square thumbnails
                              "&:hover": {
                                borderColor: "primary.main",
                              },
                            }}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Thumbnail ${index + 1}`}
                              width={100}
                              height={100}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                        multiple
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
                            height: "300px",
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
                    Product Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Controller
                      name="isPremium"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} />}
                          label="Premium Product"
                        />
                      )}
                    />
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} />}
                          label="Featured Product"
                        />
                      )}
                    />
                    <Divider />
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select {...field} label="Status">
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="added">Added</MenuItem>
                            <MenuItem value="archived">Archived</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Certifications */}
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
                    Certifications
                  </Typography>
                  <Stack spacing={1}>
                    {certificationOptions.map((cert) => (
                      <Box
                        key={cert}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1,
                          border: "1px solid",
                          borderColor: selectedCertifications.includes(cert)
                            ? "primary.main"
                            : "divider",
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                        onClick={() => handleCertificationToggle(cert)}
                      >
                        <Typography variant="body2">{cert}</Typography>
                        {selectedCertifications.includes(cert) && (
                          <Chip size="small" label="✓" color="primary" />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Tags */}
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
                    Tags
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <Button size="small" onClick={handleAddTag}>
                            Add
                          </Button>
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
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
          Product added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProduct;
