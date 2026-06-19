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

  const [activeSort, setActiveSort] = useState("latest");
  const [activeRatingFilter, setActiveRatingFilter] = useState(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editReviewData, setEditReviewData] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState(false);

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
    if (sort === "positive" || sort === "negative") {
      setActiveRatingFilter(null);
    }
    setActiveSort(sort);
  };

  const handleWriteReview = () => {
    if (!user || user?.role !== "customer") {
      toast.error("Please login to write a review");
      router.push("/login");
      return;
    }
    // Check if user has already reviewed this product
    if (eligibility?.hasReviewed) {
      setShowAlreadyReviewedModal(true);
      return;
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
    { value: "most_helpful", label: "Most Helpful" },
    { value: "latest", label: "Latest" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
  ];

  const totalReviews = ratingSummary?.totalReviews || 0;

  // Sort reviews: current user's review first
  const sortedReviews = React.useMemo(() => {
    if (!user?._id) return reviews;
    return [...reviews].sort((a, b) => {
      const aIsUser = a.user?._id === user._id || a.user === user._id;
      const bIsUser = b.user?._id === user._id || b.user === user._id;
      if (aIsUser && !bIsUser) return -1;
      if (!aIsUser && bIsUser) return 1;
      return 0;
    });
  }, [reviews, user]);

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
                  {sortedReviews.map((review) => (
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

      {/* Already Reviewed Modal */}
      {showAlreadyReviewedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAlreadyReviewedModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Info Icon */}
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Already Reviewed
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                You have already reviewed this product. You can edit or delete your existing review from the review list below.
              </p>

              <button
                onClick={() => setShowAlreadyReviewedModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

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