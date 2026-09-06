import { PRODUCT_CYCLE, PRODUCT_TYPE } from "./constants";
import { IAdminProductFormValues } from "./types";

export type ProductPriceMode =
  (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

export const buildProductPayload = (
  values: IAdminProductFormValues,
  priceMode: ProductPriceMode,
): IAdminProductFormValues => ({
  name: values.name.trim(),
  description: values.description?.trim() || "",
  price_unit_amount:
    priceMode === PRODUCT_TYPE.FREE ? 0 : Number(values.price_unit_amount),
  currency: values.currency,
  cycle:
    priceMode === PRODUCT_TYPE.FREE
      ? PRODUCT_CYCLE.ONE_TIME
      : values.cycle || PRODUCT_CYCLE.ONE_TIME,
  active: values.active,
});
