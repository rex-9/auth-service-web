// src/modules/admin/feedback/types.ts
import {
  ADMIN_FEEDBACK_CATEGORY,
  ADMIN_FEEDBACK_PRIORITY,
  ADMIN_FEEDBACK_STATUS,
} from "./constants";
import type { TSortOrder } from "../../../hooks/useSort";

export type AdminFeedbackCategory =
  (typeof ADMIN_FEEDBACK_CATEGORY)[keyof typeof ADMIN_FEEDBACK_CATEGORY];
export type AdminFeedbackPriority =
  (typeof ADMIN_FEEDBACK_PRIORITY)[keyof typeof ADMIN_FEEDBACK_PRIORITY];
export type AdminFeedbackStatus =
  (typeof ADMIN_FEEDBACK_STATUS)[keyof typeof ADMIN_FEEDBACK_STATUS];

export interface IAdminFeedback {
  id: string;
  content: string;
  rating?: number | null;
  category: AdminFeedbackCategory | string;
  priority: AdminFeedbackPriority | string;
  status: AdminFeedbackStatus | string;
  platform?: string | null;
  version_id?: string | null;
  version_code?: string | null;
  app_version?: string | null;
  os?: string | null;
  device?: string | null;
  browser?: string | null;
  page?: string | null;
  metadata?: Record<string, unknown> | null;
  admin_notes?: string | null;
  user_id?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IUpdateFeedbackPayload {
  status?: string;
  category?: string;
  priority?: string;
  admin_notes?: string;
}

export interface IAdminFeedbackFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  platform?: string;
  user_id?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}
