import type { TSortOrder } from "../../../hooks/useSort";
import { VERSION_PLATFORMS, VERSION_STATUSES } from "./constants";

export type AdminVersionStatus =
  (typeof VERSION_STATUSES)[keyof typeof VERSION_STATUSES];

export type AdminUserVersionPlatform =
  (typeof VERSION_PLATFORMS)[keyof typeof VERSION_PLATFORMS];

export interface IAdminVersion {
  id: string;
  number: string;
  title: string;
  description?: string | null;
  status: AdminVersionStatus | string;
  is_force_update: boolean;
  released_at?: Date | string | null;
  ios_build_number?: number | null;
  android_build_number?: number | null;
  created_at?: Date | string;
  updated_at?: Date | string;
  discarded_at?: Date | string | null;
  undiscarded_at?: Date | string | null;
  install_count?: number;
}

export interface IAdminVersionFormValues {
  number: string;
  title: string;
  description: string;
  status: AdminVersionStatus;
  is_force_update: boolean;
  ios_build_number: number | null;
  android_build_number: number | null;
}

export interface IAdminVersionListParams {
  page?: number;
  limit?: number;
  status?: AdminVersionStatus | string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminUserVersion {
  id: string;
  user_id: string;
  user_email?: string | null;
  platform: AdminUserVersionPlatform | string;
  number: string;
  build_number?: number | null;
  last_seen_at?: Date | string | null;
  version_id: string;
  created_at?: Date | string;
}

export interface IAdminUserVersionListParams {
  page?: number;
  limit?: number;
  platform?: AdminUserVersionPlatform | string;
  sort_by?: string;
  sort_order?: TSortOrder;
}
