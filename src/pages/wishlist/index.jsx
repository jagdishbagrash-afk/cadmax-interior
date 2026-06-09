import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import Link from "next/link";
import { FiHeart, FiTrash2, FiArrowLeft, FiEye } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import Listing from "../api/Listing";
import { formatPrice } from "@/components/formatPrice";
import { setWishlist, removeFromWishlistLocal } from "@/redux/wishlistSlice";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { user } = useRole();
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state) => state.wishlist.wishlistIds);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const fetchWishlistProducts = async () => {
    try {
      const main = new Listing();
      const response = await main.WishlistGet();
      if (response?.data?.status && response?.data?.data?.productIds) {
        const items = response.data.data.productIds;
        dispatch(setWishlist(items));
        setProducts(items);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user?.role !== "customer") {
      router.push("/login");
      return;
    }
    fetchWishlistProducts();
  }, [user]);

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      const main = new Listing();
      const response = await main.WishlistDelete(productId);
      if (response?.data?.status) {
        dispatch(removeFromWishlistLocal(productId));
        setProducts((prev) =>
          prev.filter((item) => (item._id || item) !== productId)
        );
        toast.success("Deleted from Wishlist");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove");
    } finally {
      setRemoving(null);
    }
  };

  const getImage = (item) => {
    return item?.variants?.find((v) => v.images?.length)?.images?.[0] || "/no-image.png";
  };

  const getDiscountedPrice = (item) => {
    if (item?.final_amount && item?.amount) {
      const discount = Math.round(((item.amount - item.final_amount) / item.amount) * 100);
      return discount > 0 ? discount : null;
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#171717]">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} {products.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <Link
            href="/product"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>

        {products.length === 0 ? (
          /* EMPTY STATE */
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FiHeart className="text-3xl text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Save products you love and view them here. Start exploring our collection!
            </p>
            <Link
              href="/product"
              className="px-8 py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* TABLE HEADER - DESKTOP */}
            {/* <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1.5fr] gap-4 px-4 py-3 bg-gray-50 rounded-lg mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span></span>
              <span>Product</span>
              <span>Price</span>
              <span className="text-right">Actions</span>
            </div> */}

            {/* PRODUCT LIST */}
            <div className="space-y-3">
              {products.map((item, idx) => {
                const productId = item._id || item;
                const discount = getDiscountedPrice(item);
                const displayPrice = item?.final_amount || item?.amount;

                return (
                  <div
                    key={productId || idx}
                    className="group bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                  >
                    {/* MOBILE VIEW */}
                    <div className="md:hidden p-4">
                      <div className="flex gap-4">
                        {/* IMAGE */}
                        <Link
                          href={`/product/details/${item?.slug}`}
                          className="block w-[100px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-[#F8F8F8]"
                        >
                          <img
                            src={getImage(item)}
                            alt={item?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* DETAILS */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/details/${item?.slug}`}
                            className="block"
                          >
                            <h3 className="text-sm font-medium text-[#262A33] line-clamp-2 hover:text-black transition-colors">
                              {item?.title}
                            </h3>
                          </Link>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-bold text-black">
                              ₹{formatPrice(displayPrice)}
                            </span>
                            {discount && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{formatPrice(item?.amount)}
                                </span>
                                <span className="text-xs font-semibold text-green-600">
                                  ({discount}% OFF)
                                </span>
                              </>
                            )}
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <Link
                              href={`/product/details/${item?.slug}`}
                              className="flex-1 px-3 py-2 bg-black text-white text-xs font-medium uppercase tracking-wider text-center hover:bg-gray-800 transition-colors rounded"
                            >
                              <FiEye className="inline mr-1" />
                              View
                            </Link>
                            <button
                              onClick={() => handleRemove(productId)}
                              disabled={removing === productId}
                              className="px-3 py-2 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-all duration-200 rounded"
                            >
                              {removing === productId ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FiTrash2 className="text-base" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DESKTOP VIEW - TABLE ROW */}
                    <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1.5fr] gap-4 items-center px-4 py-4">
                      {/* IMAGE */}
                      <Link
                        href={`/product/details/${item?.slug}`}
                        className="block w-[80px] h-[100px] overflow-hidden rounded-lg bg-[#F8F8F8]"
                      >
                        <img
                          src={getImage(item)}
                          alt={item?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* TITLE */}
                      <div>
                        <Link
                          href={`/product/details/${item?.slug}`}
                          className="block"
                        >
                          <h3 className="text-sm font-medium text-[#262A33] hover:text-black transition-colors line-clamp-2">
                            {item?.title}
                          </h3>
                        </Link>
                      </div>

                      {/* PRICE */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg font-bold text-black">
                            ₹{formatPrice(displayPrice)}
                          </span>
                          {discount && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ₹{formatPrice(item?.amount)}
                              </span>
                              <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                {discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/details/${item?.slug}`}
                          className="px-4 py-2.5 bg-black text-white text-xs font-medium uppercase tracking-wider text-center hover:bg-gray-800 transition-colors rounded whitespace-nowrap"
                        >
                          <FiEye className="inline mr-1.5" />
                          View Product
                        </Link>
                        <button
                          onClick={() => handleRemove(productId)}
                          disabled={removing === productId}
                          className="px-3 py-2.5 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-all duration-200 rounded"
                        >
                          {removing === productId ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 className="text-base" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}