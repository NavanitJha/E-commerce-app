import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import LoginPage from "../pages/Authentication/LoginPage";
import SignUpPage from "../pages/Authentication/SignUpPage";
import store from "../store/index.js";
import { Provider } from "react-redux";

const AppRouter = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute element={<HomePage />} />} />
        <Route
          path="/signup"
          element={<PublicRoute element={<SignUpPage />} />}
        />
        <Route
          path="/login"
          element={<PublicRoute element={<LoginPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<PublicRoute element={<ForgotPassword />} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<HomePage />} />}
        />
        <Route path="/cart" element={<PrivateRoute element={<CartPage />} />} />
        <Route
          path="/checkout"
          element={<PrivateRoute element={<CheckoutPage />} />}
        />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default AppRouter;
