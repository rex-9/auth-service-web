// src/modules/admin/notification/components/AdminNotificationTemplatesTab.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge, SearchInput, Dropdown } from "../../../../design/components";
import {
  AdminTable,
  AdminTableActions,
  ConfirmDialog,
  type IAdminTableColumn,
} from "../../components";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import { BadgeVariants, ButtonSizes, ButtonTypes, ButtonVariants } from "../../../../design/constants";
import { useTranslate, AppLocales } from "../../../../locales";
import NotificationController from "../notification.controller";
import type { IAdminNotificationTemplate } from "../types";
import { useToast } from "../../../../contexts/ToastContext";
import { NOTIFICATION_CATEGORIES } from "../constants";

export const AdminNotificationTemplatesTab: React.FC = () => {
  const t = useTranslate();
  const toast = useToast();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<IAdminNotificationTemplate[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Discard confirm state
  const [discardTarget, setDiscardTarget] =
    useState<IAdminNotificationTemplate | null>(null);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const fetchTemplates = useCallback(
    async (page = 1, searchQuery = search, category = categoryFilter) => {
      setIsLoading(true);
      try {
        const res = await NotificationController.getTemplates({
          page,
          limit: 15,
          search: searchQuery.trim() || undefined,
          category: category === "all" ? undefined : category,
        });

        if (res.success) {
          setTemplates(res.templates);
          setPagination(res.pagination);
          setCurrentPage(page);
        } else {
          toast.error(res.error || "Failed to load templates");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    },
    [search, categoryFilter, toast],
  );

  useEffect(() => {
    fetchTemplates(1, search, categoryFilter);
  }, [fetchTemplates, search, categoryFilter]);


  const handleConfirmDiscard = async () => {
    if (!discardTarget?.id) return;
    setIsDiscarding(true);
    try {
      const res = await NotificationController.discardTemplate(
        discardTarget.id,
      );
      if (res.success) {
        toast.success(
          t(AppLocales.Admin.Notifications.Templates.Toasts.DeleteSuccess),
        );
        setDiscardTarget(null);
        fetchTemplates(currentPage);
      } else {
        toast.error(res.error || "Failed to delete template");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete template");
    } finally {
      setIsDiscarding(false);
    }
  };

  const categoryOptions = [
    {
      value: "all",
      label: t(AppLocales.Admin.Notifications.Templates.AllCategories),
    },
    { value: NOTIFICATION_CATEGORIES.MARKETING, label: "Marketing" },
    { value: NOTIFICATION_CATEGORIES.BROADCAST, label: "Broadcast" },
    { value: NOTIFICATION_CATEGORIES.SYSTEM, label: "System" },
  ];

  const columns: IAdminTableColumn<IAdminNotificationTemplate>[] = [
    {
      key: "event_name",
      header: t(AppLocales.Admin.Notifications.Templates.Columns.TemplateEvent),
      render: (record) => (
        <div>
          <div className="font-semibold text-body-m text-base-content flex items-center gap-1.5">
            {record.name}
            {record.admin && (
              <span className="badge badge-xs badge-primary">Broadcast</span>
            )}
          </div>
          <div className="text-caption text-base-content/60 font-mono text-xs">
            {record.event}
          </div>
          {record.description && (
            <div className="text-caption text-base-content/50 text-xs mt-0.5 max-w-sm truncate">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: t(AppLocales.Admin.Notifications.Templates.Columns.Category),
      render: (record) => {
        const cat = record.category?.toLowerCase();
        const variant =
          cat === "system"
            ? BadgeVariants.INFO
            : cat === "broadcast"
              ? BadgeVariants.WARNING
              : BadgeVariants.SUCCESS;
        return (
          <StatusBadge status={record.category || "custom"} variant={variant} />
        );
      },
    },
    {
      key: "channels",
      header: t(AppLocales.Admin.Notifications.Templates.Columns.Channels),
      render: (record) => {
        const hasSocket = Boolean(
          record.in_app_title || record.in_app_body,
        );
        const hasPush = Boolean(
          record.push_title || record.push_body || record.push_template_id,
        );
        const hasEmail = Boolean(
          record.email_subject ||
            record.email_body ||
            record.email_template_id,
        );

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {hasSocket && (
              <span
                className="badge badge-sm badge-neutral font-medium gap-1"
                title="In-App (Socket)"
              >
                <iconsLib.chat className="w-3 h-3 text-primary" />
                In-App
              </span>
            )}
            {hasPush && (
              <span
                className="badge badge-sm badge-neutral font-medium gap-1"
                title="Push"
              >
                <iconsLib.bell className="w-3 h-3 text-warning" />
                Push
              </span>
            )}
            {hasEmail && (
              <span
                className="badge badge-sm badge-neutral font-medium gap-1"
                title="Email"
              >
                <iconsLib.mail className="w-3 h-3 text-info" />
                Email
              </span>
            )}
            {!hasSocket && !hasPush && !hasEmail && (
              <span className="text-caption text-base-content/40 text-xs">
                —
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "link",
      header: t(AppLocales.Admin.Notifications.Templates.Columns.TargetLink),
      render: (record) => (
        <span className="text-caption font-mono text-xs text-base-content/70">
          {record.link || "—"}
        </span>
      ),
    },
    {
      key: "stats",
      header: t(AppLocales.Admin.Notifications.Templates.Columns.SentRead),
      render: (record) => (
        <div className="text-caption text-xs">
          <span className="font-semibold text-base-content">
            {record.sent_count ?? 0}
          </span>{" "}
          sent /{" "}
          <span className="font-semibold text-success">
            {record.read_count ?? 0}
          </span>{" "}
          read
        </div>
      ),
    },
    {
      key: "actions",
      header: t(AppLocales.Admin.Notifications.Templates.Columns.Actions),
      className: "text-right",
      render: (record) => (
        <AdminTableActions
          resource={ADMIN_RESOURCES.NOTIFICATIONS}
          actions={[
            {
              type: ADMIN_ACTIONS.EDIT,
              onClick: () =>
                navigate(
                  AppRoutes.withId(
                    AppRoutes.client.protected.admin.NOTIFICATION_EDIT,
                    record.id || "",
                  ),
                ),
            },
            {
              type: ADMIN_ACTIONS.DISCARD,
              onClick: () => setDiscardTarget(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-base-100 p-4 rounded-xl border border-base-300">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
          <SearchInput
            placeholder={t(
              AppLocales.Admin.Notifications.Templates.SearchPlaceholder,
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="w-full"
          />
          <div className="w-40 shrink-0">
            <Dropdown
              options={categoryOptions}
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              className="w-full"
            />
          </div>
        </div>

        <Button
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.PRIMARY}
          size={ButtonSizes.MD}
          onClick={() =>
            navigate(AppRoutes.client.protected.admin.NOTIFICATION_CREATE)
          }
          className="w-full sm:w-auto"
        >
          <iconsLib.plus className="w-4 h-4 mr-1.5" />
          {t(AppLocales.Admin.Notifications.Templates.NewTemplate)}
        </Button>
      </div>

      {/* Templates Table */}
      <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-base-content/60">
            <span className="loading loading-spinner loading-md text-primary" />
            <p className="mt-2 text-body-s">
              {t(AppLocales.Admin.Notifications.Templates.Loading)}
            </p>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-12 text-center text-base-content/60">
            <iconsLib.inboxStack className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-body-m text-base-content/80">
              {t(AppLocales.Admin.Notifications.Templates.EmptyTitle)}
            </p>
            <p className="text-caption text-base-content/50 mt-1">
              {t(AppLocales.Admin.Notifications.Templates.EmptyDesc)}
            </p>
          </div>
        ) : (
          <>
            <AdminTable
              columns={columns}
              records={templates}
              getRowKey={(item) => item.id || item.event}
            />

            {/* Pagination Controls */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-base-300 bg-base-200/30">
                <span className="text-caption text-base-content/60 text-xs">
                  Page {pagination.current_page} of {pagination.total_pages} (
                  {pagination.total_count} templates)
                </span>
                <div className="flex gap-1">
                  <Button
                    type={ButtonTypes.BUTTON}
                    variant={ButtonVariants.SECONDARY}
                    size={ButtonSizes.SM}
                    disabled={!pagination.prev_page}
                    onClick={() => fetchTemplates(pagination.prev_page)}
                  >
                    Previous
                  </Button>
                  <Button
                    type={ButtonTypes.BUTTON}
                    variant={ButtonVariants.SECONDARY}
                    size={ButtonSizes.SM}
                    disabled={!pagination.next_page}
                    onClick={() => fetchTemplates(pagination.next_page)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Discard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(discardTarget)}
        onClose={() => setDiscardTarget(null)}
        onConfirm={handleConfirmDiscard}
        title={t(AppLocales.Admin.Notifications.Templates.DeleteTitle)}
        message={t(AppLocales.Admin.Notifications.Templates.DeleteMessage, {
          name: discardTarget?.name || "",
        })}
        confirmLabel={t(
          AppLocales.Admin.Notifications.Templates.DeleteConfirm,
        )}
        isDestructive={true}
        isLoading={isDiscarding}
      />
    </div>
  );
};

export default AdminNotificationTemplatesTab;
