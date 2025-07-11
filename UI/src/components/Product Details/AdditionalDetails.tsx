import theme from "@/styles/theme";
import { ArrowRight } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";

// Define the type for selectedProduct
interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  categoryName: string;
  manufacturingDate: string;
  createdDate: string;
  modifiedDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle: string;
  metaDescription: string;
  imageUrls: string[];
  keyFeatures: string[];
  uses: string[];
  origin: string;
  shelfLife: string;
  storageInstructions: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  ingredients: string;
  nutritionalInfo: string;
  thumbnailUrl?: string;
}

const AdditionalDetails = ({
  selectedProduct,
}: {
  selectedProduct: Product;
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sections, setSections] = React.useState([
    {
      id: "keyFeatures",
      title: "Key Features",
      expanded: false,
    },
    {
      id: "uses",
      title: `${selectedProduct?.name} Uses`,
      expanded: false,
    },
    {
      id: "customer_reviews",
      title: "Customer Reviews",
      expanded: false,
    },
  ]);

  const toggleSection = (id: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const [selectedSection, setSelectedSection] = React.useState<
    keyof Product | null
  >("keyFeatures");

  return (
    <>
      {!isMobile ? (
        <Grid container spacing={2} sx={{ mt: 15 }}>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}
          >
            {sections.map((section) => (
              <Typography
                key={section.id}
                sx={{
                  textDecoration:
                    section.id === selectedSection ? "underline" : "none",
                  cursor: "pointer",
                }}
                variant="body1"
                color="text.primary"
                onClick={() => setSelectedSection(section.id as keyof Product)}
              >
                {section.title}
              </Typography>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
              {sections.find((item) => item.id == selectedSection)?.title}
            </Typography>
            {selectedSection &&
              selectedProduct &&
              Array.isArray(selectedProduct[selectedSection]) &&
              selectedProduct[selectedSection].map((item, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <ArrowRight sx={{ fontSize: 16, verticalAlign: "middle" }} />{" "}
                  {item}
                </Typography>
              ))}
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ mt: 4 }}>
          {sections.map((section) => (
            <Accordion
              key={section.id}
              expanded={section.expanded}
              sx={{ backgroundColor: "transparent" }}
              elevation={0}
              onClick={() => toggleSection(section.id)}
            >
              <AccordionSummary expandIcon={<ArrowRight />}>
                <Typography variant="h6" color="text.primary">
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.id &&
                  selectedProduct &&
                  Array.isArray(selectedProduct[section.id as keyof Product]) &&
                  (
                    selectedProduct[section.id as keyof Product] as string[]
                  ).map((item, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      <ArrowRight
                        sx={{ fontSize: 16, verticalAlign: "middle" }}
                      />{" "}
                      {item}
                    </Typography>
                  ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </>
  );
};

export default AdditionalDetails;
