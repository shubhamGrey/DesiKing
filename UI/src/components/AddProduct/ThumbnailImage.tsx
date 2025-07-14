import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import Image from "next/image";
import { michroma } from "@/app/layout";

interface ThumbnailImageProps {
  thumbnailImage: File | string | null;
  handleThumbnailUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeThumbnailImage: () => void;
}

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  thumbnailImage,
  handleThumbnailUpload,
  removeThumbnailImage,
}) => {
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
            Thumbnail Image
          </Typography>
          {thumbnailImage ? (
            <Box>
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
                  src={
                    typeof thumbnailImage === "string"
                      ? thumbnailImage
                      : URL.createObjectURL(thumbnailImage)
                  }
                  alt="Thumbnail"
                  width={400}
                  height={300}
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
                  onClick={removeThumbnailImage}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="thumbnail-upload"
                type="file"
                onChange={handleThumbnailUpload}
              />
              <label htmlFor="thumbnail-upload">
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

export default ThumbnailImage;
