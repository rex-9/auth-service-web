import type { TSortOrder } from "../../../hooks/useSort";

export type AdminAction = string;

export type AdminResource = string;

export interface IPermission {
  action: AdminAction;
  resource: AdminResource;
}

export interface IAdminPermission {
  id: string;
  name: string;
  action: string;
  resource: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IAdminPermissionListParams {
  page?: number;
  limit?: number;
}

export interface IAdminRoleListParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: TSortOrder;
  discarded?: boolean | string;
}

export interface IAdminRole {
  id: string;
  name: string;
  description?: string;
  system?: boolean;
  permission_ids?: string[];
  permissions?: Record<string, string[]>;
  user_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IAdminRoleFormValues {
  name: string;
  description?: string;
  permission_ids: string[];
}
