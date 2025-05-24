import AppRoutes from "../AppRoutes";
import { ApiAuthResponse, ApiGeneralResponse } from "../models";
import api from "./api.service";

class UserService {
  async getCurrentUser(): Promise<ApiGeneralResponse<ApiAuthResponse>> {
    const response = await api.get<ApiAuthResponse>(
      AppRoutes.server.protected.GET_CURRENT_USER
    );
    return response;
  }

  async uploadImage(file: File): Promise<ApiGeneralResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ url: string }>(
      AppRoutes.server.protected.UPLOAD_ASSET,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
}

export default new UserService();
