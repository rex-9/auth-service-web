import { IApiPagination } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import VersionService from "./version.service";
import type {
  IAdminUserVersion,
  IAdminUserVersionListParams,
  IAdminVersion,
  IAdminVersionFormValues,
  IAdminVersionListParams,
} from "./types";

class VersionController {
  async getVersions(params?: IAdminVersionListParams): Promise<{
    success: boolean;
    versions: IAdminVersion[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await VersionService.getVersions(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminVersion>(response);
      return { success: true, versions: records, pagination };
    }

    return {
      success: false,
      versions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.LoadList),
      ),
    };
  }

  async getVersion(id: string): Promise<{
    success: boolean;
    version?: IAdminVersion;
    error?: string;
  }> {
    const response = await VersionService.getVersion(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        version: parseRecord<IAdminVersion>(data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.LoadOne),
      ),
    };
  }

  async getDiscardedVersions(params?: IAdminVersionListParams): Promise<{
    success: boolean;
    versions: IAdminVersion[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await VersionService.getDiscardedVersions(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminVersion>(response);
      return { success: true, versions: records, pagination };
    }

    return {
      success: false,
      versions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.LoadList),
      ),
    };
  }

  async createVersion(values: IAdminVersionFormValues): Promise<{
    success: boolean;
    version?: IAdminVersion;
    message?: string;
    error?: string;
  }> {
    const response = await VersionService.createVersion(values);
    const { status, data } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        version: data ? parseRecord<IAdminVersion>(data) : undefined,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.Create),
      ),
    };
  }

  async updateVersion(
    id: string,
    values: Partial<IAdminVersionFormValues>,
  ): Promise<{
    success: boolean;
    version?: IAdminVersion;
    message?: string;
    error?: string;
  }> {
    const response = await VersionService.updateVersion(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        version: parseRecord<IAdminVersion>(data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.Update),
      ),
    };
  }

  async discardVersion(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await VersionService.discardVersion(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true, message: status.message };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.Discard),
      ),
    };
  }

  async undiscardVersion(id: string): Promise<{
    success: boolean;
    version?: IAdminVersion;
    message?: string;
    error?: string;
  }> {
    const response = await VersionService.undiscardVersion(id);
    const { status, data } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        version: data ? parseRecord<IAdminVersion>(data) : undefined,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Versions.Errors.Restore),
      ),
    };
  }

  async getUserVersions(params?: IAdminUserVersionListParams): Promise<{
    success: boolean;
    userVersions: IAdminUserVersion[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await VersionService.getUserVersions(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminUserVersion>(response);
      return { success: true, userVersions: records, pagination };
    }

    return {
      success: false,
      userVersions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.UserVersions.Errors.LoadList),
      ),
    };
  }

  async getUserVersionByVersion(
    versionId: string,
    params?: IAdminUserVersionListParams,
  ): Promise<{
    success: boolean;
    userVersions: IAdminUserVersion[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await VersionService.getUserVersionByVersion(
      versionId,
      params,
    );
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminUserVersion>(response);
      return { success: true, userVersions: records, pagination };
    }

    return {
      success: false,
      userVersions: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.UserVersions.Errors.LoadList),
      ),
    };
  }
}

export default new VersionController();
