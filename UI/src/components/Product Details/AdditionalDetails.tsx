import theme from "@/styles/theme";
import {
  Star,
  FeaturedPlayList,
  LocalOffer,
  CheckCircle,
  Dining,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useMediaQuery,
  Paper,
  Card,
  Rating,
} from "@mui/material";
import React from "react";
import { michroma } from "@/styles/fonts";
import { ProductFormData } from "@/types/product";

const AdditionalDetails = ({
  selectedProduct,
}: {
  selectedProduct: ProductFormData;
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sections = [
    {
      id: "keyFeatures",
      title: "Key Features",
      expanded: true, // Always expanded
      icon: <FeaturedPlayList />,
      description: "Discover what makes this product special",
    },
    {
      id: "uses",
      title: `${selectedProduct?.name} Uses`,
      expanded: true, // Always expanded
      icon: <LocalOffer />,
      description: "Learn how to use this product effectively",
    },
    {
      id: "nutritionalInfo",
      title: "Nutritional Information",
      expanded: true, // Always expanded
      icon: <Dining />,
      description: "Complete nutritional details and health benefits",
    },
    {
      id: "customer_reviews",
      title: "Customer Reviews",
      expanded: true, // Always expanded
      icon: <Star />,
      description: "See what our customers are saying",
    },
  ];

  const renderCustomerReviews = () => (
    <Box
      sx={{
        p: 1.5,
        maxHeight: "400px", // Limit height to approximately 3 rows
        overflowY: "auto", // Add vertical scroll
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "grey.100",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: "2px",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        },
      }}
    >
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Customer reviews are coming soon. Be the first to review this product!
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
        <Rating value={0} readOnly />
        <Typography variant="body2" color="text.secondary">
          No reviews yet
        </Typography>
      </Box>
    </Box>
  );

  const renderNutritionalInfo = () => (
    <Box
      sx={{
        p: isMobile ? 1 : 1.5,
        maxHeight: "400px", // Limit height to approximately 3 rows
        overflowY: "auto", // Add vertical scroll
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "grey.100",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: "2px",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        },
      }}
    >
      {selectedProduct.nutritionalInfo ? (
        <Box>
          {selectedProduct.nutritionalInfo.split(",").map((item, index) => {
            const trimmedItem = item.trim();
            if (!trimmedItem) return null;

            return isMobile ? (
              // Mobile: Simple list
              <Typography
                key={`nutritional-mobile-${index}-${trimmedItem.slice(0, 10)}`}
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 16,
                    mr: 1,
                    mt: 0.2,
                    color: "primary.main",
                  }}
                />
                {trimmedItem}
              </Typography>
            ) : (
              // Desktop: Enhanced grid layout
              <Grid
                key={`nutritional-desktop-${index}-${trimmedItem.slice(0, 10)}`}
                container
                spacing={1.5}
                sx={{ mb: 1.5 }}
              >
                <Grid size={{ xs: 12 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: "grey.50",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "grey.100",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <CheckCircle
                        sx={{
                          color: "primary.main",
                          mr: 1.2,
                          mt: 0.1,
                          fontSize: 18,
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ lineHeight: 1.5, fontSize: "0.9rem" }}
                      >
                        {trimmedItem}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Nutritional information is being updated. Please contact us for
          detailed information.
        </Typography>
      )}
    </Box>
  );

  const renderFeaturesList = (items: string[], sectionId: string) => {
    if (sectionId === "customer_reviews") {
      return renderCustomerReviews();
    }

    if (sectionId === "nutritionalInfo") {
      return renderNutritionalInfo();
    }

    return (
      <Box
        sx={{
          p: isMobile ? 1 : 1.5,
          maxHeight: "400px", // Limit height to approximately 3 rows
          overflowY: "auto", // Add vertical scroll
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "grey.100",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: "2px",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          },
        }}
      >
        {isMobile ? (
          // Mobile: Simple list
          <Box>
            {items.map((item, index) => (
              <Typography
                key={`${sectionId}-mobile-${index}-${item.slice(0, 10)}`}
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 16,
                    mr: 1,
                    mt: 0.2,
                    color: "primary.main",
                  }}
                />
                {item}
              </Typography>
            ))}
          </Box>
        ) : (
          // Desktop: Enhanced grid layout
          <Grid container spacing={1.5}>
            {items.map((item, index) => (
              <Grid
                key={`${sectionId}-desktop-${index}-${item.slice(0, 10)}`}
                size={12}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    backgroundColor: "grey.50",
                    borderLeft: "4px solid",
                    borderLeftColor: "primary.main",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "grey.100",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <CheckCircle
                      sx={{
                        color: "primary.main",
                        mr: 1.2,
                        mt: 0.1,
                        fontSize: 18,
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ lineHeight: 1.5, fontSize: "0.9rem" }}
                    >
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
  };

  return (
    <Box sx={{ mt: 10 }}>
      {/* Desktop: Enhanced header */}

      {/* Sections in Grid Layout */}
      <Grid container spacing={2}>
        {sections.map((section) => (
          <Grid key={section.id} size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                mb: 1.5,
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                backgroundColor: "transparent",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                height: "400px", // Fixed height for all sections
                display: "flex",
                flexDirection: "column",
                "&:hover": !isMobile
                  ? {
                    elevation: 4,
                    transform: "translateY(-2px)",
                  }
                  : {},
              }}
            >
              <Accordion
                expanded={true} // Always expanded
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:before": { display: "none" },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              // Remove onChange to prevent toggle
              >
                <AccordionSummary
                  expandIcon={null} // Remove expand icon since it's always open
                  sx={{
                    backgroundColor: isMobile ? "transparent" : "primary.main",
                    color: isMobile ? "text.primary" : "primary.contrastText",
                    py: 1,
                    px: 2.5,
                    minHeight: 44,
                    flexShrink: 0, // Prevent header from shrinking
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      margin: "6px 0",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: michroma.style.fontFamily,
                          fontWeight: 600,
                          mb: isMobile ? 0 : 0.15,
                          fontSize: isMobile ? "0.95rem" : "1rem",
                        }}
                      >
                        {section.title}
                      </Typography>
                      {!isMobile && (
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.9,
                            fontWeight: 400,
                            fontSize: "0.8rem",
                          }}
                        >
                          {section.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, flex: 1, overflow: "hidden" }}>
                  {section.id === "customer_reviews" && renderCustomerReviews()}
                  {section.id === "nutritionalInfo" && renderNutritionalInfo()}
                  {section.id !== "customer_reviews" &&
                    section.id !== "nutritionalInfo" &&
                    selectedProduct &&
                    Array.isArray(
                      selectedProduct[section.id as "keyFeatures" | "uses"]
                    ) &&
                    renderFeaturesList(
                      selectedProduct[
                      section.id as "keyFeatures" | "uses"
                      ] as string[],
                      section.id
                    )}
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdditionalDetails;
