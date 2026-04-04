"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Button, TextField, Rating,
  Divider, Avatar, Skeleton, Stack, Alert,
} from "@mui/material";
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
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const loggedIn = isLoggedIn();
  const userId = getUserId();

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

  const handleSubmitReview = async () => {
    if (!newRating || newRating === 0) {
      setSubmitError("Please select a star rating.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${apiUrl}/Review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, userId, rating: newRating, comment: newComment || null }),
      });
      const json = await res.json();
      if (json.info?.isSuccess) {
        setNewRating(0);
        setNewComment("");
        setSubmitSuccess("Review submitted!");
        fetchReviews();
      } else {
        setSubmitError(json.info?.message || "Failed to submit review.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Customer Reviews
      </Typography>

      {isLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 1 }} />)}
        </Stack>
      ) : (
        <>
          {summary && summary.reviewCount > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {summary.averageRating.toFixed(1)}
              </Typography>
              <Box>
                <Rating value={summary.averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"}
                </Typography>
              </Box>
            </Box>
          )}

          {loggedIn && (
            <Box sx={{ mb: 4, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Write a Review
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
                variant="filled"
                placeholder="Share your experience (optional)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              {submitError && <Alert severity="error" sx={{ mb: 1 }}>{submitError}</Alert>}
              {submitSuccess && <Alert severity="success" sx={{ mb: 1 }}>{submitSuccess}</Alert>}
              <Button variant="contained" onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </Box>
          )}

          <Stack spacing={3} divider={<Divider />}>
            {reviews.length === 0 && (
              <Typography color="text.secondary">
                No reviews yet.{" "}
                {loggedIn ? "Be the first to review this product!" : "Log in to leave a review."}
              </Typography>
            )}
            {reviews.map((review) => (
              <Box key={review.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
                    {review.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} variant="body2">{review.userName}</Typography>
                    {review.createdDate && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Rating value={review.rating} readOnly size="small" sx={{ mb: 0.5 }} />
                {review.comment && (
                  <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                )}
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
