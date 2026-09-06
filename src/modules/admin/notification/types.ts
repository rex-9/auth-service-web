import type {
  NotificationAudienceType,
  NotificationDeliveryChannel,
  NotificationEventCategory,
} from "./constants";

export interface IAdminNotificationFormValues {
  event: string;
  audience_type: NotificationAudienceType;
  user_ids: string[];
  role_ids: string[];
  send_push: boolean;
  send_socket: boolean;
  send_email: boolean;
}

export interface IAdminNotificationTemplate {
  id?: string;
  event: string;
  name: string;
  label?: string;
  description?: string | null;
  category: NotificationEventCategory | string;
  link?: string | null;
  admin?: boolean;
  unavailable_reason?: string;
  in_app_title?: string | null;
  in_app_body?: string | null;
  in_app_data?: Record<string, unknown>;
  push_title?: string | null;
  push_body?: string | null;
  push_template_id?: string | null;
  email_subject?: string | null;
  email_body?: string | null;
  email_template_id?: string | null;
  sent_count?: number;
  read_count?: number;
  discarded_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IAdminNotificationTemplateFormValues {
  event: string;
  name: string;
  description?: string;
  category: string;
  link?: string;
  admin: boolean;
  in_app_title?: string;
  in_app_body?: string;
  in_app_data?: Record<string, unknown>;
  push_title?: string;
  push_body?: string;
  push_template_id?: string;
  email_subject?: string;
  email_body?: string;
  email_template_id?: string;
}

export interface IAdminTemplateListParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface IAdminNotificationDelivery {
  job_id: string;
  audience: NotificationAudienceType;
  recipient_count: number;
  channels: NotificationDeliveryChannel[];
}
