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
}

export default new UserService();
