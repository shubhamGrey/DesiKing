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

interface UsesProps {
  uses: string[];
  handleAddUse: () => void;
  handleRemoveUse: (index: number) => void;
  handleUseChange: (index: number, value: string) => void;
}

const Uses: React.FC<UsesProps> = ({
  uses,
  handleAddUse,
  handleRemoveUse,
  handleUseChange,
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
            Product Uses
          </Typography>
          <Button startIcon={<Add />} onClick={handleAddUse} size="small">
            Add Use
          </Button>
        </Box>
        {uses.map((use, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid size={10}>
              <TextField
                fullWidth
                placeholder="e.g., Perfect for curries and traditional dishes"
                size="small"
                value={use}
                onChange={(e) => handleUseChange(index, e.target.value)}
              />
            </Grid>
            <Grid size={2}>
              <IconButton
                onClick={() => handleRemoveUse(index)}
                sx={{ color: "secondary.main" }}
                disabled={uses.length === 1}
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

export default Uses;
