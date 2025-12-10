import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // This will hold the list of items in the cart
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(i => i.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cartItems.push(newItem);
      }
    },
    removeItem: (state, action) => {
      const id = action.payload; // We now expect the item's id to be passed as the payload
      state.cartItems = state.cartItems.filter(item => item.id !== id);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

