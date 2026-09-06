// src/modules/admin/products/pages/AdminProductForm.tsx

import React, { useState } from "react";
import {
  AdminProductCycle,
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import { ProductPriceMode } from "../productForm.utils";
import {
  Checkbox,
  Dropdown,
  FormActionRow,
  FormContainer,
  Radio,
  TextInput,
} from "../../components";
import { Button, Image } from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { iconsLib } from "../../../../assets";
import { ADMIN_ACTIONS } from "../../constants";
import { PRODUCT_CURRENCY, PRODUCT_CYCLE, PRODUCT_TYPE } from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { AdminAssetSelectDialog } from "../../asset/components/AdminAssetSelectDialog";
import { ASSET_TYPES } from "../../asset/constants";

interface IAdminProductFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  product?: IAdminProduct | null;
  onSubmit: (values: IAdminProductFormValues) => void;
  onCancel: () => void;
}

const initialValues: IAdminProductFormValues = {
  code: "",
  name: "",
  description: "",
  price_unit_amount: 1000,
  currency: PRODUCT_CURRENCY.USD,
  cycle: PRODUCT_CYCLE.MONTH,
  active: true,
};

const buildInitialValues = (
  product?: IAdminProduct | null,
): IAdminProductFormValues => {
  if (!product) return initialValues;

  return {
    code: product.code || "",
    name: product.name || "",
    description: product.description || "",
    price_unit_amount: product.price_unit_amount,
    currency: product.currency || PRODUCT_CURRENCY.USD,
    cycle: product.cycle || PRODUCT_CYCLE.ONE_TIME,
    active: product.active,
  };
};

export const AdminProductForm: React.FC<IAdminProductFormProps> = ({
  mode,
  product,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const [values, setValues] = useState<IAdminProductFormValues>(() =>
    buildInitialValues(product),
  );
  const [priceMode, setPriceMode] = useState<ProductPriceMode>(() =>
    product?.free || product?.price_unit_amount === 0
      ? PRODUCT_TYPE.FREE
      : PRODUCT_TYPE.PREMIUM,
  );
  const [descriptionError, setDescriptionError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [thumbnailAssetId, setThumbnailAssetId] = useState<string | null>(
    product?.thumbnail_asset_id ?? null,
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    product?.thumbnail_url ?? null,
  );
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  const isInitiallyFree =
    mode === ADMIN_ACTIONS.EDIT &&
    (product?.free || product?.price_unit_amount === 0);
  const isFree = priceMode === PRODUCT_TYPE.FREE;

  const updateValue = (
    field: keyof IAdminProductFormValues,
    value: string | number | boolean,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const updatePriceMode = (nextMode: ProductPriceMode) => {
    if (isInitiallyFree && nextMode === PRODUCT_TYPE.PREMIUM) {
      return;
    }

    setPriceMode(nextMode);
    setValues((current) => ({
      ...current,
      price_unit_amount:
        nextMode === PRODUCT_TYPE.FREE
          ? 0
          : current.price_unit_amount > 0
            ? current.price_unit_amount
            : initialValues.price_unit_amount,
      cycle:
        nextMode === PRODUCT_TYPE.FREE
          ? PRODUCT_CYCLE.ONE_TIME
          : current.cycle || initialValues.cycle,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const description = values.description.trim();
    if (!description) {
      setDescriptionError(
        t(AppLocales.Admin.Products.Form.DescriptionPlaceholder),
      );
      return;
    }

    const code = values.code?.trim();
    if (code && !/^[A-Za-z0-9]{10}$/.test(code)) {
      setCodeError(t(AppLocales.Admin.Products.Form.CodePlaceholder));
      return;
    }

    setDescriptionError("");
    setCodeError("");

    onSubmit({
      code: code || undefined,
      name: values.name.trim(),
      description,
      price_unit_amount: isFree ? 0 : Number(values.price_unit_amount),
      currency: values.currency,
      cycle: isFree
        ? PRODUCT_CYCLE.ONE_TIME
        : values.cycle || PRODUCT_CYCLE.ONE_TIME,
      active: values.active,
      thumbnail_asset_id: thumbnailAssetId,
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Thumbnail Selection Card */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-base-200 bg-base-100 mb-2">
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-base-300 bg-base-200 shrink-0 flex items-center justify-center">
          <Image
            src={thumbnailUrl || ""}
            alt={values.name || "Product Thumbnail"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <span className="text-sm font-semibold text-base-content block">
            {t(
              AppLocales.Admin.Products.Form.ThumbnailLabel,
              "Product Thumbnail",
            )}
          </span>
          <span className="text-xs text-base-content/60 block">
            {t(
              AppLocales.Admin.Products.Form.ThumbnailHelper,
              "Choose an existing uploaded thumbnail asset for this product.",
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
            {t(
              AppLocales.Admin.Products.Form.ChooseThumbnail,
              "Choose Thumbnail",
            )}
          </Button>
          {(thumbnailUrl || thumbnailAssetId) && (
            <Button
              variant={ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              className="text-error hover:bg-error/10"
              onClick={() => {
                setThumbnailAssetId("");
                setThumbnailUrl(null);
              }}
            >
              <iconsLib.trash className="w-4 h-4 mr-1" />
              {t(AppLocales.Admin.Products.Form.RemoveThumbnail, "Remove")}
            </Button>
          )}
        </div>
      </div>

      <AdminAssetSelectDialog
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        assetType={ASSET_TYPES.THUMBNAIL}
        selectedAssetId={thumbnailAssetId}
        onSelect={(asset) => {
          setThumbnailAssetId(asset.id);
          setThumbnailUrl(asset.url);
        }}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={t(AppLocales.Admin.Products.Form.NameLabel)}
          placeholder={t(AppLocales.Admin.Products.Form.NamePlaceholder)}
          value={values.name}
          required
          onChange={(event) => updateValue("name", event.target.value)}
        />

        <div className="flex flex-col">
          <TextInput
            label={t(AppLocales.Admin.Products.Form.CodeLabel)}
            placeholder={
              mode === ADMIN_ACTIONS.CREATE
                ? t(AppLocales.Admin.Products.Form.CodePlaceholder)
                : "e.g. A1b2C3d4E5"
            }
            value={values.code || ""}
            maxLength={10}
            disabled={mode === ADMIN_ACTIONS.EDIT}
            error={codeError}
            onChange={(event) => {
              updateValue("code", event.target.value);
              if (codeError) setCodeError("");
            }}
          />
          <p className="mt-1 text-caption text-base-content opacity-60">
            {mode === ADMIN_ACTIONS.CREATE
              ? "Optional 10-character alphanumeric code. Auto-generated if left blank."
              : "🔒 Product code is permanent and cannot be modified."}
          </p>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-body-s font-medium text-base-content">
            {t(AppLocales.Admin.Products.Form.PriceLabel)}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[PRODUCT_TYPE.PREMIUM, PRODUCT_TYPE.FREE].map((option) => {
              const isDisabled =
                isInitiallyFree && option === PRODUCT_TYPE.PREMIUM;

              return (
                <Radio
                  key={option}
                  name="price_type"
                  checked={priceMode === option}
                  disabled={isDisabled}
                  onChange={() => updatePriceMode(option)}
                  containerClassName={
                    isDisabled
                      ? "min-h-10 bg-base-200 opacity-50 cursor-not-allowed"
                      : "min-h-10 bg-base-100"
                  }
                >
                  {option === PRODUCT_TYPE.PREMIUM
                    ? "Paid Product"
                    : "Free Product"}
                </Radio>
              );
            })}
          </div>
          {isInitiallyFree && (
            <p className="mt-1 text-caption text-base-content opacity-60">
              Free products cannot be converted to premium products.
            </p>
          )}
          {!isInitiallyFree && mode === ADMIN_ACTIONS.EDIT && isFree && (
            <p className="mt-1 text-caption text-amber-500 font-medium">
              ⚠️ Converting this product to Free is permanent and will detach
              payment provider handling... such as Stripe.
            </p>
          )}
        </div>

        <TextInput
          label={t(AppLocales.Admin.Products.Form.PriceLabel)}
          type="number"
          min={isFree ? 0 : 1}
          step={1}
          value={isFree ? 0 : values.price_unit_amount}
          required={!isFree}
          disabled={isFree}
          onChange={(event) =>
            updateValue("price_unit_amount", Number(event.target.value))
          }
        />

        <TextInput
          label={t(AppLocales.Admin.Products.Form.DescriptionLabel)}
          placeholder={t(AppLocales.Admin.Products.Form.DescriptionPlaceholder)}
          value={values.description}
          required
          error={descriptionError}
          onChange={(event) => {
            updateValue("description", event.target.value);
            if (descriptionError) setDescriptionError("");
          }}
        />

        <Dropdown
          label={t(AppLocales.Admin.Products.Form.CurrencyLabel)}
          value={values.currency}
          onValueChange={(val) => updateValue("currency", val)}
          options={[{ value: PRODUCT_CURRENCY.USD, label: "USD" }]}
        />

        <div>
          <Dropdown
            label={t(AppLocales.Admin.Products.Form.CycleLabel)}
            value={
              isFree
                ? PRODUCT_CYCLE.ONE_TIME
                : values.cycle || PRODUCT_CYCLE.ONE_TIME
            }
            disabled={isFree}
            onValueChange={(val) =>
              updateValue("cycle", val as AdminProductCycle)
            }
            options={[
              { value: PRODUCT_CYCLE.ONE_TIME, label: "One-time" },
              { value: PRODUCT_CYCLE.MONTH, label: "Monthly" },
              { value: PRODUCT_CYCLE.YEAR, label: "Yearly" },
            ]}
          />
          {isFree && (
            <p className="mt-1 text-caption text-base-content opacity-60">
              Free products are always one-time and cannot be recurring.
            </p>
          )}
        </div>

        <Checkbox
          checked={values.active}
          onChange={(event) => updateValue("active", event.target.checked)}
          containerClassName="min-h-10 md:self-end"
        >
          <span>{t(AppLocales.Admin.Products.Form.ActiveForPurchase)}</span>
        </Checkbox>
      </div>

      <FormActionRow
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? t(AppLocales.Admin.Products.Form.CreateProduct)
            : t(AppLocales.Admin.Products.Form.SaveProduct)
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
