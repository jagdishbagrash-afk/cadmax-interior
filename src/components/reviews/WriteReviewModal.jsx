import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaTimes, FaCamera, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function WriteReviewModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  productName = "",
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [removedImageIndices, setRemovedImageIndices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Reset state when modal opens with new data (edit mode) or closes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setRating(initialData.rating || 0);
        setTitle(initialData.title || "");
        setMessage(initialData.message || "");
        // Prefill existing images with proper标记
        if (initialData.images && initialData.images.length > 0) {
          setReviewImages(
            initialData.images.map((url) => ({
              file: null,
              preview: url,
              existing: true,
              originalIndex: initialData.images.indexOf(url),
            }))
          );
        } else {
          setReviewImages([]);
        }
        setRemovedImageIndices([]);
      } else {
        // Fresh write mode - reset everything
        setRating(0);
        setTitle("");
        setMessage("");
        setReviewImages([]);
        setRemovedImageIndices([]);
      }
      setHoverRating(0);
      setSubmitting(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalExisting = reviewImages.filter(img => !img.existing).length;
    const remaining = 5 - totalExisting;

    if (files.length > remaining) {
      toast.error(`You can only add ${remaining} more image(s)`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Check for duplicates - compare by file name and size
    const existingNewFiles = reviewImages
      .filter(img => !img.existing)
      .map(img => `${img.file.name}-${img.file.size}`);
    
    const uniqueFiles = validFiles.filter((file) => {
      const fileKey = `${file.name}-${file.size}`;
      return !existingNewFiles.includes(fileKey);
    });

    if (uniqueFiles.length === 0) {
      toast.error("These images are already added");
      return;
    }

    const newImages = uniqueFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      existing: false, // Mark as new
    }));

    setReviewImages((prev) => [...prev, ...newImages].slice(0, 5));
    e.target.value = "";
  };

  const removeImage = (index) => {
    const imageToRemove = reviewImages[index];
    
    // Track removed existing images
    if (imageToRemove && imageToRemove.existing) {
      setRemovedImageIndices((prev) => [...prev, imageToRemove.originalIndex]);
    }
    
    setReviewImages((prev) => {
      const updated = [...prev];
      const removed = updated[index];
      // Revoke object URL only for non-existing (new) images
      if (removed && !removed.existing && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a review message");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        rating,
        title: title.trim(),
        message: message.trim(),
        images: reviewImages,
        removedImageIndices: removedImageIndices,
      });
      onClose();
      // Reset state after successful submit
      setRating(0);
      setTitle("");
      setMessage("");
      setReviewImages([]);
      setRemovedImageIndices([]);
    } catch (error) {
      // Error already handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wide">
              {initialData ? "Edit Review" : "Write a Review"}
            </h3>
            {productName && (
              <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                {productName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <FaStar
                    size={32}
                    className={
                      (hoverRating || rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-[#6B7280]">
                {rating > 0
                  ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      rating
                    ]
                  : "Select"}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your review (optional)"
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
            />
          </div>

          {/* Review Message */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience with this product..."
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all resize-none"
            />
            <p className="text-xs text-[#6B7280] mt-1 text-right">
              {message.length}/2000
            </p>
          </div>

          {/* Image Upload Section - Amazon Style */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Add Photos (Optional)
            </label>
            <p className="text-xs text-[#6B7280] mb-3">
              Show others what you received. Max 5 images, up to 5MB each.
            </p>

            {/* Image Preview Grid */}
            {reviewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {reviewImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-[80px] h-[80px] rounded-xl overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={img.preview}
                      alt={`Review ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={8} />
                    </button>
                  </div>
                ))}

                {/* Upload More Button */}
                {reviewImages.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[80px] h-[80px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-all"
                  >
                    <FaCamera size={18} />
                    <span className="text-[10px] font-medium">Add More</span>
                  </button>
                )}
              </div>
            )}

            {/* Upload Button - shown when no images */}
            {reviewImages.length === 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-all"
              >
                <FaCamera size={28} />
                <span className="text-sm font-medium">Click to upload photos</span>
                <span className="text-xs">or drag and drop (Max 5 images)</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-[#4D5466] hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0 || !message.trim()}
              className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Submitting..."
                : initialData
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}