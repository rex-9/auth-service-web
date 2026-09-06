// src/modules/admin/user/pages/AdminUserForm.tsx
import React, { useMemo, useState } from "react";
import { IAdminRole } from "../../role/types";
import { IAdminUser, IAdminUserFormValues } from "../types";
import {
  AdminPermissionMatrix,
  Checkbox,
  FormActionRow,
  FormContainer,
  IAdminPermissionMatrixItem,
  TextInput,
} from "../../components";
import { Button, Image } from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { iconsLib } from "../../../../assets";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { AdminAssetSelectDialog } from "../../asset/components/AdminAssetSelectDialog";
import { ASSET_TYPES } from "../../asset/constants";

export interface IAdminUserFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  user?: IAdminUser;
  roles: IAdminRole[];
  onSubmit: (values: IAdminUserFormValues) => Promise<void>;
  onCancel: () => void;
}

export const AdminUserForm: React.FC<IAdminUserFormProps> = ({
  mode,
  user,
  roles,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const initialRoleIds = useMemo(() => user?.role_ids ?? [], [user]);

  const [username, setUsername] = useState(user?.username ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [selectedRoleIds, setSelectedRoleIds] =
    useState<string[]>(initialRoleIds);
  const [avatarAssetId, setAvatarAssetId] = useState<string | null>(
    user?.avatar_asset_id ?? null,
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatar_url ?? null,
  );
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: IAdminUserFormValues = {
      username: username.trim(),
      name: name.trim(),
      email: email.trim(),
      role_ids: selectedRoleIds,
      avatar_asset_id: avatarAssetId,
    };

    await onSubmit(payload);
  };

  const selectedRoleIdSet = useMemo(
    () => new Set(selectedRoleIds),
    [selectedRoleIds],
  );
  const selectedRoles = useMemo(
    () => roles.filter((role) => selectedRoleIdSet.has(role.id)),
    [roles, selectedRoleIdSet],
  );
  const selectedRolePermissions = useMemo<IAdminPermissionMatrixItem[]>(() => {
    const permissionsByKey = new Map<string, IAdminPermissionMatrixItem>();

    selectedRoles.forEach((role) => {
      Object.entries(role.permissions ?? {}).forEach(([resource, actions]) =>
        (Array.isArray(actions) ? actions : []).forEach((action: string) => {
          const key = `${resource}-${action}`;
          permissionsByKey.set(key, {
            id: key,
            resource,
            action,
          });
        }),
      );
    });

    return [...permissionsByKey.values()];
  }, [selectedRoles]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Avatar Selection Card */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-base-200 bg-base-100 mb-2">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-base-300 bg-base-200 shrink-0">
          <Image
            src={avatarUrl || ""}
            alt={name || username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <span className="text-sm font-semibold text-base-content block">
            {t(AppLocales.Admin.Users.Form.AvatarLabel, "Profile Avatar")}
          </span>
          <span className="text-xs text-base-content/60 block">
            {t(
              AppLocales.Admin.Users.Form.AvatarHelper,
              "Choose an existing uploaded avatar asset for this user.",
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={ButtonVariants.SECONDARY}
            size={ComponentSizes.SM}
            onClick={() => setIsAssetPickerOpen(true)}
          >
            <iconsLib.photo className="w-4 h-4 mr-1.5" />
            {t(AppLocales.Admin.Users.Form.ChooseAvatar, "Choose Avatar")}
          </Button>
          {(avatarUrl || avatarAssetId) && (
            <Button
              variant={ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              className="text-error hover:bg-error/10"
              onClick={() => {
                setAvatarAssetId("");
                setAvatarUrl(null);
              }}
            >
              <iconsLib.trash className="w-4 h-4 mr-1" />
              {t(AppLocales.Admin.Users.Form.RemoveAvatar, "Remove")}
            </Button>
          )}
        </div>
      </div>

      <AdminAssetSelectDialog
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        assetType={ASSET_TYPES.AVATAR}
        selectedAssetId={avatarAssetId}
        onSelect={(asset) => {
          setAvatarAssetId(asset.id);
          setAvatarUrl(asset.url);
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={t(AppLocales.Admin.Users.Form.UsernameLabel)}
          value={username}
          required
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextInput
          label={t(AppLocales.Admin.Users.Form.NameLabel)}
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />
        <div className="md:col-span-2">
          <TextInput
            label={t(AppLocales.Admin.Users.Form.EmailLabel)}
            type="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <div className="rounded-md border border-base-300 bg-base-100 p-4 md:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-body-m font-semibold text-base-content">
                {t(AppLocales.Admin.Users.Form.RolesLabel)}
              </h2>
              <span className="rounded-md bg-base-200 px-2 py-1 text-caption font-medium text-base-content opacity-70">
                {selectedRoleIds.length}/{roles.length}
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {roles.map((role) => {
                const isSelected = selectedRoleIds.includes(role.id);
                return (
                  <Checkbox
                    key={role.id}
                    checked={isSelected}
                    onChange={() => {
                      const nextIds = isSelected
                        ? selectedRoleIds.filter((id) => id !== role.id)
                        : [...selectedRoleIds, role.id];
                      setSelectedRoleIds(nextIds);
                    }}
                    containerClassName="min-h-10 bg-base-200/40"
                  >
                    <span className="capitalize">{role.name}</span>
                  </Checkbox>
                );
              })}
            </div>

            {selectedRoles.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-base-300 pt-4">
                <h3 className="text-body-s font-semibold text-base-content">
                  {t(AppLocales.Admin.Roles.Form.PermissionsMatrixTitle)}
                </h3>
                {selectedRolePermissions.length === 0 ? (
                  <div className="text-body-s text-base-content opacity-60">
                    {t(AppLocales.Admin.Common.Table.NoRecords)}
                  </div>
                ) : (
                  <AdminPermissionMatrix
                    permissions={selectedRolePermissions}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <FormActionRow
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? t(AppLocales.Admin.Users.Form.CreateUser)
            : t(AppLocales.Admin.Users.Form.SaveUser)
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
