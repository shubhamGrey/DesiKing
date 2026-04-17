import theme from "@/styles/theme";
import { FeaturedPlayList, LocalOffer, CheckCircle, Dining } from "@mui/icons-material";
import { Box, Grid, Typography, useMediaQuery, Paper, Card } from "@mui/material";
import React from "react";
import { ProductFormData } from "@/types/product";

const scrollbarSx = {
  "&::-webkit-scrollbar": { width: "4px" },
  "&::-webkit-scrollbar-track": { backgroundColor: "grey.100", borderRadius: "2px" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "primary.main",
    borderRadius: "2px",
    "&:hover": { backgroundColor: "primary.dark" },
  },
} as const;

const sectionDefs = [
  {
    id: "keyFeatures" as const,
    baseTitle: "Key Features",
    Icon: FeaturedPlayList,
    description: "Discover what makes this product special",
  },
  {
    id: "uses" as const,
    baseTitle: "Uses",
    Icon: LocalOffer,
    description: "Learn how to use this product effectively",
  },
  {
    id: "nutritionalInfo" as const,
    baseTitle: "Nutritional Information",
    Icon: Dining,
    description: "Complete nutritional details and health benefits",
  },
];

const ItemList = ({ items, isMobile }: { items: string[]; isMobile: boolean }) => (
  <Box
    sx={{
      p: isMobile ? 1 : 1.5,
      overflowY: "auto",
      maxHeight: isMobile ? "325px" : "276px",
      ...scrollbarSx,
    }}
  >
    {isMobile ? (
      items.map((item, i) => (
        <Typography
          key={i}
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}
        >
          <CheckCircle sx={{ fontSize: 16, mr: 1, mt: 0.2, color: "primary.main" }} />
          {item}
        </Typography>
      ))
    ) : (
      <Grid container spacing={1.5}>
        {items.map((item, i) => (
          <Grid key={i} size={12}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                backgroundColor: "grey.50",
                borderLeft: "4px solid",
                borderLeftColor: "primary.main",
                transition: "all 0.2s ease-in-out",
                "&:hover": { backgroundColor: "grey.100", transform: "translateX(4px)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <CheckCircle sx={{ color: "primary.main", mr: 1.2, mt: 0.1, fontSize: 18 }} />
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.5, fontSize: "0.9rem" }}>
                  {item}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

const AdditionalDetails = ({ selectedProduct }: { selectedProduct: ProductFormData }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const nutritionalItems = (selectedProduct.nutritionalInfo ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const getItems = (id: "keyFeatures" | "uses"): string[] => {
    const data = selectedProduct[id];
    return Array.isArray(data) ? data.filter(Boolean) : [];
  };

  return (
    <Box sx={{ mt: 10 }}>
      <Grid container spacing={2}>
        {sectionDefs.map((section) => {
          const title =
            section.id === "uses" ? `${selectedProduct.name} Uses` : section.baseTitle;
          const items =
            section.id === "nutritionalInfo"
              ? nutritionalItems
              : getItems(section.id as "keyFeatures" | "uses");

          return (
            <Grid key={section.id} size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 280,
                  height: "100%",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": !isMobile
                    ? { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(232,93,4,0.15)" }
                    : {},
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    bgcolor: isMobile ? "transparent" : "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <section.Icon sx={{ fontSize: 20, color: isMobile ? "primary.main" : "white" }} />
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color: isMobile ? "text.primary" : "white",
                        fontSize: { xs: "0.95rem", md: "1rem" },
                      }}
                    >
                      {title}
                    </Typography>
                    {!isMobile && (
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.8rem", color: "white" }}>
                        {section.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  {items.length > 0 ? (
                    <ItemList items={items} isMobile={isMobile} />
                  ) : (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        {section.id === "nutritionalInfo"
                          ? "Nutritional information is being updated. Please contact us for details."
                          : "Information coming soon."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AdditionalDetails;
