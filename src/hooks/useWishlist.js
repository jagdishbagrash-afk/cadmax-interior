import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import {
  addToWishlistLocal,
  removeFromWishlistLocal,
  setWishlist,
} from "@/redux/wishlistSlice";

export default function useWishlist() {
  const dispatch = useDispatch();
  const { user, clearUser } = useRole();
  const router = useRouter();
  const count = useSelector((state) => state.wishlist.count);

  const fetchWishlist = useCallback(async () => {
    try {
      const main = new Listing();
      const response = await main.WishlistGet();
      if (response?.data?.status && response?.data?.data?.products) {
        const productIds = response.data.data.products.map((p) => p._id || p);
        dispatch(setWishlist(productIds));
      }
    } catch (error) {
      console.log("Error fetching wishlist:", error);
    }
  }, [dispatch]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user || user?.role !== "customer") {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      try {
        const main = new Listing();
        const response = await main.WishlistToggle(productId);

        if (response?.data?.status) {
          const { isWishlisted } = response.data.data;
          if (isWishlisted) {
            dispatch(addToWishlistLocal(productId));
            toast.success("Added to Wishlist");
          } else {
            dispatch(removeFromWishlistLocal(productId));
            toast.success("Removed from Wishlist");
          }
        }
      } catch (error) {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message || "Something went wrong";

        // Handle token expiration
        if (status === 401 || message.toLowerCase().includes("token")) {
          toast.error("Session expired. Please login again.");
          // Clear user session
          clearUser();
          router.push("/login");
          return;
        }

        toast.error(message);
      }
    },
    [user, dispatch, router]
  );

  return { toggleWishlist, fetchWishlist, count };
}