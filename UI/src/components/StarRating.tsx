import { Box, Typography } from "@mui/material";
import { Star, StarHalf, StarBorder } from "@mui/icons-material";

interface StarRatingProps {
  rating: number;
  size?: "small" | "medium" | "large";
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = "small", showValue = false, reviewCount }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      {stars.map((type, i) =>
        type === "full" ? <Star key={i} fontSize={size} sx={{ color: "#f59e0b" }} /> :
        type === "half" ? <StarHalf key={i} fontSize={size} sx={{ color: "#f59e0b" }} /> :
        <StarBorder key={i} fontSize={size} sx={{ color: "#f59e0b" }} />
      )}
      {showValue && (
        <Typography variant="body2" sx={{ ml: 0.5, color: "text.secondary" }}>
          {rating.toFixed(1)}{reviewCount !== undefined && ` (${reviewCount})`}
        </Typography>
      )}
    </Box>
  );
}
