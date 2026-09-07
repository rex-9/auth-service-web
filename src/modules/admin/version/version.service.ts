import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import type {
  IAdminUserVersion,
  IAdminUserVersionListParams,
  IAdminVersion,
  IAdminVersionFormValues,
  IAdminVersionListParams,
} from "./types";

class VersionService {
  async getVersions(
    params?: IAdminVersionListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminVersion>[]>>> {
    return api.get<IJsonApiResource<IAdminVersion>[]>(
      AppRoutes.server.protected.admin.APP_VERSIONS,
      params as Record<string, unknown> | undefined,
    );
  }

  async getVersion(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IAdminVersion>>> {
    return api.get<IAdminVersion>(
      AppRoutes.withId(AppRoutes.server.protected.admin.APP_VERSION_DETAIL, id),
    );
  }

  async getDiscardedVersions(
    params?: IAdminVersionListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminVersion>[]>>> {
    return api.get<IJsonApiResource<IAdminVersion>[]>(
      AppRoutes.server.protected.admin.DISCARDED_APP_VERSIONS,
      params as Record<string, unknown> | undefined,
    );
  }

  async createVersion(
    values: IAdminVersionFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminVersion>>> {
    return api.post<IAdminVersion>(
      AppRoutes.server.protected.admin.APP_VERSIONS,
      { version: values },
    );
  }

  async updateVersion(
    id: string,
    values: Partial<IAdminVersionFormValues>,
  ): Promise<IApiResponse<IApiEnvelope<IAdminVersion>>> {
    return api.put<IAdminVersion>(
      AppRoutes.withId(AppRoutes.server.protected.admin.APP_VERSION_DETAIL, id),
      { version: values },
    );
  }

  async discardVersion(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.post<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.APP_VERSION_DISCARD, id),
    );
  }

  async undiscardVersion(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IAdminVersion>>> {
    return api.post<IAdminVersion>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.APP_VERSION_UNDISCARD,
        id,
      ),
    );
  }

  async getUserVersions(
    params?: IAdminUserVersionListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUserVersion>[]>>> {
    return api.get<IJsonApiResource<IAdminUserVersion>[]>(
      AppRoutes.server.protected.admin.APP_INSTALLS,
      params as Record<string, unknown> | undefined,
    );
  }

  async getUserVersionByVersion(
    versionId: string,
    params?: IAdminUserVersionListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUserVersion>[]>>> {
    return api.get<IJsonApiResource<IAdminUserVersion>[]>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.APP_VERSION_INSTALLS,
        versionId,
      ),
      params as Record<string, unknown> | undefined,
    );
  }
}

export default new VersionService();
