import { IAdminPageMeta } from "../constants";
import { ADMIN_CHAT_PAGE_META } from "../chat/constants";
import { ADMIN_NOTIFICATION_PAGE_META } from "../notification/constants";
import { ADMIN_PRODUCT_PAGE_META } from "../product/constants";
import { ADMIN_ROLE_PAGE_META } from "../role/constants";
import { ADMIN_USER_PAGE_META } from "../user/constants";

export { formatAdminDate, formatDateTime } from "../../../helpers/date.helper";

const adminPageMeta: Record<string, IAdminPageMeta> = {
  ...ADMIN_USER_PAGE_META,
  ...ADMIN_ROLE_PAGE_META,
  ...ADMIN_NOTIFICATION_PAGE_META,
  ...ADMIN_PRODUCT_PAGE_META,
  ...ADMIN_CHAT_PAGE_META,
};

const escapeRouteSegment = (segment: string): string =>
  segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const truncateAdminText = (value: string | null | undefined): string => {
  if (!value) return "Not available";
  return value.length > 90 ? `${value.slice(0, 90)}...` : value;
};

export const getAdminPageMeta = (pathname: string): IAdminPageMeta | null => {
  const match = Object.keys(adminPageMeta).find((path) => {
    if (path === pathname) return true;

    const pattern = new RegExp(
      `^${path
        .split(/(:[^/]+)/)
        .map((segment) =>
          segment.startsWith(":") ? "[^/]+" : escapeRouteSegment(segment),
        )
        .join("")}$`,
    );
    return pattern.test(pathname);
  });

  return match ? adminPageMeta[match] : null;
};
