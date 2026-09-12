import { PRODUCT_INTERVAL, PRODUCT_TYPE } from "./constants";
import { IAdminProductFormValues } from "./types";

export type ProductPriceMode =
  (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

export const buildProductPayload = (
  values: IAdminProductFormValues,
  priceMode: ProductPriceMode,
): IAdminProductFormValues => ({
  name: values.name.trim(),
  description: values.description?.trim() || "",
  unit_amount:
    priceMode === PRODUCT_TYPE.FREE ? 0 : Number(values.unit_amount),
  currency: values.currency,
  interval:
    priceMode === PRODUCT_TYPE.FREE
      ? PRODUCT_INTERVAL.ONE_TIME
      : values.interval || PRODUCT_INTERVAL.ONE_TIME,
  active: values.active,
});
