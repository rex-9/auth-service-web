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
  [ADMIN_RESOURCES.VERSIONS]: ["versions", "version"],
  [ADMIN_RESOURCES.USER_VERSIONS]: ["user_versions", "user_version"],
};

const ADMIN_RESOURCE_VALUES = Object.values(ADMIN_RESOURCES) as string[];

interface IUsePermissionsResult {
  permissions: IPermission[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string;
  can: (action: AdminAction, resource: AdminResource) => boolean;
  refresh: () => Promise<void>;
}

export const getAdminPermissions = (
  permissionMap: unknown,
  roleNames: AdminRoleName[] | null | undefined,
): IPermission[] => {
  if (!hasAdminRole(roleNames) || Array.isArray(permissionMap)) {
    return [];
  }

  return Object.entries(permissionMap ?? {}).flatMap(([resource, actions]) => {
    if (!ADMIN_RESOURCE_VALUES.includes(resource)) {
      return [];
    }

    return Array.isArray(actions)
      ? actions.map((action) => ({
          action: action as AdminAction,
          resource: resource as AdminResource,
        }))
      : [];
  });
};

export const getScopedAdminPermissions = (
  permissionMap: unknown,
  roleNames: AdminRoleName[] | null | undefined,
): IPermission[] => {
  const permissions = getAdminPermissions(permissionMap, roleNames);
  const scopedResources = getAdminRoleResourceScope(roleNames);

  return permissions.filter((permission) =>
    scopedResources.has(permission.resource),
  );
};

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
  const { currentUser, isAuthenticated, refreshCurrentUser } = useAuth();
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
    return currentUser?.admin_permissions
      ? getAdminPermissions(currentUser.admin_permissions, roleNames)
      : getScopedAdminPermissions(currentUser?.permissions, roleNames);
  }, [currentUser?.admin_permissions, currentUser?.permissions, roleNames]);

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

  const refresh = useCallback(async () => {
    await refreshCurrentUser();
  }, [refreshCurrentUser]);

  return { permissions, isSuperAdmin, isLoading, error: "", can, refresh };
};
