// src/modules/admin/role/pages/AdminRoleCreatePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import RoleController from "../role.controller";
import {
  IAdminPermission,
  IAdminRoleFormValues,
} from "../types";
import { AlertDialog } from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminRoleCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Roles.CreateTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      const result = await RoleController.getPermissions();
      setLoading(false);
      if (result.success) {
        setPermissions(result.permissions);
      } else {
        setAlertMessage(result.error || t(AppLocales.Admin.Roles.Errors.LoadPermissions));
      }
    };

    void loadPermissions();
  }, [setLoading, t]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    setLoading(true, { overlay: false });

    const result = await RoleController.createRole(values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(t(AppLocales.Admin.Roles.Toasts.CreateSuccess));
      navigate(AppRoutes.client.protected.admin.ROLES);
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Roles.Errors.Create));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      <AdminRoleForm
        mode={ADMIN_ACTIONS.CREATE}
        permissions={permissions}
        onSubmit={handleSubmit}
        onCancel={() => navigate(AppRoutes.client.protected.admin.ROLES)}
      />
    </>
  );
};

