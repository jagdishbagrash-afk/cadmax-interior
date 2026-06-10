import React, { useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import { formatPrice } from '@/components/formatPrice';

export default function WishlistRecommendations({ products = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              You May Also Like
            </h2>
            <p className="text-xs text-gray-500">
              Based on your wishlist preferences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-blue-300 transition-colors"
          >
            <FiChevronLeft className="text-sm" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-blue-300 transition-colors"
          >
            <FiChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Products Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((item, idx) => {
          const firstImage =
            item?.variants?.find((v) => v.images?.length)?.images?.[0] ||
            '/no-image.png';
          const displayPrice = item?.final_amount || item?.amount;
          const discount =
            item?.final_amount && item?.amount
              ? Math.round(
                  ((item.amount - item.final_amount) / item.amount) * 100
                )
              : null;

          return (
            <Link
              key={item._id || idx}
              href={`/product/details/${item?.slug}`}
              className="flex-shrink-0 w-[170px] md:w-[200px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="aspect-square bg-[#F8F8F8] relative overflow-hidden">
                <img
                  src={firstImage}
                  alt={item?.title}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
                {/* {discount && (
                  <span className="absolute top-2 left-2 text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    {discount}% OFF
                  </span>
                )} */}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                  {item?.title || 'Product'}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{formatPrice(displayPrice)}
                  </span>
                  {discount && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{formatPrice(item?.amount)}
                    </span>
                  )}
                </div>
                <span className="inline-block mt-2 text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Quick View →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}