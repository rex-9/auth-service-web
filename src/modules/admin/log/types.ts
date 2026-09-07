// src/modules/admin/log/types.ts
import type { TSortOrder } from "../../../hooks/useSort";
import type {
  TAdminLogSeverity,
  TAdminLogPlatform,
  TAdminLogEnvironment,
} from "./constants";

export interface IAdminLog {
  id: string;
  message: string;
  severity: TAdminLogSeverity | string;
  platform?: TAdminLogPlatform | string | null;
  environment?: TAdminLogEnvironment | string | null;
  app_version?: string | null;
  version_id?: string | null;
  browser?: string | null;
  user_agent?: string | null;
  os?: string | null;
  os_version?: string | null;
  device?: string | null;
  url?: string | null;
  method?: string | null;
  context?: Record<string, unknown> | null;
  stack_trace?: string[] | null;
  local_storage_keys?: string[] | null;
  session_storage_keys?: string[] | null;
  cookies?: Record<string, string> | null;
  occurrence_count: number;
  resolved_at?: string | null;
  resolved_by_id?: string | null;
  resolved_by_name?: string | null;
  last_occurred_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IAdminLogFilters {
  page?: number;
  limit?: number;
  severity?: string;
  platform?: string;
  environment?: string;
  unresolved?: boolean | string;
  resolved?: boolean | string;
  storage_issues?: boolean | string;
  discarded?: boolean | string;
  sort_by?: string;
  sort_order?: TSortOrder;
}
