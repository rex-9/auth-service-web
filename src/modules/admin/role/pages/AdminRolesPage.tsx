// src/modules/admin/role/pages/AdminRolesPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions, useSort, SORT_ORDERS } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge } from "../../../../design/components";
import RoleController from "../role.controller";
import type { IAdminRole } from "../types";
import {
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_ROLE_SORT_KEYS,
  ADMIN_ROLE_TABLE_KEYS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

const countPermissions = (role: IAdminRole): number =>
  Object.values(role.permissions ?? {}).reduce(
    (total, actions) => total + (actions?.length ?? 0),
    0,
  );

interface IAdminRolesPageProps {
  view?: TAdminViewMode;
}

export const AdminRolesPage: React.FC<IAdminRolesPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const t = useTranslate();
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? `${t(AppLocales.Admin.Roles.Title)} | Admin`
      : `${t(AppLocales.Admin.Roles.RecycleTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [error, setError] = useState("");
  const [discardTarget, setDiscardTarget] = useState<IAdminRole | null>(null);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_ROLE_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    const result = await RoleController.getRoles({
      sort_by: sortBy,
      sort_order: sortOrder,
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
    });

    if (result.success) {
      setRoles(result.roles);
    } else {
      setError(result.error || t(AppLocales.Admin.Roles.Errors.LoadList));
    }
    setLoading(false);
  }, [setLoading, sortBy, sortOrder, t, view]);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const handleUndiscard = async (role: IAdminRole) => {
    setLoading(true);
    const result = await RoleController.undiscardRole(role.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Roles.Toasts.RestoreSuccess));
      void fetchRoles();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Roles.Errors.Update));
    }
  };

  const columns = useMemo<IAdminTableColumn<IAdminRole>[]>(
    () => [
      {
        key: ADMIN_ROLE_TABLE_KEYS.NAME,
        header: t(AppLocales.Admin.Roles.Table.RoleName),
        sortKey: ADMIN_ROLE_SORT_KEYS.NAME,
        render: (role) => (
          <div>
            <div className="font-semibold text-base-content">{role.name}</div>
            <div className="text-caption text-base-content opacity-60 text-xs">
              {role.description || "—"}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.PERMISSIONS,
        header: t(AppLocales.Admin.Roles.Table.PermissionsCount),
        render: (role) => {
          const count = countPermissions(role);
          return (
            <span className="font-mono text-sm text-base-content font-medium">
              {count}
            </span>
          );
        },
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.USERS,
        header: t(AppLocales.Admin.Users.Title),
        render: (role) => (
          <span className="text-body-s font-medium">
            {role.user_count ?? 0}
          </span>
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.SYSTEM,
        header: t(AppLocales.Admin.Roles.Table.Type),
        render: (role) => (
          <StatusBadge
            status={role.system ? "system" : "custom"}
            label={
              role.system
                ? t(AppLocales.Admin.Common.Status.System)
                : t(AppLocales.Admin.Common.Status.Custom)
            }
          />
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.ACTIONS,
        header: t(AppLocales.Admin.Common.Table.Actions),
        className: "text-right",
        render: (role) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ROLES}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.ROLE_EDIT,
                            role.id,
                          ),
                        ),
                    },
                    ...(!role.system
                      ? [
                          {
                            type: ADMIN_ACTIONS.DISCARD,
                            onClick: () => setDiscardTarget(role),
                          },
                        ]
                      : []),
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () => void handleUndiscard(role),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, t, toast, view],
  );

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);

    const result = await RoleController.discardRole(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Roles.Toasts.DiscardSuccess));
      setDiscardTarget(null);
      void fetchRoles();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Roles.Errors.Delete));
    }
  };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.ROLES);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Roles.Title)
            : t(AppLocales.Admin.Roles.RecycleTitle)
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Roles.Description)
            : t(AppLocales.Admin.Roles.RecycleDescription)
        }
        action={
          canCreate && view === ADMIN_VIEW_MODES.ACTIVE ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.ROLE_CREATE)
              }
            >
              <iconsLib.plus className="mr-2 h-4 w-4" />
              {t(AppLocales.Admin.Roles.Form.CreateRole)}
            </Button>
          ) : null
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ROLES) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.ROLES
                  : AppRoutes.client.protected.admin.ROLES_RECYCLE_BIN,
              );
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Roles.Tabs.ActiveRoles),
                icon: iconsLib.shieldCheck,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE ? roles.length : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Roles.Tabs.RecycleBin),
                icon: iconsLib.trash,
                count:
                  view === ADMIN_VIEW_MODES.DISCARDED
                    ? roles.length
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
      ) : !isLoading && roles.length === 0 ? (
        <AdminState
          icon={view === ADMIN_VIEW_MODES.ACTIVE ? iconsLib.key : iconsLib.trash}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <AdminTable
          columns={columns}
          records={roles}
          getRowKey={(role) => role.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
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
    </div>
  );
};

