// src/modules/admin/feedback/feedback.controller.ts
import { parsePagyList, getApiError } from "../../../services/api.service";
import type { IApiPagination } from "../../../models";
import type {
  IAdminFeedback,
  IAdminFeedbackFilters,
  IUpdateFeedbackPayload,
} from "./types";
import { Admin } from "..";

class FeedbackController {
  async getFeedbacks(params?: IAdminFeedbackFilters): Promise<{
    success: boolean;
    feedbacks: IAdminFeedback[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await Admin.FeedbackService.getFeedbacks(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePagyList<IAdminFeedback>(response);
      return { success: true, feedbacks: records, pagination };
    }

    return {
      success: false,
      feedbacks: [],
      pagination: null,
      error: getApiError(response, "Failed to load feedback"),
    };
  }

  async getFeedback(id: string): Promise<{
    success: boolean;
    feedback?: IAdminFeedback;
    error?: string;
  }> {
    const response = await Admin.FeedbackService.getFeedback(id);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, feedback: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load feedback details"),
    };
  }

  async updateFeedback(
    id: string,
    data: IUpdateFeedbackPayload,
  ): Promise<{
    success: boolean;
    feedback?: IAdminFeedback;
    error?: string;
  }> {
    const response = await Admin.FeedbackService.updateFeedback(id, data);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, feedback: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to update feedback"),
    };
  }
}

export default new FeedbackController();
