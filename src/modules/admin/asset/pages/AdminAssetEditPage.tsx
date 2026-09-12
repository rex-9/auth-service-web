// src/modules/admin/asset/pages/AdminAssetEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Button } from "../../../../design";
import { ButtonVariants, ButtonSizes } from "../../../../design/constants";
import { AppLocales, useTranslate } from "../../../../locales";
import type { IAdminAsset } from "../types";
import SocketService, {
  ISocketMessage,
} from "../../../../services/socket.service";
import { AlertDialog, AdminState, PageHeader } from "../../components";
import { ASSET_STATUSES } from "../constants";
import { ADMIN_ACTIONS } from "../../constants";
import {
  AdminAssetForm,
  type IAdminAssetEditFormValues,
} from "./AdminAssetForm";
import { Admin } from "../..";
import { NOTIFICATION_SOCKET_TYPES } from "../../../notification";

export const AdminAssetEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Assets.EditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [asset, setAsset] = useState<IAdminAsset | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUpdatingThumbnail, setIsUpdatingThumbnail] = useState(false);
  const [isUpdatingSubtitle, setIsUpdatingSubtitle] = useState(false);

  useEffect(() => {
    if (!id) return;

    const handleSocketMessage = (event: ISocketMessage) => {
      if (event.type !== "notification") return;
      const eventType =
        typeof event.data?.type === "string" ? event.data.type : "";
      if (
        eventType !== NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSED &&
        eventType !== NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSION_FAILED &&
        eventType !== NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSING &&
        eventType !== NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_GENERATED &&
        eventType !== NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_FAILED
      ) {
        return;
      }

      const assetId =
        typeof event.data?.asset_id === "string" ? event.data.asset_id : "";
      if (assetId !== id) return;

      const status =
        typeof event.data?.status === "string" ? event.data.status : "";
      const sizeBytes =
        typeof event.data?.size_bytes === "number"
          ? event.data.size_bytes
          : undefined;
      const url =
        typeof event.data?.url === "string" ? event.data.url : undefined;

      setAsset((prev) => {
        if (!prev) return null;
        const thumbnail =
          eventType === NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_GENERATED &&
          event.data?.thumbnail
            ? (event.data.thumbnail as IAdminAsset["thumbnail"])
            : prev.thumbnail;
        return {
          ...prev,
          status: status || prev.status,
          size_bytes: sizeBytes !== undefined ? sizeBytes : prev.size_bytes,
          url: url !== undefined ? url : prev.url,
          thumbnail,
        };
      });
      if (eventType.startsWith("asset_thumbnail_")) {
        setIsUpdatingThumbnail(false);
      }
    };

    SocketService.addListener(handleSocketMessage);
    return () => {
      SocketService.removeListener(handleSocketMessage);
    };
  }, [id]);

  const handleCompress = async () => {
    if (!id) return;
    setIsCompressing(true);
    try {
      const result = await Admin.AssetController.compressAsset(id);
      if (result.success) {
        if (result.asset) {
          setAsset(result.asset);
        } else {
          setAsset((prev) =>
            prev ? { ...prev, status: ASSET_STATUSES.PROCESSING } : null,
          );
        }
        toast.info(result.message || "Compression enqueued successfully");
      } else if (result.isOptimal) {
        toast.info(
          result.error || t(AppLocales.Admin.Assets.Compression.AtMinSize),
        );
        setAsset((prev) =>
          prev ? { ...prev, status: ASSET_STATUSES.OPTIMAL } : null,
        );
      } else {
        toast.error(result.error || "Failed to trigger compression");
      }
    } finally {
      setIsCompressing(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadAsset = async () => {
      setLoading(true);
      const result = await Admin.AssetController.getAsset(id);
      setLoading(false);

      if (result.success && result.asset) {
        setAsset(result.asset);
      } else {
        setError(
          result.error || t(AppLocales.Admin.Assets.Errors.LoadOneFailed),
        );
      }
    };

    void loadAsset();
  }, [id, setLoading, t]);

  const handleSubmitEdit = async (values: IAdminAssetEditFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await Admin.AssetController.updateAsset(id, {
      name: values.name,
      type: values.type,
    });
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Assets.Toasts.UpdateSuccess),
      );
      navigate(AppRoutes.client.protected.admin.ASSETS);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Assets.Errors.UpdateFailed),
      );
    }
  };

  const handleCancel = () => {
    navigate(AppRoutes.client.protected.admin.ASSETS);
  };

  const handleDownload = async () => {
    if (!id) return;
    const result = await Admin.AssetController.getDownloadUrl(id);
    if (!result.success || !result.url) {
      toast.error(result.error || t(AppLocales.Admin.Assets.Download.Failed));
      return;
    }
    const link = document.createElement("a");
    link.href = result.url;
    link.rel = "noopener";
    link.click();
  };

  const handleRegenerateThumbnail = async () => {
    if (!id) return;
    setIsUpdatingThumbnail(true);
    const result = await Admin.AssetController.regenerateThumbnail(id);
    if (result.success) {
      if (result.asset) setAsset(result.asset);
      toast.info(result.message || t(AppLocales.Admin.Assets.Thumbnail.Queued));
    } else {
      setIsUpdatingThumbnail(false);
      toast.error(result.error || t(AppLocales.Admin.Assets.Thumbnail.Failed));
    }
  };

  const handleUploadThumbnail = async (file: File) => {
    if (!id) return;
    setIsUpdatingThumbnail(true);
    const result = await Admin.AssetController.uploadThumbnail(id, file);
    setIsUpdatingThumbnail(false);
    if (result.success) {
      if (result.asset) setAsset(result.asset);
      toast.success(
        result.message || t(AppLocales.Admin.Assets.Thumbnail.Replaced),
      );
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Thumbnail.Failed));
    }
  };

  const handleUploadSubtitle = async (file: File) => {
    if (!id) return;
    setIsUpdatingSubtitle(true);
    const result = await Admin.AssetController.uploadSubtitle(id, file);
    setIsUpdatingSubtitle(false);
    if (result.success) {
      if (result.asset) setAsset(result.asset);
      toast.success(
        result.message || t(AppLocales.Admin.Assets.Subtitle.Replaced),
      );
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Subtitle.Failed));
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
        title={t(AppLocales.Admin.Assets.EditTitle)}
        description={t(AppLocales.Admin.Assets.EditDescription)}
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

      {error && !asset ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : asset ? (
        <AdminAssetForm
          mode={ADMIN_ACTIONS.EDIT}
          asset={asset}
          onSubmitEdit={handleSubmitEdit}
          onCompress={handleCompress}
          onDownload={handleDownload}
          onRegenerateThumbnail={handleRegenerateThumbnail}
          onUploadThumbnail={handleUploadThumbnail}
          onUploadSubtitle={handleUploadSubtitle}
          isCompressing={isCompressing}
          isUpdatingThumbnail={isUpdatingThumbnail}
          isUpdatingSubtitle={isUpdatingSubtitle}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  );
};
