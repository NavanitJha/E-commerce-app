import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  orders: [],
  loading: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setOrderList: (state, action) => {
      state.orders = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Selectors (get methods) - Moved outside of createSlice
// export const getProducts = (state) => state.products.products;
// export const getLoading = (state) => state.products.loading;

export const { setProducts, setLoading, setOrderList } = productSlice.actions;
export default productSlice.reducer;
