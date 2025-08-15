"use client";

import theme from "@/styles/theme";
import { Add, NavigateNext } from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { michroma } from "@/styles/fonts";
import BasicInformation from "../../components/AddProduct/BasicInformation";
import Certifications from "../../components/AddProduct/Certifications";
import KeyFeatures from "../../components/AddProduct/KeyFeatures";
import PricingAndSKUDetails from "../../components/AddProduct/PricingAndSKUDetails";
import ProductDetails from "../../components/AddProduct/ProductDetails";
import ProductImages from "../../components/AddProduct/ProductImages";

import ProductSettings from "../../components/AddProduct/ProductSettings";
import SEOInformation from "../../components/AddProduct/SEOInformation";
import ThumbnailImage from "../../components/AddProduct/ThumbnailImage";
import Uses from "../../components/AddProduct/Uses";
import { Brand, Category, Currency, FormattedBrand, FormattedCategory, FormattedCurrency, FormattedWeight, ProductFormData, Weight } from "@/types/product";

// ...removed local ProductFormData, now using from @/types/product...

const certificationOptions = [
  "Premium",
  "FSSAI Certified",
  "ISO 22000",
  "HACCP",
  "Non-GMO",
  "Gluten-Free",
  "Vegan",
];

const AddProduct: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<(File | string)[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<File | string | null>(
    null
  );
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [brands, setBrands] = useState<FormattedBrand[]>([]);
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [weights, setWeights] = useState<FormattedWeight[]>([]);
  const [currencies, setCurrencies] = useState<FormattedCurrency[]>([]);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([""]);
  const [uses, setUses] = useState<string[]>([""]);
  const [manufacturingDate, setManufacturingDate] = useState<Date | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // return () => {
    //   sessionStorage.removeItem("productId"); // Clear productId on unmount
    // };
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      pricesAndSkus: [
        {
          id: "",
          price: 0,
          isDiscounted: false,
          discountPercentage: 0,
          discountedAmount: 0,
          skuNumber: "",
          weightId: "",
          weightValue: 0,
          weightUnit: "",
          currencyCode: "",
          currencyId: "",
          barcode: "",
          createdDate: "",
          modifiedDate: null,
          isActive: true,
          isDeleted: false,
        },
      ],
      stock: 0,
      keyFeatures: [],
      uses: [],
      ingredients: "",
      nutritionalInfo: "",
      origin: "",
      shelfLife: "",
      storageInstructions: "",
      certifications: [],
      isPremium: false,
      isFeatured: false,
      manufacturingDate: "",
      isActive: true,
      metaTitle: "",
      metaDescription: "",
    },
  });

  useEffect(() => {
    const productId = sessionStorage.getItem("productId");
    if (productId) {
      setIsEditMode(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Product/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setValue("name", data.name);
          setValue("description", data.description);
          setValue("category", data.categoryId);
          setValue("brand", data.brandId);
          // Combine price and SKU data into pricesAndSkus
          const pricesAndSkus = data.price?.map((priceItem: any, index: number) => ({
            ...priceItem,
            skuNumber: data.sku?.[index]?.sku || "",
            barcode: data.sku?.[index]?.barcode || "",
            id: priceItem.id || "",
            weightId: priceItem.weightId || "",
            weightValue: priceItem.weightValue || 0,
            weightUnit: priceItem.weightUnit || "",
            currencyCode: priceItem.currencyCode || "",
            currencyId: priceItem.currencyId || "",
            createdDate: priceItem.createdDate || "",
            modifiedDate: priceItem.modifiedDate || null,
            isActive: priceItem.isActive ?? true,
            isDeleted: priceItem.isDeleted ?? false,
            price: priceItem.price || 0,
            isDiscounted: priceItem.isDiscounted || false,
            discountPercentage: priceItem.discountPercentage || 0,
            discountedAmount: priceItem.discountedAmount || 0,
          })) || [];
          setValue("pricesAndSkus", pricesAndSkus);
          setValue("stock", data.stock);
          setKeyFeatures(data.keyFeatures || []);
          setUses(data.uses || []);
          setValue("ingredients", data.ingredients || "");
          setValue("nutritionalInfo", data.nutritionalInfo || "");
          setValue("origin", data.origin);
          setValue("shelfLife", data.shelfLife);
          setValue("storageInstructions", data.storageInstructions);
          setValue("certifications", data.certifications || []);

          // Set both form values and state variables for switches
          const premiumValue = data.isPremium || false;
          const featuredValue = data.isFeatured || false;
          const activeValue = data.isActive ?? true;

          setValue("isPremium", premiumValue);
          setValue("isFeatured", featuredValue);
          setValue("isActive", activeValue);

          setIsPremium(premiumValue);
          setIsFeatured(featuredValue);
          setIsActive(activeValue);

          setValue("metaTitle", data.metaTitle);
          setValue("metaDescription", data.metaDescription);
          setManufacturingDate(
            data.manufacturingDate ? new Date(data.manufacturingDate) : null
          );
          setUploadedImages(data.imageUrls || []);
          setThumbnailImage(data.thumbnailUrl || null);
          setSelectedCertifications(data.certifications || []);
          setSelectedImageIndex(0);
          if (data.imageUrls && data.imageUrls.length > 0) {
            setSelectedImageIndex(0); // Reset to first image if available
          } else {
            setSelectedImageIndex(-1); // No images available
          }
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    }

    // Fetch brands and categories
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
            id: cat.id,
            title: cat.name,
            image: cat.imageUrl,
          }));
        setCategories(formattedCategories);
      })
      .catch((error: unknown) => {
        console.error("Error fetching categories:", error);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/getweights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res): Promise<Weight[]> => res.json())
      .then((data: Weight[]) => {
        const formattedWeights: FormattedWeight[] = data.map((weight) => ({
          label: `${weight.value} ${weight.unit}`,
          value: weight.id,
        }));
        setWeights(formattedWeights);
      })
      .catch((error: unknown) => {
        console.error("Error fetching weights:", error);
      });

    // Fetch currencies
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/getcurrencies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res): Promise<Currency[]> => res.json())
      .then((data: Currency[]) => {
        const formattedCurrencies: FormattedCurrency[] = data.map((currency) => ({
          label: currency.code,
          value: currency.id,
        }));
        setCurrencies(formattedCurrencies);
      })
      .catch((error: unknown) => {
        console.error("Error fetching currencies:", error);
      });

    return () => {
      setBrands([]);
      setCategories([]);
      setWeights([]);
      setCurrencies([]);
    };
  }, [setValue]);

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "pricesAndSkus",
  });

  const handleAddKeyFeature = () => setKeyFeatures([...keyFeatures, ""]);
  const handleRemoveKeyFeature = (index: number) =>
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  const handleKeyFeatureChange = (index: number, value: string) => {
    const updatedKeyFeatures = [...keyFeatures];
    updatedKeyFeatures[index] = value;
    setKeyFeatures(updatedKeyFeatures);
  };

  const handleAddUse = () => setUses([...uses, ""]);
  const handleRemoveUse = (index: number) =>
    setUses(uses.filter((_, i) => i !== index));
  const handleUseChange = (index: number, value: string) => {
    const updatedUses = [...uses];
    updatedUses[index] = value;
    setUses(updatedUses);
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setThumbnailImage(file);
  };
  const removeThumbnailImage = () => setThumbnailImage(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setUploadedImages([...uploadedImages, ...files]);
  };
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setSelectedImageIndex(
      selectedImageIndex >= index
        ? Math.max(0, selectedImageIndex - 1)
        : selectedImageIndex
    );
  };

  const handleCertificationToggle = (certification: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(certification)
        ? prev.filter((item) => item !== certification)
        : [...prev, certification]
    );
  };

  const uploadViaApi = async (file: File | string): Promise<string> => {
    if (typeof file === "string") {
      return file;
    }
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

  const uploadAllImages = async (
    files: (File | string)[]
  ): Promise<string[]> => {
    const uploadPromises = files.map((file) => uploadViaApi(file));
    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: ProductFormData) => {
    const imageUrls = await uploadAllImages(uploadedImages);
    const thumbnailImageUrl = thumbnailImage
      ? await uploadViaApi(thumbnailImage)
      : null;

    // Use pricesAndSkus directly from form data
    const finalData = {
      id: isEditMode ? sessionStorage.getItem("productId") : undefined,
      name: data.name,
      description: data.description,
      pricesAndSkus: data.pricesAndSkus,
      imageUrls: imageUrls,
      keyFeatures,
      uses,
      manufacturingDate: manufacturingDate
        ? new Date(manufacturingDate).toISOString()
        : new Date().toISOString(),
      categoryId: data.category,
      brandId: data.brand,
      metaTitle: data.metaTitle || "",
      metaDescription: data.metaDescription || "",
      origin: data.origin,
      shelfLife: data.shelfLife,
      storageInstructions: data.storageInstructions,
      certifications: selectedCertifications,
      isActive: isActive,
      isPremium: isPremium,
      isFeatured: isFeatured,
      ingredients: data.ingredients || "",
      nutritionalInfo: data.nutritionalInfo || "",
      thumbnailUrl: thumbnailImageUrl || ""
    };

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/Product`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      await response.json();
      setToastOpen(true);

      // Clear sessionStorage and redirect after success
      if (isEditMode) {
        sessionStorage.removeItem("productId");
      }

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product. Please try again.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              {isEditMode ? "Edit Product" : "Add Product"}
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
              {isEditMode ? "Edit Product" : "Add Product"}
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
              {isEditMode ? "Update Product" : "Save Product"}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? "Edit the product information below to update the spice in your catalog."
              : "Fill in the product information below to add a new spice to your catalog."}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 8 }}>
              <BasicInformation
                control={control}
                errors={errors}
                brands={brands}
                categories={categories}
              />
              <PricingAndSKUDetails
                control={control}
                weights={weights}
                currencies={currencies}
                pricesAndSkuFields={variantFields}
                appendPricesAndSku={appendVariant}
                removePricesAndSku={removeVariant}
              />
              <ProductDetails
                control={control}
                manufacturingDate={manufacturingDate}
                setManufacturingDate={setManufacturingDate}
              />
              <KeyFeatures
                keyFeatures={keyFeatures}
                handleAddKeyFeature={handleAddKeyFeature}
                handleRemoveKeyFeature={handleRemoveKeyFeature}
                handleKeyFeatureChange={handleKeyFeatureChange}
              />
              <Uses
                uses={uses}
                handleAddUse={handleAddUse}
                handleRemoveUse={handleRemoveUse}
                handleUseChange={handleUseChange}
              />
              <SEOInformation control={control} />
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <ThumbnailImage
                thumbnailImage={thumbnailImage}
                handleThumbnailUpload={handleThumbnailUpload}
                removeThumbnailImage={removeThumbnailImage}
              />
              <ProductImages
                uploadedImages={uploadedImages}
                handleImageUpload={handleImageUpload}
                setSelectedImageIndex={setSelectedImageIndex}
                removeImage={removeImage}
                selectedImageIndex={selectedImageIndex}
              />
              <ProductSettings
                control={control}
                isActive={isActive}
                setIsActive={setIsActive}
                isPremium={isPremium}
                setIsPremium={setIsPremium}
                isFeatured={isFeatured}
                setIsFeatured={setIsFeatured}
              />
              <Certifications
                certificationOptions={certificationOptions}
                selectedCertifications={selectedCertifications}
                onToggle={handleCertificationToggle}
              />
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* Success Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!"}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default AddProduct;
