// src/modules/admin/user/pages/AdminUserCreatePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import UserController from "../user.controller";
import { IAdminUserFormValues } from "../types";
import { IAdminRole } from "../../role/types";
import { AlertDialog } from "../../components";
import { AdminUserForm } from "./AdminUserForm";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminUserCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Users.CreateTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      const result = await UserController.getRoles();
      setLoading(false);

      if (result.success) {
        setRoles(result.roles);
      } else {
        setAlertMessage(result.error || t(AppLocales.Admin.Users.Errors.LoadRolesFailed));
      }
    };

    void loadRoles();
  }, [setLoading, t]);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    setLoading(true, { overlay: false });

    const result = await UserController.createUser(values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Users.Toasts.CreateSuccess));
      navigate(AppRoutes.client.protected.admin.USERS);
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Users.Errors.CreateFailed));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      <AdminUserForm
        mode={ADMIN_ACTIONS.CREATE}
        roles={roles}
        onSubmit={handleSubmit}
        onCancel={() => navigate(AppRoutes.client.protected.admin.USERS)}
      />
    </>
  );
};

