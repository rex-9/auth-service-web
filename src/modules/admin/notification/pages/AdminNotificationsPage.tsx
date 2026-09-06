// src/modules/admin/notifications/pages/AdminNotificationsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IUser } from "../../../../models";
import UserController from "../../user/user.controller";
import RoleController from "../../role/role.controller";
import type { IAdminRole } from "../../role/types";
import NotificationController from "../notification.controller";
import type {
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "../types";
import {
  NOTIFICATION_ADMIN_TABS,
  type TNotificationAdminTab,
  NOTIFICATION_AUDIENCE_TYPES,
  type NotificationAudienceType,
  NOTIFICATION_DELIVERY_CHANNELS,
  NOTIFICATION_DELIVERY_FIELDS,
  NOTIFICATION_FIELDS,
  NOTIFICATION_KEYBOARD_KEYS,
} from "../constants";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import {
  AlertDialog,
  AdminState,
  Button,
  PageHeader,
  Tabs,
  type ITabItem,
} from "../../components";
import { AdminNotificationTemplatesTab } from "../components";
import {
  Dropdown,
  FormContainer,
  SearchInput,
  StatusBadge,
} from "../../../../design/components";
import {
  BadgeVariants,
  ButtonSizes,
  ButtonTypes,
  DropdownSizes,
} from "../../../../design/constants";
import { iconsLib } from "../../../../assets";

const initialValues: IAdminNotificationFormValues = {
  event: "",
  audience_type: NOTIFICATION_AUDIENCE_TYPES.ALL,
  user_ids: [],
  role_ids: [],
  send_push: true,
  send_socket: true,
  send_email: false,
};

const RECIPIENT_SEARCH_MIN_LENGTH = 2;
const RECIPIENT_SEARCH_DEBOUNCE_MS = 250;
const RECIPIENT_SEARCH_LIMIT = 20;

const mergeUsersById = (currentUsers: IUser[], nextUsers: IUser[]) => {
  const usersById = new Map<string, IUser>();
  currentUsers.forEach((user) => usersById.set(user.id, user));
  nextUsers.forEach((user) => usersById.set(user.id, user));
  return Array.from(usersById.values());
};

export const AdminNotificationsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Notifications.Title)} | Admin`);

  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const canReadRoles = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROLES);
  const canReadUsers = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS);
  const canCreateNotifications = can(
    ADMIN_ACTIONS.CREATE,
    ADMIN_RESOURCES.NOTIFICATIONS,
  );

  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [templates, setTemplates] = useState<IAdminNotificationTemplate[]>([]);
  const [values, setValues] =
    useState<IAdminNotificationFormValues>(initialValues);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [isRecipientFocused, setIsRecipientFocused] = useState(false);
  const [recipientSearchError, setRecipientSearchError] = useState("");
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TNotificationAdminTab>(
    NOTIFICATION_ADMIN_TABS.BROADCAST,
  );

  const tabItems = useMemo<ITabItem<TNotificationAdminTab>[]>(
    () => [
      {
        value: NOTIFICATION_ADMIN_TABS.BROADCAST,
        label: t(AppLocales.Admin.Notifications.Tabs.Broadcast),
        icon: iconsLib.bell,
      },
      {
        value: NOTIFICATION_ADMIN_TABS.TEMPLATES,
        label: t(AppLocales.Admin.Notifications.Tabs.Templates),
        icon: iconsLib.document,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (permissionsLoading) return;

    const loadInitialData = async () => {
      setLoading(true);

      const [templateRes, rolesRes] = await Promise.all([
        NotificationController.getTemplates(),
        canReadRoles ? RoleController.getRoles() : Promise.resolve(null),
      ]);
      setLoading(false);

      if (templateRes.success) {
        setTemplates(templateRes.templates);
        const firstAvailable = templateRes.templates.find(
          (t) => t.admin === true,
        );
        if (firstAvailable) {
          setValues((v) => ({ ...v, event: firstAvailable.event }));
        }
      } else {
        setError(templateRes.error || t(AppLocales.Admin.Notifications.Errors.LoadTemplates));
      }

      if (rolesRes && rolesRes.success) {
        setRoles(rolesRes.roles);
      }
    };

    void loadInitialData();
  }, [canReadRoles, permissionsLoading, setLoading, t]);

  const searchRecipients = useCallback(
    async (search: string) => {
      if (!canReadUsers) {
        setRecipientSearchError(
          t(AppLocales.Admin.Notifications.Errors.SearchUsers),
        );
        return;
      }

      setLoading(true, { overlay: false });

      const result = await UserController.getUsers({
        search,
        limit: RECIPIENT_SEARCH_LIMIT,
      });
      setLoading(false);

      if (result.success) {
        setUsers((currentUsers) => mergeUsersById(currentUsers, result.users));
        setRecipientSearchError("");
      } else {
        setRecipientSearchError(result.error || t(AppLocales.Admin.Users.Errors.LoadListFailed));
      }
    },
    [canReadUsers, setLoading, t],
  );

  useEffect(() => {
    const search = recipientQuery.trim();

    if (
      values.audience_type !== NOTIFICATION_AUDIENCE_TYPES.USERS ||
      search.length < RECIPIENT_SEARCH_MIN_LENGTH
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void searchRecipients(search);
    }, RECIPIENT_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [recipientQuery, searchRecipients, values.audience_type]);

  const sortedRoles = useMemo(
    () => [...roles].sort((a, b) => a.name.localeCompare(b.name)),
    [roles],
  );

  const broadcastTemplates = useMemo(
    () => templates.filter((t) => t.admin === true),
    [templates],
  );

  const templateOptions = useMemo(
    () =>
      broadcastTemplates.map((template) => ({
        value: template.event,
        label: `${template.name} (${template.event})`,
        group: template.category ? template.category.toUpperCase() : undefined,
      })),
    [broadcastTemplates],
  );

  const audienceOptions = useMemo(
    () => [
      {
        value: NOTIFICATION_AUDIENCE_TYPES.ALL,
        label: t(AppLocales.Admin.Notifications.Labels.AllUsers),
      },
      ...(canReadRoles
        ? [
            {
              value: NOTIFICATION_AUDIENCE_TYPES.ROLES,
              label: t(AppLocales.Admin.Notifications.Labels.SelectedRoles),
            },
          ]
        : []),
      {
        value: NOTIFICATION_AUDIENCE_TYPES.USERS,
        label: t(AppLocales.Admin.Notifications.Labels.SelectedUsers),
      },
    ],
    [canReadRoles, t],
  );

  const selectedTemplate = useMemo(
    () => broadcastTemplates.find((t) => t.event === values.event),
    [broadcastTemplates, values.event],
  );

  useEffect(() => {
    if (broadcastTemplates.length > 0) {
      const exists = broadcastTemplates.some((t) => t.event === values.event);
      if (!exists) {
        setValues((v) => ({ ...v, event: broadcastTemplates[0].event }));
      }
    }
  }, [broadcastTemplates, values.event]);

  const selectedRoleIds = values.role_ids;
  const selectedUserIds = values.user_ids;
  const selectedRoleIdSet = useMemo(
    () => new Set(selectedRoleIds),
    [selectedRoleIds],
  );
  const selectedUserIdSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds],
  );

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedUserIdSet.has(u.id)),
    [selectedUserIdSet, users],
  );

  const availableUsers = useMemo(
    () => users.filter((u) => !selectedUserIdSet.has(u.id)),
    [selectedUserIdSet, users],
  );

  const recipientSuggestions = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase();
    if (!q) return [];
    return availableUsers
      .filter((u) =>
        [u.name, u.email, u.username].some(
          (val) => val && val.toLowerCase().includes(q),
        ),
      )
      .slice(0, 6);
  }, [availableUsers, recipientQuery]);

  const selectedChannelsCount = [
    values.send_push,
    values.send_socket,
    values.send_email,
  ].filter(Boolean).length;

  const updateValue = (
    field: keyof IAdminNotificationFormValues,
    value: string | string[] | boolean,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleRole = (roleId: string) => {
    setValues((current) => {
      const nextRoles = current.role_ids.includes(roleId)
        ? current.role_ids.filter((id) => id !== roleId)
        : [...current.role_ids, roleId];
      return { ...current, role_ids: nextRoles };
    });
  };

  const addUser = (userId: string) => {
    setValues((current) => {
      if (current.user_ids.includes(userId)) return current;
      return { ...current, user_ids: [...current.user_ids, userId] };
    });
    setRecipientQuery("");
  };

  const removeUser = (userId: string) => {
    setValues((current) => ({
      ...current,
      user_ids: current.user_ids.filter((id) => id !== userId),
    }));
  };

  const handleRecipientKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      (event.key === NOTIFICATION_KEYBOARD_KEYS.ADD_RECIPIENT ||
        event.key === NOTIFICATION_KEYBOARD_KEYS.SEPARATOR) &&
      recipientSuggestions.length > 0
    ) {
      event.preventDefault();
      addUser(recipientSuggestions[0].id);
      return;
    }

    if (
      event.key === NOTIFICATION_KEYBOARD_KEYS.REMOVE_RECIPIENT &&
      recipientQuery.length === 0 &&
      selectedUserIds.length > 0
    ) {
      removeUser(selectedUserIds[selectedUserIds.length - 1]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.event) {
      setAlertMessage(t(AppLocales.Admin.Notifications.Validation.EventRequired));
      return;
    }

    if (selectedChannelsCount === 0) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Validation.DeliveryChannelRequired),
      );
      return;
    }

    if (
      values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS &&
      selectedUserIds.length === 0
    ) {
      setAlertMessage(t(AppLocales.Admin.Notifications.Validation.UserRequired));
      return;
    }

    if (
      values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES &&
      selectedRoleIds.length === 0
    ) {
      setAlertMessage(t(AppLocales.Admin.Notifications.Validation.RoleRequired));
      return;
    }

    setLoading(true);

    const result = await NotificationController.createNotification({
      ...values,
      user_ids:
        values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
          ? values.user_ids
          : [],
      role_ids:
        values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES
          ? values.role_ids
          : [],
    });
    setLoading(false);

    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Notifications.Toasts.SendSuccess),
      );
      setValues({
        ...initialValues,
        event: broadcastTemplates[0]?.event || "",
      });
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Notifications.Errors.Send));
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title={t(AppLocales.Admin.Notifications.Title)}
        description={t(AppLocales.Admin.Notifications.Description)}
      />

      <Tabs<TNotificationAdminTab>
        items={tabItems}
        value={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === NOTIFICATION_ADMIN_TABS.TEMPLATES ? (
        <AdminNotificationTemplatesTab />
      ) : error && templates.length === 0 ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Notifications.Errors.LoadRecipients)}
          message={error}
        />
      ) : (
        <FormContainer onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Dispatch Configuration (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-200 pb-3">
                  <div>
                    <h2 className="text-body-m font-bold text-base-content flex items-center gap-2">
                      <iconsLib.bellAlert className="h-4 w-4 text-primary" />
                      Broadcast Setup
                    </h2>
                    <p className="text-caption text-base-content/60 text-xs">
                      Configure template, audience, and transmission channels.
                    </p>
                  </div>
                  {selectedTemplate && (
                    <StatusBadge
                      status={selectedTemplate.category}
                      variant={BadgeVariants.PRIMARY}
                    />
                  )}
                </div>

                {/* Field 1: Template */}
                <div className="space-y-1.5">
                  <label className="text-caption font-semibold text-base-content/80 flex items-center justify-between">
                    <span>{t(AppLocales.Admin.Notifications.Labels.Event)}</span>
                    {selectedTemplate && (
                      <span className="font-mono text-xs opacity-60">
                        {selectedTemplate.event}
                      </span>
                    )}
                  </label>
                  {broadcastTemplates.length === 0 ? (
                    <div className="p-3 rounded-lg bg-base-200/60 border border-base-300 text-caption text-base-content/70 text-xs">
                      No broadcast templates available. Create or enable &quot;Broadcast&quot; on templates in the Templates tab.
                    </div>
                  ) : (
                    <Dropdown
                      value={values.event}
                      onValueChange={(val) =>
                        updateValue(NOTIFICATION_FIELDS.EVENT, val)
                      }
                      options={templateOptions}
                      placeholder="Select a template..."
                      icon={<iconsLib.bell className="h-4 w-4" />}
                      size={DropdownSizes.SM}
                    />
                  )}
                </div>

                {/* Field 2: Audience (Clean Dropdown selector) */}
                <div className="space-y-2 pt-1 border-t border-base-200">
                  <label className="text-caption font-semibold text-base-content/80 flex items-center gap-1.5">
                    <iconsLib.userGroup className="h-3.5 w-3.5 text-primary" />
                    {t(AppLocales.Admin.Notifications.Labels.Audience)}
                  </label>
                  <Dropdown
                    value={values.audience_type}
                    onValueChange={(val) =>
                      updateValue(
                        NOTIFICATION_FIELDS.AUDIENCE_TYPE,
                        val as NotificationAudienceType,
                      )
                    }
                    options={audienceOptions}
                    icon={<iconsLib.user className="h-4 w-4" />}
                    size={DropdownSizes.SM}
                  />

                  {/* Contextual Target Options */}
                  {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ALL && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-base-200/50 border border-base-300/50 text-caption text-base-content/70 text-xs">
                      <iconsLib.info className="h-4 w-4 text-primary shrink-0" />
                      <span>Will be dispatched to all confirmed users across the platform.</span>
                    </div>
                  )}

                  {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-base-content/70 font-medium">
                          Select Target Roles ({selectedRoleIds.length} of {sortedRoles.length})
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              setValues((v) => ({
                                ...v,
                                role_ids: sortedRoles.map((r) => r.id),
                              }))
                            }
                            className="text-primary hover:underline font-medium"
                          >
                            All
                          </button>
                          <span className="opacity-30">•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setValues((v) => ({ ...v, role_ids: [] }))
                            }
                            className="text-base-content/60 hover:text-base-content font-medium"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {sortedRoles.map((role) => {
                          const isSelected = selectedRoleIdSet.has(role.id);
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => toggleRole(role.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-s font-medium transition-all ${
                                isSelected
                                  ? "bg-primary text-primary-content shadow-sm ring-1 ring-primary"
                                  : "bg-base-200/80 hover:bg-base-200 text-base-content/80 border border-base-300/50"
                              }`}
                            >
                              {isSelected && (
                                <iconsLib.checkr className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span>{role.name}</span>
                            </button>
                          );
                        })}
                      </div>
                      {selectedRoleIds.length === 0 && (
                        <div className="text-caption text-warning text-xs">
                          Please select at least one role to receive this broadcast.
                        </div>
                      )}
                    </div>
                  )}

                  {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS && (
                    <div className="space-y-2 pt-1">
                      <div className="relative">
                        <SearchInput
                          value={recipientQuery}
                          placeholder="Search users by name, email, or username..."
                          onChange={(e) => setRecipientQuery(e.target.value)}
                          onClear={() => setRecipientQuery("")}
                          onFocus={() => setIsRecipientFocused(true)}
                          onBlur={() => {
                            window.setTimeout(
                              () => setIsRecipientFocused(false),
                              200,
                            );
                          }}
                          onKeyDown={handleRecipientKeyDown}
                        />

                        {isRecipientFocused && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-52 overflow-y-auto rounded-lg border border-base-300 bg-base-100 shadow-xl">
                            {isLoading ? (
                              <div className="p-2.5 text-caption text-base-content/60 text-xs">
                                Searching users...
                              </div>
                            ) : recipientSearchError ? (
                              <div className="p-2.5 text-caption text-error text-xs">
                                {recipientSearchError}
                              </div>
                            ) : recipientSuggestions.length > 0 ? (
                              recipientSuggestions.map((user) => (
                                <button
                                  key={user.id}
                                  type="button"
                                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-body-s hover:bg-primary/10 transition-colors"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    addUser(user.id);
                                  }}
                                >
                                  <div className="min-w-0">
                                    <div className="font-semibold text-base-content truncate text-xs">
                                      {user.name || user.username || "User"}
                                    </div>
                                    <div className="text-caption text-base-content/60 font-mono text-[11px] truncate">
                                      {user.email}
                                    </div>
                                  </div>
                                  <iconsLib.plus className="h-3.5 w-3.5 text-primary shrink-0" />
                                </button>
                              ))
                            ) : recipientQuery.trim().length >=
                              RECIPIENT_SEARCH_MIN_LENGTH ? (
                              <div className="p-2.5 text-caption text-base-content/60 text-xs">
                                No users matching &quot;{recipientQuery}&quot;
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>

                      {selectedUsers.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {selectedUsers.map((user) => (
                            <span
                              key={user.id}
                              className="inline-flex items-center gap-1.5 rounded-md bg-base-200 px-2 py-0.5 text-xs font-medium text-base-content border border-base-300/50 shadow-sm"
                            >
                              <span className="truncate max-w-[150px]">
                                {user.name || user.email || user.username}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeUser(user.id)}
                                className="text-base-content/50 hover:text-error"
                                title="Remove"
                              >
                                <iconsLib.close className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-caption text-warning text-xs">
                          Please search and add at least one recipient user.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Field 3: Delivery Channels (Compact Horizontal Row) */}
                <div className="space-y-2 pt-1 border-t border-base-200">
                  <div className="flex items-center justify-between">
                    <label className="text-caption font-semibold text-base-content/80 flex items-center gap-1.5">
                      <iconsLib.sparkles className="h-3.5 w-3.5 text-primary" />
                      {t(AppLocales.Admin.Notifications.Labels.Delivery)}
                    </label>
                    <span className="text-caption text-base-content/50 text-xs">
                      {selectedChannelsCount} of 3 active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {NOTIFICATION_DELIVERY_FIELDS.map(
                      ({ field, channel, label }) => {
                        const isChecked = Boolean(values[field]);
                        const icon =
                          channel === NOTIFICATION_DELIVERY_CHANNELS.SOCKET ? (
                            <iconsLib.chat className="h-4 w-4" />
                          ) : channel ===
                            NOTIFICATION_DELIVERY_CHANNELS.PUSH ? (
                            <iconsLib.bell className="h-4 w-4" />
                          ) : (
                            <iconsLib.mail className="h-4 w-4" />
                          );
                        const activeColor =
                          channel === NOTIFICATION_DELIVERY_CHANNELS.SOCKET
                            ? "text-primary"
                            : channel === NOTIFICATION_DELIVERY_CHANNELS.PUSH
                              ? "text-warning"
                              : "text-info";

                        return (
                          <button
                            key={field}
                            type="button"
                            onClick={() => updateValue(field, !isChecked)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all ${
                              isChecked
                                ? "border-primary/50 bg-primary/10 ring-1 ring-primary/40 font-medium text-base-content"
                                : "border-base-300 bg-base-100 hover:bg-base-200/60 text-base-content/60"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={
                                  isChecked
                                    ? activeColor
                                    : "text-base-content/40"
                                }
                              >
                                {icon}
                              </span>
                              <span className="text-body-s font-medium truncate">
                                {t(label)}
                              </span>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isChecked
                                  ? "bg-primary text-primary-content"
                                  : "border border-base-300 bg-base-200/50"
                              }`}
                            >
                              {isChecked && (
                                <iconsLib.checkr className="w-2.5 h-2.5" />
                              )}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                  {selectedChannelsCount === 0 && (
                    <div className="text-caption text-error text-xs">
                      {t(
                        AppLocales.Admin.Notifications.Validation
                          .DeliveryChannelRequired,
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Preview & Dispatch Panel (5 cols, sticky) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-base-200 pb-3">
                  <h3 className="text-body-m font-bold text-base-content flex items-center gap-1.5">
                    <iconsLib.eye className="h-4 w-4 text-primary" />
                    {t(AppLocales.Admin.Notifications.Preview.Title)}
                  </h3>
                  <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                    {values.audience_type.toUpperCase()}
                  </span>
                </div>

                {selectedTemplate ? (
                  <div className="space-y-3">
                    {/* Visual In-App Card Mockup */}
                    <div className="rounded-lg bg-base-200/50 border border-base-300/80 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <iconsLib.bell className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-semibold text-xs text-base-content">
                            {selectedTemplate.in_app_title ||
                              selectedTemplate.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-base-content/50">
                          Just now
                        </span>
                      </div>

                      <p className="text-caption text-xs text-base-content/80 pl-8 leading-relaxed">
                        {selectedTemplate.in_app_body ||
                          selectedTemplate.description ||
                          "No message body specified."}
                      </p>

                      {selectedTemplate.link && (
                        <div className="pl-8 pt-0.5">
                          <span className="text-[10px] text-primary hover:underline font-mono">
                            Target: {selectedTemplate.link}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Broadcast Meta Summary */}
                    <div className="space-y-1.5 text-xs text-base-content/70 bg-base-200/30 rounded-lg p-2.5 border border-base-300/40">
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Event Key:</span>
                        <code className="font-mono text-xs">
                          {selectedTemplate.event}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Category:</span>
                        <span className="font-medium capitalize">
                          {selectedTemplate.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Audience:</span>
                        <span className="font-medium">
                          {values.audience_type ===
                          NOTIFICATION_AUDIENCE_TYPES.ALL
                            ? "All Confirmed Users"
                            : values.audience_type ===
                                NOTIFICATION_AUDIENCE_TYPES.ROLES
                              ? `${selectedRoleIds.length} role(s) selected`
                              : `${selectedUserIds.length} user(s) selected`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Channels:</span>
                        <div className="flex items-center gap-1">
                          {values.send_socket && (
                            <span className="badge badge-xs badge-neutral">
                              In-App
                            </span>
                          )}
                          {values.send_push && (
                            <span className="badge badge-xs badge-warning">
                              Push
                            </span>
                          )}
                          {values.send_email && (
                            <span className="badge badge-xs badge-info">
                              Email
                            </span>
                          )}
                          {selectedChannelsCount === 0 && (
                            <span className="text-error">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-caption text-base-content/50 text-xs">
                    Select a template to view the live dispatch preview.
                  </div>
                )}

                {/* Primary Dispatch Action */}
                <div className="pt-2">
                  <Button
                    type={ButtonTypes.SUBMIT}
                    size={ButtonSizes.MD}
                    isLoading={isLoading}
                    disabled={
                      !canCreateNotifications ||
                      isLoading ||
                      !values.event ||
                      selectedChannelsCount === 0 ||
                      (values.audience_type ===
                        NOTIFICATION_AUDIENCE_TYPES.ROLES &&
                        selectedRoleIds.length === 0) ||
                      (values.audience_type ===
                        NOTIFICATION_AUDIENCE_TYPES.USERS &&
                        selectedUserIds.length === 0)
                    }
                    className="w-full font-semibold"
                  >
                    <iconsLib.bell className="mr-2 h-4 w-4" />
                    {isLoading
                      ? t(AppLocales.Admin.Notifications.Actions.Sending)
                      : t(AppLocales.Admin.Notifications.Actions.Send)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
};

