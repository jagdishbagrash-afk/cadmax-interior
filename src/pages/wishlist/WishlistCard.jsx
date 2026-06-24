import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { formatPrice } from "@/components/formatPrice";

export default function WishlistCard({
  product = {},
  onRemove,
  removing = null,
}) {
  const [selectedColor, setSelectedColor] = useState(null);

  const productId = product?._id;
  const isRemoving = removing === productId;
  const isOutOfStock = product?.stock_status === "out_of_stock";

  // Get saved variant data from backend
  const savedWishlistItem = product?._wishlistItem || null;
  const savedVariant = savedWishlistItem?.selectedVariant || null;
  const savedPriceSection = savedWishlistItem?.selectedPriceSection || null;
  const savedSize = savedWishlistItem?.selectedSize || null;

  // Initialize selected color from saved data
  const effectiveSelectedColor = selectedColor || savedVariant?.color || null;

  // Find current variant based on selection
  const currentVariant = useMemo(() => {
    if (effectiveSelectedColor) {
      return product?.variants?.find((v) => v.color === effectiveSelectedColor);
    }
    return product?.variants?.[0] || null;
  }, [effectiveSelectedColor, product?.variants]);

  // Calculate price based on variant, price section, and size
  const { displayPrice, originalPrice, discount } = useMemo(() => {
    let finalAmount = product?.final_amount || 0;
    let amount = product?.amount || 0;

    // If we have saved price section and size, use those prices
    if (savedPriceSection && savedSize) {
      finalAmount = savedSize.final_amount || savedPriceSection.final_amount || finalAmount;
      amount = savedSize.amount || savedPriceSection.amount || amount;
    } else if (savedPriceSection) {
      finalAmount = savedPriceSection.final_amount || finalAmount;
      amount = savedPriceSection.amount || amount;
    }

    // If variant has specific pricing (you can add variant-specific pricing here if needed)
    if (currentVariant) {
      // Use variant pricing if available, otherwise keep calculated price
      if (currentVariant.final_amount) {
        finalAmount = currentVariant.final_amount;
      }
      if (currentVariant.amount) {
        amount = currentVariant.amount;
      }
    }

    const display = finalAmount > 0 ? finalAmount : amount;
    const discountPercent =
      amount && finalAmount && finalAmount < amount
        ? Math.round(((amount - finalAmount) / amount) * 100)
        : 0;

    return {
      displayPrice: display,
      originalPrice: amount,
      discount: discountPercent,
    };
  }, [product, currentVariant, savedPriceSection, savedSize]);

  const images = currentVariant?.images || [];

  const handleColorClick = (color) => {
    setSelectedColor(color === effectiveSelectedColor ? null : color);
  };

  const hasVariants = product?.variants?.length > 0;
  const hasPriceSections = product?.product_price_section?.length > 0;

  return (
    <div className="group block relative h-full">
      <div className="bg-white overflow-hidden transition-all duration-300 border border-gray-200 rounded-lg h-full flex flex-col">
        {/* IMAGE SECTION */}
        <Link
          href={`/product/details/${product?.slug}`}
          className="relative block"
        >
          <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[430px] overflow-hidden bg-[#F8F8F8]">
            {/* REMOVE BUTTON */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(productId);
              }}
              disabled={isRemoving}
              className="absolute top-3 right-3 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200"
            >
              {isRemoving ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiTrash2 className="text-gray-600 hover:text-red-500 text-lg" />
              )}
            </button>

            {/* OUT OF STOCK */}
            {isOutOfStock && (
              <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
                Out Of Stock
              </div>
            )}

            {/* DEFAULT IMAGE */}
            <img
              src={images?.[0] || "/no-image.png"}
              alt={product?.title}
              className="
                absolute inset-0
                w-full h-full
                object-cover
                transition-opacity duration-500
                group-hover:opacity-0
              "
            />

            {/* HOVER IMAGE */}
            <img
              src={images?.[1] || images?.[0] || "/no-image.png"}
              alt={product?.title}
              className="
                absolute inset-0
                w-full h-full
                object-cover
                opacity-0
                transition-opacity duration-500
                group-hover:opacity-100
              "
            />
          </div>
        </Link>

        {/* CONTENT */}
        <div className="bg-white px-2 pt-2 pb-2 flex-1 flex flex-col">
          {/* TITLE */}
          <Link href={`/product/details/${product?.slug}`}>
            <h3
              className="
                text-[13px]
                sm:text-sm
                font-medium
                text-[#262A33]
                uppercase
                tracking-wide
                line-clamp-2
                hover:text-black
                transition-colors
              "
            >
              {product?.title}
            </h3>
          </Link>

          {/* BRAND */}
          <div className="mt-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[2px] text-amber-700 bg-amber-50 px-2 py-1 rounded">
              Cadmax Atelier Exclusive
            </span>
          </div>

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
            {/* {discount > 0 && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                {discount}% OFF
              </span>
            )} */}
          </div>

          {/* STOCK */}
          <div className="mt-2">
            {isOutOfStock ? (
              <span className="text-xs text-red-500 font-medium">
                Out of Stock
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  In Stock
                </span>
              </div>
            )}
          </div>

          {/* COLORS - Always show if variants exist */}
          {hasVariants && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.variants.slice(0, 4).map((variant, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(variant?.color)}
                  className={`px-2 py-1 text-[10px] rounded-full border capitalize transition-all ${effectiveSelectedColor === variant?.color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-600 hover:border-black"
                    }`}
                >
                  {variant?.color}
                </button>
              ))}

              {product.variants.length > 4 && (
                <span className="text-[10px] text-gray-500 flex items-center">
                  +{product.variants.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Show selected variant details - compact chip style */}
          {(savedPriceSection || savedSize) && (
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
              {savedPriceSection && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-800">Size:</span>
                  <span>{savedPriceSection.title}</span>
                </div>
              )}

              {savedSize && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-800">Category:</span>
                  <span>{savedSize.title}</span>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-auto pt-3">
            <Link
              href={`/product/details/${product?.slug}`}
              className="
                flex-1
                bg-black
                text-white
                text-xs
                font-semibold
                py-3
                text-center
                uppercase
                tracking-wider
                hover:bg-gray-800
                transition-colors
                block
              "
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}