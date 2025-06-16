"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  IconButton,
  Stack,
  useMediaQuery,
  Slide,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { useSwipeable } from "react-swipeable";

const sampleItems = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: "Jud brown for kitchen",
  price: "$99.50",
  image: "https://via.placeholder.com/150",
  rating: 4.5,
  sold: 340,
  inStock: true,
}));

const ProductCard = ({ item, wishlist }: any) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 1,
      p: 2,
      textAlign: "center",
      width: "100%",
    }}
  >
    <Box position="relative">
      <CardMedia
        component="img"
        height="140"
        image={item.image}
        alt={item.title}
        sx={{ objectFit: "contain" }}
      />
      <IconButton sx={{ position: "absolute", top: 8, right: 8 }}>
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>
    </Box>
    <CardContent>
      <Typography fontWeight={600}>{item.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {item.inStock ? "In stock" : "Out of stock"}
      </Typography>
      <Typography fontWeight={600} mt={1}>
        {item.price}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {item.sold} sold this week
      </Typography>

      <Stack mt={2} spacing={1}>
        <Button fullWidth variant="outlined">
          {wishlist ? "Move to cart" : "Add to cart"}
        </Button>
        {wishlist && (
          <Button fullWidth variant="text" color="error">
            Remove from wishlist
          </Button>
        )}
      </Stack>
    </CardContent>
  </Card>
);

const RecommendationsAndWishlist = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const itemsPerPage = isDesktop ? 4 : isTablet ? 2 : 1;

  const [recommendIndex, setRecommendIndex] = useState(0);
  const [wishlistIndex, setWishlistIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );

  const handleSwipe = (
    dir: "left" | "right",
    section: "recommend" | "wishlist"
  ) => {
    if (dir === "left") handleNext(section);
    if (dir === "right") handlePrev(section);
  };

  const getVisibleItems = (items: typeof sampleItems, index: number) => {
    const start = index;
    const end = Math.min(index + itemsPerPage, items.length);
    const result = items.slice(start, end);
    while (result.length < itemsPerPage) {
      result.push({
        id: -1 * result.length,
        title: "",
        image: "",
        price: "",
        sold: 0,
        rating: 0,
        inStock: false,
      });
    }
    return result;
  };

  const visibleRecommended = getVisibleItems(sampleItems, recommendIndex);
  const visibleWishlist = getVisibleItems(sampleItems, wishlistIndex);

  const handleNext = (section: "recommend" | "wishlist") => {
    setSlideDirection("left");
    if (section === "recommend") {
      if (recommendIndex + itemsPerPage < sampleItems.length) {
        setRecommendIndex(recommendIndex + itemsPerPage);
      }
    } else {
      if (wishlistIndex + itemsPerPage < sampleItems.length) {
        setWishlistIndex(wishlistIndex + itemsPerPage);
      }
    }
  };

  const handlePrev = (section: "recommend" | "wishlist") => {
    setSlideDirection("right");
    if (section === "recommend") {
      if (recommendIndex - itemsPerPage >= 0) {
        setRecommendIndex(recommendIndex - itemsPerPage);
      }
    } else {
      if (wishlistIndex - itemsPerPage >= 0) {
        setWishlistIndex(wishlistIndex - itemsPerPage);
      }
    }
  };

  const renderSlide = (items: typeof sampleItems, wishlist: boolean) => (
    <Slide direction={slideDirection} in mountOnEnter unmountOnExit appear>
      <Grid container spacing={2} justifyContent="center">
        {items.map((item) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={item.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {item.id >= 0 && <ProductCard item={item} wishlist={wishlist} />}
          </Grid>
        ))}
      </Grid>
    </Slide>
  );

  const swipeHandlersRecommend = useSwipeable({
    onSwipedLeft: () => handleSwipe("left", "recommend"),
    onSwipedRight: () => handleSwipe("right", "recommend"),
  });

  const swipeHandlersWishlist = useSwipeable({
    onSwipedLeft: () => handleSwipe("left", "wishlist"),
    onSwipedRight: () => handleSwipe("right", "wishlist"),
  });

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4, width: "95%" }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Customer also bought these
      </Typography>

      <Box sx={{ position: "relative" }} {...swipeHandlersRecommend}>
        <IconButton
          onClick={() => handlePrev("recommend")}
          disabled={recommendIndex === 0}
          sx={{
            position: "absolute",
            top: "40%",
            left: -20,
            zIndex: 1,
            opacity: recommendIndex === 0 ? 0.3 : 1,
            transition: "opacity 0.3s ease",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "50%",
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {renderSlide(visibleRecommended, false)}

        <IconButton
          onClick={() => handleNext("recommend")}
          disabled={recommendIndex + itemsPerPage >= sampleItems.length}
          sx={{
            position: "absolute",
            top: "40%",
            right: -20,
            zIndex: 1,
            opacity:
              recommendIndex + itemsPerPage >= sampleItems.length ? 0.3 : 1,
            transition: "opacity 0.3s ease",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "50%",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Typography variant="h6" fontWeight={600} mt={6} mb={2}>
        Your wishlist (34)
      </Typography>

      <Box sx={{ position: "relative" }} {...swipeHandlersWishlist}>
        <IconButton
          onClick={() => handlePrev("wishlist")}
          disabled={wishlistIndex === 0}
          sx={{
            position: "absolute",
            top: "40%",
            left: -20,
            zIndex: 1,
            opacity: wishlistIndex === 0 ? 0.3 : 1,
            transition: "opacity 0.3s ease",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "50%",
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {renderSlide(visibleWishlist, true)}

        <IconButton
          onClick={() => handleNext("wishlist")}
          disabled={wishlistIndex + itemsPerPage >= sampleItems.length}
          sx={{
            position: "absolute",
            top: "40%",
            right: -20,
            zIndex: 1,
            opacity:
              wishlistIndex + itemsPerPage >= sampleItems.length ? 0.3 : 1,
            transition: "opacity 0.3s ease",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "50%",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default RecommendationsAndWishlist;
