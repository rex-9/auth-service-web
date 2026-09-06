import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import {
  IAdminPermission,
  IAdminPermissionListParams,
  IAdminRole,
  IAdminRoleFormValues,
  IAdminRoleListParams,
} from "./types";

type AdminRoleResponse = IJsonApiResource<IAdminRole> | IAdminRole | { role: IAdminRole };
type AdminRoleListResponse = IJsonApiResource<IAdminRole>[];
type AdminPermissionListResponse = IJsonApiResource<IAdminPermission>[];

class RoleService {
  async getRoles(
    params?: IAdminRoleListParams,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleListResponse>>> {
    return api.get<AdminRoleListResponse>(
      AppRoutes.server.protected.admin.IAM_ROLES,
      params as Record<string, unknown>,
    );
  }

  async getRole(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.get<AdminRoleResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
    );
  }

  async getPermissions(
    params?: IAdminPermissionListParams,
  ): Promise<IApiResponse<IApiEnvelope<AdminPermissionListResponse>>> {
    return api.get<AdminPermissionListResponse>(
      AppRoutes.server.protected.admin.IAM_ROLE_PERMISSIONS,
      (params ?? {}) as Record<string, unknown>,
    );
  }

  async createRole(
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.post<AdminRoleResponse>(
      AppRoutes.server.protected.admin.IAM_ROLES,
      values,
    );
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.put<AdminRoleResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
      values,
    );
  }

  async discardRole(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.post<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DISCARD, id),
    );
  }

  async undiscardRole(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.post<AdminRoleResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_UNDISCARD, id),
    );
  }
}

export default new RoleService();
