import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import Listing from '../api/Listing';

export default function WishlistEmptyState() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const getProductImage = (product) => {
    // Images are inside variants[0].images
    if (product.variants?.[0]?.images?.[0]) {
      return product.variants[0].images[0];
    }
    // Fallback to top-level images if any
    if (product.images?.[0]) {
      return product.images[0];
    }
    return null;
  };

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.GetBestSeller();
      const resData = response?.data;
      if (resData?.success && resData?.data) {
        const data = resData.data;
        // Data is array of { product: {...} } from aggregation
        const items = data.map(item => item.product || item).slice(0, 3);
        setBestSellers(items);
      }
    } catch (error) {
      console.log("Error fetching best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <p className="text-gray-500 max-w-md mb-8">
        Curate your dream collection. Save products you love and find them here.
      </p>

      {/* Best Seller Products Preview */}
      <div className="mb-8 w-full max-w-lg">
        <p className="text-xs uppercase tracking-[2px] text-gray-400 font-medium mb-3">
          Best Seller
        </p>
        <div className="flex gap-3 justify-center">
          {loading ? (
            <>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="w-28 md:w-32 bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="aspect-square bg-[#F8F8F8] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="p-2">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </>
          ) : bestSellers.length > 0 ? (
            bestSellers.map((item, idx) => {
              const imgSrc = getProductImage(item);
              return (
                <Link
                  key={item._id || idx}
                  href={`/product/details/${item.slug || item._id}`}
                  className="w-28 md:w-32 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 transition-colors group"
                >
                  <div className="aspect-square bg-[#F8F8F8] flex items-center justify-center overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-gray-300 text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg>';
                        }}
                      />
                    ) : (
                      <FiHeart className="text-gray-300 text-2xl" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-medium text-gray-900 line-clamp-1">
                      {item.title || item.name}
                    </p>
                    <p className="text-xs font-bold text-amber-700 mt-0.5">
                      ₹{item.final_amount || item.amount || 0}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="w-28 md:w-32 bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="aspect-square bg-[#F8F8F8] flex items-center justify-center">
                    <FiHeart className="text-gray-300 text-2xl" />
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-medium text-gray-900 line-clamp-1">
                      Best Seller {idx + 1}
                    </p>
                    <p className="text-xs font-bold text-amber-700 mt-0.5">
                      ₹0
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
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