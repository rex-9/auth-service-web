// src/modules/admin/access/pages/AdminAccessEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Button } from "../../../../design";
import { ButtonVariants, ButtonSizes } from "../../../../design/constants";
import AccessController from "../access.controller";
import type { IAdminAccess } from "../types";
import { AlertDialog, AdminState, PageHeader } from "../../components";
import { useTranslate, AppLocales } from "../../../../locales";
import { ADMIN_ACTIONS } from "../../constants";
import { AdminAccessForm, type IAdminAccessFormValues } from "./AdminAccessForm";

export const AdminAccessEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Accesses.ExtendDialog.Title)} | Admin`,
  );

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [access, setAccess] = useState<IAdminAccess | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadAccess = async () => {
      setLoading(true);
      const result = await AccessController.getAccess(id);
      setLoading(false);

      if (result.success && result.access) {
        setAccess(result.access);
      } else {
        setError(
          result.error || t(AppLocales.Admin.Accesses.Errors.LoadListFailed),
        );
      }
    };

    void loadAccess();
  }, [id, setLoading, t]);

  const handleSubmit = async (values: IAdminAccessFormValues) => {
    if (!id || !access) return;

    setLoading(true, { overlay: false });

    const result = await AccessController.extendAccess(id, {
      days: values.days || 30,
    });
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        t(AppLocales.Admin.Accesses.Toasts.ExtendSuccess, {
          user: access.user_name || access.user_email,
        }),
      );
      navigate(AppRoutes.client.protected.admin.ACCESSES);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Accesses.Errors.ExtendFailed),
      );
    }
  };

  const handleCancel = () => {
    navigate(AppRoutes.client.protected.admin.ACCESSES);
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title={t(AppLocales.Admin.Accesses.ExtendDialog.Title)}
        description="Extend the validity period of an active user entitlement"
        action={
          <Button
            variant={ButtonVariants.SECONDARY}
            size={ButtonSizes.SM}
            onClick={handleCancel}
          >
            <iconsLib.arrowLeft className="w-4 h-4 mr-1.5" />
            {t(AppLocales.Admin.Accesses.Title)}
          </Button>
        }
      />

      {error && !access ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : access ? (
        <AdminAccessForm
          mode={ADMIN_ACTIONS.EDIT}
          access={access}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  );
};
