import { authService } from "../services";
import { handleApi } from "../services/api.service";
import { AuthApiResponse, GeneralApiResponse } from "../models";

class AuthController {
  async signInWithToken(
    token: string,
    onSuccess: (response: GeneralApiResponse<AuthApiResponse>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "signing in with token",
      () => authService.signInWithToken(token),
      onSuccess,
      onFailure
    );
  }

  async signInWithEmailOrUsername(
    loginKey: string,
    password: string,
    onSuccess: (response: GeneralApiResponse<AuthApiResponse>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "signing in with email or username",
      () => authService.signInWithEmailOrUsername(loginKey, password),
      onSuccess,
      onFailure
    );
  }

  async signInWithGoogle(
    token: string,
    onSuccess: (response: GeneralApiResponse<AuthApiResponse>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "signing in with google",
      () => authService.signInWithGoogle(token),
      onSuccess,
      onFailure
    );
  }

  async signUpWithEmail(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    onSuccess: (data: GeneralApiResponse<undefined>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "signing up with email",
      () =>
        authService.signUpWithEmail(
          username,
          email,
          password,
          passwordConfirmation
        ),
      onSuccess,
      onFailure
    );
  }

  async confirmEmailWithCode(
    emailOrUsername: string,
    confirmationCode: string,
    onSuccess: (response: GeneralApiResponse<AuthApiResponse>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "confirming email with code",
      () => authService.confirmEmailWithCode(emailOrUsername, confirmationCode),
      onSuccess,
      onFailure
    );
  }

  async resendConfirmationEmail(
    emailOrUsername: string,
    onSuccess: (response: GeneralApiResponse<undefined>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "resending confirmation email",
      () => authService.resendConfirmationEmail(emailOrUsername),
      onSuccess,
      onFailure
    );
  }

  async sendForgotPasswordMail(
    email: string,
    onSuccess: (response: GeneralApiResponse<undefined>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "sending forgot password email",
      () => authService.sendForgotPasswordMail(email),
      onSuccess,
      onFailure
    );
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
    onSuccess: (response: GeneralApiResponse<undefined>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "resetting password",
      () => authService.resetPassword(token, password, passwordConfirmation),
      onSuccess,
      onFailure
    );
  }

  async signOut(
    onSuccess: (response: GeneralApiResponse<undefined>) => void,
    onFailure?: (error: any) => void
  ): Promise<void> {
    await handleApi(
      "signing out",
      () => authService.signOut(),
      onSuccess,
      onFailure
    );
  }
}

export default new AuthController();
