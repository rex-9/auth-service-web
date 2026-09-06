// src/modules/admin/notification/pages/AdminNotificationForm.tsx

import React, { useMemo, useState } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import type {
  IAdminNotificationTemplate,
  IAdminNotificationTemplateFormValues,
} from "../types";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  type TNotificationChannel,
} from "../constants";
import {
  AlertDialog,
  Checkbox,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
  TextInput,
} from "../../components";
import { ADMIN_ACTIONS } from "../../constants";

export interface IAdminNotificationFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  template?: IAdminNotificationTemplate;
  onSubmit: (values: IAdminNotificationTemplateFormValues) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: IAdminNotificationTemplateFormValues = {
  event: "",
  name: "",
  description: "",
  category: NOTIFICATION_CATEGORIES.MARKETING,
  link: "",
  admin: true,
  in_app_title: "",
  in_app_body: "",
  push_title: "",
  push_body: "",
  push_template_id: "",
  email_subject: "",
  email_body: "",
  email_template_id: "",
};

export const AdminNotificationForm: React.FC<IAdminNotificationFormProps> = ({
  mode,
  template,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const isCreate = mode === ADMIN_ACTIONS.CREATE;

  const [formValues, setFormValues] =
    useState<IAdminNotificationTemplateFormValues>(() => {
      if (template) {
        return {
          event: template.event || "",
          name: template.name || "",
          description: template.description || "",
          category: template.category || NOTIFICATION_CATEGORIES.MARKETING,
          link: template.link || "",
          admin: template.admin ?? true,
          in_app_title: template.in_app_title || "",
          in_app_body: template.in_app_body || "",
          push_title: template.push_title || "",
          push_body: template.push_body || "",
          push_template_id: template.push_template_id || "",
          email_subject: template.email_subject || "",
          email_body: template.email_body || "",
          email_template_id: template.email_template_id || "",
        };
      }
      return emptyForm;
    });

  const [activeChannelTab, setActiveChannelTab] =
    useState<TNotificationChannel>(NOTIFICATION_CHANNELS.IN_APP);
  const [alertMessage, setAlertMessage] = useState("");

  const categoryOptions = useMemo(
    () => [
      { value: NOTIFICATION_CATEGORIES.MARKETING, label: "Marketing" },
      { value: NOTIFICATION_CATEGORIES.BROADCAST, label: "Broadcast" },
      { value: NOTIFICATION_CATEGORIES.SYSTEM, label: "System" },
    ],
    [],
  );

  const handleChange = (
    field: keyof IAdminNotificationTemplateFormValues,
    value: any,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreate && !formValues.event.trim()) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Templates.Dialog.EventRequired),
      );
      return;
    }

    if (!formValues.name.trim()) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Templates.Dialog.NameRequired),
      );
      return;
    }

    await onSubmit(formValues);
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <FormContainer onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Template General Information */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-base-200 pb-3">
            <iconsLib.document className="h-5 w-5 text-primary" />
            <h3 className="text-body-m font-bold text-base-content">
              {t(AppLocales.Admin.Notifications.Templates.Dialog.GeneralInfo)}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.EventLabel,
              )}
              placeholder={t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .EventPlaceholder,
              )}
              value={formValues.event}
              onChange={(e) => handleChange("event", e.target.value)}
              disabled={!isCreate}
              required={isCreate}
              helperText={
                !isCreate
                  ? "Event identifier is unique and cannot be modified."
                  : undefined
              }
            />

            <TextInput
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.NameLabel,
              )}
              placeholder={t(
                AppLocales.Admin.Notifications.Templates.Dialog.NamePlaceholder,
              )}
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.CategoryLabel,
              )}
              options={categoryOptions}
              value={formValues.category}
              onValueChange={(val) => handleChange("category", val)}
            />

            <TextInput
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.LinkLabel,
              )}
              placeholder={t(
                AppLocales.Admin.Notifications.Templates.Dialog.LinkPlaceholder,
              )}
              value={formValues.link || ""}
              onChange={(e) => handleChange("link", e.target.value)}
            />
          </div>

          <TextArea
            label={t(AppLocales.Admin.Notifications.Templates.Dialog.DescLabel)}
            placeholder={t(
              AppLocales.Admin.Notifications.Templates.Dialog.DescPlaceholder,
            )}
            value={formValues.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />

          <div className="pt-1">
            <Checkbox
              checked={formValues.admin}
              onChange={(e) => handleChange("admin", e.target.checked)}
            >
              {t(AppLocales.Admin.Notifications.Templates.Dialog.AdminOnly)}
            </Checkbox>
          </div>
        </div>

        {/* Section 2: Multi-Channel Content */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-base-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <iconsLib.sparkles className="h-5 w-5 text-secondary" />
              <h3 className="text-body-m font-bold text-base-content">
                {t(
                  AppLocales.Admin.Notifications.Templates.Dialog.ChannelContent,
                )}
              </h3>
            </div>
            <span className="text-caption text-xs text-base-content/50">
              {t(AppLocales.Admin.Notifications.Templates.Dialog.VariablesHint)}
            </span>
          </div>

          {/* Channel Tabs */}
          <div className="flex gap-2 border-b border-base-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveChannelTab(NOTIFICATION_CHANNELS.IN_APP)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-body-s font-semibold rounded-lg transition-colors ${
                activeChannelTab === NOTIFICATION_CHANNELS.IN_APP
                  ? "bg-primary text-white shadow-sm"
                  : "text-base-content/60 hover:bg-base-200"
              }`}
            >
              <iconsLib.chat className="w-4 h-4" />
              {t(AppLocales.Admin.Notifications.Templates.Dialog.InAppTab)}
            </button>
            <button
              type="button"
              onClick={() => setActiveChannelTab(NOTIFICATION_CHANNELS.PUSH)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-body-s font-semibold rounded-lg transition-colors ${
                activeChannelTab === NOTIFICATION_CHANNELS.PUSH
                  ? "bg-primary text-white shadow-sm"
                  : "text-base-content/60 hover:bg-base-200"
              }`}
            >
              <iconsLib.bell className="w-4 h-4" />
              {t(AppLocales.Admin.Notifications.Templates.Dialog.PushTab)}
            </button>
            <button
              type="button"
              onClick={() => setActiveChannelTab(NOTIFICATION_CHANNELS.EMAIL)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-body-s font-semibold rounded-lg transition-colors ${
                activeChannelTab === NOTIFICATION_CHANNELS.EMAIL
                  ? "bg-primary text-white shadow-sm"
                  : "text-base-content/60 hover:bg-base-200"
              }`}
            >
              <iconsLib.mail className="w-4 h-4" />
              {t(AppLocales.Admin.Notifications.Templates.Dialog.EmailTab)}
            </button>
          </div>

          {/* Tab Contents */}
          {activeChannelTab === NOTIFICATION_CHANNELS.IN_APP && (
            <div className="space-y-4 pt-2">
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.InAppTitle,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .InAppTitlePlaceholder,
                )}
                value={formValues.in_app_title || ""}
                onChange={(e) => handleChange("in_app_title", e.target.value)}
              />
              <TextArea
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.InAppBody,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .InAppBodyPlaceholder,
                )}
                value={formValues.in_app_body || ""}
                onChange={(e) => handleChange("in_app_body", e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeChannelTab === NOTIFICATION_CHANNELS.PUSH && (
            <div className="space-y-4 pt-2">
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.PushTitle,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTitlePlaceholder,
                )}
                value={formValues.push_title || ""}
                onChange={(e) => handleChange("push_title", e.target.value)}
              />
              <TextArea
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.PushBody,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushBodyPlaceholder,
                )}
                value={formValues.push_body || ""}
                onChange={(e) => handleChange("push_body", e.target.value)}
                rows={4}
              />
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.PushTemplateId,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTemplateIdPlaceholder,
                )}
                value={formValues.push_template_id || ""}
                onChange={(e) =>
                  handleChange("push_template_id", e.target.value)
                }
              />
            </div>
          )}

          {activeChannelTab === NOTIFICATION_CHANNELS.EMAIL && (
            <div className="space-y-4 pt-2">
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.EmailSubject,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailSubjectPlaceholder,
                )}
                value={formValues.email_subject || ""}
                onChange={(e) => handleChange("email_subject", e.target.value)}
              />
              <TextArea
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.EmailBody,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailBodyPlaceholder,
                )}
                value={formValues.email_body || ""}
                onChange={(e) => handleChange("email_body", e.target.value)}
                rows={6}
              />
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailTemplateId,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailTemplateIdPlaceholder,
                )}
                value={formValues.email_template_id || ""}
                onChange={(e) =>
                  handleChange("email_template_id", e.target.value)
                }
              />
            </div>
          )}
        </div>

        {/* Action Row */}
        <FormActionRow
          cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
          submitLabel={
            isCreate
              ? t(AppLocales.Admin.Notifications.Templates.NewTemplate)
              : t(AppLocales.Admin.Common.Actions.Save)
          }
          onCancel={onCancel}
        />
      </FormContainer>
    </>
  );
};
