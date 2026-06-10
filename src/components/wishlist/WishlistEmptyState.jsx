import React from 'react';
import Link from 'next/link';
import { FiHeart, FiArrowRight } from 'react-icons/fi';

export default function WishlistEmptyState() {
  const trendingProducts = [
    {
      title: 'Modern Velvet Sofa',
      price: '₹34,499',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Art Deco Floor Lamp',
      price: '₹12,999',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Luxury Marble Table',
      price: '₹24,999',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Main Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center animate-pulse-slow">
          <FiHeart className="text-4xl text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
          !
        </div>
      </div>

      {/* Text */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Your Wishlist Awaits...
      </h2>
      <p className="text-gray-500 max-w-md mb-2">
        Curate your dream collection. Save products you love and find them here.
      </p>
      <p className="text-amber-700 text-sm font-medium mb-8">
        Sign in to save your favorites across devices!
      </p>

      {/* Trending Products Preview */}
      <div className="mb-8 w-full max-w-lg">
        <p className="text-xs uppercase tracking-[2px] text-gray-400 font-medium mb-3">
          Trending Now
        </p>
        <div className="flex gap-3 justify-center">
          {trendingProducts.map((item, idx) => (
            <div
              key={idx}
              className="w-28 md:w-32 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 transition-colors"
            >
              <div className="aspect-square bg-[#F8F8F8] flex items-center justify-center">
                <FiHeart className="text-gray-300 text-2xl" />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-gray-900 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs font-bold text-amber-700 mt-0.5">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/product"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-xl shadow-lg hover:shadow-xl"
      >
        Explore Collection
        <FiArrowRight />
      </Link>

      {/* Brand */}
      <p className="mt-6 text-[10px] tracking-[3px] text-gray-400 uppercase font-medium">
        Cadmax Atelier Exclusive
      </p>
    </div>
  );
}