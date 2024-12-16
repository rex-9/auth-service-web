import AppRoutes from "../AppRoutes";
import { IApiAuthResponse, IApiResponse, IUser } from "../types";
import { api } from "../utils";

class UserService {
  async getCurrentUser(): Promise<
    IApiResponse<IApiAuthResponse<{ user: IUser; token: string }>>
  > {
    const response = await api.get<
      IApiAuthResponse<{ user: IUser; token: string }>
    >(AppRoutes.server.protected.GET_CURRENT_USER);
    return response;
  }

  async uploadImage(file: File): Promise<IApiResponse<{ url: string }>> {
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
