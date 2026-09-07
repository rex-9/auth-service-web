import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import type { IAdminVersionFormValues } from "../types";
import VersionController from "../version.controller";
import { AdminVersionForm } from "./AdminVersionForm";
import { AlertDialog } from "../../components";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminVersionCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Versions.CreateTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (values: IAdminVersionFormValues) => {
    setLoading(true, { overlay: false });

    const result = await VersionController.createVersion(values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Versions.Toasts.CreateSuccess),
      );
      navigate(AppRoutes.client.protected.admin.VERSIONS, { replace: true });
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Versions.Errors.Create),
      );
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      <AdminVersionForm
        mode={ADMIN_ACTIONS.CREATE}
        onSubmit={handleSubmit}
        onCancel={() => navigate(AppRoutes.client.protected.admin.VERSIONS)}
      />
    </>
  );
};
