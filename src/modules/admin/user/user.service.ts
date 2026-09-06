import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
} from "./types";
import { IAdminRole } from "../role";

export type AdminUserResponse =
  | IJsonApiResource<IAdminUser>
  | IAdminUser
  | { user: IAdminUser };

export type AdminUserRoleListResponse =
  | IJsonApiResource<IAdminRole>[]
  | { roles: IJsonApiResource<IAdminRole>[] };

class UserService {
  async getUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.admin.USERS,
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sort_by: params.sort_by,
            sort_order: params.sort_order,
          }
        : undefined,
    );
  }

  async getUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.get<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
    );
  }

  async getDiscardedUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.admin.DISCARDED_USERS,
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sort_by: params.sort_by,
            sort_order: params.sort_order,
          }
        : undefined,
    );
  }

  async createUser(
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(AppRoutes.server.protected.admin.USERS, {
      user: values,
    });
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.put<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
      {
      user: values,
      },
    );
  }

  async discardUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DISCARD, id),
    );
  }

  async undiscardUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_UNDISCARD, id),
    );
  }

  async getRoles(): Promise<
    IApiResponse<IApiEnvelope<AdminUserRoleListResponse>>
  > {
    return api.get<AdminUserRoleListResponse>(
      AppRoutes.server.protected.admin.USER_ROLES,
    );
  }
}

export default new UserService();
