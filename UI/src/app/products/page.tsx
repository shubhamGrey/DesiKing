"use client";
import ProductSection from "@/components/ProductSection";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import DesiKing from "../../../public/DesiKing.png";
import theme from "@/styles/theme";

const productsList = [
  {
    category: "Powdered Spices",
    category_image: "/Powdered Spices.jpg",
    products: [
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
      {
        id: 5,
        name: "Garam Masala",
        description:
          "AGRO NEXIS Garam Masala is a signature blend of premium, hand-selected spices, expertly ground to deliver a rich, aromatic flavor profile. \
          This traditional Indian spice mix enhances the taste and aroma of a wide variety of dishes, making it an essential addition to any kitchen. \
          Perfect for curries, gravies, and marinades, our Garam Masala is crafted to preserve the freshness and natural oils of each spice.",
        image: "/GaramMasala.png",
        key_features: [
          "Authentic Blend of Premium Spices",
          "Warm and Aromatic Flavor",
          "No Artificial Additives or Preservatives",
          "Freshly Ground for Maximum Potency",
          "Packed in a Hygienic Environment",
        ],
        uses: [
          "Garam Masala is ideal for seasoning curries, lentil dishes, and vegetable preparations.",
          "Sprinkle over finished dishes for an extra burst of flavor and aroma.",
          "Use in marinades for meats, poultry, and paneer to enhance taste.",
        ],
      },
    ],
  },
  {
    category: "Whole spices",
    category_image: "/Whole spices.jpg",
    products: [
      {
        id: 1,
        name: "Turmeric",
        description:
          "AGRO NEXIS Turmeric consists of carefully selected turmeric roots, sun-dried to preserve their natural color and essential oils. \
          These whole roots are perfect for grinding fresh powder or infusing into teas and broths. Known for their earthy aroma and potent curcumin content, \
          they are a staple in traditional cooking and wellness remedies.",
        image: "/RawTurmeric.jpg",
        key_features: [
          "Premium Quality Roots",
          "High Curcumin Content",
          "Naturally Sun-Dried",
          "No Preservatives",
          "Ideal for Grinding or Infusion",
        ],
        uses: [
          "Grind whole turmeric to make fresh powder for cooking.",
          "Add to soups, stews, and broths for flavor and color.",
          "Use in traditional remedies and herbal teas.",
        ],
      },
      {
        id: 2,
        name: "Cumin Seeds",
        description:
          "AGRO NEXIS Cumin Seeds are sourced from the best farms, offering a warm, nutty flavor and distinctive aroma. \
          These seeds are a must-have for tempering, seasoning, and spice blends, adding depth and complexity to a variety of dishes.",
        image: "/Cumin seeds.jpg",
        key_features: [
          "Aromatic and Flavorful",
          "100% Pure and Natural",
          "No Artificial Additives",
          "Carefully Cleaned and Packed",
          "Rich in Essential Oils",
        ],
        uses: [
          "Temper in hot oil to release flavors in curries and dals.",
          "Grind for use in spice blends like garam masala.",
          "Sprinkle over salads, breads, and roasted vegetables.",
        ],
      },
      {
        id: 3,
        name: "Coriander Seeds",
        description:
          "AGRO NEXIS Coriander Seeds are harvested at peak maturity, ensuring maximum flavor and freshness. With a citrusy, \
          slightly sweet taste, these seeds are perfect for grinding or using whole in pickles, curries, and spice mixes.",
        image: "/Coriander seeds.jpg",
        key_features: [
          "Fresh and Aromatic",
          "Naturally Sun-Dried",
          "No Artificial Colors or Flavors",
          "Packed for Freshness",
          "Versatile Culinary Use",
        ],
        uses: [
          "Roast and grind for spice blends and marinades.",
          "Add whole to pickles, stews, and curries.",
          "Use in baking and to flavor breads.",
        ],
      },
      {
        id: 4,
        name: "Dry Red Chillies",
        description:
          "AGRO NEXIS Dry Red Chillies are carefully selected and sun-dried to preserve their vibrant color and fiery heat. \
          These chillies add a bold kick to dishes and are essential in many traditional spice blends.",
        image: "/DryRedChili.JPG",
        key_features: [
          "Sun-Dried for Maximum Flavor",
          "Vibrant Color and Heat",
          "No Artificial Additives",
          "Rich in Capsaicin",
          "Ideal for Cooking and Pickling",
        ],
        uses: [
          "Use whole or crushed in curries, sauces, and chutneys.",
          "Infuse in oils for spicy condiments.",
          "Grind to make homemade chili powder.",
        ],
      },
      {
        id: 5,
        name: "Bay Leaves",
        description:
          "AGRO NEXIS Bay Leaves are handpicked and naturally dried to retain their subtle aroma and flavor. These leaves add a delicate, \
          herbal note to soups, stews, and rice dishes, making them a kitchen essential.",
        image: "/Bay Leaf.jpg",
        key_features: [
          "Handpicked and Naturally Dried",
          "Subtle Aroma and Flavor",
          "No Artificial Preservatives",
          "Whole, Unbroken Leaves",
          "Enhances Soups and Stews",
        ],
        uses: [
          "Add to soups, stews, and curries during cooking.",
          "Infuse in rice and pilaf for added aroma.",
          "Remove before serving for best results.",
        ],
      },
      {
        id: 6,
        name: "Cloves",
        description:
          "AGRO NEXIS Cloves are whole, aromatic flower buds known for their intense flavor and warm, sweet aroma. Used in both sweet and savory dishes, \
          cloves are a versatile spice for baking, cooking, and beverages.",
        image: "/Cloves.jpg",
        key_features: [
          "Whole, Premium Quality Buds",
          "Strong Aroma and Flavor",
          "Naturally Sun-Dried",
          "No Artificial Additives",
          "Rich in Antioxidants",
        ],
        uses: [
          "Add to curries, biryanis, and spice blends.",
          "Use in baking, desserts, and mulled drinks.",
          "Infuse in teas and herbal remedies.",
        ],
      },
      {
        id: 7,
        name: "Cardamom",
        description:
          "AGRO NEXIS Cardamom pods are carefully selected for their fresh, sweet aroma and complex flavor. \
          These pods are perfect for both sweet and savory dishes, as well as beverages like chai and coffee.",
        image: "/Cardamom.jpg",
        key_features: [
          "Fresh, Aromatic Pods",
          "Sweet and Spicy Flavor",
          "No Artificial Preservatives",
          "Handpicked and Carefully Packed",
          "Versatile Culinary Use",
        ],
        uses: [
          "Add to curries, rice, and desserts.",
          "Use in chai, coffee, and other beverages.",
          "Grind seeds for spice blends and baking.",
        ],
      },
      {
        id: 8,
        name: "Cinnamon",
        description:
          "AGRO NEXIS Cinnamon sticks are sourced from premium bark, offering a sweet, woody aroma and warm flavor. \
          Ideal for both sweet and savory recipes, these sticks can be used whole or ground for maximum versatility.",
        image: "/Cinammon.jpg",
        key_features: [
          "Premium Quality Sticks",
          "Sweet and Woody Aroma",
          "No Artificial Additives",
          "Naturally Sun-Dried",
          "Perfect for Cooking and Baking",
        ],
        uses: [
          "Add whole to stews, curries, and beverages.",
          "Grind for use in baking and spice blends.",
          "Infuse in teas and desserts for flavor.",
        ],
      },
    ],
  },
];

const Products = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          backgroundImage: 'url("/Header Image.png")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={DesiKing}
          alt="Desi King"
          style={{ width: "30%", height: "30%", marginTop: 32 }}
        />
        <Typography
          variant="body1"
          sx={{ mb: 4, mt: 2 }}
          color="#000000"
          fontSize={isMobile ? "0.2rem" : "1rem"}
        >
          A legacy of authenticity in every pinch.
        </Typography>
      </Box>
      {productsList.map((category, index) => (
        <ProductSection key={index} item={category} />
      ))}
    </>
  );
};

export default Products;
