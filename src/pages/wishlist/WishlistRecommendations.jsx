import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import ProductCard from '../common/ProductCard';

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
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              You May Also Like
            </h2>
            <p className="text-xs text-gray-500">
              Explore more products from our collection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-amber-400 transition-colors"
          >
            <FiChevronLeft className="text-sm" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-amber-400 transition-colors"
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
        {products.map((item, idx) => (
          <div key={item._id || idx} className="flex-shrink-0 w-[220px] md:w-[260px]">
            <ProductCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}