// src/modules/admin/feedback/pages/AdminFeedbackPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Dropdown,
  DropdownSizes,
  getCategoryBadgeVariant,
  getPriorityBadgeVariant,
  StatusBadge,
} from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
import type { IAdminFeedback } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  AdminTableActions,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  ADMIN_FEEDBACK_CATEGORY,
  ADMIN_FEEDBACK_PRIORITY,
  ADMIN_FEEDBACK_SORT_KEYS,
  ADMIN_FEEDBACK_STATUS,
  ADMIN_FEEDBACK_TABLE_KEYS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { Admin } from "../..";

export const AdminFeedbacksPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Feedback.Title)} | Admin`);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const categoryFilter = searchParams.get("category") || "";
  const priorityFilter = searchParams.get("priority") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_FEEDBACK_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [feedbacks, setFeedbacks] = useState<IAdminFeedback[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const updateFilters = useCallback(
    (updates: {
      page?: number;
      status?: string;
      category?: string;
      priority?: string;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.status !== undefined) {
            if (updates.status) next.set("status", updates.status);
            else next.delete("status");
          }
          if (updates.category !== undefined) {
            if (updates.category) next.set("category", updates.category);
            else next.delete("category");
          }
          if (updates.priority !== undefined) {
            if (updates.priority) next.set("priority", updates.priority);
            else next.delete("priority");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadFeedbacks = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.FEEDBACKS)) return;

    setLoading(true);
    setError("");

    const result = await Admin.FeedbackController.getFeedbacks({
      page,
      limit: ADMIN_PAGE_SIZE,
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      priority: priorityFilter || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setFeedbacks(result.feedbacks);
      setPagination(result.pagination);
    } else {
      setError(
        result.error || t(AppLocales.Admin.Feedback.Errors.LoadListFailed),
      );
    }

    setLoading(false);
  }, [
    can,
    page,
    statusFilter,
    categoryFilter,
    priorityFilter,
    setLoading,
    sortBy,
    sortOrder,
    t,
  ]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadFeedbacks();
    }
  }, [loadFeedbacks, permissionsLoading]);

  const columns: IAdminTableColumn<IAdminFeedback>[] = useMemo(
    () => [
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.CATEGORY,
        header: t(AppLocales.Admin.Feedback.Table.Category),
        render: (item) => (
          <StatusBadge
            status={item.category}
            variant={getCategoryBadgeVariant(item.category)}
          />
        ),
      },
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.CONTENT,
        header: t(AppLocales.Admin.Feedback.Table.Content),
        sortKey: ADMIN_FEEDBACK_SORT_KEYS.RATING,
        render: (item) => (
          <div className="max-w-md">
            <div className="line-clamp-2 text-body-m font-medium text-base-content">
              {item.content}
            </div>
            {item.rating && (
              <div className="text-caption text-warning pt-0.5">
                {"⭐".repeat(item.rating)} ({item.rating}/10)
              </div>
            )}
            {item.admin_notes && (
              <div className="line-clamp-1 text-caption text-primary opacity-80 text-xs mt-0.5">
                Note: {item.admin_notes}
              </div>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.USER,
        header: t(AppLocales.Admin.Feedback.Table.User),
        sortKey: ADMIN_FEEDBACK_SORT_KEYS.USER_NAME,
        render: (item) => (
          <div>
            <div className="font-semibold text-base-content">
              {item.user_name || item.user_email || "Anonymous"}
            </div>
            {item.platform && (
              <div className="text-caption text-base-content opacity-60 text-xs">
                {item.platform} • {item.app_version || "web"}
              </div>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.STATUS,
        header: t(AppLocales.Admin.Feedback.Table.Status),
        render: (item) => <StatusBadge status={item.status} />,
      },
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.PRIORITY,
        header: t(AppLocales.Admin.Feedback.Table.Priority),
        render: (item) => (
          <StatusBadge
            status={item.priority || "medium"}
            variant={getPriorityBadgeVariant(item.priority)}
          />
        ),
      },
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.CREATED_AT,
        header: t(AppLocales.Admin.Common.Table.CreatedAt),
        sortKey: ADMIN_FEEDBACK_SORT_KEYS.CREATED_AT,
        className: "text-center",
        render: (item) => formatAdminDate(item.created_at),
      },
      {
        key: ADMIN_FEEDBACK_TABLE_KEYS.ACTIONS,
        header: "",
        className: "text-right",
        render: (item) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.FEEDBACKS}
            actions={[
              {
                type: ADMIN_ACTIONS.REVIEW,
                onClick: () =>
                  navigate(
                    AppRoutes.withId(
                      AppRoutes.client.protected.admin.FEEDBACK_DETAIL,
                      item.id,
                    ),
                  ),
              },
            ]}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Feedback.Title)}
        description={t(AppLocales.Admin.Feedback.Description)}
      />

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-44"
          value={statusFilter}
          onValueChange={(val) => updateFilters({ status: val, page: 1 })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Feedback.Filters.AllStatuses),
            },
            {
              value: ADMIN_FEEDBACK_STATUS.NEW,
              label: t(AppLocales.Admin.Feedback.Filters.Open),
            },
            {
              value: ADMIN_FEEDBACK_STATUS.IN_PROGRESS,
              label: t(AppLocales.Admin.Feedback.Filters.InReview),
            },
            {
              value: ADMIN_FEEDBACK_STATUS.RESOLVED,
              label: t(AppLocales.Admin.Feedback.Filters.Resolved),
            },
            {
              value: ADMIN_FEEDBACK_STATUS.CLOSED,
              label: t(AppLocales.Admin.Feedback.Filters.Closed),
            },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-44"
          value={categoryFilter}
          onValueChange={(val) => updateFilters({ category: val, page: 1 })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Feedback.Filters.AllCategories),
            },
            {
              value: ADMIN_FEEDBACK_CATEGORY.BUG,
              label: t(AppLocales.Admin.Feedback.Filters.Bug),
            },
            {
              value: ADMIN_FEEDBACK_CATEGORY.FEATURE_REQUEST,
              label: t(AppLocales.Admin.Feedback.Filters.FeatureRequest),
            },
            {
              value: ADMIN_FEEDBACK_CATEGORY.IMPROVEMENT,
              label: t(AppLocales.Admin.Feedback.Filters.Improvement),
            },
            {
              value: ADMIN_FEEDBACK_CATEGORY.GENERAL,
              label: t(AppLocales.Admin.Feedback.Filters.General),
            },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-44"
          value={priorityFilter}
          onValueChange={(val) => updateFilters({ priority: val, page: 1 })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Feedback.Filters.AllPriorities),
            },
            {
              value: ADMIN_FEEDBACK_PRIORITY.CRITICAL,
              label: t(AppLocales.Admin.Feedback.Filters.Urgent),
            },
            {
              value: ADMIN_FEEDBACK_PRIORITY.URGENT,
              label: t(AppLocales.Admin.Feedback.Filters.Urgent),
            },
            {
              value: ADMIN_FEEDBACK_PRIORITY.HIGH,
              label: t(AppLocales.Admin.Feedback.Filters.High),
            },
            {
              value: ADMIN_FEEDBACK_PRIORITY.MEDIUM,
              label: t(AppLocales.Admin.Feedback.Filters.Normal),
            },
            {
              value: ADMIN_FEEDBACK_PRIORITY.LOW,
              label: t(AppLocales.Admin.Feedback.Filters.Low),
            },
          ]}
        />
      </div>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && feedbacks.length === 0 ? (
        <AdminState
          icon={iconsLib.mail}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable<IAdminFeedback>
            records={feedbacks}
            columns={columns}
            getRowKey={(record) => record.id}
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
    </div>
  );
};
