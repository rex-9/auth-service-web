import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import AppRoutes from "../AppRoutes";
import { PageLayout } from "../design/pages";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, refreshCurrentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) return;

    void refreshCurrentUser();
  }, [isAuthenticated, location.pathname, refreshCurrentUser]);

  if (!isAuthenticated) {
    return <Navigate to={AppRoutes.client.public.ROOT} replace />;
  }

  const isAdminPath = location.pathname.startsWith(
    AppRoutes.client.protected.admin.HOME,
  );

  return (
    <PageLayout isAdmin={isAdminPath}>
      <Outlet />
    </PageLayout>
  );
};

export default ProtectedRoute;
