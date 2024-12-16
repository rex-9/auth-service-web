import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppRoutes from "../AppRoutes";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? (
    <Navigate to={AppRoutes.client.public.SIGN_IN} replace />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
