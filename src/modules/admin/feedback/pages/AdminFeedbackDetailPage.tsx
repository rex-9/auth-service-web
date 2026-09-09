// src/modules/admin/feedback/pages/AdminFeedbackDetailPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  Dropdown,
  StatusBadge,
  TextArea,
} from "../../../../design/components";
import {
  BadgeVariants,
  DropdownSizes,
} from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";
import type { IAdminFeedback } from "../types";
import {
  AlertDialog,
  AdminDetailHeader,
  AdminState,
  FormActionRow,
  FormContainer,
} from "../../components";
import { ADMIN_FEEDBACK_PRIORITY, ADMIN_FEEDBACK_STATUS } from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { Admin } from "../..";

export const AdminFeedbackDetailPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Feedback.Drawer.Title)} | ${t(AppLocales.Admin.Common.Detail.Admin)}`,
  );

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [feedback, setFeedback] = useState<IAdminFeedback | null>(null);
  const [status, setStatus] = useState<string>(ADMIN_FEEDBACK_STATUS.NEW);
  const [priority, setPriority] = useState<string>(
    ADMIN_FEEDBACK_PRIORITY.MEDIUM,
  );
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const statusOptions = useMemo(
    () => [
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
    ],
    [t],
  );

  const priorityOptions = useMemo(
    () => [
      {
        value: ADMIN_FEEDBACK_PRIORITY.LOW,
        label: t(AppLocales.Admin.Feedback.Filters.Low),
      },
      {
        value: ADMIN_FEEDBACK_PRIORITY.MEDIUM,
        label: t(AppLocales.Admin.Feedback.Filters.Normal),
      },
      {
        value: ADMIN_FEEDBACK_PRIORITY.HIGH,
        label: t(AppLocales.Admin.Feedback.Filters.High),
      },
      {
        value: ADMIN_FEEDBACK_PRIORITY.URGENT,
        label: t(AppLocales.Admin.Feedback.Filters.Urgent),
      },
      {
        value: ADMIN_FEEDBACK_PRIORITY.CRITICAL,
        label: t(AppLocales.Admin.Feedback.Filters.Urgent),
      },
    ],
    [t],
  );

  useEffect(() => {
    if (!id) return;

    const loadFeedback = async () => {
      setLoading(true);
      const result = await Admin.FeedbackController.getFeedback(id);
      setLoading(false);

      if (result.success && result.feedback) {
        setFeedback(result.feedback);
        setStatus(result.feedback.status || ADMIN_FEEDBACK_STATUS.NEW);
        setPriority(result.feedback.priority || ADMIN_FEEDBACK_PRIORITY.MEDIUM);
        setAdminNotes(result.feedback.admin_notes || "");
      } else {
        setError(
          result.error || t(AppLocales.Admin.Feedback.Errors.LoadListFailed),
        );
      }
    };

    void loadFeedback();
  }, [id, setLoading, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await Admin.FeedbackController.updateFeedback(id, {
      status,
      priority,
      admin_notes: adminNotes,
    });
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(t(AppLocales.Admin.Feedback.Toasts.StatusUpdateSuccess));
      navigate(AppRoutes.client.protected.admin.FEEDBACK);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Feedback.Errors.UpdateStatusFailed),
      );
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <AdminDetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          {
            label: t(AppLocales.Admin.Feedback.Title),
            to: AppRoutes.client.protected.admin.FEEDBACK,
          },
          { label: t(AppLocales.Admin.Feedback.Drawer.Title) },
        ]}
        title={t(AppLocales.Admin.Feedback.Drawer.Title)}
        description={t(AppLocales.Admin.Feedback.Detail.Description)}
        backTo={AppRoutes.client.protected.admin.FEEDBACK}
      />

      {error && !feedback ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : feedback ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Metadata Card */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
            <h3 className="font-semibold text-base-content text-lg">
              {t(AppLocales.Admin.Feedback.Detail.SubmissionInfo)}
            </h3>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Feedback.Table.User)}
                </span>
                <span className="font-medium text-base-content">
                  {feedback.user_name || feedback.user_email || t(AppLocales.Admin.Feedback.Detail.Anonymous)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Feedback.Table.Category)}
                </span>
                <StatusBadge
                  status={feedback.category}
                  variant={BadgeVariants.SECONDARY}
                />
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">{t(AppLocales.Admin.Feedback.Table.Rating)}</span>
                <span className="text-warning font-semibold">
                  {feedback.rating ? `⭐ ${feedback.rating}/10` : t(AppLocales.Admin.Feedback.Detail.None)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">{t(AppLocales.Admin.Common.Detail.Created)}</span>
                <span className="text-base-content/70">
                  {formatAdminDate(feedback.created_at)}
                </span>
              </div>

              {feedback.platform && (
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">{t(AppLocales.Admin.Feedback.Detail.Platform)}</span>
                  <StatusBadge
                    status={feedback.platform}
                    variant={BadgeVariants.INFO}
                  />
                </div>
              )}

              {(feedback.device || feedback.browser || feedback.os) && (
                <div className="pt-2 text-xs opacity-60 font-mono space-y-1">
                  <div>{t(AppLocales.Admin.Feedback.Detail.DeviceTelemetry)}:</div>
                  <div className="p-2 rounded bg-base-200 break-all">
                    {[
                      feedback.platform,
                      feedback.os,
                      feedback.browser,
                      feedback.device,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Content & Triage Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-2">
              <label className="block text-caption font-semibold text-base-content opacity-70">
                {t(AppLocales.Admin.Feedback.Table.Content)}
              </label>
              <div className="rounded-lg border border-base-300 bg-base-200/50 p-4 text-body-m text-base-content whitespace-pre-wrap leading-relaxed">
                {feedback.content}
              </div>
            </div>

            <FormContainer onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Dropdown
                    label={t(AppLocales.Admin.Feedback.Table.Status)}
                    value={status}
                    onValueChange={(val) => setStatus(val)}
                    options={statusOptions}
                    size={DropdownSizes.MD}
                  />
                  <Dropdown
                    label={t(AppLocales.Admin.Feedback.Table.Priority)}
                    value={priority}
                    onValueChange={(val) => setPriority(val)}
                    options={priorityOptions}
                    size={DropdownSizes.MD}
                  />
                </div>

                <TextArea
                  label={t(AppLocales.Admin.Feedback.Detail.AdminNotes)}
                  placeholder={t(AppLocales.Admin.Feedback.Detail.AdminNotesPlaceholder)}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <FormActionRow
                cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                submitLabel={t(AppLocales.Admin.Feedback.Drawer.UpdateStatus)}
                onCancel={() =>
                  navigate(AppRoutes.client.protected.admin.FEEDBACK)
                }
              />
            </FormContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
};
