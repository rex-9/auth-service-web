import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AppRoutes from "../../AppRoutes";

interface PublicRouteProps {
  element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? (
    element
  ) : (
    <Navigate to={AppRoutes.client.protected.HOME} />
  );
};

export default PublicRoute;
