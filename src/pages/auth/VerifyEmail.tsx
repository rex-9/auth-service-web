import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { api } from "../../services/api";
import { useAuth } from "../../contexts";
import { AlertMessage } from "../../components";
import PageLayout from "../PageLayout";
import { User } from "../../models";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        const { data, error } = await api.get<{
          message: string;
          token: string;
          user: User;
        }>(`${AppRoutes.server.public.VERIFY_EMAIL}?token=${token}`);
        if (error) {
          setError(error);
          navigate(AppRoutes.client.public.CONFIRM_EMAIL);
        } else {
          setError("");
          setMessage(data!.message);
          login(data!.token, data!.user);
        }
      }
    };

    verifyEmail();
  }, [token, navigate, login]);

  return (
    <PageLayout>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Verify Email</h2>
        {message && <AlertMessage type="success" message={message} />}
        {error && <AlertMessage type="error" message={error} />}
      </div>
    </PageLayout>
  );
};

export default VerifyEmail;
