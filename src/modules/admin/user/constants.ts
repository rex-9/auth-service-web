import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";

export const ADMIN_USER_PAGE_TITLES = {
  CREATE: "Create User",
  EDIT: "Edit User",
  LIST: "Users",
  RECYCLE_BIN: "User Recycle Bin",
} as const;

export const ADMIN_USER_TABLE_HEADERS = {
  EMAIL: "Email",
  ROLE: "Roles",
  USER: "User",
} as const;

export const ADMIN_USER_TABLE_KEYS = {
  ACTIONS: "actions",
  EMAIL: "email",
  IDENTITY: "identity",
  LIFECYCLE_DATE: "lifecycle_date",
  ROLE: "role",
} as const;

export const ADMIN_USER_SORT_KEYS = {
  NAME: "name",
  USERNAME: "username",
  EMAIL: "email",
  CREATED_AT: "created_at",
  DISCARDED_AT: "discarded_at",
} as const;

export const ADMIN_USER_LABELS = {
  UNASSIGNED: "Unassigned",
} as const;

export const ADMIN_USER_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.USERS]: {
    title: ADMIN_USER_PAGE_TITLES.LIST,
    actionLabel: "Create user",
    actionTo: AppRoutes.client.protected.admin.USER_CREATE,
    actionResource: ADMIN_RESOURCES.USERS,
    hasRecycleBin: true,
  },
  [AppRoutes.client.protected.admin.USERS_RECYCLE_BIN]: {
    title: ADMIN_USER_PAGE_TITLES.RECYCLE_BIN,
    description: "Restore discarded users or permanently remove them.",
  },
  [AppRoutes.client.protected.admin.USER_CREATE]: {
    title: ADMIN_USER_PAGE_TITLES.CREATE,
    description: "Add a user account using the admin user endpoint.",
  },
  [AppRoutes.client.protected.admin.USER_EDIT]: {
    title: ADMIN_USER_PAGE_TITLES.EDIT,
    description: "Update account details and admin-assigned fields.",
  },
};
