// src/modules/notification/notification.controller.ts

import NotificationService from "./notification.service";
import { INotificationListParams, IUserNotification } from "./types";
import {
  parsePaginatedResponse,
  parseRecord,
} from "../../services/api.service";

export class NotificationController {
  /**
   * Fetch paginated notifications
   */
  static async getNotifications(params?: INotificationListParams) {
    const response = await NotificationService.getNotifications(params);
    return parsePaginatedResponse<IUserNotification>(response);
  }

  /**
   * Fetch total unread count for badge
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await NotificationService.getUnreadCount();
      if (response.data?.status?.success && response.data?.data) {
        return response.data.data.unread_count ?? 0;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(id: string): Promise<IUserNotification> {
    const response = await NotificationService.markAsRead(id);
    if (!response.data?.status?.success || !response.data?.data) {
      throw new Error(
        response.data?.status?.error ||
          response.data?.status?.message ||
          "Failed to mark notification as read",
      );
    }
    return parseRecord<IUserNotification>(response.data.data);
  }

  /**
   * Mark all unread notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    const response = await NotificationService.markAllAsRead();
    if (!response.data?.status?.success) {
      throw new Error(
        response.data?.status?.error ||
          response.data?.status?.message ||
          "Failed to mark all as read",
      );
    }
  }

  /**
   * Delete an individual notification
   */
  static async deleteNotification(id: string): Promise<void> {
    const response = await NotificationService.deleteNotification(id);
    if (!response.data?.status?.success) {
      throw new Error(
        response.data?.status?.error ||
          response.data?.status?.message ||
          "Failed to delete notification",
      );
    }
  }
}

export default NotificationController;
