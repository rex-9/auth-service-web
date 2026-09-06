// src/modules/admin/accesses/accesses.service.ts
import { api } from "../../../services/api.service";
import AppRoutes from "../../../AppRoutes";
import type {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import type {
  IAdminAccess,
  IAdminAccessFilters,
  IGrantAccessPayload,
  IExtendAccessPayload,
} from "./types";

class AdminAccessService {
  async getAccesses(
    params?: IAdminAccessFilters,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAccess>[]>>> {
    return api.get<IJsonApiResource<IAdminAccess>[]>(
      AppRoutes.server.protected.admin.ACCESSES,
      params as Record<string, unknown>,
    );
  }

  async getAccess(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAccess>>>> {
    return api.get<IJsonApiResource<IAdminAccess>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ACCESS_DETAIL, id),
    );
  }

  async grantAccess(
    data: IGrantAccessPayload,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAccess>>>> {
    return api.post<IJsonApiResource<IAdminAccess>>(
      AppRoutes.server.protected.admin.ACCESSES,
      { access: data },
    );
  }

  async extendAccess(
    id: string,
    data: IExtendAccessPayload,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAccess>>>> {
    return api.put<IJsonApiResource<IAdminAccess>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ACCESS_DETAIL, id),
      { access: data },
    );
  }

  async revokeAccess(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<Record<string, unknown>>>> {
    return api.delete<Record<string, unknown>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ACCESS_DETAIL, id),
    );
  }
}

export default new AdminAccessService();
