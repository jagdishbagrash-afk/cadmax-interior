"use client";
import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../common/AdminLayout";
import { Api } from "@/pages/api/Api";
import toast from "react-hot-toast";
import moment from "moment";
import { FaCheck, FaTimes, FaTrash, FaStar, FaSpinner, FaEye, FaTimes as FaClose, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import StarRatingDisplay from "@/components/reviews/StarRatingDisplay";
import ConfirmModal from "@/components/ConfirmModal";

const statusConfig = {
  pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
};

function ViewReviewModal({ review, onClose }) {
  if (!review) return null;

  const statusInfo = statusConfig[review.status] || statusConfig.pending;
  const images = review.images || [];
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const goNext = () => setLightboxIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition-colors">
          <FaClose size={15} />
        </button>

        {/* LEFT: Review Details */}
        <div className="w-full md:w-[55%] p-6 md:p-8 overflow-y-auto flex flex-col">
          {/* Status Badge */}
          <div className="mb-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
            {review.user?.profileImage ? (
              <img src={review.user.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-bold">
                {(review.user?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{review.user?.name || "Anonymous"}</p>
              <p className="text-sm text-gray-400">{review.user?.email || ""}</p>
            </div>
          </div>

          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Product</p>
            <div className="flex items-center gap-3">
              {review.product?.images?.[0] && (
                <img src={review.product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
              )}
              <div>
                <Link href={`/product/details/${review.product?.slug}`} target="_blank" className="text-sm font-medium text-gray-800 hover:text-blue-600">
                  {review.product?.title || "N/A"}
                </Link>
                <p className="text-xs text-gray-400">₹{review.product?.final_amount || 0}</p>
              </div>
            </div>
          </div>

          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Rating</p>
            <div className="flex items-center gap-3">
              <StarRatingDisplay rating={review.rating} size={20} />
              <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
            </div>
          </div>

          {review.title && (
            <div className="mb-5 pb-5 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Title</p>
              <h4 className="text-base font-bold text-black">{review.title}</h4>
            </div>
          )}

          <div className="mb-5 pb-5 border-b border-gray-100 flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Comment</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{review.message}</p>
          </div>

          <div className="text-xs text-gray-400 pt-2">
            Submitted {moment(review.createdAt).format("MMMM D, YYYY [at] h:mm A")}
          </div>
        </div>

        {/* RIGHT: Image Slider */}
        <div className="relative w-full md:w-[45%] min-h-[300px] md:min-h-[500px] bg-gray-50 flex items-center justify-center">
          {images.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="text-center text-gray-400">
              <FaStar size={40} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">No images uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewReview, setViewReview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchReviews = useCallback(async (page = 1, status = "") => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (status) params.status = status;
      const response = await Api.get("/admin/reviews", { params });
      if (response?.data?.status) {
        setReviews(response.data.data.reviews);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchReviews]);

  const handleApprove = async (reviewId) => {
    setActionLoading(reviewId);
    try {
      const response = await Api.post(`/admin/reviews/approve/${reviewId}`);
      if (response?.data?.status) {
        toast.success("Review approved successfully");
        setViewReview(null);
        fetchReviews(currentPage, statusFilter);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId) => {
    setActionLoading(reviewId);
    try {
      const response = await Api.post(`/admin/reviews/reject/${reviewId}`);
      if (response?.data?.status) {
        toast.success("Review rejected");
        setViewReview(null);
        fetchReviews(currentPage, statusFilter);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId) => {
    setActionLoading(reviewId);
    setDeleteConfirm(null);
    try {
      const response = await Api.post(`/admin/reviews/delete/${reviewId}`);
      if (response?.data?.status) {
        toast.success("Review deleted");
        setViewReview(null);
        fetchReviews(currentPage, statusFilter);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const filters = [
    { value: "", label: "All Reviews" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <AdminLayout page="Review Management">
      <div className="p-4 md:p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-black text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-gray-400" size={30} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm mt-1">Try changing the filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Product</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Reviewer</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Date</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => {
                  const statusInfo = statusConfig[review.status] || statusConfig.pending;
                  const isLoading = actionLoading === review._id;

                  return (
                    <tr key={review._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {review.product?.images?.[0] && (
                            <img src={review.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <Link href={`/product/details/${review.product?.slug}`} target="_blank" className="text-xs font-medium text-gray-800 hover:text-blue-600 truncate block max-w-[150px]">
                              {review.product?.title || "N/A"}
                            </Link>
                            <span className="text-[10px] text-gray-400">₹{review.product?.final_amount || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {review.user?.profileImage ? (
                            <img src={review.user.profileImage} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                              {(review.user?.name || "U").charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-medium text-gray-800">{review.user?.name || "Anonymous"}</p>
                            <p className="text-[10px] text-gray-400">{review.user?.email || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-gray-500">{moment(review.createdAt).format("MMM D, YYYY")}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Button */}
                          <button onClick={() => setViewReview(review)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View Review">
                            <FaEye size={14} />
                          </button>

                          {/* Approve - only for pending */}
                          {review.status === "pending" && (
                            <button onClick={() => handleApprove(review._id)} disabled={isLoading} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50" title="Approve">
                              {isLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaCheck size={14} />}
                            </button>
                          )}

                          {/* Reject - only for pending */}
                          {review.status === "pending" && (
                            <button onClick={() => handleReject(review._id)} disabled={isLoading} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50" title="Reject">
                              {isLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaTimes size={14} />}
                            </button>
                          )}

                          {/* Delete */}
                          <button onClick={() => setDeleteConfirm({ reviewId: review._id })} disabled={isLoading} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition disabled:opacity-50" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={!pagination.hasPrevPage} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
            <button onClick={() => setCurrentPage((p) => p + 1)} disabled={!pagination.hasNextPage} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.reviewId)}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No"
        confirmClassName="bg-red-600 hover:bg-red-700"
      />

      {/* View Review Modal */}
      {viewReview && (
        <ViewReviewModal
          review={viewReview}
          onClose={() => setViewReview(null)}
        />
      )}
    </AdminLayout>
  );
}