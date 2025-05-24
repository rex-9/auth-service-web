import AppRoutes from "../AppRoutes";
import api from "./api.service";
import { AuthApiResponse, GeneralApiResponse } from "../models";

class AuthService {
  async signInWithEmailOrUsername(
    loginKey: string,
    password: string
  ): Promise<GeneralApiResponse<AuthApiResponse>> {
    const response = await api.post<AuthApiResponse>(
      AppRoutes.server.public.SIGN_IN_EMAIL,
      {
        user: { login_key: loginKey, password },
      }
    );
    return response;
  }

  async signInWithToken(
    token: string
  ): Promise<GeneralApiResponse<AuthApiResponse>> {
    const response = await api.post<AuthApiResponse>(
      AppRoutes.server.public.SIGN_IN_TOKEN,
      { token }
    );
    return response;
  }

  async signInWithGoogle(
    token: string
  ): Promise<GeneralApiResponse<AuthApiResponse>> {
    const response = await api.post<AuthApiResponse>(
      AppRoutes.server.public.SIGN_IN_GOOGLE,
      { token }
    );
    return response;
  }

  async signUpWithEmail(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<GeneralApiResponse<undefined>> {
    const response = await api.post<undefined>(
      AppRoutes.server.public.SIGN_UP,
      {
        user: {
          username,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      }
    );
    return response;
  }

  async confirmEmailWithCode(
    emailOrUsername: string,
    confirmationCode: string
  ): Promise<GeneralApiResponse<AuthApiResponse>> {
    const response = await api.post<AuthApiResponse>(
      `${AppRoutes.server.public.CONFIRM_WITH_CODE}`,
      {
        login_key: emailOrUsername,
        confirmation_code: confirmationCode,
      }
    );
    return response;
  }

  async resendConfirmationEmail(
    emailOrUsername: string
  ): Promise<GeneralApiResponse<undefined>> {
    const response = await api.post<undefined>(
      `${AppRoutes.server.public.RESEND_VERIFY_EMAIL}`,
      { login_key: emailOrUsername }
    );
    return response;
  }

  async sendForgotPasswordMail(
    email: string
  ): Promise<GeneralApiResponse<undefined>> {
    const response = await api.post<undefined>(
      AppRoutes.server.public.FORGOT_PASSWORD,
      { email }
    );
    return response;
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<GeneralApiResponse<undefined>> {
    const response = await api.put<undefined>(
      AppRoutes.server.public.RESET_PASSWORD,
      {
        user: {
          reset_password_token: token,
          password,
          password_confirmation: passwordConfirmation,
        },
      }
    );
    return response;
  }

  async signOut(): Promise<GeneralApiResponse<undefined>> {
    const response = await api.delete<undefined>(
      AppRoutes.server.protected.SIGN_OUT
    );
    return response;
  }
}

export default new AuthService();
