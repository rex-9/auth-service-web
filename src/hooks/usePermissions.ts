import { useCallback, useMemo } from "react";
import { useAuth } from "../contexts";
import type {
  AdminAction,
  AdminResource,
  IPermission,
} from "../modules/admin/role";
import type { IUserIam } from "../models";

export const getAdminPermissions = (
  iam: IUserIam | undefined,
): IPermission[] => {
  if (!iam?.is_admin) return [];

  return iam.admin_permissions.map(({ attributes }) => ({
    action: attributes.action,
    resource: attributes.resource,
  }));
};

interface IUsePermissionsResult {
  permissions: IPermission[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string;
  can: (action: AdminAction, resource: AdminResource) => boolean;
  refresh: () => Promise<void>;
}

export const usePermissions = (): IUsePermissionsResult => {
  const { currentUser, isAuthenticated, refreshCurrentUser } = useAuth();
  const isLoading = isAuthenticated && !currentUser;
  const iam = currentUser?.iam;
  const isAdmin = iam?.is_admin ?? false;
  const isSuperAdmin = iam?.is_super_admin ?? false;

  const permissions = useMemo<IPermission[]>(() => {
    return getAdminPermissions(iam);
  }, [iam]);

  const permissionKeys = useMemo(
    () =>
      new Set(
        permissions.map(
          (permission) => `${permission.action}:${permission.resource}`,
        ),
      ),
    [permissions],
  );

  const can = useCallback(
    (action: AdminAction, resource: AdminResource) => {
      if (!isAdmin) return false;
      if (isSuperAdmin) return true;
      return permissionKeys.has(`${action}:${resource}`);
    },
    [isAdmin, isSuperAdmin, permissionKeys],
  );

  const refresh = useCallback(async () => {
    await refreshCurrentUser();
  }, [refreshCurrentUser]);

  return {
    permissions,
    isAdmin,
    isSuperAdmin,
    isLoading,
    error: "",
    can,
    refresh,
  };
};
