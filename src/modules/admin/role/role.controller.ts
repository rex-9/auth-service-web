import { getApiError, parsePagyList, parseRecord } from "../../../services/api.service";
import { AppLocales, translate } from "../../../locales";
import RoleService from "./role.service";
import type { IApiPagination, IJsonApiResource } from "../../../models";
import {
  IAdminPermission,
  IAdminPermissionListParams,
  IAdminRole,
  IAdminRoleFormValues,
  IAdminRoleListParams,
} from "./types";

class RoleController {
  async getRoles(params?: IAdminRoleListParams): Promise<{
    success: boolean;
    roles: IAdminRole[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await RoleService.getRoles(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminRole>(response);
      return { success: true, roles: records, pagination };
    }

    return {
      success: false,
      roles: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Roles.Errors.LoadList),
      ),
    };
  }

  async getRole(id: string): Promise<{
    success: boolean;
    role?: IAdminRole;
    error?: string;
  }> {
    const response = await RoleService.getRole(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const raw = "role" in data ? data.role : data;
      return {
        success: true,
        role: parseRecord<IAdminRole>(raw as IJsonApiResource<IAdminRole>),
      };
    }

    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Admin.Roles.Errors.LoadOne)),
    };
  }

  async getPermissions(params?: IAdminPermissionListParams): Promise<{
    success: boolean;
    permissions: IAdminPermission[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await RoleService.getPermissions(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminPermission>(response);
      return { success: true, permissions: records, pagination };
    }

    return {
      success: false,
      permissions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Roles.Errors.LoadPermissions),
      ),
    };
  }

  async createRole(values: IAdminRoleFormValues): Promise<{
    success: boolean;
    role?: IAdminRole;
    error?: string;
  }> {
    const response = await RoleService.createRole(values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const raw = "role" in data ? data.role : data;
      return {
        success: true,
        role: parseRecord<IAdminRole>(raw as IJsonApiResource<IAdminRole>),
      };
    }

    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Admin.Roles.Errors.Create)),
    };
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
  ): Promise<{
    success: boolean;
    role?: IAdminRole;
    error?: string;
  }> {
    const response = await RoleService.updateRole(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const raw = "role" in data ? data.role : data;
      return {
        success: true,
        role: parseRecord<IAdminRole>(raw as IJsonApiResource<IAdminRole>),
      };
    }

    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Admin.Roles.Errors.Update)),
    };
  }

  async discardRole(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await RoleService.discardRole(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Admin.Roles.Errors.Delete)),
    };
  }

  async undiscardRole(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await RoleService.undiscardRole(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore role"),
    };
  }
}

export default new RoleController();
