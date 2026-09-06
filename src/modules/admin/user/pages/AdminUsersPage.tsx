// src/modules/admin/user/pages/AdminUsersPage.tsx

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
import {
  Button,
  Badge,
  SearchInput,
  getRoleBadgeVariant,
} from "../../../../design";
import UserController from "../user.controller";
import type { IAdminUser } from "../types";
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
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_USER_SORT_KEYS,
  ADMIN_USER_TABLE_KEYS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { BadgeSizes } from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";

const renderUserRoles = (user: IAdminUser, unassignedLabel: string) => {
  const roles: string[] =
    user.role_names ?? user.roles ?? (user.role ? [user.role] : []);
  if (!roles.length) {
    return (
      <span className="text-caption text-base-content opacity-50">
        {unassignedLabel}
      </span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {roles.map((role) => (
        <Badge
          key={role}
          size={BadgeSizes.XS}
          variant={getRoleBadgeVariant(role)}
        >
          {role}
        </Badge>
      ))}
    </div>
  );
};

type UserLifecycleAction =
  | typeof ADMIN_ACTIONS.DISCARD
  | typeof ADMIN_ACTIONS.UNDISCARD;

interface IAdminUsersPageProps {
  view?: TAdminViewMode;
}

export const AdminUsersPage: React.FC<IAdminUsersPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const t = useTranslate();
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? `${t(AppLocales.Admin.Users.Title)} | Admin`
      : `${t(AppLocales.Admin.Users.RecycleTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy:
      view === ADMIN_VIEW_MODES.ACTIVE
        ? ADMIN_USER_SORT_KEYS.CREATED_AT
        : ADMIN_USER_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const [searchInput, setSearchInput] = useState(searchQuery);
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [actionTarget, setActionTarget] = useState<IAdminUser | null>(null);
  const [lifecycleAction, setLifecycleAction] =
    useState<UserLifecycleAction | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number; search?: string }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.search !== undefined) {
            if (updates.search.trim())
              next.set("search", updates.search.trim());
            else next.delete("search");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Keep local search input in sync if URL search param changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Debounce search input by 300ms before updating URL and querying API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        updateFilters({ search: searchInput.trim(), page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateFilters]);

  const loadUsers = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS)) return;

    setLoading(true);
    setError("");

    const result =
      view === ADMIN_VIEW_MODES.ACTIVE
        ? await UserController.getUsers({
            page,
            limit: ADMIN_PAGE_SIZE,
            search: searchQuery.trim() || undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
          })
        : await UserController.getDiscardedUsers({
            page,
            limit: ADMIN_PAGE_SIZE,
          });

    if (result.success) {
      setUsers(result.users);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Users.Errors.LoadListFailed));
    }
    setLoading(false);
  }, [can, page, searchQuery, setLoading, sortBy, sortOrder, t, view]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadUsers();
    }
  }, [loadUsers, permissionsLoading]);

  const openLifecycleDialog = (
    user: IAdminUser,
    action: UserLifecycleAction,
  ) => {
    setActionTarget(user);
    setLifecycleAction(action);
  };

  const closeLifecycleDialog = () => {
    if (isLoading) return;

    setActionTarget(null);
    setLifecycleAction(null);
  };

  const columns = useMemo<IAdminTableColumn<IAdminUser>[]>(
    () => [
      {
        key: ADMIN_USER_TABLE_KEYS.IDENTITY,
        header: t(AppLocales.Admin.Users.Table.User),
        sortKey: ADMIN_USER_SORT_KEYS.NAME,
        render: (user) => (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base-content">
                {user.name || user.username || user.email}
              </span>
              {user.username && (
                <span className="text-caption text-base-content opacity-50 text-xs">
                  (@{user.username})
                </span>
              )}
            </div>
            <div className="text-caption text-base-content opacity-60 text-xs">
              {user.email}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.ROLE,
        header: t(AppLocales.Admin.Users.Table.Roles),
        render: (user) => renderUserRoles(user, "Unassigned"),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.LIFECYCLE_DATE,
        header:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Common.Table.CreatedAt)
            : t(AppLocales.Admin.Common.Table.DiscardedAt),
        sortKey:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_USER_SORT_KEYS.CREATED_AT
            : ADMIN_USER_SORT_KEYS.DISCARDED_AT,
        className: "text-center",
        render: (user) =>
          formatAdminDate(
            view === ADMIN_VIEW_MODES.ACTIVE
              ? user.created_at
              : user.discarded_at,
          ),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.ACTIONS,
        header: t(AppLocales.Admin.Common.Table.Actions),
        className: "text-right",
        render: (user) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.USERS}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.USER_EDIT,
                            user.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      onClick: () =>
                        openLifecycleDialog(user, ADMIN_ACTIONS.DISCARD),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () =>
                        openLifecycleDialog(user, ADMIN_ACTIONS.UNDISCARD),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, t, view],
  );

  const handleLifecycleAction = async () => {
    if (
      !actionTarget ||
      !lifecycleAction ||
      !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.USERS)
    )
      return;

    setLoading(true);

    const result =
      lifecycleAction === ADMIN_ACTIONS.DISCARD
        ? await UserController.discardUser(actionTarget.id)
        : await UserController.undiscardUser(actionTarget.id);

    setLoading(false);

    if (result.success) {
      toast.success(
        result.message ||
          (lifecycleAction === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Users.Toasts.DiscardSuccess)
            : t(AppLocales.Admin.Users.Toasts.RestoreSuccess)),
      );
      setActionTarget(null);
      setLifecycleAction(null);
      void loadUsers();
    } else {
      toast.error(
        result.error ||
          (lifecycleAction === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Users.Errors.DeleteFailed)
            : t(AppLocales.Admin.Users.Errors.UpdateFailed)),
      );
    }
  };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.USERS);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Users.Title)
            : t(AppLocales.Admin.Users.RecycleTitle)
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Users.Description)
            : t(AppLocales.Admin.Users.RecycleDescription)
        }
        action={
          view === "active" && canCreate ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.USER_CREATE)
              }
            >
              <iconsLib.plus className="mr-2 h-4 w-4" />
              {t(AppLocales.Admin.Users.Form.CreateUser)}
            </Button>
          ) : null
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.USERS) && (
            <Tabs
              value={view}
              onChange={(tab) => {
                navigate(
                  tab === ADMIN_VIEW_MODES.ACTIVE
                    ? AppRoutes.client.protected.admin.USERS
                    : AppRoutes.client.protected.admin.USERS_RECYCLE_BIN,
                );
                updateFilters({ page: 1 });
              }}
              items={[
                { value: ADMIN_VIEW_MODES.ACTIVE, label: t(AppLocales.Admin.Users.Tabs.ActiveUsers) },
                { value: ADMIN_VIEW_MODES.DISCARDED, label: t(AppLocales.Admin.Users.Tabs.RecycleBin) },
              ]}
            />
          )}
          <div className="w-full sm:w-72">
            <SearchInput
              placeholder={t(AppLocales.Admin.Users.SearchPlaceholder)}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClear={() => setSearchInput("")}
            />
          </div>
        </div>
      </PageHeader>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && users.length === 0 ? (
        <AdminState
          icon={iconsLib.user}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={users}
            getRowKey={(user) => user.id}
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

      {/* Discard / Restore Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(actionTarget && lifecycleAction)}
        title={
          lifecycleAction === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardTitle)
            : t(AppLocales.Admin.Common.Confirm.RestoreTitle)
        }
        message={
          lifecycleAction === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardMessage)
            : t(AppLocales.Admin.Common.Confirm.RestoreMessage)
        }
        confirmLabel={
          lifecycleAction === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Actions.Discard)
            : t(AppLocales.Admin.Common.Actions.Restore)
        }
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={lifecycleAction === ADMIN_ACTIONS.DISCARD}
        isLoading={isLoading}
        onClose={closeLifecycleDialog}
        onConfirm={handleLifecycleAction}
      />
    </div>
  );
};

