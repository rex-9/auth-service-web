import AppRoutes from "../../../AppRoutes";
import { AppLocales } from "../../../locales";
import { IAdminPageMeta } from "../constants";

export const ADMIN_NOTIFICATION_PAGE_TITLES = {
  LIST: "Notifications",
  CREATE: "Create Notification Template",
  EDIT: "Edit Notification Template",
} as const;

export const ADMIN_NOTIFICATION_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.NOTIFICATIONS]: {
    title: ADMIN_NOTIFICATION_PAGE_TITLES.LIST,
  },
  [AppRoutes.client.protected.admin.NOTIFICATION_CREATE]: {
    title: ADMIN_NOTIFICATION_PAGE_TITLES.CREATE,
  },
  [AppRoutes.client.protected.admin.NOTIFICATION_EDIT]: {
    title: ADMIN_NOTIFICATION_PAGE_TITLES.EDIT,
  },
};

export const NOTIFICATION_AUDIENCE_TYPES = {
  ALL: "all",
  ROLES: "roles",
  USERS: "users",
} as const;

export type NotificationAudienceType =
  (typeof NOTIFICATION_AUDIENCE_TYPES)[keyof typeof NOTIFICATION_AUDIENCE_TYPES];

export const NOTIFICATION_DELIVERY_CHANNELS = {
  EMAIL: "email",
  PUSH: "push",
  SOCKET: "socket",
} as const;

export type NotificationDeliveryChannel =
  (typeof NOTIFICATION_DELIVERY_CHANNELS)[keyof typeof NOTIFICATION_DELIVERY_CHANNELS];

export const NOTIFICATION_CHANNELS = {
  IN_APP: "in_app",
  PUSH: "push",
  EMAIL: "email",
} as const;

export type TNotificationChannel =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS];

export const NOTIFICATION_FIELDS = {
  AUDIENCE_TYPE: "audience_type",
  EVENT: "event",
  ROLE_IDS: "role_ids",
  SEND_EMAIL: "send_email",
  SEND_PUSH: "send_push",
  SEND_SOCKET: "send_socket",
  USER_IDS: "user_ids",
} as const;

export const NOTIFICATION_EVENT_CATEGORIES = {
  AUTHENTICATION: "authentication",
  BROADCAST: "broadcast",
  PAYMENT: "payment",
} as const;

export const NOTIFICATION_CATEGORIES = {
  SYSTEM: "system",
  MARKETING: "marketing",
  BROADCAST: "broadcast",
} as const;

export const NOTIFICATION_ADMIN_TABS = {
  BROADCAST: "broadcast",
  TEMPLATES: "templates",
} as const;

export type TNotificationAdminTab =
  (typeof NOTIFICATION_ADMIN_TABS)[keyof typeof NOTIFICATION_ADMIN_TABS];

export type NotificationEventCategory =
  (typeof NOTIFICATION_EVENT_CATEGORIES)[keyof typeof NOTIFICATION_EVENT_CATEGORIES];

export const NOTIFICATION_KEYBOARD_KEYS = {
  ADD_RECIPIENT: "Enter",
  REMOVE_RECIPIENT: "Backspace",
  SEPARATOR: ",",
} as const;

export const NOTIFICATION_DELIVERY_FIELDS = [
  {
    field: NOTIFICATION_FIELDS.SEND_PUSH,
    channel: NOTIFICATION_DELIVERY_CHANNELS.PUSH,
    label: AppLocales.Admin.Notifications.Labels.Push,
  },
  {
    field: NOTIFICATION_FIELDS.SEND_SOCKET,
    channel: NOTIFICATION_DELIVERY_CHANNELS.SOCKET,
    label: AppLocales.Admin.Notifications.Labels.InApp,
  },
  {
    field: NOTIFICATION_FIELDS.SEND_EMAIL,
    channel: NOTIFICATION_DELIVERY_CHANNELS.EMAIL,
    label: AppLocales.Admin.Notifications.Labels.Email,
  },
] as const;
