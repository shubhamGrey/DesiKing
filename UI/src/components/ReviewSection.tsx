"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Typography, Button, TextField, Rating,
  Avatar, Skeleton, Stack, Alert, LinearProgress,
  Card, Chip, Divider,
} from "@mui/material";
import { RateReview } from "@mui/icons-material";
import { isLoggedIn, getUserId } from "@/utils/auth";
import Cookies from "js-cookie";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdDate?: string;
}

interface ReviewSummary {
  averageRating: number;
  reviewCount: number;
}

interface SubmitMessage {
  type: "error" | "success";
  message: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newRating, setNewRating] = useState<number | null>(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const loggedIn = useMemo(() => isLoggedIn(), []);
  const userId = useMemo(() => getUserId(), []);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reviewsRes, summaryRes] = await Promise.all([
        fetch(`${apiUrl}/Review/${productId}`),
        fetch(`${apiUrl}/Review/summary/${productId}`),
      ]);
      const reviewsJson = await reviewsRes.json();
      const summaryJson = await summaryRes.json();
      if (reviewsJson.info?.isSuccess) setReviews(reviewsJson.data || []);
      if (summaryJson.info?.isSuccess) setSummary(summaryJson.data);
    } catch {}
    setIsLoading(false);
  }, [productId, apiUrl]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const ratingBreakdown = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.round(r.rating) === star).length,
      })),
    [reviews]
  );

  const handleSubmitReview = async () => {
    if (!newRating) {
      setSubmitMessage({ type: "error", message: "Please select a star rating." });
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${apiUrl}/Review`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, userId, rating: newRating, comment: newComment || null }),
      });
      const json = await res.json();
      if (json.info?.isSuccess) {
        setNewRating(0);
        setNewComment("");
        setSubmitMessage({ type: "success", message: "Review submitted successfully!" });
        fetchReviews();
      } else {
        setSubmitMessage({ type: "error", message: json.info?.message || "Failed to submit review." });
      }
    } catch {
      setSubmitMessage({ type: "error", message: "Network error. Please try again." });
    }
    setIsSubmitting(false);
  };

  return (
    <Box sx={{ mt: 6 }}>
      {/* Section Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <RateReview sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          Customer Reviews
        </Typography>
        {summary && summary.reviewCount > 0 && (
          <Chip
            label={`${summary.reviewCount} ${summary.reviewCount === 1 ? "review" : "reviews"}`}
            size="small"
            sx={{ bgcolor: "primary.main", color: "white", fontWeight: 600 }}
          />
        )}
      </Box>

      {isLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      ) : (
        <>
          {/* Rating Summary + Breakdown */}
          {summary && summary.reviewCount > 0 && (
            <Card
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                gap: 4,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box sx={{ textAlign: "center", flexShrink: 0 }}>
                <Typography variant="h2" fontWeight={800} color="primary.main" lineHeight={1}>
                  {summary.averageRating.toFixed(1)}
                </Typography>
                <Rating value={summary.averageRating} precision={0.1} readOnly sx={{ mt: 0.5 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  out of 5
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

              <Stack spacing={0.75} flex={1} width="100%">
                {ratingBreakdown.map(({ star, count }) => (
                  <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ width: 10, textAlign: "right" }}>
                      {star}
                    </Typography>
                    <Rating value={1} max={1} readOnly size="small" />
                    <LinearProgress
                      variant="determinate"
                      value={summary.reviewCount > 0 ? (count / summary.reviewCount) * 100 : 0}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": { bgcolor: "primary.main", borderRadius: 4 },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ width: 24, textAlign: "right" }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          )}

          {/* Write a Review */}
          {loggedIn && (
            <Card
              elevation={0}
              sx={{
                mb: 4,
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.25,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <RateReview sx={{ color: "white", fontSize: 18 }} />
                <Typography variant="subtitle1" fontWeight={600} color="white">
                  Write a Review
                </Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Your rating
                </Typography>
                <Rating
                  value={newRating}
                  onChange={(_, val) => setNewRating(val)}
                  size="large"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Share your experience (optional)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {submitMessage && (
                  <Alert severity={submitMessage.type} sx={{ mb: 2 }}>
                    {submitMessage.message}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  disableElevation
                  sx={{ px: 3 }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </Box>
            </Card>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {loggedIn ? "Be the first to review this product!" : "Log in to leave a review."}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontWeight: 700 }}>
                      {review.userName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={600} variant="body1">
                        {review.userName}
                      </Typography>
                      {review.createdDate && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </Typography>
                      )}
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  {review.comment && (
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {review.comment}
                    </Typography>
                  )}
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
