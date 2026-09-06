// src/modules/notification/notification.service.ts
import AppRoutes from "../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../models";
import { api } from "../../services";
import {
  INotificationListParams,
  IUnreadCountResponse,
  IUserNotification,
} from "./types";

class NotificationService {
  /**
   * Fetch paginated notifications with optional filter (all, unread, read)
   */
  async getNotifications(
    params?: INotificationListParams,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IUserNotification>[]>>
  > {
    return await api.get<IJsonApiResource<IUserNotification>[]>(
      AppRoutes.server.protected.NOTIFICATIONS,
      params,
    );
  }

  /**
   * Fetch total unread count for badge
   */
  async getUnreadCount(): Promise<
    IApiResponse<IApiEnvelope<IUnreadCountResponse>>
  > {
    return await api.get<IUnreadCountResponse>(
      AppRoutes.server.protected.NOTIFICATIONS_UNREAD_COUNT,
    );
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IUserNotification>>>> {
    return await api.put<IJsonApiResource<IUserNotification>>(
      AppRoutes.withId(AppRoutes.server.protected.NOTIFICATION_READ, id),
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<
    IApiResponse<IApiEnvelope<IUnreadCountResponse>>
  > {
    return await api.put<IUnreadCountResponse>(
      AppRoutes.server.protected.NOTIFICATIONS_READ_ALL,
    );
  }

  /**
   * Soft-delete an individual notification
   */
  async deleteNotification(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    return await api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.NOTIFICATION_DELETE, id),
    );
  }
}

export default new NotificationService();
