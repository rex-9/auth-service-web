// src/modules/admin/notification/pages/AdminNotificationEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import NotificationController from "../notification.controller";
import type {
  IAdminNotificationTemplate,
  IAdminNotificationTemplateFormValues,
} from "../types";
import { AlertDialog, AdminState, PageHeader } from "../../components";
import { Button } from "../../../../design/components";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { ADMIN_ACTIONS } from "../../constants";
import { AdminNotificationForm } from "./AdminNotificationForm";

export const AdminNotificationEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Notifications.Templates.Dialog.EditTitle)} | Admin`,
  );

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [template, setTemplate] = useState<IAdminNotificationTemplate | null>(
    null,
  );
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadTemplate = async () => {
      setLoading(true);
      const result = await NotificationController.getTemplate(id);
      setLoading(false);

      if (result.success && result.template) {
        setTemplate(result.template);
      } else {
        setError(
          result.error ||
            t(AppLocales.Admin.Notifications.Errors.LoadTemplates),
        );
      }
    };

    void loadTemplate();
  }, [id, setLoading, t]);

  const handleSubmit = async (values: IAdminNotificationTemplateFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });
    const result = await NotificationController.updateTemplate(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        t(AppLocales.Admin.Notifications.Templates.Toasts.UpdateSuccess),
      );
      navigate(AppRoutes.client.protected.admin.NOTIFICATIONS);
    } else {
      setAlertMessage(result.error || "Failed to update notification template");
    }
  };

  const handleCancel = () => {
    navigate(AppRoutes.client.protected.admin.NOTIFICATIONS);
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <div className="space-y-6">
        <PageHeader
          title={t(AppLocales.Admin.Notifications.Templates.Dialog.EditTitle)}
          description={t(
            AppLocales.Admin.Notifications.Templates.Description,
          )}
          action={
            <Button
              variant={ButtonVariants.SECONDARY}
              size={ButtonSizes.SM}
              onClick={handleCancel}
            >
              <iconsLib.arrowLeft className="w-4 h-4 mr-1.5" />
              {t(AppLocales.Admin.Notifications.Title)}
            </Button>
          }
        />

        {error && !template ? (
          <AdminState
            icon={iconsLib.warning}
            title={t(AppLocales.Admin.Common.State.ErrorTitle)}
            message={error}
          />
        ) : !template ? (
          <div className="py-16 flex items-center justify-center text-base-content/40">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <AdminNotificationForm
            mode={ADMIN_ACTIONS.EDIT}
            template={template}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </>
  );
};
