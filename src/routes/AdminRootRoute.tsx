import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts';
import { NotFoundPage } from '../design/pages';
import { usePermissions } from '../hooks';
import type { AdminAction, AdminResource } from '../modules/admin/role';
import { hasAdminRole } from '../modules/admin/role';
import { AdminLayout } from '../modules/admin/components/AdminLayout';

interface IAdminRootRouteProps {
  action: AdminAction;
  resource: AdminResource;
  superAdminOnly?: boolean;
}

export const AdminRootRoute: React.FC<IAdminRootRouteProps> = ({
  action,
  resource,
  superAdminOnly = false,
}) => {
  const { currentUser } = useAuth();
  const { can, isLoading, isSuperAdmin } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const isAllowed = superAdminOnly
    ? isSuperAdmin
    : hasAdminAccess && can(action, resource);

  return <AdminLayout>{isAllowed ? <Outlet /> : <NotFoundPage />}</AdminLayout>;
};
