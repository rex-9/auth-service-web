import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import {
  FormContainer,
  GoogleSignIn,
  Button,
  FormInput,
  TextLink,
} from "../../components";
import { PageLayout } from "..";
import { useLocalization, useToast } from "../../hooks";
import { authController } from "../../controllers";
import { useAuth } from "../../contexts";

const SignUpPage: React.FC = () => {
  const { login } = useAuth();
  const { t, AppLocales } = useLocalization();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authController.signUpWithEmail(
      username,
      email,
      password,
      passwordConfirmation,
      () =>
        navigate(`${AppRoutes.client.public.CONFIRM_EMAIL}?login_key=${email}`),
      (error) => toast.error(`Sign up failed: ${error}`)
    );
  };

  return (
    <PageLayout>
      <FormContainer
        title={AppLocales.AUTH.SIGN_UP.TITLE}
        onSubmit={handleSubmit}
      >
        <FormInput
          id="username"
          label={AppLocales.AUTH.SIGN_UP.USERNAME_LABEL}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          required
        />
        <FormInput
          id="email"
          label={AppLocales.AUTH.SIGN_UP.EMAIL_LABEL}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          id="password"
          label={AppLocales.AUTH.SIGN_UP.PASSWORD_LABEL}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormInput
          id="passwordConfirmation"
          label={AppLocales.AUTH.SIGN_UP.PASSWORD_CONFIRMATION_LABEL}
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <Button
          variant="primary"
          type="submit"
          label={AppLocales.AUTH.SIGN_UP.BUTTON}
        />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t(AppLocales.AUTH.SIGN_UP.SIGN_IN_PROMPT)}{" "}
          <TextLink
            className="mt-4"
            to={AppRoutes.client.public.SIGN_IN}
            label={AppLocales.AUTH.SIGN_UP.SIGN_IN_LINK}
          />
        </p>
        <div className="mt-6">
          <GoogleSignIn login={login} />
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default SignUpPage;
