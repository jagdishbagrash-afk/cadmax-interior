import React, { useEffect, useState, useMemo } from "react";
import Layout from "../common/Layout";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import Listing from "../api/Listing";
import { setWishlist, removeFromWishlistLocal } from "@/redux/wishlistSlice";
import toast from "react-hot-toast";
import WishlistHero from "./WishlistHero";
import WishlistEmptyState from "./WishlistEmptyState";
import WishlistSortBar from "./WishlistSortBar";
import WishlistCard from "./WishlistCard";
import WishlistRecommendations from "./WishlistRecommendations";

export default function WishlistPage() {
  const { user } = useRole();
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state) => state.wishlist.wishlistIds);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [sort, setSort] = useState("recent");

  const fetchWishlistProducts = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.WishlistGet();
      if (response?.data?.status && response?.data?.data) {
        const data = response.data.data;
        console.log("data",data)
        const items = data.products || [];
        dispatch(setWishlist(items));
        setProducts(items);
        setRecommendations(data.recommendations || []);
      } else {
        setProducts([]);
        setRecommendations([]);
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

  // Sort products
  const sortedProducts = useMemo(() => {
    const items = [...products];
    switch (sort) {
      case "price-low":
        return items.sort(
          (a, b) => (a.final_amount || a.amount || 0) - (b.final_amount || b.amount || 0)
        );
      case "price-high":
        return items.sort(
          (a, b) => (b.final_amount || b.amount || 0) - (a.final_amount || a.amount || 0)
        );
      case "discount":
        return items.sort((a, b) => {
          const dA = a.amount && a.final_amount
            ? ((a.amount - a.final_amount) / a.amount) * 100
            : 0;
          const dB = b.amount && b.final_amount
            ? ((b.amount - b.final_amount) / b.amount) * 100
            : 0;
          return dB - dA;
        });
      default:
        return items;
    }
  }, [products, sort]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading your wishlist...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
        <div className="container mx-auto px-4 max-w-[1430px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Wishlist</span>
        </div>

        {/* Hero Section */}
        <WishlistHero count={products.length} />

        {products.length === 0 ? (
          <WishlistEmptyState />
        ) : (
          <>
            {/* Sort Bar */}
            <WishlistSortBar
              sort={sort}
              onSortChange={setSort}
              totalCount={products.length}
            />

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {sortedProducts.map((item, idx) => (
                <WishlistCard
                  key={item._id || idx}
                  product={item}
                  onRemove={handleRemove}
                  removing={removing}
                />
              ))}
            </div>

            {/* Recommendations */}
            <WishlistRecommendations products={recommendations} />
          </>
        )}

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 transition-colors"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}