import { useCallback, useMemo } from "react";
import { useAuth } from "../contexts";
import { ADMIN_RESOURCES } from "../modules/admin/constants";
import {
  hasAdminRole,
  isAdminRoleName,
  ADMIN_ROLE_NAMES,
} from "../modules/admin/role/constants";
import type {
  AdminAction,
  AdminRoleName,
  AdminResource,
  IPermission,
} from "../modules/admin/role";

/**
 * Standardized mapping between AdminResource (matching Rails controller_name)
 * and scoped role name prefixes (e.g. users_admin or user_admin).
 * Strictly standardizes on the controller resource names with no ad-hoc aliases.
 */
const ADMIN_ROLE_RESOURCE_PREFIXES: Record<AdminResource, readonly string[]> = {
  [ADMIN_RESOURCES.USERS]: ["users", "user"],
  [ADMIN_RESOURCES.ROLES]: ["roles", "role"],
  [ADMIN_RESOURCES.PRODUCTS]: ["products", "product"],
  [ADMIN_RESOURCES.ACCESSES]: ["accesses", "access"],
  [ADMIN_RESOURCES.NOTIFICATIONS]: ["notifications", "notification"],
  [ADMIN_RESOURCES.ROOMS]: ["rooms", "room", "chat"],
  [ADMIN_RESOURCES.MESSAGES]: ["messages", "message", "chat"],
  [ADMIN_RESOURCES.ANALYTICS]: ["analytics"],
  [ADMIN_RESOURCES.FEEDBACKS]: ["feedbacks", "feedback"],
  [ADMIN_RESOURCES.CLIENTS]: ["clients", "client", "logs", "log"],
  [ADMIN_RESOURCES.ASSETS]: ["assets", "asset"],
};

interface IUsePermissionsResult {
  permissions: IPermission[];
  isLoading: boolean;
  error: string;
  can: (action: AdminAction, resource: AdminResource) => boolean;
  refresh: () => Promise<void>;
}

export const getAdminRoleResourceScope = (
  roleNames: AdminRoleName[] | null | undefined,
): Set<AdminResource> => {
  const scopedResources = new Set<AdminResource>();

  roleNames
    ?.filter((roleName) => isAdminRoleName(roleName))
    .forEach((roleName) => {
      if (
        roleName === ADMIN_ROLE_NAMES.ADMIN ||
        roleName === ADMIN_ROLE_NAMES.SUPER_ADMIN
      ) {
        Object.values(ADMIN_RESOURCES).forEach((resource) =>
          scopedResources.add(resource),
        );
        return;
      }

      if (!roleName.endsWith("_admin")) return;

      const rolePrefix = roleName.replace(/_admin$/, "");
      Object.entries(ADMIN_ROLE_RESOURCE_PREFIXES).forEach(
        ([resource, prefixes]) => {
          if (prefixes.includes(rolePrefix)) {
            scopedResources.add(resource as AdminResource);
          }
        },
      );
    });

  return scopedResources;
};

export const usePermissions = (): IUsePermissionsResult => {
  const { currentUser, isAuthenticated } = useAuth();
  const isLoading = isAuthenticated && !currentUser;
  const roleNames = currentUser?.role_names ?? currentUser?.roles;

  const isSuperAdmin = useMemo(
    () =>
      Boolean(
        currentUser?.is_super_admin ||
          roleNames?.includes(ADMIN_ROLE_NAMES.SUPER_ADMIN),
      ),
    [currentUser?.is_super_admin, roleNames],
  );

  const permissions = useMemo<IPermission[]>(() => {
    // Non-admin roles (user, etc.) NEVER grant access to admin capabilities
    if (!hasAdminRole(roleNames)) {
      return [];
    }

    const scopedResources = getAdminRoleResourceScope(roleNames);
    const permissionMap = !Array.isArray(currentUser?.permissions)
      ? (currentUser?.permissions ?? {})
      : {};

    return Object.entries(permissionMap).flatMap(([resource, actions]) => {
      const adminResource = resource as AdminResource;

      // Filter strictly: only accept permissions for resources covered by the user's admin roles
      if (scopedResources.has(adminResource)) {
        return (actions ?? []).map((action: AdminAction) => ({
          action,
          resource: adminResource,
        }));
      }

      return [];
    });
  }, [currentUser?.permissions, roleNames]);

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
      if (!hasAdminRole(roleNames)) return false;
      if (isSuperAdmin) return true;
      return permissionKeys.has(`${action}:${resource}`);
    },
    [isSuperAdmin, permissionKeys, roleNames],
  );

  const refresh = useCallback(async () => undefined, []);

  return { permissions, isLoading, error: "", can, refresh };
};
