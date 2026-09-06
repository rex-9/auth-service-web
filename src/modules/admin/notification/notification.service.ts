// src/modules/admin/notification/notification.service.ts

import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import {
  IAdminNotificationDelivery,
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
  IAdminNotificationTemplateFormValues,
  IAdminTemplateListParams,
} from "./types";
import {
  NOTIFICATION_AUDIENCE_TYPES,
  NOTIFICATION_DELIVERY_CHANNELS,
} from "./constants";
import type { NotificationDeliveryChannel } from "./constants";

class NotificationService {
  async getTemplates(
    params?: IAdminTemplateListParams,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminNotificationTemplate>[]>>
  > {
    return api.get<IJsonApiResource<IAdminNotificationTemplate>[]>(
      AppRoutes.server.protected.admin.NOTIFICATIONS,
      params,
    );
  }

  async getTemplate(
    id: string,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminNotificationTemplate>>>
  > {
    return api.get<IJsonApiResource<IAdminNotificationTemplate>>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.NOTIFICATION_DETAIL,
        id,
      ),
    );
  }

  async createTemplate(
    values: IAdminNotificationTemplateFormValues,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminNotificationTemplate>>>
  > {
    return api.post<IJsonApiResource<IAdminNotificationTemplate>>(
      AppRoutes.server.protected.admin.NOTIFICATIONS,
      { notification: values },
    );
  }

  async updateTemplate(
    id: string,
    values: Partial<IAdminNotificationTemplateFormValues>,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminNotificationTemplate>>>
  > {
    return api.put<IJsonApiResource<IAdminNotificationTemplate>>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.NOTIFICATION_DETAIL,
        id,
      ),
      { notification: values },
    );
  }

  async discardTemplate(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.NOTIFICATION_DETAIL,
        id,
      ),
    );
  }

  async undiscardTemplate(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.post<null>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.NOTIFICATION_UNDISCARD,
        id,
      ),
    );
  }

  async createNotification(
    values: IAdminNotificationFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminNotificationDelivery>>> {
    const channels = [
      values.send_socket ? NOTIFICATION_DELIVERY_CHANNELS.SOCKET : null,
      values.send_push ? NOTIFICATION_DELIVERY_CHANNELS.PUSH : null,
      values.send_email ? NOTIFICATION_DELIVERY_CHANNELS.EMAIL : null,
    ].filter(
      (channel): channel is NotificationDeliveryChannel => Boolean(channel),
    );

    return api.post<IAdminNotificationDelivery>(
      AppRoutes.server.protected.admin.NOTIFICATION_DISPATCH,
      {
        audience: this.buildAudience(values),
        channels,
        event: values.event,
      },
    );
  }

  private buildAudience(values: IAdminNotificationFormValues) {
    if (values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ALL) {
      return { type: NOTIFICATION_AUDIENCE_TYPES.ALL };
    }

    if (values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES) {
      return { type: NOTIFICATION_AUDIENCE_TYPES.ROLES, role_ids: values.role_ids };
    }

    return { type: NOTIFICATION_AUDIENCE_TYPES.USERS, user_ids: values.user_ids };
  }
}

export default new NotificationService();
