import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";
import type { AdminRoleName } from "./types";

export const ADMIN_ROLE_NAMES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  USER: "user",
} as const;

export const isAdminRoleName = (roleName: string): boolean =>
  roleName === ADMIN_ROLE_NAMES.ADMIN || roleName.endsWith("_admin");

export const hasAdminRole = (
  roleNames: AdminRoleName[] | null | undefined,
): boolean => roleNames?.some((roleName) => isAdminRoleName(roleName)) ?? false;

export const ADMIN_ROLE_PAGE_TITLES = {
  CREATE: "Create Role",
  EDIT: "Edit Role",
  LIST: "Roles",
  RECYCLE_BIN: "Recycle Bin | Roles",
} as const;

export const ADMIN_ROLE_TABLE_HEADERS = {
  PERMISSIONS: "Permissions",
  ROLE: "Role",
  TYPE: "Type",
  USERS: "Users",
} as const;

export const ADMIN_ROLE_TABLE_KEYS = {
  ACTIONS: "actions",
  NAME: "name",
  PERMISSIONS: "permissions",
  SYSTEM: "system",
  USERS: "users",
} as const;

export const ADMIN_ROLE_SORT_KEYS = {
  NAME: "name",
  CREATED_AT: "created_at",
} as const;

export const ADMIN_ROLE_LABELS = {
  CUSTOM: "Custom",
  SYSTEM: "System",
} as const;

export const ADMIN_ROLE_FORM_LABELS = {
  CREATE_ROLE: "Create role",
  DESCRIPTION: "Description",
  NAME_ERROR: "Admin panel roles must end with _admin, for example notification_admin.",
  NAME_HELPER: "Use a name ending with _admin, such as notification_admin.",
  PERMISSIONS: "Permissions",
  ROLE_NAME: "Role name",
  SAVE_CHANGES: "Save changes",
} as const;

export const ADMIN_ROLE_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.ROLES]: {
    title: ADMIN_ROLE_PAGE_TITLES.LIST,
    actionLabel: "Create role",
    actionTo: AppRoutes.client.protected.admin.ROLE_CREATE,
    actionResource: ADMIN_RESOURCES.ROLES,
  },
  [AppRoutes.client.protected.admin.ROLE_CREATE]: {
    title: ADMIN_ROLE_PAGE_TITLES.CREATE,
  },
  [AppRoutes.client.protected.admin.ROLE_EDIT]: {
    title: ADMIN_ROLE_PAGE_TITLES.EDIT,
  },
};
