// src/modules/admin/asset/pages/AdminAssetCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { AppLocales, useTranslate } from "../../../../locales";
import { AlertDialog, PageHeader } from "../../components";
import { Button } from "../../../../design/components";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { ADMIN_ACTIONS } from "../../constants";
import { AdminAssetForm } from "./AdminAssetForm";
import { Admin } from "../..";

export const AdminAssetCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Assets.UploadDialog.Title, "Upload Assets")} | Admin`,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const [alertMessage, setAlertMessage] = useState("");

  const handleUploadBatch = async (
    files: File[],
    type: string,
    onProgress: (percent: number, msg: string) => void,
  ) => {
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      onProgress(
        Math.round((i / total) * 100),
        t(AppLocales.Admin.Assets.UploadDialog.UploadingStatus, {
          defaultValue: `Uploading file {{current}} of {{total}}: {{name}}`,
          current: i + 1,
          total,
          name: file.name,
        }),
      );

      const response = await Admin.AssetController.uploadAsset(file, { type });

      if (!response.success) {
        throw new Error(
          response.error ||
            `${t(AppLocales.Admin.Assets.Errors.UploadFailed)} (${file.name})`,
        );
      }

      onProgress(
        Math.round(((i + 1) / total) * 100),
        t(AppLocales.Admin.Assets.UploadDialog.UploadingStatus, {
          defaultValue: `Uploading file {{current}} of {{total}}: {{name}}`,
          current: i + 1,
          total,
          name: file.name,
        }),
      );
    }

    if (total > 1) {
      toast.success(
        t(AppLocales.Admin.Assets.Toasts.BulkUploadSuccess, {
          defaultValue: `Successfully uploaded ${total} assets`,
          count: total,
        }),
      );
    } else {
      toast.success(t(AppLocales.Admin.Assets.Toasts.UploadSuccess));
    }

    navigate(AppRoutes.client.protected.admin.ASSETS);
  };

  const handleCancel = () => {
    navigate(AppRoutes.client.protected.admin.ASSETS);
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <div className="space-y-6">
        <PageHeader
          title={t(AppLocales.Admin.Assets.UploadDialog.Title, "Upload Assets")}
          description="Upload and configure media assets in storage"
          action={
            <Button
              variant={ButtonVariants.SECONDARY}
              size={ButtonSizes.SM}
              onClick={handleCancel}
            >
              <iconsLib.arrowLeft className="w-4 h-4 mr-1.5" />
              {t(AppLocales.Admin.Assets.Title)}
            </Button>
          }
        />

        <AdminAssetForm
          mode={ADMIN_ACTIONS.CREATE}
          onUploadBatch={handleUploadBatch}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};
