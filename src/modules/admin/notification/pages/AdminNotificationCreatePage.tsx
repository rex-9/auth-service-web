// src/modules/admin/notification/pages/AdminNotificationCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import NotificationController from "../notification.controller";
import type { IAdminNotificationTemplateFormValues } from "../types";
import { AlertDialog, PageHeader } from "../../components";
import { Button } from "../../../../design/components";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { ADMIN_ACTIONS } from "../../constants";
import { AdminNotificationForm } from "./AdminNotificationForm";

export const AdminNotificationCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Notifications.Templates.Dialog.NewTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (values: IAdminNotificationTemplateFormValues) => {
    setLoading(true, { overlay: false });
    const result = await NotificationController.createTemplate(values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        t(AppLocales.Admin.Notifications.Templates.Toasts.CreateSuccess),
      );
      navigate(AppRoutes.client.protected.admin.NOTIFICATIONS);
    } else {
      setAlertMessage(result.error || "Failed to create notification template");
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
          title={t(AppLocales.Admin.Notifications.Templates.Dialog.NewTitle)}
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

        <AdminNotificationForm
          mode={ADMIN_ACTIONS.CREATE}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};
