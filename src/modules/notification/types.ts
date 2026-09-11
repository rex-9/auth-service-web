// src/modules/notification/types.ts

import {
  TAsyncOperationStatus,
  TAsyncOperationType,
  TNotificationFilter,
} from "./constants";

export type NotificationFilter = TNotificationFilter;

export interface IUserNotification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  data: INotificationData;
  operation_id?: string | null;
  operation_type?: TAsyncOperationType | null;
  operation_status?: TAsyncOperationStatus | null;
  read: boolean;
  read_at: string | null;
  notification_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface INotificationData extends Record<string, unknown> {
  type?: string;
  operation_id?: string;
  operation_type?: TAsyncOperationType;
  operation_status?: TAsyncOperationStatus;
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
