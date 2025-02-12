import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";

export const rootReducer = combineReducers({
  authData: authReducer,
  cartData: cartReducer,
  productData: productReducer
});
