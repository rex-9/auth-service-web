// src/modules/notification/types.ts

import { TNotificationFilter } from "./constants";

export type NotificationFilter = TNotificationFilter;

export interface IUserNotification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  data: Record<string, unknown>;
  read: boolean;
  read_at: string | null;
  notification_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface INotificationListParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  filter?: NotificationFilter;
}

export interface IUnreadCountResponse {
  unread_count: number;
}
