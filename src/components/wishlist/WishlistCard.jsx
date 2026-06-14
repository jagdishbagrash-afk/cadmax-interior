import React, { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiTrash2, FiEye } from 'react-icons/fi';
import { formatPrice } from '@/components/formatPrice';

export default function WishlistCard({
  product = {},
  onRemove,
  onAddToCart,
  removing = null,
}) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [imgError, setImgError] = useState(false);

  const productId = product._id;
  const discount =
    product?.final_amount && product?.amount
      ? Math.round(
          ((product.amount - product.final_amount) / product.amount) * 100
        )
      : null;

  const displayPrice = product?.final_amount || product?.amount;
  const isRemoving = removing === productId;
  const isOutOfStock = product?.stock_status === 'out_of_stock';

  // Get first image safely
  const getFirstImage = () => {
    const variant = selectedColor
      ? product?.variants?.find((v) => v.color === selectedColor)
      : product?.variants?.[0];
    return variant?.images?.[0] || '/no-image.png';
  };

  const handleColorClick = (color) => {
    setSelectedColor(color === selectedColor ? null : color);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <Link
        href={`/product/details/${product?.slug}`}
        className="relative block aspect-square bg-[#F8F8F8] overflow-hidden"
      >
        {/* {discount && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )} */}

        {/* {isOutOfStock && (
          <div className="absolute top-3 right-3 z-10 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )} */}

        {/* Heart icon always visible */}
        {/* <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <FiHeart className="text-red-500 fill-red-500 text-sm" />
        </div> */}

        {!imgError ? (
          <img
            src={getFirstImage()}
            alt={product?.title || 'Product'}
            className="w-full h-full object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiEye className="text-4xl" />
          </div>
        )}

      </Link>

      {/* Content Section */}
      <div className="p-2 md:p-4">
        {/* Title */}
        <Link href={`/product/details/${product?.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-amber-700 transition-colors min-h-[1.5rem]">
            {product?.title || 'Product'}
          </h3>
        </Link>

        {/* Brand Badge */}
        <div className="mt-1 ">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[2px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            Cadmax Atelier Exclusive
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base md:text-lg font-bold text-gray-900">
            ₹{formatPrice(displayPrice)}
          </span>
          {discount && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{formatPrice(product?.amount)}
              </span>
              {/* <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                {discount}% off
              </span> */}
            </>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-1.5 flex items-center gap-1.5">
          {isOutOfStock ? (
            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-green-600 font-medium">In Stock</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">Ships in 8-12 days</span>
            </>
          )}
        </div>

        {/* Color Variants */}
        {product?.variants?.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mr-1">
              Colors:
            </span>
            {product.variants.slice(0, 4).map((v, idx) => (
              <button
                key={idx}
                onClick={() => handleColorClick(v.color)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-200 capitalize ${
                  selectedColor === v.color
                    ? 'border-amber-500 bg-amber-50 text-amber-700 font-medium'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {v.color}
              </button>
            ))}
            {product.variants.length > 4 && (
              <span className="text-[10px] text-gray-400">
                +{product.variants.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/product/details/${product?.slug}`}
            className="flex-1 px-2 md:px-3 py-1.5 md:py-2 bg-black text-white text-[10px] md:text-xs font-semibold uppercase tracking-wider text-center hover:bg-gray-800 transition-colors rounded-lg flex items-center justify-center gap-1"
          >
            <FiShoppingBag className="text-sm" />
            View Details
          </Link>
          <button
            onClick={() => onRemove(productId)}
            disabled={isRemoving}
            className="px-3 py-2 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-all duration-200 rounded-lg"
          >
            {isRemoving ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiTrash2 className="text-sm" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}