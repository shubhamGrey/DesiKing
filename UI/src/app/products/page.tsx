"use client";
import theme from "@/styles/theme";
import { Close } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Michroma } from "next/font/google";
import Image from "next/image";
import React from "react";

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const products = [
  {
    id: 1,
    name: "Turmeric Powder",
    description:
      "AGRO NEXIS Turmeric Powder is made from the finest turmeric roots, known for its vibrant color and health benefits. \
      Ground to perfection to preserve its natural aroma and flavor, this turmeric powder is ideal for cooking, baking, and health supplements. \
      It adds a warm, earthy flavor to dishes and is rich in curcumin, a powerful antioxidant.",
    image: "/Turmeric.png",
    key_features: [
      "100% Pure and Natural",
      "Rich in Curcumin",
      "No Artificial Additives",
      "Packed in a Hygienic Environment",
      "Sourced from Trusted Farmers",
    ],
    uses: [
      "Turmeric powder is versatile and can be used in various dishes such as curries, soups, stews, and even smoothies.",
      "It is commonly used in Indian cuisine for its flavor and color.",
      "In addition to culinary uses, turmeric powder is often added to health drinks and supplements for its potential health benefits.",
    ],
  },
  {
    id: 2,
    name: "Cumin Powder",
    description:
      "AGRO NEXIS Cumin Powder is made from handpicked cumin seeds, expertly ground to preserve their distinctive warm, earthy aroma and slightly bitter taste. \
      This versatile spice enhances the flavor profile of countless dishes and is valued for its digestive benefits.",
    image: "/Cumin.png",
    key_features: [
      "100% Pure and Natural",
      "Rich, Earthy Flavor",
      "No Artificial Additives",
      "Sourced from Trusted Farmers",
      "Packed in a Hygienic Environment",
    ],
    uses: [
      "Cumin powder is essential in curries, stews, soups, and spice blends.",
      "It is commonly used in Indian, Middle Eastern, and Mexican cuisines.",
      "Also used as a seasoning for roasted vegetables, meats, and snacks.",
    ],
  },
  {
    id: 3,
    name: "Red Chili Powder",
    description:
      "AGRO NEXIS Red Chili Powder is crafted from premium quality dried red chilies, delivering a vibrant color and fiery heat to your dishes. \
      Finely ground to retain its natural pungency and aroma, this chili powder is perfect for adding spice and depth to a variety of cuisines. \
      It is a staple ingredient for those who love bold and spicy flavors.",
    image: "/Chili.png",
    key_features: [
      "100% Pure and Natural",
      "Vibrant Color and Spicy Flavor",
      "No Artificial Colors or Preservatives",
      "Carefully Selected Chilies",
      "Packed in a Hygienic Environment",
    ],
    uses: [
      "Red chili powder is widely used in curries, marinades, sauces, and spice blends.",
      "It adds heat and color to both vegetarian and non-vegetarian dishes.",
      "Ideal for Indian, Mexican, Thai, and other global cuisines that require a spicy kick.",
    ],
  },
  {
    id: 4,
    name: "Coriander Powder",
    description:
      "AGRO NEXIS Coriander Powder is produced from select coriander seeds, ground to a fine powder to capture their fresh, citrusy aroma and mild flavor. \
      This spice is a must-have for adding a subtle, sweet undertone to your recipes and is known for its digestive properties.",
    image: "/Coriander.png",
    key_features: [
      "100% Pure and Natural",
      "Fresh, Citrusy Aroma",
      "No Artificial Additives",
      "Sourced from Trusted Farmers",
      "Packed in a Hygienic Environment",
    ],
    uses: [
      "Coriander powder is widely used in curries, gravies, and spice blends.",
      "It enhances the flavor of soups, salads, and marinades.",
      "Common in Indian, Middle Eastern, and Mediterranean cuisines.",
    ],
  },
];

const Products = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedProduct, setSelectedProduct] = React.useState<null | {
    id: number;
    name: string;
    description: string;
    image: string;
    key_features?: string[];
    uses?: string[];
  }>(null);

  return (
    <Box sx={{ mx: 3, my: 10 }}>
      <Box
        sx={{
          backgroundImage: 'url("/Product Brand.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          p: 4,
          borderRadius: 4,
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "primary.contrastText" }}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={michroma.style.fontFamily}
        >
          Powdered Spices
        </Typography>
      </Box>
      <Box sx={{ mt: 10 }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={4}
          justifyContent="center"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                maxWidth: 345,
                backgroundColor: "transparent",
                borderRadius: 2,
              }}
              elevation={0}
            >
              <CardActionArea
                disableRipple
                onClick={() => setSelectedProduct(product)}
              >
                <CardMedia
                  component="img"
                  height="100%"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                />
                <CardContent>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {product.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>

      {selectedProduct && (
        <Box sx={{ m: 10 }}>
          <Grid container spacing={10}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Image
                src={selectedProduct.image}
                alt={selectedProduct?.name}
                layout="responsive"
                width={500}
                height={500}
                style={{ borderRadius: 8 }}
              />
            </Grid>
            <Grid size={{ xs: 11, md: 5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{ mb: 2 }}
                fontFamily={michroma.style.fontFamily}
                color="primary.main"
              >
                {selectedProduct.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.primary", mb: 2 }}
                textAlign={"justify"}
              >
                {selectedProduct.description}
              </Typography>
              {selectedProduct.key_features && (
                <>
                  <Typography
                    variant="h5"
                    sx={{ color: "primary.main" }}
                    textAlign={"left"}
                  >
                    Key Features:
                  </Typography>

                  <ul>
                    {selectedProduct.key_features.map((feature, index) => (
                      <li key={index}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {selectedProduct.uses && (
                <>
                  <Typography
                    variant="h5"
                    sx={{ color: "primary.main" }}
                    textAlign={"left"}
                  >
                    Uses:
                  </Typography>

                  <ul>
                    {selectedProduct.uses?.map((use, index) => (
                      <li key={index}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {use}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Grid>
            <Grid
              size={{ xs: 1, md: 1 }}
              display={"flex"}
              justifyContent={"right"}
            >
              <Close
                fontSize="medium"
                sx={{ color: "primary.main", cursor: "pointer" }}
                onClick={() => setSelectedProduct(null)}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Products;
