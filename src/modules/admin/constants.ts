// src/modules/admin/constants.ts

export const ADMIN_PAGE_SIZE = 20;

export const ADMIN_VIEW_MODES = {
  ACTIVE: "active",
  DISCARDED: "discarded",
} as const;

export type TAdminViewMode =
  (typeof ADMIN_VIEW_MODES)[keyof typeof ADMIN_VIEW_MODES];

export const ADMIN_ACTIONS = {
  CREATE: "create",
  DELETE: "delete",
  READ: "read",
  UPDATE: "update",
  EDIT: "edit",
  DISCARD: "discard",
  UNDISCARD: "undiscard",
  DESTROY: "destroy",

  EXTEND: "extend",
  REVOKE: "revoke",

  REVIEW: "review",
  INSPECT: "inspect",
} as const;

export const ADMIN_ACTION_CATEGORIES = {
  NEUTRAL: "neutral",
  DANGER: "danger",
  SUCCESS: "success",
} as const;

export type TAdminActionCategory =
  (typeof ADMIN_ACTION_CATEGORIES)[keyof typeof ADMIN_ACTION_CATEGORIES];

export type TAdminActionsType =
  (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];

export const ADMIN_RESOURCES = {
  USERS: "users",
  ROLES: "roles",
  PRODUCTS: "products",
  ACCESSES: "accesses",
  NOTIFICATIONS: "notifications",
  ROOMS: "rooms",
  MESSAGES: "messages",
  ANALYTICS: "analytics",
  FEEDBACKS: "feedbacks",
  CLIENTS: "clients",
  ASSETS: "assets",
} as const;

export type TAdminResourceName =
  (typeof ADMIN_RESOURCES)[keyof typeof ADMIN_RESOURCES];

export const ADMIN_PERMISSION_ACTION_ORDER: string[] = [
  ADMIN_ACTIONS.READ,
  ADMIN_ACTIONS.CREATE,
  ADMIN_ACTIONS.UPDATE,
  ADMIN_ACTIONS.DELETE,
];

export const ADMIN_PERMISSION_FALLBACKS = {
  NULL_RESOURCE: "null",
  UNASSIGNED_RESOURCE: "unassigned",
} as const;

export interface IAdminPageMeta {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  actionResource?: TAdminResourceName;
  hasRecycleBin?: boolean;
}

export const ADMIN_NAV_SECTION_LABELS = {
  OVERVIEW: "Overview",
  IAM: "IAM",
  CHAT: "Chat",
  COMMERCE: "Commerce",
  COMMUNICATION: "Communication",
  SUPPORT: "Support",
  OBSERVABILITY: "Observability",
  MEDIA: "Media",
} as const;

export const ADMIN_NAV_LABELS = {
  ANALYTICS: "Analytics",
  CHAT_MESSAGES: "Chat Messages",
  CHAT_ROOMS: "Chat Rooms",
  NOTIFICATIONS: "Notifications",
  PRODUCTS: "Products",
  ACCESSES: "Access",
  FEEDBACK: "Feedback Inbox",
  LOGS: "Client Logs & Telemetry",
  ROLES: "Roles",
  USERS: "Users",
  ASSETS: "Assets",
} as const;

export const ANALYTICS_PERIODS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  SEVEN_DAYS: "7d",
  THIRTY_DAYS: "30d",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_YEAR: "this_year",
  LAST_YEAR: "last_year",
  CUSTOM: "custom",
} as const;

export type TAnalyticsPeriod =
  (typeof ANALYTICS_PERIODS)[keyof typeof ANALYTICS_PERIODS];

export const ANALYTICS_GRAINS = {
  HOURLY: "hourly",
  DAILY: "daily",
  MONTHLY: "monthly",
} as const;

export type TAnalyticsGrain =
  (typeof ANALYTICS_GRAINS)[keyof typeof ANALYTICS_GRAINS];

export const ANALYTICS_PERIOD_LABELS: Record<TAnalyticsPeriod, string> = {
  [ANALYTICS_PERIODS.TODAY]: "Today",
  [ANALYTICS_PERIODS.YESTERDAY]: "Yesterday",
  [ANALYTICS_PERIODS.SEVEN_DAYS]: "Last 7 days",
  [ANALYTICS_PERIODS.THIRTY_DAYS]: "Last 30 days",
  [ANALYTICS_PERIODS.THIS_MONTH]: "This month",
  [ANALYTICS_PERIODS.LAST_MONTH]: "Last month",
  [ANALYTICS_PERIODS.THIS_YEAR]: "This year",
  [ANALYTICS_PERIODS.LAST_YEAR]: "Last year",
  [ANALYTICS_PERIODS.CUSTOM]: "Custom Range",
};

export const ADMIN_TABLE_HEADERS = {
  ACTIONS: "",
  CREATED: "Created",
  STATUS: "Status",
} as const;

export const ADMIN_COMMON_LABELS = {
  ACTIVE: "Active",
  CANCEL: "Cancel",
  CUSTOM: "Custom",
  DELETE: "Delete",
  DISCARD: "Discard",
  DESTROY: "Destroy",
  EDIT: "Edit",
  EXTEND: "Extend",
  INACTIVE: "Inactive",
  INSPECT: "Inspect",
  NOT_AVAILABLE: "Not available",
  OPENRECYCLEBIN: "Open recycle bin",
  UNDISCARD: "Restore",
  REVIEW: "Review",
  REVOKE: "Revoke",
  SYSTEM: "System",
  UNASSIGNED: "Unassigned",
} as const;
