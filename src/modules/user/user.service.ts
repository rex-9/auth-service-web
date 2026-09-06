// src/modules/user/user.service.ts

import AppRoutes from "../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IUser,
  IAssetUploadResponse,
  IAssetUploadOptions,
} from "../../models";
import { api } from "../../services";

class UserService {
  async peekUser(email: string): Promise<
    IApiResponse<
      IApiEnvelope<{
        user_exists: boolean;
        confirmed: boolean;
      }>
    >
  > {
    return api.get<{
      user_exists: boolean;
      confirmed: boolean;
    }>(AppRoutes.server.public.PEEK_USER, { email });
  }

  async getCurrentUser(): Promise<
    IApiResponse<IApiEnvelope<{ user: IUser; token: string }>>
  > {
    return await api.get<{ user: IUser; token: string }>(
      AppRoutes.server.protected.CURRENT_USER,
    );
  }

  async uploadImage(
    file: File,
    options?: IAssetUploadOptions,
  ): Promise<IApiResponse<IApiEnvelope<IAssetUploadResponse>>> {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.type) formData.append("type", options.type);
    if (options?.assetable_type)
      formData.append("assetable_type", options.assetable_type);
    if (options?.assetable_id)
      formData.append("assetable_id", options.assetable_id);
    if (options?.duration_secs !== undefined)
      formData.append("duration_secs", String(options.duration_secs));
    if (options?.folder) formData.append("folder", options.folder);

    const response = await api.post<IAssetUploadResponse>(
      AppRoutes.server.protected.UPLOAD_ASSET,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  }
}

export default new UserService();
