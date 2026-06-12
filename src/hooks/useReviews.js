import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useRole } from "@/context/RoleContext";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import { Api } from "@/pages/api/Api";

export default function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const { user } = useRole();
  const router = useRouter();

  const fetchReviews = useCallback(async (productId, params = {}, append = false) => {
    if (!productId) return;
    if (!append) setLoading(true);
    try {
      const main = new Listing();
      const response = await main.GetProductReviews(productId, params);
      if (response?.data?.status) {
        if (append) {
          // Append new reviews to existing list
          setReviews((prev) => [...prev, ...response.data.data.reviews]);
        } else {
          // Replace reviews
          setReviews(response.data.data.reviews);
        }
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRatingSummary = useCallback(async (productId) => {
    if (!productId) return;
    try {
      const main = new Listing();
      const response = await main.GetProductRatingSummary(productId);
      if (response?.data?.status) {
        setRatingSummary(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching rating summary:", error);
    }
  }, []);

  const checkEligibility = useCallback(async (productId) => {
    if (!productId || !user) {
      setEligibility(null);
      return;
    }
    try {
      const main = new Listing();
      const response = await main.CheckReviewEligibility(productId);
      if (response?.data?.status) {
        setEligibility(response.data.data);
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  }, [user]);

  const submitReview = useCallback(async (data) => {
    try {
      const main = new Listing();
      const response = await main.AddReview({
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        message: data.message,
      });
      if (response?.data?.status) {
        // If there are new images (with file objects), upload them after review is created
        if (data.images && data.images.length > 0) {
          const newImages = data.images.filter((img) => img.file !== null);
          if (newImages.length > 0) {
            const reviewId = response.data.data._id;
            const formData = new FormData();
            newImages.forEach((img) => {
              formData.append("reviewImages", img.file);
            });
            try {
              await Api.post(`/review/images/upload/${reviewId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            } catch (imgErr) {
              console.error("Image upload error:", imgErr);
              toast.error("Review submitted but some images failed to upload");
            }
          }
        }
        toast.success("Review submitted successfully!");
        return response.data;
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to submit review";
      toast.error(message);
      throw error;
    }
  }, []);

  const updateReview = useCallback(async (reviewId, data) => {
    try {
      const main = new Listing();
      // Only send rating, title, message to backend (images handled separately)
      const response = await main.UpdateReview(reviewId, {
        rating: data.rating,
        title: data.title,
        message: data.message,
      });
      if (response?.data?.status) {
        toast.success("Review updated successfully!");
        return response.data;
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update review";
      toast.error(message);
      throw error;
    }
  }, []);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      const main = new Listing();
      const response = await main.DeleteReview(reviewId);
      if (response?.data?.status) {
        toast.success("Review deleted");
        return true;
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to delete review";
      toast.error(message);
      throw error;
    }
  }, []);

  const markHelpful = useCallback(async (reviewId) => {
    try {
      const main = new Listing();
      const response = await main.MarkHelpful(reviewId);
      if (response?.data?.status) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to mark";
      toast.error(message);
    }
  }, []);

  const markNotHelpful = useCallback(async (reviewId) => {
    try {
      const main = new Listing();
      const response = await main.MarkNotHelpful(reviewId);
      if (response?.data?.status) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to mark";
      toast.error(message);
    }
  }, []);

  return {
    reviews,
    ratingSummary,
    pagination,
    loading,
    eligibility,
    fetchReviews,
    fetchRatingSummary,
    checkEligibility,
    submitReview,
    updateReview,
    deleteReview,
    markHelpful,
    markNotHelpful,
  };
}