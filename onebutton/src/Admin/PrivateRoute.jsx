import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("admin_token"); // Check if token exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/Admin/login" replace />;
};

export default PrivateRoute;
