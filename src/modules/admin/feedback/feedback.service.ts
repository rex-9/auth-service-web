// src/modules/admin/feedback/feedback.service.ts
import { api } from "../../../services/api.service";
import AppRoutes from "../../../AppRoutes";
import type {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import type {
  IAdminFeedback,
  IAdminFeedbackFilters,
  IUpdateFeedbackPayload,
} from "./types";

class FeedbackService {
  async getFeedbacks(
    params?: IAdminFeedbackFilters,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminFeedback>[]>>> {
    return api.get<IJsonApiResource<IAdminFeedback>[]>(
      AppRoutes.server.protected.admin.FEEDBACKS,
      params as Record<string, unknown>,
    );
  }

  async getFeedback(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminFeedback>>>> {
    return api.get<IJsonApiResource<IAdminFeedback>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.FEEDBACK_DETAIL, id),
    );
  }

  async updateFeedback(
    id: string,
    data: IUpdateFeedbackPayload,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminFeedback>>>> {
    return api.put<IJsonApiResource<IAdminFeedback>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.FEEDBACK_DETAIL, id),
      { feedback: data },
    );
  }
}

export default new FeedbackService();
