import React from 'react';
import { FiHeart } from 'react-icons/fi';

export default function WishlistHero({ count = 0 }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#000000] mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[20px] border-white" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[20px] border-white" />
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-white rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-3 h-3 bg-white rounded-full" />
      </div>

      <div className="relative px-6 py-8 md:px-12 md:py-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <FiHeart className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              My Wishlist Collection
            </h1>
            <p className="text-amber-100 text-sm md:text-base mt-1 opacity-90">
              Save the styles you love. Your personal design inspiration board awaits!
            </p>
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/80 text-xs md:text-sm tracking-[3px] uppercase font-medium">
            C A D M A X &nbsp; A T E L I E R &nbsp; • &nbsp; 
            <span className="text-amber-200">{count} {count === 1 ? 'item' : 'items'} saved</span>
          </p>
        </div>
      </div>
    </div>
  );
}