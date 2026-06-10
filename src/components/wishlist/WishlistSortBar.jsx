import React from 'react';
import { FiSearch } from 'react-icons/fi';

export default function WishlistSortBar({
  sort = 'recent',
  onSortChange,
  totalCount = 0,
}) {
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Biggest Discount' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-200">
      {/* Left: Sort + Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">•</span>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Right: Search */}
      <div className="relative w-full sm:w-auto">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search in wishlist..."
          className="w-full sm:w-52 pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
        />
      </div>
    </div>
  );
}