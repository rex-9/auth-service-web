// src/modules/admin/chat/pages/AdminChatMessageEditPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import ChatController from "../chat.controller";
import {
  IAdminChatMessage,
  IAdminChatMessageFormValues,
} from "../types";
import {
  AlertDialog,
  AdminState,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
} from "../../components";
import { ADMIN_CHAT_ROLES } from "../constants";
import type { TAdminChatRole } from "../types";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminChatMessageEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Chat.MessageEditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [message, setMessage] = useState<IAdminChatMessage | null>(null);
  const [role, setRole] = useState<TAdminChatRole>(ADMIN_CHAT_ROLES.USER);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const messageRoleOptions = useMemo(
    () => [
      { value: ADMIN_CHAT_ROLES.USER, label: "User" },
      { value: ADMIN_CHAT_ROLES.ASSISTANT, label: "Assistant" },
    ],
    [],
  );

  useEffect(() => {
    if (!id) return;

    const loadMessage = async () => {
      setLoading(true);
      const result = await ChatController.getMessage(id);
      setLoading(false);

      if (result.success && result.message) {
        setMessage(result.message);
        setRole((result.message.role as TAdminChatRole) || ADMIN_CHAT_ROLES.USER);
        setContent(result.message.content || "");
      } else {
        setError(result.error || t(AppLocales.Admin.Chat.Errors.LoadMessage));
      }
    };

    void loadMessage();
  }, [id, setLoading, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const values: IAdminChatMessageFormValues = {
      role,
      content: content.trim(),
    };

    setLoading(true, { overlay: false });

    const result = await ChatController.updateMessage(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.MessageUpdateSuccess));
      navigate(AppRoutes.client.protected.admin.CHAT_MESSAGES);
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Chat.Errors.UpdateMessage));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && !message ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : message ? (
        <FormContainer onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <Dropdown
              label={t(AppLocales.Admin.Chat.MessageForm.RoleLabel)}
              value={role}
              onValueChange={(val) => setRole(val as TAdminChatRole)}
              options={messageRoleOptions}
            />
            <TextArea
              label={t(AppLocales.Admin.Chat.MessageForm.ContentLabel)}
              value={content}
              required
              rows={6}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <FormActionRow
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            submitLabel={t(AppLocales.Admin.Chat.MessageForm.SaveMessage)}
            onCancel={() =>
              navigate(AppRoutes.client.protected.admin.CHAT_MESSAGES)
            }
          />
        </FormContainer>
      ) : null}
    </>
  );
};

