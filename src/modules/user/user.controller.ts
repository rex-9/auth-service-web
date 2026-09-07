import UserService from "./user.service";
import { USER_PEEK_STATUS, type TUserPeekStatus } from "./constants";
import {
  IApiEnvelope,
  IApiResponse,
  IUser,
  IAssetUploadResponse,
  IAssetUploadOptions,
} from "../../models";
import { AppLocales, translate } from "../../locales";
import { getApiError } from "../../services/api.service";
import type { ICurrentUserUpdateValues } from "./types";

class UserController {
  async peekUser(email: string): Promise<TUserPeekStatus> {
    const response = await UserService.peekUser(email);
    const { status } = response.data || {};
    if (
      status?.code === 403 &&
      response.data?.status?.error ===
        translate(AppLocales.Auth.Initial.AccountDiscarded)
    ) {
      return USER_PEEK_STATUS.DISCARDED;
    }

    if (response.error || !response.data?.data) {
      console.error("Error peeking user:", response.error);
      throw new Error(translate(response.error || AppLocales.Auth.Initial.UserCheckFailed));
    }

    const { user_exists, confirmed } = response.data.data;

    if (!user_exists) {
      return USER_PEEK_STATUS.NOT_EXISTS;
    }

    return confirmed
      ? USER_PEEK_STATUS.EXISTS_CONFIRMED
      : USER_PEEK_STATUS.EXISTS_UNCONFIRMED;
  }

  async getCurrentUser(): Promise<IUser | null> {
    const response = await UserService.getCurrentUser();
    return response.data?.data?.user || null;
  }

  async updateCurrentUser(values: ICurrentUserUpdateValues): Promise<{
    success: boolean;
    user?: IUser;
    message?: string;
    error?: string;
  }> {
    const response = await UserService.updateCurrentUser(values);
    const { status, data } = response.data || {};

    if (status?.success && data?.user) {
      return {
        success: true,
        user: data.user,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.User.Errors.Update),
      ),
    };
  }

  async uploadImage(
    file: File,
    options?: IAssetUploadOptions,
  ): Promise<IAssetUploadResponse | null> {
    const response: IApiResponse<IApiEnvelope<IAssetUploadResponse>> =
      await UserService.uploadImage(file, options);
    return response.data?.data || null;
  }
}

export default new UserController();
