import { parsePagyList, getApiError } from "../../../services/api.service";
import type { IApiPagination } from "../../../models";
import type {
  IAdminAccess,
  IAdminAccessFilters,
  IGrantAccessPayload,
  IExtendAccessPayload,
} from "./types";
import { Admin } from "..";

class AccessController {
  async getAccesses(params?: IAdminAccessFilters): Promise<{
    success: boolean;
    accesses: IAdminAccess[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await Admin.AccessService.getAccesses(params);
    const { status } = response.data || {};

    if (status?.success) {
      const { records, pagination } = parsePagyList<IAdminAccess>(response);
      return { success: true, accesses: records, pagination };
    }

    return {
      success: false,
      accesses: [],
      pagination: null,
      error: getApiError(response, "Failed to load entitlements"),
    };
  }

  async getAccess(id: string): Promise<{
    success: boolean;
    access?: IAdminAccess;
    error?: string;
  }> {
    const response = await Admin.AccessService.getAccess(id);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, access: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load entitlement"),
    };
  }

  async grantAccess(data: IGrantAccessPayload): Promise<{
    success: boolean;
    accesses: IAdminAccess[];
    error?: string;
  }> {
    const response = await Admin.AccessService.grantAccess(data);
    const { status, data: body } = response.data || {};

    if (status?.success && Array.isArray(body)) {
      return {
        success: true,
        accesses: body.map((item) => item.attributes),
      };
    }

    return {
      success: false,
      accesses: [],
      error: getApiError(response, "Failed to grant entitlement"),
    };
  }

  async extendAccess(
    id: string,
    data: IExtendAccessPayload,
  ): Promise<{
    success: boolean;
    access?: IAdminAccess;
    error?: string;
  }> {
    const response = await Admin.AccessService.extendAccess(id, data);
    const { status, data: body } = response.data || {};

    if (status?.success && body) {
      return { success: true, access: body.attributes };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to update entitlement"),
    };
  }

  async revokeAccess(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await Admin.AccessService.revokeAccess(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to revoke entitlement"),
    };
  }
}

export default new AccessController();
