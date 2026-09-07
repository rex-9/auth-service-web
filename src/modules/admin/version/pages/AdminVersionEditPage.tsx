import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import type { IAdminVersion, IAdminVersionFormValues } from "../types";
import { AlertDialog, AdminState } from "../../components";
import VersionController from "../version.controller";
import { AdminVersionForm } from "./AdminVersionForm";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminVersionEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Versions.EditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [version, setVersion] = useState<IAdminVersion | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadVersion = async () => {
      setLoading(true);
      const result = await VersionController.getVersion(id);
      setLoading(false);

      if (result.success && result.version) {
        setVersion(result.version);
      } else {
        setError(result.error || t(AppLocales.Admin.Versions.Errors.LoadOne));
      }
    };

    void loadVersion();
  }, [id, setLoading, t]);

  const handleSubmit = async (values: IAdminVersionFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await VersionController.updateVersion(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Versions.Toasts.UpdateSuccess),
      );
      navigate(AppRoutes.client.protected.admin.VERSIONS);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Versions.Errors.Update),
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
      {error && !version ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : version ? (
        <AdminVersionForm
          mode={ADMIN_ACTIONS.EDIT}
          version={version}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.admin.VERSIONS)}
        />
      ) : null}
    </>
  );
};
