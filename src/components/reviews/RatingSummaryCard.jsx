import React from "react";
import StarRatingDisplay from "./StarRatingDisplay";

export default function RatingSummaryCard({ ratingSummary, onFilterByRating, activeRatingFilter }) {
  if (!ratingSummary) return null;

  const { averageRating, totalReviews, ratingBreakdown } = ratingSummary;

  const stars = [
    { star: 5, label: "5 Star" },
    { star: 4, label: "4 Star" },
    { star: 3, label: "3 Star" },
    { star: 2, label: "2 Star" },
    { star: 1, label: "1 Star" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-6">
        Customer Reviews
      </h3>

      {/* Average Rating */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-black text-black">
          {averageRating || 0}
        </div>
        <div>
          <StarRatingDisplay rating={averageRating || 0} size={20} />
          <p className="text-sm text-[#6B7280] mt-1">
            {totalReviews || 0} {totalReviews === 1 ? "Review" : "Reviews"}
          </p>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-3">
        {stars.map(({ star, label }) => {
          const data = ratingBreakdown?.[`star${star}`];
          const count = data?.count || 0;
          const percentage = data?.percentage || 0;
          const isActive = activeRatingFilter === star;

          return (
            <button
              key={star}
              onClick={() => onFilterByRating?.(isActive ? null : star)}
              className={`w-full flex items-center gap-3 text-sm group transition-all ${
                isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            >
              <span className="w-16 text-right text-[#4D5466] font-medium whitespace-nowrap">
                {label}
              </span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isActive ? "bg-yellow-500" : "bg-yellow-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-[#4D5466] font-medium">
                {percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}