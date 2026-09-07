import React, { useState } from "react";
import {
  IAdminVersion,
  IAdminVersionFormValues,
  AdminVersionStatus,
} from "../types";
import {
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
  TextInput,
  Toggle,
} from "../../components";
import { ADMIN_ACTIONS } from "../../constants";
import {
  VERSION_SEMVER_PATTERN,
  VERSION_STATUSES,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { formatAdminDate } from "../../../../helpers";

interface IAdminVersionFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  version?: IAdminVersion | null;
  onSubmit: (values: IAdminVersionFormValues) => void;
  onCancel: () => void;
}

interface IAdminVersionFormState {
  number: string;
  title: string;
  description: string;
  status: AdminVersionStatus;
  is_force_update: boolean;
  ios_build_number: string;
  android_build_number: string;
}

const initialValues: IAdminVersionFormState = {
  number: "",
  title: "",
  description: "",
  status: VERSION_STATUSES.DRAFT,
  is_force_update: false,
  ios_build_number: "",
  android_build_number: "",
};

const parseOptionalBuildNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const buildInitialValues = (
  version?: IAdminVersion | null,
): IAdminVersionFormState => {
  if (!version) return initialValues;

  return {
    number: version.number || "",
    title: version.title || "",
    description: version.description || "",
    status:
      version.status === VERSION_STATUSES.PUBLISHED ||
      version.status === VERSION_STATUSES.YANKED
        ? version.status
        : VERSION_STATUSES.DRAFT,
    is_force_update: Boolean(version.is_force_update),
    ios_build_number:
      version.ios_build_number != null ? String(version.ios_build_number) : "",
    android_build_number:
      version.android_build_number != null
        ? String(version.android_build_number)
        : "",
  };
};

export const AdminVersionForm: React.FC<IAdminVersionFormProps> = ({
  mode,
  version,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const [values, setValues] = useState<IAdminVersionFormState>(() =>
    buildInitialValues(version),
  );
  const [numberError, setNumberError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [iosBuildError, setIosBuildError] = useState("");
  const [androidBuildError, setAndroidBuildError] = useState("");

  const updateValue = <K extends keyof IAdminVersionFormState>(
    field: K,
    value: IAdminVersionFormState[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const validateBuildNumber = (raw: string): boolean => {
    const trimmed = raw.trim();
    if (!trimmed) return true;
    const parsed = Number(trimmed);
    return Number.isInteger(parsed) && parsed > 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const number = values.number.trim();
    const title = values.title.trim();
    let isValid = true;

    if (!VERSION_SEMVER_PATTERN.test(number)) {
      setNumberError(t(AppLocales.Admin.Versions.Form.NumberError));
      isValid = false;
    } else {
      setNumberError("");
    }

    if (!title) {
      setTitleError(t(AppLocales.Admin.Versions.Form.TitleError));
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!validateBuildNumber(values.ios_build_number)) {
      setIosBuildError(t(AppLocales.Admin.Versions.Form.BuildNumberError));
      isValid = false;
    } else {
      setIosBuildError("");
    }

    if (!validateBuildNumber(values.android_build_number)) {
      setAndroidBuildError(t(AppLocales.Admin.Versions.Form.BuildNumberError));
      isValid = false;
    } else {
      setAndroidBuildError("");
    }

    if (!isValid) return;

    onSubmit({
      number,
      title,
      description: values.description.trim(),
      status: values.status,
      is_force_update: values.is_force_update,
      ios_build_number: parseOptionalBuildNumber(values.ios_build_number),
      android_build_number: parseOptionalBuildNumber(
        values.android_build_number,
      ),
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={t(AppLocales.Admin.Versions.Form.NumberLabel)}
          placeholder={t(AppLocales.Admin.Versions.Form.NumberPlaceholder)}
          value={values.number}
          required
          error={numberError}
          helperText={t(AppLocales.Admin.Versions.Form.NumberHelper)}
          onChange={(event) => {
            updateValue("number", event.target.value);
            if (numberError) setNumberError("");
          }}
        />

        <TextInput
          label={t(AppLocales.Admin.Versions.Form.TitleLabel)}
          placeholder={t(AppLocales.Admin.Versions.Form.TitlePlaceholder)}
          value={values.title}
          required
          error={titleError}
          onChange={(event) => {
            updateValue("title", event.target.value);
            if (titleError) setTitleError("");
          }}
        />

        <div className="md:col-span-2">
          <TextArea
            label={t(AppLocales.Admin.Versions.Form.DescriptionLabel)}
            placeholder={t(
              AppLocales.Admin.Versions.Form.DescriptionPlaceholder,
            )}
            value={values.description}
            onChange={(event) =>
              updateValue("description", event.target.value)
            }
          />
        </div>

        <Dropdown
          label={t(AppLocales.Admin.Versions.Form.StatusLabel)}
          value={values.status}
          onValueChange={(value) =>
            updateValue("status", value as AdminVersionStatus)
          }
          options={[
            {
              value: VERSION_STATUSES.DRAFT,
              label: t(AppLocales.Admin.Versions.Status.Draft),
            },
            {
              value: VERSION_STATUSES.PUBLISHED,
              label: t(AppLocales.Admin.Versions.Status.Published),
            },
            {
              value: VERSION_STATUSES.YANKED,
              label: t(AppLocales.Admin.Versions.Status.Yanked),
            },
          ]}
        />

        <div className="flex items-end">
          <Toggle
            checked={values.is_force_update}
            onCheckedChange={(checked) =>
              updateValue("is_force_update", checked)
            }
            label={t(AppLocales.Admin.Versions.Form.ForceUpdateLabel)}
          />
        </div>

        <TextInput
          label={t(AppLocales.Admin.Versions.Form.IosBuildLabel)}
          placeholder={t(AppLocales.Admin.Versions.Form.BuildPlaceholder)}
          type="number"
          min={1}
          step={1}
          value={values.ios_build_number}
          error={iosBuildError}
          helperText={t(AppLocales.Admin.Versions.Form.BuildHelper)}
          onChange={(event) => {
            updateValue("ios_build_number", event.target.value);
            if (iosBuildError) setIosBuildError("");
          }}
        />

        <TextInput
          label={t(AppLocales.Admin.Versions.Form.AndroidBuildLabel)}
          placeholder={t(AppLocales.Admin.Versions.Form.BuildPlaceholder)}
          type="number"
          min={1}
          step={1}
          value={values.android_build_number}
          error={androidBuildError}
          helperText={t(AppLocales.Admin.Versions.Form.BuildHelper)}
          onChange={(event) => {
            updateValue("android_build_number", event.target.value);
            if (androidBuildError) setAndroidBuildError("");
          }}
        />
      </div>

      {mode === ADMIN_ACTIONS.EDIT && version && (
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label={t(AppLocales.Admin.Versions.Form.ReleasedAtLabel)}
            value={
              version.released_at
                ? String(
                    formatAdminDate(version.released_at, { inline: true }),
                  )
                : t(AppLocales.Admin.Versions.Form.NotReleased)
            }
            disabled
          />
          <TextInput
            label={t(AppLocales.Admin.Versions.Form.InstallCountLabel)}
            value={String(version.install_count ?? 0)}
            disabled
          />
        </div>
      )}

      <FormActionRow
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? t(AppLocales.Admin.Versions.Form.CreateVersion)
            : t(AppLocales.Admin.Versions.Form.SaveVersion)
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
