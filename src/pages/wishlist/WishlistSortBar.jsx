import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

export default function WishlistSortBar({
  sort = 'recent',
  onSortChange,
  totalCount = 0,
  searchQuery = '',
  onSearchChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  const selectedLabel = sortOptions.find((o) => o.value === sort)?.label || 'Most Recent';

  const handleSearchInput = (e) => {
    const value = e.target.value;
    onSearchChange(value);
  };

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-200">
      {/* Left: Sort + Count */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 font-medium">Sort by:</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 flex items-center gap-1.5 min-w-[140px] justify-between"
          >
            
            <span>{selectedLabel}</span>
            <FiChevronDown
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Animated Dropdown */}
          <div
            className={`absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full min-w-[140px] origin-top transition-all duration-200 ease-out ${
              isOpen
                ? 'opacity-100 scale-y-100 translate-y-0'
                : 'opacity-0 scale-y-0 -translate-y-1 pointer-events-none'
            }`}
          >
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 ${
                  sort === opt.value
                    ? 'bg-black text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">•</span>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Right: Search bar */}
      <div className="relative w-full sm:w-auto">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search in wishlist... (min 3 chars)"
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full sm:w-56 pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 bg-white"
        />
      </div>
    </div>
  );
}