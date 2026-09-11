import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";
import { BILLING_INTERVALS } from "../../payment/constants";

export const ADMIN_PRODUCT_PAGE_TITLES = {
  CREATE: "Create Product",
  EDIT: "Edit Product",
  LIST: "Products",
  RECYCLE_BIN: "Product Recycle Bin",
} as const;

export const ADMIN_PRODUCT_TABLE_HEADERS = {
  INTERVAL: "Interval",
  DISCARDED: "Discarded",
  PRICE: "Price",
  PRODUCT: "Product",
  NAME: "Product Name",
  STATUS: "Status",
} as const;

export const ADMIN_PRODUCT_TABLE_KEYS = {
  ACTIONS: "actions",
  INTERVAL: "interval",
  IDENTITY: "identity",
  LIFECYCLE_DATE: "lifecycle_date",
  PRICE: "price",
  PRODUCT: "product",
  STATUS: "active",
} as const;

export const ADMIN_PRODUCT_SORT_KEYS = {
  NAME: "name",
  UNIT_AMOUNT: "unit_amount",
  INTERVAL: "interval",
  CREATED_AT: "created_at",
  DISCARDED_AT: "discarded_at",
} as const;

export const ADMIN_PRODUCT_LABELS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export const ADMIN_PRODUCT_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.PRODUCTS]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.LIST,
    actionLabel: "Create product",
    actionTo: AppRoutes.client.protected.admin.PRODUCT_CREATE,
    actionResource: ADMIN_RESOURCES.PRODUCTS,
    hasRecycleBin: true,
  },
  [AppRoutes.client.protected.admin.PRODUCTS_RECYCLE_BIN]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.RECYCLE_BIN,
    description: "Restore discarded products to make them active in Stripe again.",
  },
  [AppRoutes.client.protected.admin.PRODUCT_CREATE]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.CREATE,
  },
  [AppRoutes.client.protected.admin.PRODUCT_EDIT]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.EDIT,
  },
};

export const PRODUCT_TYPE = {
  FREE: "free",
  PREMIUM: "premium",
} as const;

export const PRODUCT_INTERVAL = {
  ONE_TIME: "",
  ...BILLING_INTERVALS,
} as const;

export const PRODUCT_CURRENCY = {
  USD: "usd",
} as const;
