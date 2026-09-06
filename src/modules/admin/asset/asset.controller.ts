import { Admin } from "..";
import { IApiPagination, IAsset } from "../../../models";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import { ASSET_STATUSES } from "./constants";
import { IAdminAsset, IStorageStats } from "./types";

class AssetController {
  async getAssets(params?: Record<string, string | number>): Promise<{
    success: boolean;
    assets: IAdminAsset[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await Admin.AssetService.getAssets(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAsset>(
        response as any,
      );
      return { success: true, assets: records, pagination };
    }

    return {
      success: false,
      assets: [],
      pagination: null,
      error: getApiError(
        response,
        "Failed to load assets", // Assuming we will add locales later
      ),
    };
  }

  async getAsset(id: string): Promise<{
    success: boolean;
    asset?: IAdminAsset;
    error?: string;
  }> {
    const response = await Admin.AssetService.getAsset(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        asset: parseRecord("asset" in data ? data.asset : data),
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load asset"),
    };
  }

  async getDiscardedAssets(params?: Record<string, string | number>): Promise<{
    success: boolean;
    assets: IAdminAsset[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await Admin.AssetService.getDiscardedAssets(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAsset>(
        response as any,
      );
      return { success: true, assets: records, pagination };
    }

    return {
      success: false,
      assets: [],
      pagination: null,
      error: getApiError(response, "Failed to load discarded assets"),
    };
  }

  async uploadAsset(
    file: File,
    options?: {
      type?: string;
      assetable_type?: string;
      assetable_id?: string;
      folder?: string;
    },
  ): Promise<{
    success: boolean;
    asset?: IAsset;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.uploadAsset(file, options);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        asset: parseRecord("asset" in data ? (data as any).asset : data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to upload asset"),
    };
  }

  async updateAsset(
    id: string,
    values: Partial<
      Pick<IAsset, "name" | "type" | "assetable_type" | "assetable_id">
    >,
  ): Promise<{
    success: boolean;
    asset?: IAdminAsset;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.updateAsset(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        asset: parseRecord("asset" in data ? data.asset : data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to update asset"),
    };
  }

  async discardAsset(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.discardAsset(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to discard asset"),
    };
  }

  async undiscardAsset(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.undiscardAsset(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore asset"),
    };
  }

  async destroyAsset(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.destroyAsset(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to destroy asset"),
    };
  }

  async compressAsset(id: string): Promise<{
    success: boolean;
    asset?: IAdminAsset;
    isOptimal?: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.compressAsset(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const asset = parseRecord("asset" in data ? data.asset : data);
      return {
        success: true,
        asset,
        isOptimal: asset.status === ASSET_STATUSES.OPTIMAL,
        message: status.message,
      };
    }

    const err = getApiError(response, "Failed to compress asset");
    const rawAsset = data ? ("asset" in data ? data.asset : data) : undefined;
    const parsedAsset = rawAsset ? parseRecord(rawAsset) : undefined;
    const isOptimal =
      parsedAsset?.status === ASSET_STATUSES.OPTIMAL ||
      err?.toLowerCase().includes("optimal") ||
      err?.toLowerCase().includes("minimum") ||
      err?.toLowerCase().includes("max");

    return {
      success: false,
      isOptimal,
      asset: parsedAsset,
      error: err,
    };
  }

  async getStorageStats(): Promise<{
    success: boolean;
    stats?: IStorageStats;
    error?: string;
  }> {
    const response = await Admin.AssetService.getStorageStats();
    const { status, data } = response.data || {};

    if (status?.success && data?.stats) {
      return {
        success: true,
        stats: data.stats,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load storage statistics"),
    };
  }

  async emptyRecycleBin(): Promise<{
    success: boolean;
    count?: number;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.emptyRecycleBin();
    const { status, data } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        count: data?.count ?? 0,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to empty recycle bin"),
    };
  }

  async discardBatch(ids: string[]): Promise<{
    success: boolean;
    count?: number;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.discardBatch(ids);
    const { status, data } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        count: data?.count ?? 0,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to discard selected assets"),
    };
  }

  async undiscardBatch(ids: string[]): Promise<{
    success: boolean;
    count?: number;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.undiscardBatch(ids);
    const { status, data } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        count: data?.count ?? 0,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore selected assets"),
    };
  }

  async destroyBatch(ids: string[]): Promise<{
    success: boolean;
    count?: number;
    message?: string;
    error?: string;
  }> {
    const response = await Admin.AssetService.destroyBatch(ids);
    const { status, data } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        count: data?.count ?? 0,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        "Failed to permanently delete selected assets",
      ),
    };
  }
}

export default new AssetController();
