// src/modules/admin/access/pages/AdminAccessForm.tsx

import React, { useMemo, useState } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IAdminAccess } from "../types";
import {
  ADMIN_ACCESS_DURATION_OPTIONS,
  type TAdminAccessDurationOption,
} from "../constants";
import {
  AlertDialog,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
  TextInput,
} from "../../components";
import { StatusBadge } from "../../../../design/components";
import { ADMIN_ACTIONS } from "../../constants";
import { formatAdminDate } from "../../../../helpers";

export interface IAdminAccessFormValues {
  emails?: string[];
  usernames?: string[];
  code?: string;
  days?: number | null;
}

export interface IAdminAccessFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  access?: IAdminAccess;
  onSubmit: (values: IAdminAccessFormValues) => Promise<void>;
  onCancel: () => void;
}

export const AdminAccessForm: React.FC<IAdminAccessFormProps> = ({
  mode,
  access,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const isCreate = mode === ADMIN_ACTIONS.CREATE;

  // Create mode state
  const [emailsInput, setEmailsInput] = useState("");
  const [productCode, setProductCode] = useState("");
  const [durationOption, setDurationOption] =
    useState<TAdminAccessDurationOption>(ADMIN_ACCESS_DURATION_OPTIONS.DAYS_30);
  const [customDays, setCustomDays] = useState<number>(30);

  // Edit (extend) mode state
  const [extendDays, setExtendDays] = useState<number>(30);

  const [alertMessage, setAlertMessage] = useState("");

  const durationOptions = useMemo(
    () => [
      {
        value: ADMIN_ACCESS_DURATION_OPTIONS.DAYS_30,
        label: t(AppLocales.Admin.Accesses.GrantDialog.DurationDays, {
          days: 30,
        }),
      },
      {
        value: ADMIN_ACCESS_DURATION_OPTIONS.DAYS_90,
        label: t(AppLocales.Admin.Accesses.GrantDialog.DurationDays, {
          days: 90,
        }),
      },
      {
        value: ADMIN_ACCESS_DURATION_OPTIONS.DAYS_365,
        label: t(AppLocales.Admin.Accesses.GrantDialog.DurationDays, {
          days: 365,
        }),
      },
      {
        value: ADMIN_ACCESS_DURATION_OPTIONS.LIFETIME,
        label: t(AppLocales.Admin.Accesses.GrantDialog.Lifetime),
      },
      {
        value: ADMIN_ACCESS_DURATION_OPTIONS.CUSTOM,
        label: "Custom Duration (Days)",
      },
    ],
    [t],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreate) {
      const rawTokens = emailsInput
        .split(/[,\n]/)
        .map((token: string) => token.trim())
        .filter(Boolean);

      if (rawTokens.length === 0) {
        setAlertMessage(
          t(AppLocales.Admin.Notifications.Validation.UserRequired),
        );
        return;
      }

      const emails: string[] = [];
      const usernames: string[] = [];
      rawTokens.forEach((token: string) => {
        if (token.includes("@")) {
          emails.push(token);
        } else {
          usernames.push(token);
        }
      });

      const trimmedCode = productCode.trim().toUpperCase();
      if (!trimmedCode) {
        setAlertMessage(t(AppLocales.Admin.Accesses.GrantDialog.ProductLabel));
        return;
      }

      if (!/^[A-Za-z0-9]{10}$/.test(trimmedCode)) {
        setAlertMessage(
          "Product code must be 10 alphanumeric characters without special characters.",
        );
        return;
      }

      let days: number | null = null;
      if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.DAYS_30) days = 30;
      else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.DAYS_90)
        days = 90;
      else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.DAYS_365)
        days = 365;
      else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.CUSTOM) {
        if (!customDays || customDays <= 0) {
          setAlertMessage("Please specify a valid positive number of days.");
          return;
        }
        days = customDays;
      } else if (durationOption === ADMIN_ACCESS_DURATION_OPTIONS.LIFETIME) {
        days = null;
      }

      await onSubmit({
        emails: emails.length > 0 ? emails : undefined,
        usernames: usernames.length > 0 ? usernames : undefined,
        code: trimmedCode,
        days,
      });
    } else {
      if (access && !access.expires_at) {
        setAlertMessage("Lifetime access cannot be extended.");
        return;
      }

      if (extendDays <= 0) {
        setAlertMessage("Please enter a positive number of days.");
        return;
      }

      await onSubmit({ days: extendDays });
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      {isCreate ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guidelines Card (col-span-1) */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4 h-fit">
            <div className="flex items-center gap-2 border-b border-base-200 pb-3">
              <iconsLib.shieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-base-content text-base">
                Grant Guidelines
              </h3>
            </div>

            <div className="space-y-4 text-xs text-base-content/80 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <iconsLib.user className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-base-content font-medium">Multiple Recipients</strong>
                  <span>Enter email addresses or usernames separated by commas, spaces, or newlines.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <iconsLib.cube className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-base-content font-medium">Product Code</strong>
                  <span>Specify a valid 10-character alphanumeric product code (e.g., PROD123456).</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <iconsLib.clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-base-content font-medium">Duration Options</strong>
                  <span>Choose standard 30/90/365 day periods, permanent Lifetime validity, or custom days.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <iconsLib.sparkles className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-base-content font-medium">Immediate Activation</strong>
                  <span>Entitlements take effect instantly and unlock associated features without manual delay.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container (col-span-2) */}
          <div className="lg:col-span-2">
            <FormContainer onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-base-200 bg-base-100 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                  <iconsLib.key className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-base-content text-base">
                    Entitlement & Access Details
                  </h3>
                </div>

                <div>
                  <TextArea
                    label={t(AppLocales.Admin.Accesses.GrantDialog.EmailsLabel)}
                    placeholder={t(
                      AppLocales.Admin.Accesses.GrantDialog.EmailsPlaceholder,
                    )}
                    value={emailsInput}
                    onChange={(e) => setEmailsInput(e.target.value)}
                    rows={4}
                    required
                    helperText={t(
                      AppLocales.Admin.Accesses.GrantDialog.EmailsHelper,
                    )}
                  />
                </div>

                <div>
                  <TextInput
                    label={t(AppLocales.Admin.Accesses.GrantDialog.ProductLabel)}
                    placeholder={t(
                      AppLocales.Admin.Accesses.GrantDialog.ProductPlaceholder,
                    )}
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                    maxLength={10}
                    required
                    helperText="10-character alphanumeric product identifier (e.g., PROD123456)."
                  />
                </div>

                <div className="space-y-3">
                  <Dropdown
                    label={t(AppLocales.Admin.Accesses.GrantDialog.DurationLabel)}
                    options={durationOptions}
                    value={durationOption}
                    onValueChange={(val) =>
                      setDurationOption(val as TAdminAccessDurationOption)
                    }
                  />

                  {durationOption === ADMIN_ACCESS_DURATION_OPTIONS.CUSTOM && (
                    <div className="pt-2">
                      <TextInput
                        label="Custom Duration (Days)"
                        type="number"
                        value={customDays.toString()}
                        onChange={(e) =>
                          setCustomDays(parseInt(e.target.value, 10) || 0)
                        }
                        min={1}
                        required
                        helperText="Specify the exact number of validity days for this grant."
                      />
                    </div>
                  )}
                </div>
              </div>

              <FormActionRow
                cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                submitLabel={t(AppLocales.Admin.Accesses.GrantDialog.GrantButton)}
                onCancel={onCancel}
              />
            </FormContainer>
          </div>
        </div>
      ) : access ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entitlement Details Card */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4 h-fit">
            <h3 className="font-semibold text-base-content text-lg">
              Entitlement Info
            </h3>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.User)}
                </span>
                <span className="font-medium text-base-content">
                  {access.user_name || access.user_email || access.user_id}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.Product)}
                </span>
                <span className="font-medium text-base-content">
                  {access.product_name ||
                    access.product_code ||
                    access.product_id}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">Status</span>
                <StatusBadge status={access.status} />
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.GrantedAt)}
                </span>
                <span className="text-base-content/70">
                  {formatAdminDate(access.granted_at)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.ExpiresAt)}
                </span>
                <span className="font-medium text-base-content">
                  {access.expires_at
                    ? formatAdminDate(access.expires_at)
                    : t(AppLocales.Admin.Common.Status.Lifetime)}
                </span>
              </div>

              {access.remaining_days !== undefined &&
                access.remaining_days !== null &&
                access.remaining_days > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">Remaining Days</span>
                    <span className="font-medium text-base-content">
                      {access.remaining_days} days
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Extend Form */}
          <div className="lg:col-span-2">
            {!access.expires_at ? (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-6 text-sm text-warning space-y-2">
                <p className="font-semibold text-base">Lifetime Access</p>
                <p>
                  This entitlement has lifetime validity and does not expire. It
                  cannot be extended further.
                </p>
              </div>
            ) : (
              <FormContainer onSubmit={handleSubmit}>
                <div className="rounded-xl border border-base-200 bg-base-100 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                    <iconsLib.clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-base-content text-base">
                      Extend Duration
                    </h3>
                  </div>

                  <TextInput
                    label={t(
                      AppLocales.Admin.Accesses.ExtendDialog.AdditionalDaysLabel,
                    )}
                    placeholder={t(
                      AppLocales.Admin.Accesses.ExtendDialog
                        .AdditionalDaysPlaceholder,
                    )}
                    type="number"
                    value={extendDays.toString()}
                    onChange={(e) =>
                      setExtendDays(parseInt(e.target.value, 10) || 0)
                    }
                    min={1}
                    required
                    helperText="Number of additional days to add to the existing expiry date."
                  />
                </div>

                <FormActionRow
                  cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                  submitLabel={t(
                    AppLocales.Admin.Accesses.ExtendDialog.ExtendButton,
                  )}
                  onCancel={onCancel}
                />
              </FormContainer>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
