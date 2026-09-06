// src/modules/admin/accesses/constants.ts

import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";

export const ADMIN_ACCESS_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
} as const;

export type TAdminAccessStatus =
  (typeof ADMIN_ACCESS_STATUS)[keyof typeof ADMIN_ACCESS_STATUS];

export const ADMIN_ACCESS_DURATION_OPTIONS = {
  DAYS_30: "30",
  DAYS_90: "90",
  DAYS_365: "365",
  LIFETIME: "lifetime",
  CUSTOM: "custom",
} as const;

export type TAdminAccessDurationOption =
  (typeof ADMIN_ACCESS_DURATION_OPTIONS)[keyof typeof ADMIN_ACCESS_DURATION_OPTIONS];


export const ADMIN_ACCESS_PAGE_TITLES = {
  LIST: "Entitlements & Access",
} as const;

export const ADMIN_ACCESS_TABLE_HEADERS = {
  USER: "User",
  PRODUCT: "Product",
  STATUS: "Status",
  EXPIRES: "Expires",
  GRANTED_AT: "Granted",
} as const;

export const ADMIN_ACCESS_TABLE_KEYS = {
  USER: "user",
  PRODUCT: "product",
  STATUS: "status",
  GRANTED_AT: "granted_at",
  EXPIRES_AT: "expires_at",
  ACTIONS: "actions",
} as const;

export const ADMIN_ACCESS_SORT_KEYS = {
  USER_NAME: "user_name",
  PRODUCT_NAME: "product_name",
  CREATED_AT: "created_at",
  EXPIRES_AT: "expires_at",
  REVOKED_AT: "revoked_at",
} as const;

export const ADMIN_ACCESS_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.ACCESSES]: {
    title: ADMIN_ACCESS_PAGE_TITLES.LIST,
    actionLabel: "Grant Access",
    actionResource: ADMIN_RESOURCES.ACCESSES,
  },
};
