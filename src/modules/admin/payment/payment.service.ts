import AppRoutes from "../../../AppRoutes";
import type {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services/api.service";
import type {
  IAdminSubscription,
  IAdminSubscriptionFilters,
  IAdminTransaction,
  IAdminTransactionFilters,
} from "./types";

class PaymentService {
  getTransactions(
    params?: IAdminTransactionFilters,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminTransaction>[]>>
  > {
    return api.get(
      AppRoutes.server.protected.admin.PAYMENT_TRANSACTIONS,
      params as Record<string, unknown>,
    );
  }

  getTransaction(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminTransaction>>>> {
    return api.get(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_TRANSACTION_DETAIL,
        id,
      ),
    );
  }

  getSubscriptions(
    params?: IAdminSubscriptionFilters,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminSubscription>[]>>
  > {
    return api.get(
      AppRoutes.server.protected.admin.PAYMENT_SUBSCRIPTIONS,
      params as Record<string, unknown>,
    );
  }

  getSubscription(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminSubscription>>>> {
    return api.get(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.PAYMENT_SUBSCRIPTION_DETAIL,
        id,
      ),
    );
  }
}

export default new PaymentService();
