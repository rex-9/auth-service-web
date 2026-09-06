// src/modules/admin/chat/pages/AdminChatRoomEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import ChatController from "../chat.controller";
import {
  IAdminChatRoom,
  IAdminChatRoomFormValues,
} from "../types";
import {
  AlertDialog,
  AdminState,
  FormActionRow,
  FormContainer,
  TextInput,
} from "../../components";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminChatRoomEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Chat.RoomEditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [room, setRoom] = useState<IAdminChatRoom | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadRoom = async () => {
      setLoading(true);
      const result = await ChatController.getRoom(id);
      setLoading(false);

      if (result.success && result.room) {
        setRoom(result.room);
        setTitle(result.room.title || "");
      } else {
        setError(result.error || t(AppLocales.Admin.Chat.Errors.LoadRoom));
      }
    };

    void loadRoom();
  }, [id, setLoading, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const values: IAdminChatRoomFormValues = {
      title: title.trim(),
    };

    setLoading(true, { overlay: false });

    const result = await ChatController.updateRoom(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.RoomUpdateSuccess));
      navigate(AppRoutes.client.protected.admin.CHAT_ROOMS);
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Chat.Errors.UpdateRoom));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && !room ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : room ? (
        <FormContainer onSubmit={handleSubmit}>
          <TextInput
            label={t(AppLocales.Admin.Chat.RoomForm.TitleLabel)}
            value={title}
            required
            onChange={(event) => setTitle(event.target.value)}
          />
          <FormActionRow
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            submitLabel={t(AppLocales.Admin.Chat.RoomForm.SaveRoom)}
            onCancel={() =>
              navigate(AppRoutes.client.protected.admin.CHAT_ROOMS)
            }
          />
        </FormContainer>
      ) : null}
    </>
  );
};

