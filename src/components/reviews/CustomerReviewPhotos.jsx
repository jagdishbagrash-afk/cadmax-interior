import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import StarRatingDisplay from "./StarRatingDisplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function timeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 30) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes > 0) return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
  return "Just now";
}

export default function CustomerReviewPhotos({ reviews }) {
  const [allReviewImages, setAllReviewImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const closeLightbox = () => setSelectedIndex(null);

  useEffect(() => {
    if (!reviews || reviews.length === 0) return;
    const images = [];
    reviews.forEach((review) => {
      if (review.images && review.images.length > 0) {
        review.images.forEach((imgUrl) => {
          images.push({ imageUrl: imgUrl, review });
        });
      }
    });
    setAllReviewImages(images);
  }, [reviews]);

  // Keyboard
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev + 1) % allReviewImages.length);
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev - 1 + allReviewImages.length) % allReviewImages.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, allReviewImages.length]);

  if (!allReviewImages || allReviewImages.length === 0) return null;

  const currentItem = selectedIndex !== null ? allReviewImages[selectedIndex] : null;
  const currentReview = currentItem?.review;

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-black mb-5 uppercase tracking-wide">
        Customer Review Photos ({allReviewImages.length})
      </h3>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".review-photos-prev",
          nextEl: ".review-photos-next",
        }}
        spaceBetween={12}
        slidesPerView="auto"
        className="!pb-2"
      >
        {allReviewImages.map((item, idx) => (
          <SwiperSlide key={idx} className="!w-[130px] sm:!w-[140px] md:!w-[150px]">
            <button
              onClick={() => setSelectedIndex(idx)}
              className="w-full aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-all cursor-pointer group"
            >
              <img
                src={item.imageUrl}
                alt={`Customer photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom nav buttons */}
      {allReviewImages.length > 4 && (
        <div className="flex justify-end gap-2 mt-2">
          <button className="review-photos-prev w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
            <FaChevronLeft size={14} className="text-gray-600" />
          </button>
          <button className="review-photos-next w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
            <FaChevronRight size={14} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedIndex !== null && currentReview && (
        <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center p-2 md:p-4" onClick={closeLightbox}>
          <div className="relative bg-white rounded-xl md:rounded-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeLightbox} className="absolute top-2 right-2 md:top-3 md:right-3 z-30 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition-colors" aria-label="Close">
              <FaTimes size={14} />
            </button>

            {/* LEFT */}
            <div className="relative w-full md:w-[55%] min-h-[200px] md:min-h-[450px] bg-gray-50 flex items-center justify-center">
              {allReviewImages.length > 1 && (
                <button onClick={() => setSelectedIndex((prev) => (prev - 1 + allReviewImages.length) % allReviewImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-all">
                  <FaChevronLeft size={16} className="text-gray-700" />
                </button>
              )}
              <img src={allReviewImages[selectedIndex]?.imageUrl} alt={`Photo ${selectedIndex + 1}`} className="max-w-full max-h-[300px] md:max-h-[420px] w-auto h-auto object-contain p-2 md:p-4" />
              {allReviewImages.length > 1 && (
                <button onClick={() => setSelectedIndex((prev) => (prev + 1) % allReviewImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-all">
                  <FaChevronRight size={16} className="text-gray-700" />
                </button>
              )}
              {allReviewImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs text-white bg-black/50 px-2.5 py-1 rounded-full">
                  {selectedIndex + 1} / {allReviewImages.length}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="w-full md:w-[45%] p-4 md:p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {currentReview.user?.profileImage ? (
                    <img src={currentReview.user.profileImage} alt={currentReview.user?.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-sm font-bold">{(currentReview.user?.name || "U").charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-black truncate">{currentReview.user?.name || "Anonymous"}</p>
                    {currentReview.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium"><MdVerified size={10} /> Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRatingDisplay rating={currentReview.rating} size={12} />
                    <span className="text-[10px] text-[#6B7280]">{timeAgo(currentReview.createdAt)}</span>
                  </div>
                </div>
              </div>
              {currentReview.title && <h4 className="text-sm md:text-base font-bold text-black mb-2">{currentReview.title}</h4>}
              <p className="text-xs md:text-sm text-[#4D5466] leading-relaxed">{currentReview.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}