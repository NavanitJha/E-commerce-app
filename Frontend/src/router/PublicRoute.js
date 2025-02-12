import React from "react";
// import { Route, Redirect } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/authSlice";

const PublicRoute = ({ element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

export default PublicRoute;
