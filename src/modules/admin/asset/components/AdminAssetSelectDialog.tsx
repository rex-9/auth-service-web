// src/modules/admin/asset/components/AdminAssetSelectDialog.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, Button, SearchInput, Image, Badge } from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IAdminAsset } from "../types";
import { formatAssetFileSize } from "../constants";
import type { IApiPagination } from "../../../../models";
import { Admin } from "../..";

export interface IAdminAssetSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: IAdminAsset) => void;
  assetType?: string;
  title?: string;
  selectedAssetId?: string | null;
}

export const AdminAssetSelectDialog: React.FC<IAdminAssetSelectDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  assetType,
  title,
  selectedAssetId,
}) => {
  const t = useTranslate();
  const [assets, setAssets] = useState<IAdminAsset[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<IAdminAsset | null>(null);

  const limit = 12;

  const fetchAssets = useCallback(
    async (currentPage: number, searchTerm: string) => {
      setIsLoading(true);
      const params: Record<string, string | number> = {
        page: currentPage,
        limit,
      };

      if (assetType) {
        params.type = assetType;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const result = await Admin.AssetController.getAssets(params);
      setIsLoading(false);

      if (result.success) {
        setAssets(result.assets);
        setPagination(result.pagination);
      } else {
        setAssets([]);
        setPagination(null);
      }
    },
    [assetType, limit],
  );

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setSelectedAsset(null);
      void fetchAssets(1, search);
    }
  }, [isOpen, fetchAssets, search]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    void fetchAssets(nextPage, search);
  };

  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onClose();
    }
  };

  const totalPages =
    pagination?.total_pages ??
    (pagination?.total_count ? Math.ceil(pagination.total_count / limit) : 1);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title || t(AppLocales.Admin.Assets.Picker.Title, "Select Asset")}
      className="max-w-3xl w-full"
    >
      <div className="space-y-4">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex-1">
            <SearchInput
              value={search}
              placeholder={t(
                AppLocales.Admin.Assets.Picker.SearchPlaceholder,
                "Search assets by name...",
              )}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
            />
          </div>
          {assetType && (
            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <span>{t(AppLocales.Admin.Assets.Table.Type, "Type")}:</span>
              <Badge variant="primary" className="capitalize">
                {assetType}
              </Badge>
            </div>
          )}
        </div>

        {/* Assets Grid */}
        <div className="min-h-[300px] max-h-[420px] overflow-y-auto border border-base-200 rounded-xl p-3 bg-base-200/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-base-content/60">
              <iconsLib.arrowPath className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm">
                {t(AppLocales.Common.Loading, "Loading...")}
              </span>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-base-content/60">
              <iconsLib.document className="w-12 h-12 stroke-[1.5]" />
              <p className="text-sm font-medium">
                {t(
                  AppLocales.Admin.Assets.Picker.NoAssets,
                  "No assets found matching criteria.",
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {assets.map((asset) => {
                const isSelected =
                  selectedAsset?.id === asset.id ||
                  (!selectedAsset && selectedAssetId === asset.id);

                return (
                  <Button
                    key={asset.id}
                    variant={ButtonVariants.TERTIARY}
                    onClick={() => setSelectedAsset(asset)}
                    className={`flex flex-col text-left p-2 h-auto rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(255,94,98,0.25)] ring-2 ring-primary"
                        : "border-base-200 bg-base-100 hover:border-primary/50 hover:bg-base-200/50"
                    }`}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-base-200 border border-base-300 relative flex items-center justify-center mb-2">
                      <Image
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-1 shadow-md">
                          <iconsLib.checkr className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="w-full min-w-0">
                      <span
                        className="block truncate text-xs font-semibold text-base-content"
                        title={asset.name}
                      >
                        {asset.name}
                      </span>
                      <div className="flex justify-between items-center text-[10px] text-base-content/60 mt-0.5">
                        <span className="uppercase font-medium">
                          {asset.format || "Media"}
                        </span>
                        <span>{formatAssetFileSize(asset.size_bytes)}</span>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination & Footer */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-base-200">
          <div className="text-xs text-base-content/70">
            {pagination?.total_count !== undefined && (
              <span>Total: {pagination.total_count} assets</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariants.SECONDARY}
              size={ComponentSizes.SM}
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <iconsLib.chevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs px-2 font-medium text-base-content">
              {page} / {Math.max(totalPages, 1)}
            </span>
            <Button
              variant={ButtonVariants.SECONDARY}
              size={ComponentSizes.SM}
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Next
              <iconsLib.chevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant={ButtonVariants.SECONDARY} onClick={onClose}>
            {t(AppLocales.Admin.Common.Actions.Cancel, "Cancel")}
          </Button>
          <Button
            variant={ButtonVariants.PRIMARY}
            disabled={!selectedAsset}
            onClick={handleConfirm}
          >
            {t(AppLocales.Admin.Assets.Picker.SelectAction, "Select Asset")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
