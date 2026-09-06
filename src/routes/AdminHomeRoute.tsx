import React from "react";
import { Navigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { useAuth } from "../contexts";
import { NotFoundPage } from "../design/pages";
import { usePermissions } from "../hooks";
import type { AdminResource } from "../modules/admin/role";
import { hasAdminRole } from "../modules/admin/role";
import { ADMIN_ACTIONS, ADMIN_RESOURCES, ADMIN_ROLE_NAMES } from "../modules/admin";

const adminEntryRoutes: Array<{
  action?: typeof ADMIN_ACTIONS.READ | typeof ADMIN_ACTIONS.CREATE;
  resource: AdminResource;
  path: string;
  superAdminOnly?: boolean;
}> = [
  {
    resource: ADMIN_RESOURCES.ANALYTICS,
    path: AppRoutes.client.protected.admin.ANALYTICS,
  },
  {
    resource: ADMIN_RESOURCES.USERS,
    path: AppRoutes.client.protected.admin.USERS,
    superAdminOnly: true,
  },
  {
    resource:ADMIN_RESOURCES.NOTIFICATIONS,
    path: AppRoutes.client.protected.admin.NOTIFICATIONS,
  },
  { resource: ADMIN_RESOURCES.PRODUCTS, path: AppRoutes.client.protected.admin.PRODUCTS },
  { resource: ADMIN_RESOURCES.ROOMS, path: AppRoutes.client.protected.admin.CHAT_ROOMS },
  {
    resource:ADMIN_RESOURCES.MESSAGES,
    path: AppRoutes.client.protected.admin.CHAT_MESSAGES,
  },
];

export const AdminHomeRoute: React.FC = () => {
  const { currentUser } = useAuth();
  const { can, isLoading } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);
  const isSuperAdmin =
    currentUser?.role_names?.includes(ADMIN_ROLE_NAMES.SUPER_ADMIN) ?? false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const entry = hasAdminAccess
    ? adminEntryRoutes.find((item) =>
        item.superAdminOnly
          ? isSuperAdmin
          : can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
      )
    : null;

  return entry ? <Navigate to={entry.path} replace /> : <NotFoundPage />;
};
