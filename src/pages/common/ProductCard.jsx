import { formatPrice } from "@/components/formatPrice";
import Link from "next/link";
import React from "react";
import { FiHeart } from "react-icons/fi";
import { useSelector } from "react-redux";
import useWishlist from "@/hooks/useWishlist";
import { getProductPrices } from "@/components/productPrices";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRole } from "@/context/RoleContext";

export default function ProductCard({ item }) {
  const wishlistIds = useSelector((state) => state.wishlist.wishlistIds);
  const { toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.includes(item?._id);
  const { openAuthModal } = useAuthModal();
  const { user } = useRole();
  // Get prices using the helper
  const { displayPrice, originalPrice } = getProductPrices(item);

  const image =
    item?.variants?.find((v) => v.images?.length)?.images;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user && user?.role === "customer") {
      // User is logged in, toggle wishlist directly
      toggleWishlist(item?._id);
    } else {
      // User not logged in, show auth modal
      openAuthModal("login");
    }
  };

  return (
    <Link
      href={`/product/details/${item?.slug}`}
      className="group block relative"
    >
      {/* CARD */}
      <div className="bg-white overflow-hidden transition-all duration-300">
        {/* IMAGE */}
        <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[450px] overflow-hidden bg-[#F8F8F8]">
          {/* WISHLIST BUTTON */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart
              className={`text-lg transition-all duration-200 ${isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-400"
                }`}
            />
          </button>

          {item?.stock_status === "out_of_stock" && (
            <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
              Out Of Stock
            </div>
          )}

          {/* Default Image */}
          <img
            src={image?.[0] || "/no-image.png"}
            alt={item?.title}
            className="
              absolute inset-0
              w-full h-full object-cover
              transition-opacity duration-500
              group-hover:opacity-0
            "
          />

          {/* Hover Image */}
          <img
            src={image?.[1] || image?.[0] || "/no-image.png"}
            alt={item?.title}
            className="
              absolute inset-0
              w-full h-full object-cover
              opacity-0
              transition-opacity duration-500
              group-hover:opacity-100
            "
          />
        </div>

        {/* TEXT AREA */}
        <div className="bg-white pt-4 pb-2 relative z-10">
          {/* TITLE */}
          <h3 className="text-[13px] sm:text-sm font-medium text-[#262A33] uppercase tracking-wide line-clamp-2">
            {item?.title}
          </h3>

          {/* PRICE */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <p className="text-[18px] sm:text-[20px] font-black text-black uppercase">
              ₹{formatPrice(displayPrice)}
            </p>
            {originalPrice > displayPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}