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
import { michroma } from "@/app/layout";

interface KeyFeaturesProps {
  keyFeatures: string[];
  handleAddKeyFeature: () => void;
  handleRemoveKeyFeature: (index: number) => void;
  handleKeyFeatureChange: (index: number, value: string) => void;
}

const KeyFeatures: React.FC<KeyFeaturesProps> = ({
  keyFeatures,
  handleAddKeyFeature,
  handleRemoveKeyFeature,
  handleKeyFeatureChange,
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
            Key Features
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={handleAddKeyFeature}
            size="small"
          >
            Add Feature
          </Button>
        </Box>
        {keyFeatures.map((feature, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid size={10}>
              <TextField
                fullWidth
                placeholder="e.g., 100% Pure and Natural"
                size="small"
                value={feature}
                onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
              />
            </Grid>
            <Grid size={2}>
              <IconButton
                onClick={() => handleRemoveKeyFeature(index)}
                sx={{ color: "secondary.main" }}
                disabled={keyFeatures.length === 1}
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

export default KeyFeatures;
