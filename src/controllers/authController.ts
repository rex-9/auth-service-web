import AppRoutes from "../AppRoutes";
import AuthService from "../services/authService"; // Add this line to import AuthService
import { IUser } from "../types";

class AuthController {
  async signInWithToken(
    token: string,
    setError: (message: string) => void,
    login: (token: string, user: IUser) => void
  ): Promise<void> {
    try {
      const response = await AuthService.signInWithToken(token);
      const { status, data } = response.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user);
      } else {
        setError(status?.error ?? "An error occurred during token login.");
      }
    } catch (error) {
      setError(`An error occurred during token login. error: ${error}`);
    }
  }

  async signInWithEmail(
    email: string,
    password: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    login: (token: string, user: IUser) => void,
    navigate: (url: string) => void
  ): Promise<void> {
    try {
      const response = await AuthService.signInWithEmail(email, password);
      const { status, data } = response.data || {};
      if (status?.success) {
        setMessage(status.message);
        setError("");
        if (data) {
          login(data.token, data.user);
        }
        navigate(AppRoutes.client.public.CONFIRM_EMAIL + `?email=${email}`);
      } else {
        setError(
          status?.error ??
            status?.message ??
            "An error occurred during email login."
        );
      }
    } catch (error) {
      setError(`An error occurred during email login. error: ${error}`);
    }
  }

  async signInWithGoogle(
    token: string,
    setError: (message: string) => void,
    login: (token: string, user: IUser) => void
  ): Promise<void> {
    try {
      const response = await AuthService.signInWithGoogle(token);
      const { status, data } = response.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user);
      } else {
        setError(status?.error ?? "An error occurred during google login.");
      }
    } catch (error) {
      setError(`An error occurred during google login. error: ${error}`);
    }
  }

  async signUpWithEmail(
    email: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    navigate: (url: string) => void
  ): Promise<void> {
    try {
      const response = await AuthService.signUpWithEmail(
        email,
        password,
        passwordConfirmation
      );
      if (response?.error) {
        setError(response.error);
      } else {
        setError("");
        navigate(`${AppRoutes.client.public.CONFIRM_EMAIL}?email=${email}`);
      }
    } catch (error) {
      setError(`An error occurred during email signup. error: ${error}`);
    }
  }

  async confirmEmailWithCode(
    email: string,
    confirmationCode: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    login: (token: string, user: IUser) => void
  ): Promise<void> {
    try {
      const response = await AuthService.confirmEmailWithCode(
        email,
        confirmationCode
      );
      const { status, data } = response.data || {};
      if (status?.success) {
        setError("");
        setMessage(status.message);
        if (data) login(data.token, data.user);
      } else {
        setError(status?.error ?? "An error occurred during resending email.");
        setMessage("");
      }
    } catch (error) {
      setError(
        `An error occurred during confirming email with code. error: ${error}`
      );
    }
  }

  async resendConfirmationEmail(
    email: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void
  ): Promise<void> {
    try {
      const response = await AuthService.resendConfirmationEmail(email);
      const { status } = response.data || {};
      if (status?.success) {
        setError("");
        setMessage(status.message);
        startCountdown();
      } else {
        setError(status?.error ?? "An error occurred during resending email.");
      }
    } catch (error) {
      setError(`An error occurred during resending email. error: ${error}`);
    }
  }

  async sendForgotPasswordMail(
    email: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void
  ): Promise<void> {
    try {
      const response = await AuthService.sendForgotPasswordMail(email);
      const { status } = response.data || {};
      if (status?.success) {
        setError("");
        setMessage(status.message);
        startCountdown();
      } else {
        setError(
          status?.error ??
            "An error occurred during resending email to reset password."
        );
      }
    } catch (error) {
      setError(
        `An error occurred during resending email to reset password. error: ${error}`
      );
    }
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    navigate: (url: string) => void
  ): Promise<void> {
    try {
      const response = await AuthService.resetPassword(
        token,
        password,
        passwordConfirmation
      );
      const { status } = response.data || {};
      if (status?.success) {
        setError("");
        setMessage(status.message);
        navigate(AppRoutes.client.public.SIGN_IN);
      } else {
        setError(
          status?.error ?? "An error occurred during resetting password."
        );
      }
    } catch (error) {
      setError(`An error occurred during resetting password. error: ${error}`);
    }
  }

  async signOut(): Promise<void> {
    try {
      const response = await AuthService.signOut();
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
