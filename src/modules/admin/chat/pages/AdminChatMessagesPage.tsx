// src/modules/admin/chat/pages/AdminChatMessagesPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import { BadgeVariants, StatusBadge } from "../../../../design";
import ChatController from "../chat.controller";
import type { IAdminChatMessage } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import { formatAdminDate, truncateAdminText } from "../../helpers/admin.helper";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_CHAT_MESSAGE_SORT_KEYS,
  ADMIN_CHAT_MESSAGE_TABLE_KEYS,
  ADMIN_CHAT_ROLES,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

interface IAdminChatMessagesPageProps {
  view?: TAdminViewMode;
}

export const AdminChatMessagesPage: React.FC<IAdminChatMessagesPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const t = useTranslate();
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? `${t(AppLocales.Admin.Chat.MessagesTitle)} | Admin`
      : `${t(AppLocales.Admin.Chat.MessagesRecycleTitle)} | Admin`,
  );

  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy:
      view === ADMIN_VIEW_MODES.ACTIVE
        ? ADMIN_CHAT_MESSAGE_SORT_KEYS.CREATED_AT
        : ADMIN_CHAT_MESSAGE_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [messages, setMessages] = useState<IAdminChatMessage[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [discardTarget, setDiscardTarget] = useState<IAdminChatMessage | null>(
    null,
  );
  const [destroyTarget, setDestroyTarget] = useState<IAdminChatMessage | null>(
    null,
  );

  const updateFilters = useCallback(
    (updates: { page?: number }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadMessages = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.MESSAGES)) return;

    setLoading(true);
    setError("");

    const result = await ChatController.getMessages({
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
    });

    if (result.success) {
      setMessages(result.messages);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Chat.Errors.LoadMessages));
    }
    setLoading(false);
  }, [can, page, setLoading, sortBy, sortOrder, t, view]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const handleUndiscard = async (message: IAdminChatMessage) => {
    setLoading(true);
    const result = await ChatController.undiscardMessage(message.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.MessageRestoreSuccess));
      void loadMessages();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Chat.Errors.UpdateMessage));
    }
  };

  const columns = useMemo<IAdminTableColumn<IAdminChatMessage>[]>(
    () => [
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.ROLE,
        header: t(AppLocales.Admin.Chat.MessagesTable.Role),
        sortKey: ADMIN_CHAT_MESSAGE_SORT_KEYS.ROLE,
        render: (message) => (
          <StatusBadge
            status={message.role}
            variant={
              message.role === ADMIN_CHAT_ROLES.ASSISTANT
                ? BadgeVariants.PRIMARY
                : BadgeVariants.DEFAULT
            }
          />
        ),
      },
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.CONTENT,
        header: t(AppLocales.Admin.Chat.MessagesTable.Message),
        render: (message) => (
          <div className="max-w-md">
            <div className="line-clamp-2 text-body-m text-base-content">
              {truncateAdminText(message.content)}
            </div>
            <div className="text-caption text-base-content opacity-50 font-mono text-xs pt-0.5">
              Room: {message.room_id}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.CREATED,
        header: t(AppLocales.Admin.Common.Table.CreatedAt),
        sortKey: ADMIN_CHAT_MESSAGE_SORT_KEYS.CREATED_AT,
        className: "text-center",
        render: (message) => formatAdminDate(message.created_at),
      },
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.ACTIONS,
        header: t(AppLocales.Admin.Common.Table.Actions),
        className: "text-right",
        render: (message) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.MESSAGES}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.CHAT_MESSAGE_EDIT,
                            message.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      onClick: () => setDiscardTarget(message),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () => void handleUndiscard(message),
                    },
                    {
                      type: ADMIN_ACTIONS.DESTROY,
                      onClick: () => setDestroyTarget(message),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, t, view],
  );

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);

    const result = await ChatController.discardMessage(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.MessageDiscardSuccess));
      setDiscardTarget(null);
      void loadMessages();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Chat.Errors.DeleteMessage));
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;

    setLoading(true);

    const result = await ChatController.deleteMessage(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.MessageDestroySuccess));
      setDestroyTarget(null);
      void loadMessages();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Chat.Errors.DeleteMessage));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Chat.MessagesTitle)
            : t(AppLocales.Admin.Chat.MessagesRecycleTitle)
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Chat.MessagesDescription)
            : t(AppLocales.Admin.Chat.MessagesRecycleDescription)
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.MESSAGES) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.CHAT_MESSAGES
                  : AppRoutes.client.protected.admin.CHAT_MESSAGES_RECYCLE_BIN,
              );
              updateFilters({ page: 1 });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Chat.MessagesTabs.ActiveMessages),
                icon: iconsLib.feedback,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE
                    ? pagination?.total_count
                    : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Chat.MessagesTabs.RecycleBin),
                icon: iconsLib.trash,
                count:
                  view === ADMIN_VIEW_MODES.DISCARDED
                    ? pagination?.total_count
                    : undefined,
              },
            ]}
          />
        )}
      </PageHeader>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && messages.length === 0 ? (
        <AdminState
          icon={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? iconsLib.inboxStack
              : iconsLib.trash
          }
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={messages}
            getRowKey={(message) => message.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(discardTarget)}
        title={t(AppLocales.Admin.Common.Confirm.DiscardTitle)}
        message={t(AppLocales.Admin.Common.Confirm.DiscardMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDiscardTarget(null)}
        onConfirm={handleDiscard}
      />

      <ConfirmDialog
        isOpen={Boolean(destroyTarget)}
        title={t(AppLocales.Admin.Common.Confirm.DestroyTitle)}
        message={t(AppLocales.Admin.Common.Confirm.DestroyMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDestroyTarget(null)}
        onConfirm={handleDestroy}
      />
    </div>
  );
};

