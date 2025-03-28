import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element }) => {
  const { userDetails } = useSelector((state) => state.authData);
  return userDetails?.token ? <Navigate to="/dashboard" /> : element;
};

export default PublicRoute;
