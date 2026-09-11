import type { TSortOrder } from "../../../hooks/useSort";
import type { ISubscription, ITransaction } from "../../payment/types";

export interface IAdminPaymentIdentity {
  product_code?: string | null;
  user_name?: string | null;
  username?: string | null;
  user_email?: string | null;
}

export type IAdminTransaction = ITransaction & IAdminPaymentIdentity;
export type IAdminSubscription = ISubscription & IAdminPaymentIdentity;

export interface IAdminTransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  currency?: string;
  product_id?: string;
  user_id?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminSubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  interval?: string;
  product_id?: string;
  user_id?: string;
  cancel_at_period_end?: boolean;
  sort_by?: string;
  sort_order?: TSortOrder;
}
