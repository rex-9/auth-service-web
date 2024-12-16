import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppRoutes from "../AppRoutes";

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to={AppRoutes.client.protected.HOME} />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
