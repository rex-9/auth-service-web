// src/modules/admin/access/pages/AdminAccessCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import AccessController from "../access.controller";
import { AlertDialog, PageHeader } from "../../components";
import { Button } from "../../../../design/components";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { ADMIN_ACTIONS } from "../../constants";
import { AdminAccessForm, type IAdminAccessFormValues } from "./AdminAccessForm";

export const AdminAccessCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Accesses.GrantDialog.Title)} | Admin`,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (values: IAdminAccessFormValues) => {
    setLoading(true, { overlay: false });

    const result = await AccessController.grantAccess({
      emails: values.emails,
      usernames: values.usernames,
      code: values.code || "",
      days: values.days,
    });

    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(t(AppLocales.Admin.Accesses.Toasts.GrantSuccess));
      navigate(AppRoutes.client.protected.admin.ACCESSES);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Accesses.Errors.GrantFailed),
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
        title={t(AppLocales.Admin.Accesses.GrantDialog.Title)}
        description={t(AppLocales.Admin.Accesses.GrantDialog.Description)}
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

      <AdminAccessForm
        mode={ADMIN_ACTIONS.CREATE}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};
