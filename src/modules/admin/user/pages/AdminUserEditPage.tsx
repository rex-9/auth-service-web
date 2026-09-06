// src/modules/admin/user/pages/AdminUserEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import UserController from "../user.controller";
import {
  IAdminUser,
  IAdminUserFormValues,
} from "../types";
import { IAdminRole } from "../../role/types";
import { AlertDialog, AdminState } from "../../components";
import { AdminUserForm } from "./AdminUserForm";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminUserEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Users.EditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [user, setUser] = useState<IAdminUser | null>(null);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      const [userResult, rolesResult] = await Promise.all([
        UserController.getUser(id),
        UserController.getRoles(),
      ]);
      setLoading(false);

      if (userResult.success && userResult.user) {
        setUser(userResult.user);
      } else {
        setError(userResult.error || t(AppLocales.Admin.Users.Errors.LoadOneFailed));
      }

      if (rolesResult.success) {
        setRoles(rolesResult.roles);
      }
    };

    void loadData();
  }, [id, setLoading, t]);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await UserController.updateUser(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Users.Toasts.UpdateSuccess));
      navigate(AppRoutes.client.protected.admin.USERS);
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Users.Errors.UpdateFailed));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && (!user || !id) ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : !user ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={t(AppLocales.Admin.Users.Errors.LoadOneFailed)} />
      ) : (
        <AdminUserForm
          mode={ADMIN_ACTIONS.EDIT}
          user={user}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.admin.USERS)}
        />
      )}
    </>
  );
};

