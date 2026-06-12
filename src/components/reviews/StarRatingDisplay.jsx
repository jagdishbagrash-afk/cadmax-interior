import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRatingDisplay({ rating, size = 16, interactive = false, onRate }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars < 0.7;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  for (let i = 1; i <= fullStars; i++) {
    stars.push(
      <span
        key={`full-${i}`}
        onClick={() => interactive && onRate?.(i)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
      >
        <FaStar className="text-yellow-400" size={size} />
      </span>
    );
  }

  if (hasHalf) {
    stars.push(
      <span
        key="half"
        onClick={() => interactive && onRate?.(fullStars + 1)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
      >
        <FaStarHalfAlt className="text-yellow-400" size={size} />
      </span>
    );
  }

  for (let i = 1; i <= emptyStars; i++) {
    const starNum = fullStars + (hasHalf ? 1 : 0) + i;
    stars.push(
      <span
        key={`empty-${i}`}
        onClick={() => interactive && onRate?.(starNum)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
      >
        <FaRegStar className="text-yellow-400" size={size} />
      </span>
    );
  }

  return <div className="inline-flex items-center gap-0.5">{stars}</div>;
}