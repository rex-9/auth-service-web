import type { TSortOrder } from "../../../hooks/useSort";
import type { TAdminAccessStatus } from "./constants";

export interface IAdminAccess {
  id: string;
  status: TAdminAccessStatus | string;
  granted_at: string | null;
  expires_at: string | null;
  revoked_at?: string | null;
  expired_at?: string | null;
  product_id: string;
  product_code?: string | null;
  product_name?: string | null;
  user_id?: string;
  user_email?: string | null;
  username?: string | null;
  user_name?: string | null;
  remaining_days?: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IGrantAccessPayload {
  code?: string;
  product_id?: string;
  emails?: string[];
  usernames?: string[];
  user_id?: string;
  days?: number | null;
  expires_at?: string | null;
}

export interface IExtendAccessPayload {
  days?: number | null;
  expires_at?: string | null;
  status?: string;
}

export interface IAdminAccessFilters {
  page?: number;
  limit?: number;
  status?: string;
  product_id?: string;
  user_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}
