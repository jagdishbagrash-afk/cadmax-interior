import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useReviews from "@/hooks/useReviews";
import RatingSummaryCard from "./RatingSummaryCard";
import ReviewCard from "./ReviewCard";
import CustomerReviewPhotos from "./CustomerReviewPhotos";
import WriteReviewModal from "./WriteReviewModal";
import { FaStar, FaSpinner } from "react-icons/fa";
import Loader from "@/components/Loader";
import ConfirmModal from "@/components/ConfirmModal";

export default function ReviewsSection({ productId, productName = "" }) {
  const { user } = useRole();
  const router = useRouter();
  const {
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
  } = useReviews();

  const [activeSort, setActiveSort] = useState("all");
  const [activeRatingFilter, setActiveRatingFilter] = useState(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editReviewData, setEditReviewData] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // For infinite scroll
  const scrollContainerRef = useRef(null);
  const currentPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isLoadingMoreRef = useRef(false);

  // Load reviews for a page - pass userId for visibility logic
  const loadReviews = useCallback(
    (page = 1, append = false) => {
      currentPageRef.current = page;
      const params = { sort: activeSort, page, limit: 10 };
      if (activeRatingFilter) params.rating = activeRatingFilter;
      // Pass userId so backend can include user's own reviews (even pending/rejected)
      if (user?._id) {
        params.userId = user._id;
      }

      if (append) {
        setLoadingMore(true);
        isLoadingMoreRef.current = true;
      }

      fetchReviews(productId, params, append).then(() => {
        setLoadingMore(false);
        isLoadingMoreRef.current = false;
      });
    },
    [productId, activeSort, activeRatingFilter, fetchReviews, user]
  );

  // Initial load
  useEffect(() => {
    if (productId) {
      fetchRatingSummary(productId);
      hasMoreRef.current = true;
      loadReviews(1, false);
    }
  }, [productId]);

  // Re-fetch when sort or filter changes
  useEffect(() => {
    if (productId) {
      hasMoreRef.current = true;
      loadReviews(1, false);
    }
  }, [activeSort, activeRatingFilter]);

  // Check eligibility when user changes
  useEffect(() => {
    if (productId && user) {
      checkEligibility(productId);
    }
  }, [productId, user, checkEligibility]);

  // Update hasMore when pagination changes
  useEffect(() => {
    if (pagination) {
      hasMoreRef.current = pagination.hasNextPage;
    }
  }, [pagination]);

  // Infinite scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isLoadingMoreRef.current || !hasMoreRef.current || loading) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // Load more when scrolled to within 100px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        const nextPage = currentPageRef.current + 1;
        hasMoreRef.current = false; // Prevent multiple loads
        loadReviews(nextPage, true);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadReviews, loading]);

  const handleFilterByRating = (rating) => {
    setActiveRatingFilter(rating);
  };

  const handleSort = (sort) => {
    if (sort === "all") {
      setActiveRatingFilter(null);
    }
    setActiveSort(sort);
  };

  const handleWriteReview = async () => {
    if (!user || user?.role !== "customer") {
      toast.error("Please login to write a review");
      router.push("/login");
      return;
    }
    // If user already reviewed, open edit modal directly
    if (eligibility?.hasReviewed && eligibility?.existingReviewId) {
      try {
        // Fetch the user's existing review from API using the review ID
        const Listing = (await import("@/pages/api/Listing")).default;
        const main = new Listing();
        const response = await main.GetProductReviews(productId, { userId: user._id, limit: 50 });
        if (response?.data?.status) {
          const userReview = response.data.data.reviews.find(
            (r) => r._id === eligibility.existingReviewId
          );
          if (userReview) {
            setEditReviewData(userReview);
            setShowWriteModal(true);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing review:", err);
      }
    }
    // Any logged-in user can write a review (purchase not required)
    setEditReviewData(null);
    setShowWriteModal(true);
  };
  
  const handleEditReview = (review) => {
    setEditReviewData(review);
    setShowWriteModal(true);
  };

  const handleSubmitReview = async (data) => {
    if (editReviewData) {
      await updateReview(editReviewData._id, data);

      const originalImages = editReviewData.images || [];
      const currentImages = data.images || [];

      const removedImages = originalImages.filter(
        (origUrl) => !currentImages.some((img) => img.preview === origUrl)
      );

      const newImages = currentImages.filter((img) => img.file !== null);

      for (let i = 0; i < removedImages.length; i++) {
        const imgIndex = originalImages.indexOf(removedImages[i]);
        if (imgIndex !== -1) {
          try {
            const Listing = (await import("@/pages/api/Listing")).default;
            const main = new Listing();
            await main.DeleteReviewImage(editReviewData._id, imgIndex);
          } catch (err) {
            console.error("Failed to delete image:", err);
          }
        }
      }

      if (newImages.length > 0) {
        try {
          const formData = new FormData();
          newImages.forEach((img) => {
            formData.append("reviewImages", img.file);
          });
          const Listing = (await import("@/pages/api/Listing")).default;
          const main = new Listing();
          await main.UploadReviewImages(editReviewData._id, formData);
        } catch (err) {
          console.error("Failed to upload new images:", err);
          toast.error("Some images failed to upload");
        }
      }
    } else {
      await submitReview({ productId, ...data });
    }
    hasMoreRef.current = true;
    loadReviews(1, false);
    fetchRatingSummary(productId);
    checkEligibility(productId);
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(reviewId);
    setDeleteConfirm(null);
    hasMoreRef.current = true;
    loadReviews(1, false);
    fetchRatingSummary(productId);
    checkEligibility(productId);
  };

  const handleHelpful = async (reviewId) => {
    await markHelpful(reviewId);
    hasMoreRef.current = true;
    loadReviews(1, false);
  };

  const handleNotHelpful = async (reviewId) => {
    await markNotHelpful(reviewId);
    hasMoreRef.current = true;
    loadReviews(1, false);
  };

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "most_helpful", label: "Most Helpful" },
    { value: "latest", label: "Latest" },
  ];

  const totalReviews = ratingSummary?.totalReviews || 0;

  return (
    <div className="mt-12 md:mt-16 border-t border-gray-200 pt-10 md:pt-14">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-wide">
          Ratings & Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT - Rating Summary (fixed, not scrolling) */}
        <div className="lg:col-span-1">
          <RatingSummaryCard
            ratingSummary={ratingSummary}
            onFilterByRating={handleFilterByRating}
            activeRatingFilter={activeRatingFilter}
          />

          {/* Write Review Button - Show to all logged-in customers */}
          {user && user?.role === "customer" && (
            <button
              onClick={handleWriteReview}
              className="w-full mt-4 py-3 rounded-2xl text-sm font-semibold transition-all bg-black text-white hover:opacity-90"
            >
              Write a Review
            </button>
          )}

          {!user && (
            <button
              onClick={() => router.push("/login")}
              className="w-full mt-4 py-3 border border-gray-300 text-[#4D5466] rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Login to Write a Review
            </button>
          )}
        </div>

        {/* RIGHT - Reviews List with infinite scroll */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Sort & Filter Bar (fixed at top) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-black">Sort by:</span>
              <div className="flex flex-wrap gap-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                      activeSort === option.value
                        ? "bg-black text-white"
                        : "bg-gray-100 text-[#4D5466] hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {activeRatingFilter && (
              <button
                onClick={() => setActiveRatingFilter(null)}
                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs rounded-lg font-medium hover:bg-yellow-100 transition-all"
              >
                <FaStar size={12} className="text-yellow-500" />
                {activeRatingFilter} Star
                <span className="ml-1">✕</span>
              </button>
            )}
          </div>

          {/* Scrollable Reviews Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-y-auto max-h-[600px] pr-1 scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {loading && reviews.length === 0 ? (
              <Loader />
            ) : reviews.length > 0 ? (
              <>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      userId={user?._id}
                      onHelpful={handleHelpful}
                      onNotHelpful={handleNotHelpful}
                      onEdit={handleEditReview}
                      onDelete={(id) => setDeleteConfirm({ reviewId: id })}
                    />
                  ))}
                </div>

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <FaSpinner className="animate-spin text-gray-400" size={18} />
                    <span className="text-sm text-[#6B7280]">Loading more reviews...</span>
                  </div>
                )}

                {/* End of reviews indicator */}
                {!hasMoreRef.current && !loadingMore && reviews.length > 0 && (
                  <div className="text-center py-6">
                    <span className="text-xs text-[#6B7280]">
                      You've reached the end of all reviews
                    </span>
                  </div>
                )}
              </>
            ) : totalReviews > 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7280]">No reviews match your filter.</p>
                <button
                  onClick={() => setActiveRatingFilter(null)}
                  className="mt-2 text-sm text-black underline"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="text-center py-12 border border-gray-100 rounded-2xl">
                <p className="text-[#6B7280]">No reviews yet.</p>
                {user?.role === "customer" && (
                  <button
                    onClick={handleWriteReview}
                    className="mt-3 text-sm text-black font-semibold underline"
                  >
                    Be the first to review
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Review Photos */}
      {reviews.length > 0 && (
        <CustomerReviewPhotos reviews={reviews} />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDeleteReview(deleteConfirm?.reviewId)}
        title="Delete Review"
        message="Are you sure you want to delete your review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No"
        confirmClassName="bg-red-600 hover:bg-red-700"
      />

      {/* Write/Edit Review Modal */}
      <WriteReviewModal
        isOpen={showWriteModal}
        onClose={() => {
          setShowWriteModal(false);
          setEditReviewData(null);
        }}
        onSubmit={handleSubmitReview}
        initialData={editReviewData}
        productName={productName}
      />
    </div>
  );
}