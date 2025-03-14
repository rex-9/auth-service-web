import React, { useEffect, useState } from "react";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import {
  GoogleSignIn,
  FormInput,
  AlertMessage,
  Button,
  FormContainer,
  TextLink,
} from "../../components";
import PageLayout from "../PageLayout";
import { useLocalization } from "../../hooks";
import { authController } from "../../controllers";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignInPage: React.FC = () => {
  const { t, AppLocales } = useLocalization();
  const navigate = useNavigate();
  const [loginKey, setLoginKey] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleAuthToken = async () => {
      const params = new URLSearchParams(location.search);
      const authToken = params.get("auth_token");
      const errorParam = params.get("error");
      if (authToken) {
        await authController.signInWithToken(authToken, setError, login);
      } else if (errorParam) {
        setError(errorParam);
      }
    };

    handleAuthToken();
  }, [location, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authController.signInWithEmailOrUsername(
      loginKey,
      password,
      setError,
      setMessage,
      login,
      navigate
    );
  };

  return (
    <PageLayout>
      <FormContainer
        title={AppLocales.AUTH.SIGN_IN.TITLE}
        onSubmit={handleSubmit}
      >
        {message && <AlertMessage type="success" message={message} />}
        {error && <AlertMessage type="error" message={error} />}
        <FormInput
          id="email-or-username"
          label={AppLocales.AUTH.SIGN_IN.EMAIL_OR_USERNAME_LABEL}
          type="text"
          value={loginKey}
          onChange={(e) => setLoginKey(e.target.value.toLowerCase())}
          required
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
          <GoogleSignIn setError={setError} login={login} />
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default SignInPage;
