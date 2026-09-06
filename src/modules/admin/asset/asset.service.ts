import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IAsset,
  IAssetUploadResponse,
} from "../../../models";
import { api } from "../../../services";
import type { IAdminAsset, IStorageStats } from "./types";

class AssetService {
  async getAssets(
    params?: Record<string, string | number>,
  ): Promise<IApiResponse<IApiEnvelope<{ assets: IAdminAsset[] }>>> {
    return api.get<{ assets: IAdminAsset[] }>(
      AppRoutes.server.protected.admin.ASSETS,
      params,
    );
  }

  async getAsset(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ asset: IAdminAsset }>>> {
    return api.get<{ asset: IAdminAsset }>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ASSET_DETAIL, id),
    );
  }

  async getDiscardedAssets(
    params?: Record<string, string | number>,
  ): Promise<IApiResponse<IApiEnvelope<{ assets: IAdminAsset[] }>>> {
    return api.get<{ assets: IAdminAsset[] }>(
      AppRoutes.server.protected.admin.DISCARDED_ASSETS,
      params,
    );
  }

  async uploadAsset(
    file: File,
    options?: {
      type?: string;
      assetable_type?: string;
      assetable_id?: string;
      folder?: string;
    },
  ): Promise<IApiResponse<IApiEnvelope<IAssetUploadResponse>>> {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.type) formData.append("type", options.type);
    if (options?.assetable_type)
      formData.append("assetable_type", options.assetable_type);
    if (options?.assetable_id)
      formData.append("assetable_id", options.assetable_id);
    if (options?.folder) formData.append("folder", options.folder);

    return api.post<IAssetUploadResponse>(
      AppRoutes.server.protected.admin.ASSET_UPLOAD,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  }

  async updateAsset(
    id: string,
    data: Partial<
      Pick<IAsset, "name" | "type" | "assetable_type" | "assetable_id">
    >,
  ): Promise<IApiResponse<IApiEnvelope<{ asset: IAdminAsset }>>> {
    return api.put<{ asset: IAdminAsset }>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ASSET_DETAIL, id),
      { asset: data },
    );
  }

  async discardAsset(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ asset: IAdminAsset }>>> {
    return api.post<{ asset: IAdminAsset }>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ASSET_DISCARD, id),
    );
  }

  async undiscardAsset(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ asset: IAdminAsset }>>> {
    return api.post<{ asset: IAdminAsset }>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ASSET_UNDISCARD, id),
    );
  }

  async destroyAsset(id: string): Promise<IApiResponse<IApiEnvelope<void>>> {
    return api.delete<void>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ASSET_DETAIL, id),
    );
  }

  async compressAsset(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ asset: IAdminAsset }>>> {
    return api.post<{ asset: IAdminAsset }>(
      AppRoutes.withId(AppRoutes.server.protected.admin.ASSET_COMPRESS, id),
    );
  }

  async getStorageStats(): Promise<
    IApiResponse<IApiEnvelope<{ stats: IStorageStats }>>
  > {
    return api.get<{ stats: IStorageStats }>(
      AppRoutes.server.protected.admin.ASSET_STORAGE_STATS,
    );
  }

  async emptyRecycleBin(): Promise<
    IApiResponse<IApiEnvelope<{ count: number }>>
  > {
    return api.delete<{ count: number }>(
      AppRoutes.server.protected.admin.ASSET_EMPTY_RECYCLE_BIN,
    );
  }

  async discardBatch(
    ids: string[],
  ): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.post<{ count: number }>(
      AppRoutes.server.protected.admin.ASSETS_BATCH_DISCARD,
      { ids },
    );
  }

  async undiscardBatch(
    ids: string[],
  ): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.post<{ count: number }>(
      AppRoutes.server.protected.admin.ASSETS_BATCH_UNDISCARD,
      { ids },
    );
  }

  async destroyBatch(
    ids: string[],
  ): Promise<IApiResponse<IApiEnvelope<{ count: number }>>> {
    return api.post<{ count: number }>(
      AppRoutes.server.protected.admin.ASSETS_BATCH_DESTROY,
      { ids },
    );
  }
}

export default new AssetService();
