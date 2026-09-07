import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";

export const VERSION_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  YANKED: "yanked",
} as const;

export const VERSION_PLATFORMS = {
  IOS: "ios",
  ANDROID: "android",
} as const;

export const VERSION_SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

export const ADMIN_VERSION_PAGE_TITLES = {
  CREATE: "Create Version",
  EDIT: "Edit Version",
  LIST: "Versions",
  RECYCLE_BIN: "Version Recycle Bin",
  USER_VERSIONS: "User Versions",
} as const;

export const ADMIN_VERSION_TABLE_KEYS = {
  NUMBER: "number",
  TITLE: "title",
  STATUS: "status",
  FORCE: "force",
  INSTALLS: "installs",
  RELEASED_AT: "released_at",
  DISCARDED_AT: "discarded_at",
  ACTIONS: "actions",
} as const;

export const ADMIN_VERSION_SORT_KEYS = {
  CREATED_AT: "created_at",
  NUMBER: "number",
  TITLE: "title",
  STATUS: "status",
  RELEASED_AT: "released_at",
  DISCARDED_AT: "discarded_at",
  INSTALL_COUNT: "install_count",
} as const;

export const ADMIN_USER_VERSION_TABLE_KEYS = {
  USER: "user",
  PLATFORM: "platform",
  NUMBER: "number",
  BUILD: "build",
  LAST_SEEN: "last_seen",
} as const;

export const ADMIN_USER_VERSION_SORT_KEYS = {
  LAST_SEEN_AT: "last_seen_at",
  NUMBER: "number",
  PLATFORM: "platform",
  CREATED_AT: "created_at",
} as const;

export const ADMIN_VERSION_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.VERSIONS]: {
    title: ADMIN_VERSION_PAGE_TITLES.LIST,
    actionLabel: "Create version",
    actionTo: AppRoutes.client.protected.admin.VERSION_CREATE,
    actionResource: ADMIN_RESOURCES.VERSIONS,
    hasRecycleBin: true,
  },
  [AppRoutes.client.protected.admin.VERSIONS_RECYCLE_BIN]: {
    title: ADMIN_VERSION_PAGE_TITLES.RECYCLE_BIN,
  },
  [AppRoutes.client.protected.admin.VERSION_CREATE]: {
    title: ADMIN_VERSION_PAGE_TITLES.CREATE,
  },
  [AppRoutes.client.protected.admin.VERSION_EDIT]: {
    title: ADMIN_VERSION_PAGE_TITLES.EDIT,
  },
  [AppRoutes.client.protected.admin.USER_VERSIONS]: {
    title: ADMIN_VERSION_PAGE_TITLES.USER_VERSIONS,
  },
  [AppRoutes.client.protected.admin.VERSION_INSTALLS]: {
    title: ADMIN_VERSION_PAGE_TITLES.USER_VERSIONS,
  },
};
