// src/modules/admin/chat/pages/AdminChatRoomsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions, useSort, SORT_ORDERS } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import ChatController from "../chat.controller";
import type { IAdminChatRoom } from "../types";
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
  ADMIN_CHAT_ROOM_SORT_KEYS,
  ADMIN_CHAT_ROOM_TABLE_KEYS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

interface IAdminChatRoomsPageProps {
  view?: TAdminViewMode;
}

export const AdminChatRoomsPage: React.FC<IAdminChatRoomsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const t = useTranslate();
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? `${t(AppLocales.Admin.Chat.RoomsTitle)} | Admin`
      : `${t(AppLocales.Admin.Chat.RoomsRecycleTitle)} | Admin`,
  );

  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy:
      view === ADMIN_VIEW_MODES.ACTIVE
        ? ADMIN_CHAT_ROOM_SORT_KEYS.CREATED_AT
        : ADMIN_CHAT_ROOM_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [rooms, setRooms] = useState<IAdminChatRoom[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [discardTarget, setDiscardTarget] = useState<IAdminChatRoom | null>(null);
  const [destroyTarget, setDestroyTarget] = useState<IAdminChatRoom | null>(null);

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

  const loadRooms = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROOMS)) return;

    setLoading(true);
    setError("");

    const result = await ChatController.getRooms({
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
    });

    if (result.success) {
      setRooms(result.rooms);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Chat.Errors.LoadRooms));
    }
    setLoading(false);
  }, [can, page, setLoading, sortBy, sortOrder, t, view]);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const handleUndiscard = async (room: IAdminChatRoom) => {
    setLoading(true);
    const result = await ChatController.undiscardRoom(room.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.RoomRestoreSuccess));
      void loadRooms();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Chat.Errors.UpdateRoom));
    }
  };

  const columns = useMemo<IAdminTableColumn<IAdminChatRoom>[]>(
    () => [
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.TITLE,
        header: t(AppLocales.Admin.Chat.RoomsTable.Room),
        sortKey: ADMIN_CHAT_ROOM_SORT_KEYS.TITLE,
        render: (room) => (
          <div>
            <div className="font-semibold text-base-content">
              {room.title || "Untitled Room"}
            </div>
            {room.last_message && (
              <div className="text-body-s text-base-content opacity-60">
                {truncateAdminText(room.last_message)}
              </div>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.MESSAGES,
        header: t(AppLocales.Admin.Chat.RoomsTable.MessagesCount),
        sortKey: ADMIN_CHAT_ROOM_SORT_KEYS.MESSAGE_COUNT,
        render: (room) => (
          <span className="font-semibold text-base-content">
            {room.message_count ?? 0}
          </span>
        ),
      },
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.CREATED,
        header: t(AppLocales.Admin.Common.Table.CreatedAt),
        sortKey: ADMIN_CHAT_ROOM_SORT_KEYS.CREATED_AT,
        className: "text-center",
        render: (room) => formatAdminDate(room.created_at),
      },
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.ACTIONS,
        header: t(AppLocales.Admin.Common.Table.Actions),
        className: "text-right",
        render: (room) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ROOMS}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.CHAT_ROOM_EDIT,
                            room.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      onClick: () => setDiscardTarget(room),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () => void handleUndiscard(room),
                    },
                    {
                      type: ADMIN_ACTIONS.DESTROY,
                      onClick: () => setDestroyTarget(room),
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

    const result = await ChatController.discardRoom(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.RoomDiscardSuccess));
      setDiscardTarget(null);
      void loadRooms();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Chat.Errors.DeleteRoom));
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;

    setLoading(true);
    const result = await ChatController.deleteRoom(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Chat.Toasts.RoomDestroySuccess));
      setDestroyTarget(null);
      void loadRooms();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Chat.Errors.DeleteRoom));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Chat.RoomsTitle)
            : t(AppLocales.Admin.Chat.RoomsRecycleTitle)
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Chat.RoomsDescription)
            : t(AppLocales.Admin.Chat.RoomsRecycleDescription)
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ROOMS) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.CHAT_ROOMS
                  : AppRoutes.client.protected.admin.CHAT_ROOMS_RECYCLE_BIN,
              );
              updateFilters({ page: 1 });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Chat.RoomsTabs.ActiveRooms),
                icon: iconsLib.chatBubbleLeftRight,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE
                    ? pagination?.total_count
                    : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Chat.RoomsTabs.RecycleBin),
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
      ) : !isLoading && rooms.length === 0 ? (
        <AdminState
          icon={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? iconsLib.chatBubbleLeftRight
              : iconsLib.trash
          }
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={rooms}
            getRowKey={(room) => room.id}
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

