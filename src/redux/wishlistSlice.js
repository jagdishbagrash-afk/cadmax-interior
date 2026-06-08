import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
  wishlistIds: [],
  count: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      const items = action.payload;
      state.wishlistItems = items;
      state.wishlistIds = items.map((item) => item._id || item);
      state.count = items.length;
    },
    addToWishlistLocal: (state, action) => {
      const productId = action.payload;
      if (!state.wishlistIds.includes(productId)) {
        state.wishlistIds.push(productId);
        state.count = state.wishlistIds.length;
      }
    },
    removeFromWishlistLocal: (state, action) => {
      const productId = action.payload;
      state.wishlistIds = state.wishlistIds.filter((id) => id !== productId);
      state.count = state.wishlistIds.length;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => (item._id || item) !== productId
      );
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.wishlistIds = [];
      state.count = 0;
    },
  },
});

export const {
  setWishlist,
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;