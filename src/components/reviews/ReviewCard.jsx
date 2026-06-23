import React, { useState } from "react";
import StarRatingDisplay from "./StarRatingDisplay";
import { FaRegThumbsUp, FaRegThumbsDown, FaTrash, FaEdit, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

export default function ReviewCard({
  review,
  userId,
  onHelpful,
  onNotHelpful,
  onEdit,
  onDelete,
}) {
  const {
    _id,
    user,
    rating,
    title,
    message,
    helpfulCount = 0,
    notHelpfulCount = 0,
    createdAt,
    images = [],
  } = review;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const isOwnReview = userId && user?._id === userId;
  const MAX_MESSAGE_LENGTH = 100;
  const isLongMessage = message && message.length > MAX_MESSAGE_LENGTH;
  const displayMessage = isLongMessage && !showFullMessage
    ? message.substring(0, MAX_MESSAGE_LENGTH) + "..."
    : message;
  const hasImages = images && images.length > 0;
  const showStatusBadge = false;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleMessage = () => setShowFullMessage(!showFullMessage);

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 hover:shadow-sm transition-shadow relative">
        {/* Header - User Info & Rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-sm font-bold">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-black">
                  {user?.name || "Anonymous"}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRatingDisplay rating={rating} size={14} />
                <span className="text-xs text-[#6B7280]">{timeAgo(createdAt)}</span>
              </div>
            </div>
          </div>
          {isOwnReview && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button onClick={() => onEdit(review)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" title="Edit review">
                  <FaEdit size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(_id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete review">
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {title && <h4 className="text-sm font-semibold text-black mb-1">{title}</h4>}
        <p className="text-sm text-[#4D5466] leading-relaxed mb-2">
          {displayMessage}
          {isLongMessage && (
            <button
              onClick={toggleMessage}
              className="text-blue-600 hover:text-blue-800 font-medium ml-1 text-xs"
            >
              {showFullMessage ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* Review Images */}
        {hasImages && (
          <div className="flex flex-wrap gap-2 mb-4">
            {images.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-all cursor-pointer group"
              >
                <img src={imgUrl} alt={`Review img ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </button>
            ))}
          </div>
        )}

        {/* Helpful */}
        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <button onClick={() => onHelpful?.(_id)} className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
            <FaRegThumbsUp size={14} />
            <span>Helpful ({helpfulCount})</span>
          </button>
          <button onClick={() => onNotHelpful?.(_id)} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
            <FaRegThumbsDown size={14} />
            <span>({notHelpfulCount})</span>
          </button>
        </div>
      </div>

      {/* Amazon-style Popup: Image Left + Review Right */}
      {lightboxOpen && hasImages && (
        <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeLightbox} className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition-colors">
              <FaTimes size={15} />
            </button>

            {/* LEFT: Image */}
            <div className="relative w-full md:w-[55%] min-h-[300px] md:min-h-[500px] bg-gray-50 flex items-center justify-center">
              {images.length > 1 && (
                <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-all">
                  <FaChevronLeft size={18} className="text-gray-700" />
                </button>
              )}
              <img src={images[lightboxIndex]} alt={`Review image ${lightboxIndex + 1}`} className="max-w-full max-h-[450px] object-contain p-6" />
              {images.length > 1 && (
                <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-all">
                  <FaChevronRight size={18} className="text-gray-700" />
                </button>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* RIGHT: Review Details */}
            <div className="w-full md:w-[45%] p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user?.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-sm font-bold">
                      {(user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-black">{user?.name || "Anonymous"}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRatingDisplay rating={rating} size={12} />
                    <span className="text-xs text-[#6B7280]">{timeAgo(createdAt)}</span>
                  </div>
                </div>
              </div>
              {title && <h4 className="text-base font-bold text-black mb-2">{title}</h4>}
              <p className="text-sm text-[#4D5466] leading-relaxed">{message}</p>
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-xs text-[#6B7280]">
                <button onClick={() => { onHelpful?.(_id); }} className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                  <FaRegThumbsUp size={13} />
                  <span>Helpful ({helpfulCount})</span>
                </button>
                <button onClick={() => { onNotHelpful?.(_id); }} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <FaRegThumbsDown size={13} />
                  <span>({notHelpfulCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}