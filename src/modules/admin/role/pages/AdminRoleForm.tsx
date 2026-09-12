// src/modules/admin/role/pages/AdminRoleForm.tsx
import React, { useMemo, useState } from "react";
import {
  ADMIN_ROLE_NAME_INVALID_CHARACTERS,
  ADMIN_ROLE_NAME_PATTERN,
  isAdminRoleName,
} from "../constants";
import {
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "../types";
import {
  AdminPermissionMatrix,
  AdminDetailSection,
  FormActionRow,
  FormContainer,
  TextInput,
} from "../../components";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

interface IAdminRoleFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  role?: IAdminRole | null;
  permissions: IAdminPermission[];
  onSubmit: (values: IAdminRoleFormValues) => void;
  onCancel: () => void;
}

export const AdminRoleForm: React.FC<IAdminRoleFormProps> = ({
  mode,
  role,
  permissions,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [nameError, setNameError] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    role?.permission_ids ?? [],
  );
  const shouldValidateAdminName = !role?.system;

  const permissionItems = useMemo(
    () =>
      permissions.map((permission) => ({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
      })),
    [permissions],
  );

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const selectPermissions = (permissionIds: string[]) => {
    setSelectedPermissionIds((current) => [
      ...new Set([...current, ...permissionIds]),
    ]);
  };

  const clearPermissions = (permissionIds: string[]) => {
    setSelectedPermissionIds((current) =>
      current.filter((id) => !permissionIds.includes(id)),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();

    if (shouldValidateAdminName && !isAdminRoleName(nextName)) {
      setNameError(t(AppLocales.Admin.Roles.Form.NameInvalid));
      return;
    }

    setNameError("");

    onSubmit({
      name: nextName,
      description: description.trim(),
      permission_ids: selectedPermissionIds,
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={t(AppLocales.Admin.Roles.Form.NameLabel)}
          placeholder={t(AppLocales.Admin.Roles.Form.NamePlaceholder)}
          value={name}
          pattern={ADMIN_ROLE_NAME_PATTERN.source}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          disabled={role?.system}
          error={nameError}
          helperText={
            shouldValidateAdminName
              ? t(AppLocales.Admin.Roles.Form.KeyPlaceholder)
              : undefined
          }
          onChange={(event) => {
            setName(
              event.target.value
                .toLowerCase()
                .replace(ADMIN_ROLE_NAME_INVALID_CHARACTERS, ""),
            );
            if (nameError) setNameError("");
          }}
        />
        <TextInput
          label={t(AppLocales.Admin.Roles.Form.DescriptionLabel)}
          placeholder={t(AppLocales.Admin.Roles.Form.DescriptionPlaceholder)}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="md:col-span-2">
          <AdminDetailSection
            title={t(AppLocales.Admin.Roles.Form.PermissionsMatrixTitle)}
          >
            <AdminPermissionMatrix
              permissions={permissionItems}
              selectedPermissionIds={selectedPermissionIds}
              isSelectable
              showSelectAll
              onTogglePermission={togglePermission}
              onSelectPermissions={selectPermissions}
              onClearPermissions={clearPermissions}
            />
          </AdminDetailSection>
        </div>
      </div>

      <FormActionRow
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? t(AppLocales.Admin.Roles.Form.CreateRole)
            : t(AppLocales.Admin.Roles.Form.SaveRole)
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
