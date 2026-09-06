import { AppLocales, translate } from "../../../locales";
import { IApiPagination } from "../../../models";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import UserService from "./user.service";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
} from "./";
import { IAdminRole } from "../role";

class UserController {
  async getUsers(params?: IAdminUserListParams): Promise<{
    success: boolean;
    users: IAdminUser[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await UserService.getUsers(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminUser>(response);
      return { success: true, users: records, pagination };
    }

    return {
      success: false,
      users: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.LoadListFailed),
      ),
    };
  }

  async getUser(id: string): Promise<{
    success: boolean;
    user?: IAdminUser;
    error?: string;
  }> {
    const response = await UserService.getUser(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        user: parseRecord("user" in data ? data.user : data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.LoadOneFailed),
      ),
    };
  }

  async getDiscardedUsers(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    users: IAdminUser[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await UserService.getDiscardedUsers(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminUser>(response);
      return { success: true, users: records, pagination };
    }

    return {
      success: false,
      users: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.LoadListFailed),
      ),
    };
  }

  async createUser(values: IAdminUserFormValues): Promise<{
    success: boolean;
    user?: IAdminUser;
    message?: string;
    error?: string;
  }> {
    const response = await UserService.createUser(values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        user: parseRecord("user" in data ? data.user : data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.CreateFailed),
      ),
    };
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<{
    success: boolean;
    user?: IAdminUser;
    message?: string;
    error?: string;
  }> {
    const response = await UserService.updateUser(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        user: parseRecord("user" in data ? data.user : data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.UpdateFailed),
      ),
    };
  }

  async discardUser(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await UserService.discardUser(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.DeleteFailed),
      ),
    };
  }

  async undiscardUser(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await UserService.undiscardUser(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.UpdateFailed),
      ),
    };
  }

  async getRoles(): Promise<{
    success: boolean;
    roles: IAdminRole[];
    error?: string;
  }> {
    const response = await UserService.getRoles();
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const roles = Array.isArray(data) ? data : data.roles;
      return {
        success: true,
        roles: roles.map(parseRecord),
      };
    }

    return {
      success: false,
      roles: [],
      error: getApiError(
        response,
        translate(AppLocales.Admin.Users.Errors.LoadRolesFailed),
      ),
    };
  }
}

export default new UserController();
