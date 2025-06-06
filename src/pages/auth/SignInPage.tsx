import React, { useEffect, useState } from "react";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import {
  GoogleSignIn,
  FormInput,
  Button,
  FormContainer,
  TextLink,
} from "../../components";
import PageLayout from "../PageLayout";
import { useLocalization } from "../../hooks";
import { authController } from "../../controllers";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useToast } from "../../hooks/useToast";
const SignInPage: React.FC = () => {
  const { t, AppLocales } = useLocalization();
  const navigate = useNavigate();
  const toast = useToast();
  const [loginKey, setLoginKey] = useState<string>("");
  const [loginKeyError, setLoginKeyError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleAuthToken = async () => {
      const params = new URLSearchParams(location.search);
      const authToken = params.get("auth_token");
      const errorParam = params.get("error");
      if (authToken) {
        await authController.signInWithToken(
          authToken,
          (response) => {
            login(response.data!.token, response.data!.user);
            navigate(AppRoutes.client.protected.HOME);
            toast.success("Sign in successful");
          },
          (error) => toast.error(`Sign in failed: ${error}`)
        );
      } else if (errorParam) {
        toast.error(`Sign in failed: ${errorParam}`);
      }
    };

    handleAuthToken();
  }, [location, login]);

  const validateLoginKey = (value: string) => {
    if (value.includes("@")) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setLoginKeyError(t("Invalid email format"));
      } else {
        setLoginKeyError("");
      }
    } else {
      // Username validation matching backend requirements
      if (value.length < 3 || value.length > 30) {
        setLoginKeyError(t("Username must be between 3 and 30 characters"));
      } else if (!/^[a-z0-9_]+$/.test(value)) {
        setLoginKeyError(
          t(
            "Username can only contain lowercase letters, numbers, and underscores"
          )
        );
      } else {
        setLoginKeyError("");
      }
    }
  };

  const handleLoginKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setLoginKey(value);
    if (value) {
      validateLoginKey(value);
    } else {
      setLoginKeyError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginKeyError) {
      return;
    }
    await authController.signInWithEmailOrUsername(
      loginKey,
      password,
      (response) => {
        login(response.data!.token, response.data!.user);
        navigate(AppRoutes.client.protected.HOME);
        toast.success("Sign in successful");
      },
      (error) => toast.error(`Sign in failed: ${error}`)
    );
  };

  return (
    <PageLayout>
      <FormContainer
        title={AppLocales.AUTH.SIGN_IN.TITLE}
        onSubmit={handleSubmit}
      >
        <FormInput
          id="email-or-username"
          label={AppLocales.AUTH.SIGN_IN.EMAIL_OR_USERNAME_LABEL}
          type="text"
          value={loginKey}
          onChange={handleLoginKeyChange}
          required
          error={loginKeyError}
          placeholder={t("superstar@gmail.com")}
          hint={t("superstar@gmail.com")}
        />
        <FormInput
          id="password"
          label={AppLocales.AUTH.SIGN_IN.PASSWORD_LABEL}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={t("s0m3th!ngc0mpl3x")}
          hint={t("s0m3th!ngc0mpl3x")}
          suffixIcon={showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          onSuffixIconClick={() => setShowPassword(!showPassword)}
        />
        <Button
          variant="primary"
          type="submit"
          label={AppLocales.AUTH.SIGN_IN.BUTTON}
        />
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t(AppLocales.AUTH.SIGN_IN.SIGN_UP_PROMPT)}{" "}
          <TextLink
            to={AppRoutes.client.public.SIGN_UP}
            label={AppLocales.AUTH.SIGN_IN.SIGN_UP_LINK}
          />
        </p>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t(AppLocales.AUTH.SIGN_IN.FORGOT_PASSWORD_PROMPT)}{" "}
          <TextLink
            to={AppRoutes.client.public.FORGOT_PASSWORD}
            label={AppLocales.AUTH.SIGN_IN.FORGOT_PASSWORD_LINK}
          />
        </p>
        <div className="mt-6">
          <GoogleSignIn login={login} />
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default SignInPage;
