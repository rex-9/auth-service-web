// src/modules/admin/asset/pages/AdminAssetForm.tsx

import React, { useMemo, useState } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IAdminAsset } from "../types";
import {
  ASSET_TYPE_OPTIONS,
  ASSET_TYPES,
  ASSET_STATUSES,
  formatAssetFileSize,
  isImageAsset,
} from "../constants";
import {
  AlertDialog,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextInput,
} from "../../components";
import {
  Badge,
  Button,
  FileInput,
  Image,
  ProgressBar,
  ProgressBarVariants,
  StatusBadge,
} from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { UPLOAD_SIZE_LIMITS } from "../../../../constants";
import { ADMIN_ACTIONS } from "../../constants";
import { formatAdminDate } from "../../../../helpers";

export interface IAdminAssetEditFormValues {
  name: string;
  type: string;
}

export interface IFileItem {
  file: File;
  previewUrl: string | null;
}

export interface IAdminAssetFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  asset?: IAdminAsset;
  onUploadBatch?: (
    files: File[],
    type: string,
    onProgress: (percent: number, msg: string) => void,
  ) => Promise<void>;
  onSubmitEdit?: (values: IAdminAssetEditFormValues) => Promise<void>;
  onCompress?: () => Promise<void>;
  isCompressing?: boolean;
  onCancel: () => void;
}

export const AdminAssetForm: React.FC<IAdminAssetFormProps> = ({
  mode,
  asset,
  onUploadBatch,
  onSubmitEdit,
  onCompress,
  isCompressing = false,
  onCancel,
}) => {
  const t = useTranslate();
  const isCreate = mode === ADMIN_ACTIONS.CREATE;

  // Create Mode state
  const [fileItems, setFileItems] = useState<IFileItem[]>([]);
  const [uploadType, setUploadType] = useState<string>(ASSET_TYPES.GENERAL);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const [hasOversizedFiles, setHasOversizedFiles] = useState(false);

  // Edit Mode state
  const [editName, setEditName] = useState(asset?.name ?? "");
  const [editType, setEditType] = useState(asset?.type ?? ASSET_TYPES.GENERAL);

  const [alertMessage, setAlertMessage] = useState("");

  const filteredTypeOptions = useMemo(
    () => ASSET_TYPE_OPTIONS.filter((opt) => opt.value !== ""),
    [],
  );

  const totalSize = useMemo(
    () => fileItems.reduce((acc, item) => acc + item.file.size, 0),
    [fileItems],
  );

  const handleFilesSelected = (newFiles: File[]) => {
    setHasOversizedFiles(false);
    if (!newFiles || newFiles.length === 0) return;

    if (
      fileItems.length + newFiles.length >
      UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT
    ) {
      setAlertMessage(
        t(AppLocales.Admin.Assets.UploadDialog.MaxFilesExceeded, {
          count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
          defaultValue: `Maximum ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files allowed per batch upload.`,
        }),
      );
      return;
    }

    const validatedItems: IFileItem[] = [];
    const oversizedFiles: string[] = [];

    for (const f of newFiles) {
      const isVideo = f.type.startsWith("video/");
      const sizeLimit = isVideo
        ? UPLOAD_SIZE_LIMITS.MAX_VIDEO_BYTES
        : UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_BYTES;
      const limitMb = isVideo
        ? UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB
        : UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB;

      if (f.size > sizeLimit) {
        oversizedFiles.push(`${f.name} (>${limitMb}MB)`);
      } else {
        const previewUrl = f.type.startsWith("image/")
          ? URL.createObjectURL(f)
          : null;
        validatedItems.push({ file: f, previewUrl });
      }
    }

    if (oversizedFiles.length > 0) {
      setHasOversizedFiles(true);
      setAlertMessage(
        t(AppLocales.Admin.Assets.UploadDialog.FileSizeExceeded, {
          names: oversizedFiles.join(", "),
          defaultValue: `Some files exceed maximum size limit: ${oversizedFiles.join(", ")}`,
        }),
      );
    }

    setFileItems((prev) => [...prev, ...validatedItems]);
  };

  const handleRemoveFile = (index: number) => {
    if (isUploading) return;
    setFileItems((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAllFiles = () => {
    if (isUploading) return;
    fileItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileItems([]);
  };

  const handleBatchUploadSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (fileItems.length === 0 || isUploading || !onUploadBatch) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatusMessage("");

    try {
      await onUploadBatch(
        fileItems.map((item) => item.file),
        uploadType,
        (percent, msg) => {
          setUploadProgress(percent);
          setUploadStatusMessage(msg);
        },
      );
    } catch (err: any) {
      setAlertMessage(err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSubmitEdit) return;

    const trimmed = editName.trim();
    if (!trimmed) {
      setAlertMessage("Asset name is required.");
      return;
    }

    await onSubmitEdit({
      name: trimmed,
      type: editType,
    });
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
          {/* Left Column (lg:col-span-1): Guidelines, Batch Summary & Optimization Tools */}
          <div className="lg:col-span-1 space-y-5 h-fit">
            {/* Upload Guidelines Card */}
            <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                <iconsLib.upload className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base-content text-base">
                  {t(
                    AppLocales.Admin.Assets.UploadDialog.BulkNoticeTitle,
                    "Upload Guidelines",
                  )}
                </h3>
              </div>

              <div className="space-y-4 text-xs text-base-content/80 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <iconsLib.inboxStack className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      Batch Limits
                    </strong>
                    <span>
                      Upload up to {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files
                      simultaneously in a single upload session.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <iconsLib.photo className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      File Size Limits
                    </strong>
                    <span>
                      Maximum {UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB}MB for
                      images and documents; up to{" "}
                      {UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB}MB for video files.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <iconsLib.cube className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      Asset Categorization
                    </strong>
                    <span>
                      All selected files within this batch will share the chosen
                      asset classification type.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <iconsLib.shieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      Garage Storage
                    </strong>
                    <span>
                      Assets are encrypted, processed, and persisted directly to
                      self-hosted Garage object storage.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Batch Summary Card (when files are selected) */}
            {fileItems.length > 0 && (
              <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Batch Summary
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">Selected Files</span>
                    <span className="font-semibold text-base-content">
                      {fileItems.length} / {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">
                      Total Batch Size
                    </span>
                    <span className="font-semibold text-base-content">
                      {formatAssetFileSize(totalSize)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">Assigned Type</span>
                    <Badge>{uploadType}</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Optimization Tools Card */}
            <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <iconsLib.sparkles className="w-4 h-4 text-warning shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Optimization Tools
                </h4>
              </div>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Need to compress oversized files before uploading to comply with
                batch size limits?
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.XS}
                  className="bg-base-200/80 hover:bg-base-300 text-primary border border-base-300 px-3 py-2 text-xs justify-between rounded-lg font-medium"
                  onClick={() =>
                    window.open(
                      "https://tinypng.com",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <span>
                    {t(
                      AppLocales.Admin.Assets.UploadDialog.CompressImages,
                      "Compress Images (TinyPNG)",
                    )}
                  </span>
                  <span className="text-xs opacity-70">↗</span>
                </Button>
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.XS}
                  className="bg-base-200/80 hover:bg-base-300 text-primary border border-base-300 px-3 py-2 text-xs justify-between rounded-lg font-medium"
                  onClick={() =>
                    window.open(
                      "https://www.freeconvert.com/video-compressor",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <span>
                    {t(
                      AppLocales.Admin.Assets.UploadDialog.CompressVideos,
                      "Compress Videos (FreeConvert)",
                    )}
                  </span>
                  <span className="text-xs opacity-70">↗</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-2): Form Container */}
          <div className="lg:col-span-2">
            <FormContainer
              onSubmit={handleBatchUploadSubmit}
              className="space-y-6"
            >
              {/* Compression Recommendation Banner if oversized */}
              {hasOversizedFiles && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5 text-base-content">
                  <iconsLib.warning className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-xs space-y-2 flex-1">
                    <div>
                      <span className="font-bold block text-base-content">
                        {t(
                          AppLocales.Admin.Assets.UploadDialog.CompressTipTitle,
                          "Compression Recommended",
                        )}
                      </span>
                      <p className="text-base-content/80 leading-relaxed mt-0.5">
                        {t(
                          AppLocales.Admin.Assets.UploadDialog.CompressTipDesc,
                          "Built-in media compression is not yet available for oversized files. Please compress large files before uploading:",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields Card */}
              <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                  <iconsLib.photo className="h-5 w-5 text-primary" />
                  <h3 className="text-body-m font-bold text-base-content">
                    Upload Configuration
                  </h3>
                </div>

                <Dropdown
                  label={t(
                    AppLocales.Admin.Assets.UploadDialog.TypeLabel,
                    "Asset Type",
                  )}
                  value={uploadType}
                  options={filteredTypeOptions.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  onValueChange={(val) => setUploadType(val)}
                  disabled={isUploading}
                />

                <FileInput
                  label={t(
                    AppLocales.Admin.Assets.UploadDialog.FileLabel,
                    "Select Files",
                  )}
                  buttonText={t(
                    AppLocales.Admin.Assets.UploadDialog.ChooseFiles,
                    {
                      count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
                      defaultValue: `Choose Files (Up to ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT})`,
                    },
                  )}
                  multiple
                  onFilesChange={handleFilesSelected}
                  disabled={isUploading}
                  helperText={t(
                    AppLocales.Admin.Assets.UploadDialog.FileLimitHint,
                    {
                      count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
                      imageLimit: UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB,
                      videoLimit: UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB,
                      defaultValue: `You can choose up to ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files per batch (Max ${UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB}MB per image, ${UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB}MB per video).`,
                    },
                  )}
                />

                {/* Selected Files Tray */}
                {fileItems.length > 0 && (
                  <div className="border border-base-200 rounded-xl p-4 bg-base-200/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-base-content/80 pb-2 border-b border-base-200">
                      <span>
                        {t(
                          AppLocales.Admin.Assets.UploadDialog.SelectedFiles,
                          "Selected Files",
                        )}{" "}
                        ({fileItems.length} /{" "}
                        {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT}) •{" "}
                        {formatAssetFileSize(totalSize)}
                      </span>
                      {!isUploading && (
                        <Button
                          variant={ButtonVariants.TERTIARY}
                          size={ComponentSizes.SM}
                          onClick={handleClearAllFiles}
                          className="text-error hover:bg-error/10 h-7 px-2.5 text-xs"
                        >
                          {t(
                            AppLocales.Admin.Assets.UploadDialog.ClearAll,
                            "Clear All",
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {fileItems.map((item, index) => (
                        <div
                          key={`${item.file.name}-${index}`}
                          className="flex items-center justify-between gap-3 p-2 rounded-lg bg-base-100 border border-base-200 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {item.previewUrl ? (
                              <div className="w-10 h-10 rounded-md shrink-0 overflow-hidden border border-base-300">
                                <Image
                                  src={item.previewUrl}
                                  alt={item.file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-md shrink-0 bg-base-200 flex items-center justify-center border border-base-300">
                                <iconsLib.document className="w-5 h-5 text-base-content/60" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-base-content">
                                {item.file.name}
                              </span>
                              <span className="text-[11px] text-base-content/60">
                                {formatAssetFileSize(item.file.size)}
                              </span>
                            </div>
                          </div>

                          {!isUploading && (
                            <Button
                              variant={ButtonVariants.TERTIARY}
                              size={ComponentSizes.SM}
                              onClick={() => handleRemoveFile(index)}
                              className="p-1 h-auto text-base-content/50 hover:text-error"
                            >
                              <iconsLib.close className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2 pt-2">
                    <ProgressBar
                      value={uploadProgress}
                      showPercentage
                      label={
                        uploadStatusMessage ||
                        t(
                          AppLocales.Admin.Assets.UploadDialog.Uploading,
                          "Uploading...",
                        )
                      }
                      variant={ProgressBarVariants.PRIMARY}
                    />
                  </div>
                )}
              </div>

              <FormActionRow
                cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                submitLabel={
                  isUploading
                    ? t(
                        AppLocales.Admin.Assets.UploadDialog.Uploading,
                        "Uploading...",
                      )
                    : `${t(AppLocales.Admin.Assets.UploadDialog.UploadButton, "Upload")}${
                        fileItems.length > 1 ? ` (${fileItems.length})` : ""
                      }`
                }
                onCancel={onCancel}
              />
            </FormContainer>
          </div>
        </div>
      ) : asset ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Preview and Details Card */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
            <h3 className="font-semibold text-base-content text-lg">
              {t(AppLocales.Admin.Assets.Table.Preview)}
            </h3>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-base-200 flex items-center justify-center border border-base-300">
              {isImageAsset(asset) ? (
                <Image
                  src={asset.url}
                  alt={asset.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  fallback={
                    <div className="flex flex-col items-center gap-2 text-base-content/60">
                      <iconsLib.photo className="w-12 h-12" />
                      <span className="text-xs uppercase font-medium">
                        {asset.format || "Media"}
                      </span>
                    </div>
                  }
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-base-content/60">
                  <iconsLib.photo className="w-12 h-12" />
                  <span className="text-xs uppercase font-medium">
                    {asset.format || "Media"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Type)}
                </span>
                <Badge>{asset.type}</Badge>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Format)}
                </span>
                <span className="font-mono text-xs uppercase font-medium text-base-content">
                  {asset.format || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Size)}
                </span>
                <span className="text-base-content font-medium">
                  {formatAssetFileSize(asset.size_bytes)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">Status</span>
                <StatusBadge status={asset.status || ASSET_STATUSES.READY} />
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Created)}
                </span>
                <span className="text-base-content/70">
                  {formatAdminDate(asset.created_at)}
                </span>
              </div>
            </div>

            {onCompress &&
              asset.status !== ASSET_STATUSES.OPTIMAL &&
              asset.status !== ASSET_STATUSES.PROCESSING && (
                <div className="pt-2">
                  <Button
                    variant={ButtonVariants.SECONDARY}
                    size={ComponentSizes.SM}
                    className="w-full flex items-center justify-center gap-1.5"
                    onClick={onCompress}
                    isLoading={isCompressing}
                    disabled={isCompressing}
                  >
                    <iconsLib.sparkles className="w-4 h-4 text-primary" />
                    <span>
                      {t(
                        AppLocales.Admin.Assets.Compression.Compress,
                        "Compress Media",
                      )}
                    </span>
                  </Button>
                </div>
              )}
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <FormContainer onSubmit={handleEditSubmit}>
              <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                  <iconsLib.pencilSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-body-m font-bold text-base-content">
                    Asset Details
                  </h3>
                </div>

                <TextInput
                  label={t(AppLocales.Admin.Assets.Table.Name)}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />

                <Dropdown
                  label={t(AppLocales.Admin.Assets.Table.Type)}
                  value={editType}
                  options={filteredTypeOptions.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  onValueChange={(val) => setEditType(val)}
                />
              </div>

              <FormActionRow
                cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                submitLabel={t(AppLocales.Admin.Common.Actions.Save)}
                onCancel={onCancel}
              />
            </FormContainer>
          </div>
        </div>
      ) : null}
    </>
  );
};
