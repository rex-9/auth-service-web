import AppRoutes from "../AppRoutes";
import { authService } from "../services";
import { User } from "../models";
import { apiHandler } from "../services/api.service";

class AuthController {
  async signInWithToken(
    token: string,
    setError: (message: string) => void,
    login: (token: string, user: User) => void
  ): Promise<void> {
    await apiHandler(
      "signing in with token",
      () => authService.signInWithToken(token),
      setError,
      (data) => login(data.data!.token, data.data!.user)
    );
  }

  async signInWithEmailOrUsername(
    loginKey: string,
    password: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    login: (token: string, user: User) => void,
    navigate: (url: string) => void
  ): Promise<void> {
    await apiHandler(
      "signing in with email or username",
      () => authService.signInWithEmailOrUsername(loginKey, password),
      setError,
      (data) => {
        setMessage(data.status.message);
        if (data.data) login(data.data!.token, data.data!.user);
        navigate(
          AppRoutes.client.public.CONFIRM_EMAIL + `?login_key=${loginKey}`
        );
      }
    );
  }

  async signInWithGoogle(
    token: string,
    setError: (message: string) => void,
    login: (token: string, user: User) => void
  ): Promise<void> {
    await apiHandler(
      "signing in with google",
      () => authService.signInWithGoogle(token),
      setError,
      (data) => login(data.data!.token, data.data!.user)
    );
  }

  async signUpWithEmail(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    navigate: (url: string) => void
  ): Promise<void> {
    await apiHandler(
      "signing up with email",
      () =>
        authService.signUpWithEmail(
          username,
          email,
          password,
          passwordConfirmation
        ),
      setError,
      () =>
        navigate(`${AppRoutes.client.public.CONFIRM_EMAIL}?login_key=${email}`)
    );
  }

  async confirmEmailWithCode(
    emailOrUsername: string,
    confirmationCode: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    login: (token: string, user: User) => void
  ): Promise<void> {
    await apiHandler(
      "confirming email with code",
      () => authService.confirmEmailWithCode(emailOrUsername, confirmationCode),
      setError,
      (data) => {
        setMessage(data.status.message);
        login(data.data!.token, data.data!.user);
      },
      () => setMessage("")
    );
  }

  async resendConfirmationEmail(
    emailOrUsername: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void
  ): Promise<void> {
    await apiHandler(
      "resending confirmation email",
      () => authService.resendConfirmationEmail(emailOrUsername),
      setError,
      (data) => {
        setMessage(data.status.message);
        startCountdown();
      }
    );
  }

  async sendForgotPasswordMail(
    email: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void
  ): Promise<void> {
    await apiHandler(
      "sending forgot password email",
      () => authService.sendForgotPasswordMail(email),
      setError,
      (data) => {
        setMessage(data.status.message);
        startCountdown();
      }
    );
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    navigate: (url: string) => void
  ): Promise<void> {
    await apiHandler(
      "resetting password",
      () => authService.resetPassword(token, password, passwordConfirmation),
      setError,
      (data) => {
        setMessage(data.status.message);
        navigate(AppRoutes.client.public.SIGN_IN);
      }
    );
  }

  async signOut(): Promise<void> {
    try {
      const response = await authService.signOut();
      const { status } = response.data || {};
      if (status?.success) {
        console.log("user signed out from server successfully.");
      } else {
        console.log("server signout failed.");
      }
    } catch (error) {
      console.log(`An error occurred during server sign out. error: ${error}`);
    }
  }
}

export default new AuthController();
