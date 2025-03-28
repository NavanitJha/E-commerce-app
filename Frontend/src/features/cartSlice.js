import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  cartList: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartList: (state, action) => {
      state.cartList = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.cartList.items.filter(
        (item) => item._id !== action.payload.id
      );
    },
    incrementQuantity: (state, action) => {
      const item = state.cartList.items.find(
        (item) => item.productId._id === action.payload._id
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.cartList.items.find(
        (item) => item.productId._id === action.payload._id
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.cartList = [];
    },
  },
});

export const {
  setCartList,
  addItem,
  removeItem,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
