import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import Image from "next/image";
import { michroma } from "@/app/layout";

interface ProductImagesProps {
  uploadedImages: (File | string)[];
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string): boolean => {
  return imageSrc.includes("cloud.agronexis.com");
};

const ProductImages: React.FC<ProductImagesProps> = ({
  uploadedImages,
  selectedImageIndex,
  setSelectedImageIndex,
  handleImageUpload,
  removeImage,
}) => {
  const isMobile = useTheme().breakpoints.down("sm");

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
                {uploadedImages.length > 0 && (
                  <Image
                    src={
                      typeof uploadedImages[selectedImageIndex] === "string"
                        ? uploadedImages[selectedImageIndex]
                        : URL.createObjectURL(
                            uploadedImages[selectedImageIndex]
                          )
                    }
                    alt={`Product ${selectedImageIndex + 1}`}
                    width={400}
                    height={300}
                    unoptimized={
                      typeof uploadedImages[selectedImageIndex] === "string" &&
                      shouldUnoptimizeImage(uploadedImages[selectedImageIndex])
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                  />
                )}
                {uploadedImages.length > 0 && (
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
                )}
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
                    : `repeat(${Math.min(uploadedImages.length, 6)}, 1fr)`,
                  gap: 1.5,
                  width: "100%",
                }}
              >
                {uploadedImages.map((image, index) => (
                  <Box
                    key={`thumbnail-${index}-${
                      typeof image === "string" ? image : image.name
                    }`}
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
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      unoptimized={
                        typeof image === "string" &&
                        shouldUnoptimizeImage(image)
                      }
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
                  <CloudUpload sx={{ fontSize: 48, color: "primary.main" }} />
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductImages;
