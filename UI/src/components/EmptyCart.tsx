import React from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image"; // or use <img src="" /> if you're not using Next.js
import EmptyCartImg from "../../public/EmptyCart.png"; // Update this path to your actual image
import theme from "@/styles/theme";

const EmptyCart = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      px={2}
    >
      <Stack
        spacing={3}
        alignItems="center"
        textAlign="center"
        sx={{
          width: "100%",
          maxWidth: isMobile ? "90%" : "100%",
          margin: "0 auto",
        }}
      >
        <Image
          src={EmptyCartImg}
          alt="Empty cart"
          width={isMobile ? 180 : 220}
          height={isMobile ? 180 : 220}
        />
        <Typography variant="h6" fontWeight="bold" color="primary">
          No products have been added to the cart yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Let’s start exploring products and fulfill your various needs here.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => window.location.href = "/products"}
          sx={{ 
            width: isMobile ? "100%" : "auto",
            padding: isMobile ? "10px 20px" : "12px 24px",
            fontSize: isMobile ? "0.875rem" : "1rem",
            textTransform: "none",
            borderRadius: "8px",
            '&:hover': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        >
          <Typography>Explore Product</Typography>
        </Button>
      </Stack>
    </Box>
  );
};

export default EmptyCart;
