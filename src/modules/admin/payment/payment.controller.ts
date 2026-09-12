import type { IApiPagination } from "../../../models";
import { getApiError, parsePagyList } from "../../../services/api.service";
import PaymentService from "./payment.service";
import type {
  IAdminSubscription,
  IAdminSubscriptionFilters,
  IAdminTransaction,
  IAdminTransactionFilters,
} from "./types";

class PaymentController {
  async getTransactions(params?: IAdminTransactionFilters) {
    const response = await PaymentService.getTransactions(params);
    if (response.data?.status?.success) {
      const { records, pagination } =
        parsePagyList<IAdminTransaction>(response);
      return { success: true as const, transactions: records, pagination };
    }
    return {
      success: false as const,
      transactions: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load transactions"),
    };
  }

  async getTransaction(id: string) {
    const response = await PaymentService.getTransaction(id);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, transaction: body.attributes }
      : {
          success: false as const,
          error: getApiError(response, "Failed to load transaction"),
        };
  }

  async getSubscriptions(params?: IAdminSubscriptionFilters) {
    const response = await PaymentService.getSubscriptions(params);
    if (response.data?.status?.success) {
      const { records, pagination } =
        parsePagyList<IAdminSubscription>(response);
      return { success: true as const, subscriptions: records, pagination };
    }
    return {
      success: false as const,
      subscriptions: [],
      pagination: null as IApiPagination | null,
      error: getApiError(response, "Failed to load subscriptions"),
    };
  }

  async getSubscription(id: string) {
    const response = await PaymentService.getSubscription(id);
    const body = response.data?.data;
    return response.data?.status?.success && body
      ? { success: true as const, subscription: body.attributes }
      : {
          success: false as const,
          error: getApiError(response, "Failed to load subscription"),
        };
  }
}

export default new PaymentController();
