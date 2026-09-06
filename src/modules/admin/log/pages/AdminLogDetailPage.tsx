// src/modules/admin/log/pages/AdminLogDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge } from "../../../../design";
import { BadgeVariants, ButtonVariants } from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";
import { ADMIN_LOG_SEVERITY } from "../constants";
import type { IAdminLog } from "../types";
import AdminLogController from "../log.controller";
import { AlertDialog, AdminState, PageHeader } from "../../components";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminLogDetailPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Logs.Drawer.Title)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const { can } = usePermissions();

  const [log, setLog] = useState<IAdminLog | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const canUpdate = can(ADMIN_ACTIONS.UPDATE, ADMIN_RESOURCES.CLIENTS);

  useEffect(() => {
    if (!id) return;

    const loadLog = async () => {
      setLoading(true);
      const result = await AdminLogController.getLog(id);
      setLoading(false);

      if (result.success && result.log) {
        setLog(result.log);
      } else {
        setError(result.error || "Failed to load log details");
      }
    };

    void loadLog();
  }, [id, setLoading]);

  const handleToggleResolve = async () => {
    if (!id || !log) return;

    const isResolved = Boolean(log.resolved_at);
    setIsUpdating(true);

    const result = isResolved
      ? await AdminLogController.unresolveLog(id)
      : await AdminLogController.resolveLog(id);

    setIsUpdating(false);

    if (result.success && result.log) {
      setLog(result.log);
      toast.success(
        isResolved
          ? t(AppLocales.Admin.Logs.Toasts.UnresolveSuccess)
          : t(AppLocales.Admin.Logs.Toasts.ResolveSuccess),
      );
    } else {
      setAlertMessage(result.error || "Failed to update log status");
    }
  };

  const isResolved = Boolean(log?.resolved_at);

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title={t(AppLocales.Admin.Logs.Drawer.Title)}
        description="Detailed telemetry diagnostic report and stack trace analysis"
        action={
          <div className="flex items-center gap-2">
            {canUpdate && log && (
              <Button
                variant={
                  isResolved ? ButtonVariants.SECONDARY : ButtonVariants.PRIMARY
                }
                onClick={handleToggleResolve}
                isLoading={isUpdating}
              >
                {isResolved
                  ? t(AppLocales.Admin.Logs.Drawer.MarkUnresolved)
                  : t(AppLocales.Admin.Logs.Drawer.MarkResolved)}
              </Button>
            )}
            <Button
              variant={ButtonVariants.SECONDARY}
              onClick={() => navigate(AppRoutes.client.protected.admin.LOGS)}
            >
              <iconsLib.arrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>
        }
      />

      {error && !log ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : log ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metadata Card */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
            <h3 className="font-semibold text-base-content text-lg">
              Telemetry Summary
            </h3>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">Severity</span>
                <StatusBadge
                  status={log.severity}
                  variant={
                    log.severity === ADMIN_LOG_SEVERITY.FATAL ||
                    log.severity === ADMIN_LOG_SEVERITY.ERROR
                      ? BadgeVariants.ERROR
                      : BadgeVariants.WARNING
                  }
                />
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">Status</span>
                <StatusBadge
                  status={isResolved ? "resolved" : "unresolved"}
                  variant={
                    isResolved ? BadgeVariants.SUCCESS : BadgeVariants.WARNING
                  }
                />
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Logs.Table.Occurrences)}
                </span>
                <span className="font-semibold text-base-content">
                  {log.occurrence_count}
                </span>
              </div>

              {log.platform && (
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Logs.Table.Platform)}
                  </span>
                  <StatusBadge
                    status={log.platform}
                    variant={BadgeVariants.SECONDARY}
                  />
                </div>
              )}

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Common.Table.CreatedAt)}
                </span>
                <span className="text-base-content/70">
                  {formatAdminDate(log.created_at)}
                </span>
              </div>

              {log.last_occurred_at && (
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Logs.Table.Timestamp)}
                  </span>
                  <span className="text-base-content/70">
                    {formatAdminDate(log.last_occurred_at)}
                  </span>
                </div>
              )}

              {log.resolved_at && (
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">Resolved At</span>
                  <span className="text-success font-medium">
                    {formatAdminDate(log.resolved_at)}
                  </span>
                </div>
              )}

              <div className="pt-2 text-xs opacity-75 font-mono space-y-1">
                <div>
                  <span className="font-semibold">
                    {t(AppLocales.Admin.Logs.Drawer.Url)}:
                  </span>{" "}
                  {log.method || "GET"} {log.url || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Device Spec:</span>{" "}
                  {[log.browser, log.os, log.device, log.app_version]
                    .filter(Boolean)
                    .join(" • ") || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-2">
              <label className="block text-caption font-semibold text-base-content opacity-70">
                {t(AppLocales.Admin.Logs.Drawer.Message)}
              </label>
              <div className="rounded-lg border border-error/30 bg-error/5 p-4 font-mono text-sm text-error font-medium break-all">
                {log.message}
              </div>
            </div>

            {/* Stack Trace */}
            {log.stack_trace && log.stack_trace.length > 0 && (
              <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-2">
                <label className="block text-caption font-semibold text-base-content opacity-70">
                  {t(AppLocales.Admin.Logs.Drawer.StackTrace)}
                </label>
                <div className="max-h-80 overflow-auto rounded-lg border border-base-300 bg-base-300 p-4 font-mono text-xs text-base-content whitespace-pre leading-relaxed">
                  {log.stack_trace.join("\n")}
                </div>
              </div>
            )}

            {/* Context Payload */}
            {log.context && Object.keys(log.context).length > 0 && (
              <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-2">
                <label className="block text-caption font-semibold text-base-content opacity-70">
                  {t(AppLocales.Admin.Logs.Drawer.StorageSnapshot)}
                </label>
                <pre className="max-h-60 overflow-auto rounded-lg border border-base-300 bg-base-200 p-4 font-mono text-xs text-base-content">
                  {JSON.stringify(log.context, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
