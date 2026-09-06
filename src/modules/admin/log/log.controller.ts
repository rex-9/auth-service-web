import AdminLogService from "./log.service";
import { parsePagyList, getApiError } from "../../../services/api.service";
import type { IApiPagination } from "../../../models";
import type { IAdminLog, IAdminLogFilters } from "./types";

class AdminLogController {
  async getLogs(params?: IAdminLogFilters): Promise<{
    success: boolean;
    logs: IAdminLog[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await AdminLogService.getLogs(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePagyList<IAdminLog>(response);
      return { success: true, logs: records, pagination };
    }

    return {
      success: false,
      logs: [],
      pagination: null,
      error: getApiError(response, "Failed to load telemetry logs"),
    };
  }

  async getLog(id: string): Promise<{
    success: boolean;
    log?: IAdminLog;
    error?: string;
  }> {
    const response = await AdminLogService.getLog(id);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, log: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load log details"),
    };
  }

  async resolveLog(id: string): Promise<{
    success: boolean;
    log?: IAdminLog;
    error?: string;
  }> {
    const response = await AdminLogService.resolveLog(id);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, log: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to resolve log"),
    };
  }

  async unresolveLog(id: string): Promise<{
    success: boolean;
    log?: IAdminLog;
    error?: string;
  }> {
    const response = await AdminLogService.unresolveLog(id);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, log: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to unresolve log"),
    };
  }

  async discardLog(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await AdminLogService.discardLog(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to discard log"),
    };
  }

  async undiscardLog(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await AdminLogService.undiscardLog(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore log"),
    };
  }

  async deleteLog(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await AdminLogService.deleteLog(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to destroy log"),
    };
  }
}

export default new AdminLogController();
