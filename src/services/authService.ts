import AppRoutes from "../AppRoutes";
import { User } from "../models";
import { api } from "./api";

interface ApiAuthResponse<T> {
  status: {
    code: number;
    success: boolean;
    message: string;
    error?: string;
  };
  data: T;
}

class AuthService {
  async signInWithToken(
    token: string,
    setError: (message: string) => void,
    login: (token: string, user: User) => void
  ): Promise<void> {
    try {
      const response = await api.post<
        ApiAuthResponse<{ user: User; token: string }>
      >(AppRoutes.server.public.SIGN_IN_TOKEN, {
        token,
      });
      const { status, data } = response.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user); // Update authentication state with token
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
    login: (token: string, user: User) => void
  ): Promise<void> {
    try {
      const response = await api.post<
        ApiAuthResponse<{ user: User; token: string }>
      >(AppRoutes.server.public.SIGN_IN_EMAIL, { user: { email, password } });
      const { status, data } = response.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user); // Update authentication state with token
      } else {
        setError(status?.error ?? "An error occurred during email login.");
      }
    } catch (error) {
      setError(`An error occurred during email login. error: ${error}`);
    }
  }

  async signInWithGoogle(
    token: string,
    setError: (message: string) => void,
    login: (token: string, user: User) => void
  ): Promise<void> {
    try {
      const res = await api.post<
        ApiAuthResponse<{ user: User; token: string }>
      >(AppRoutes.server.public.SIGN_IN_GOOGLE, {
        token,
      });
      const { status, data } = res.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user); // Update authentication state with token
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
      const { error } = await api.post<{ message: string }>(
        AppRoutes.server.public.SIGN_UP,
        {
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }
      );
      if (error) {
        setError(error);
      } else {
        setError("");
        navigate(`${AppRoutes.client.public.CONFIRM_EMAIL}?email=${email}`);
      }
    } catch (error) {
      setError(`An error occurred during email signup. error: ${error}`);
    }
  }

  async resendConfirmationEmail(
    email: string,
    setError: (message: string) => void,
    setMessage: (message: string) => void,
    startCountdown: () => void
  ): Promise<void> {
    try {
      const response = await api.post<{
        status: {
          code: number;
          success: boolean;
          message: string;
          error?: string;
        };
      }>(`${AppRoutes.server.public.RESEND_VERIFY_EMAIL}`, { email });
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
      const response = await api.post<ApiAuthResponse<undefined>>(
        AppRoutes.server.public.FORGOT_PASSWORD,
        { email }
      );
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
      const response = await api.put<ApiAuthResponse<undefined>>(
        AppRoutes.server.public.RESET_PASSWORD,
        {
          user: {
            reset_password_token: token,
            password,
            password_confirmation: passwordConfirmation,
          },
        }
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
      const response = await api.delete<ApiAuthResponse<null>>(
        AppRoutes.server.protected.SIGN_OUT
      );
      if (response.data?.status.success) {
        console.log("user signed out from server successfully.");
      } else {
        console.log("server signout failed.");
      }
    } catch (error) {
      console.log(`An error occurred during server sign out. error: ${error}`);
    }
  }
}

export default new AuthService();
