import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { StatusBadge } from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import ChatController from "../chat.controller";
import type { IAdminChatMessage } from "../types";

const loadMessage = async (id: string) => {
  const result = await ChatController.getMessage(id);
  return { ...result, record: result.message };
};
export const AdminChatMessageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: message, error } = useAdminDetail<IAdminChatMessage>(
    id,
    loadMessage,
  );
  const listPath = AppRoutes.client.protected.admin.CHAT_MESSAGES;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          { label: t(AppLocales.Admin.Chat.MessagesTitle), to: listPath },
          { label: message ? t(AppLocales.Admin.Chat.MessageDetail.MessageBreadcrumb, { role: message.role }) : t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Chat.MessageDetail.Title)}
        description={t(AppLocales.Admin.Chat.MessageDetail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : message ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <AdminDetailSection
            title={t(AppLocales.Admin.Chat.MessageDetail.Context)}
            icon={iconsLib.chatBubbleLeftRight}
          >
            <AdminDetailGrid className="grid-cols-1">
              <AdminDetailField
                label={t(AppLocales.Admin.Chat.MessageDetail.Role)}
                value={<StatusBadge status={message.role} />}
              />
              <AdminDetailField label={t(AppLocales.Admin.Chat.MessageDetail.RoomId)} value={message.room_id} />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={formatAdminDate(message.created_at)}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={formatAdminDate(message.updated_at)}
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Chat.MessageDetail.Content)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <div className="whitespace-pre-wrap wrap-break-word leading-relaxed text-base-content">
              {message.content}
            </div>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
