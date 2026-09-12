import AppRoutes from "../../../AppRoutes";

const NOTIFICATION_ROUTE_ORIGIN = "https://notification.rexone.local";
const EXTERNAL_LINK_PROTOCOL = "https:";

export const NOTIFICATION_ROUTES = {
  HOME: AppRoutes.client.protected.HOME,
  PROFILE: AppRoutes.client.protected.PROFILE,
  PAYMENT: AppRoutes.client.protected.PAYMENT,
  AI: AppRoutes.client.protected.AI,
  ADMIN: AppRoutes.client.protected.admin.HOME,
} as const;

export function isExternalNotificationLink(
  rawLink?: string | null,
): rawLink is string {
  if (!rawLink) return false;
  try {
    const uri = new URL(rawLink);
    return uri.protocol === EXTERNAL_LINK_PROTOCOL;
  } catch {
    return false;
  }
}

/**
 * Resolves Core's single notification link into a safe Web router target.
 * External and unsupported links never leave the application.
 */
export function resolveNotificationRoute(rawLink?: string | null): string {
  const value = rawLink?.trim();
  if (!value) return NOTIFICATION_ROUTES.HOME;
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith("//")) {
    return NOTIFICATION_ROUTES.HOME;
  }

  let uri: URL;
  try {
    uri = new URL(value, NOTIFICATION_ROUTE_ORIGIN);
  } catch {
    return NOTIFICATION_ROUTES.HOME;
  }

  if (uri.origin !== NOTIFICATION_ROUTE_ORIGIN) {
    return NOTIFICATION_ROUTES.HOME;
  }

  const path =
    uri.pathname.length > 1 && uri.pathname.endsWith("/")
      ? uri.pathname.slice(0, -1)
      : uri.pathname;

  if (path === "/" || path === NOTIFICATION_ROUTES.HOME) {
    return NOTIFICATION_ROUTES.HOME;
  }
  if (path === NOTIFICATION_ROUTES.PROFILE) {
    return NOTIFICATION_ROUTES.PROFILE;
  }
  if (
    path === NOTIFICATION_ROUTES.PAYMENT ||
    path.startsWith(`${NOTIFICATION_ROUTES.PAYMENT}/`)
  ) {
    return NOTIFICATION_ROUTES.PAYMENT;
  }
  if (path === NOTIFICATION_ROUTES.AI) {
    return `${NOTIFICATION_ROUTES.AI}${uri.search}`;
  }
  if (
    path === NOTIFICATION_ROUTES.ADMIN ||
    path.startsWith(NOTIFICATION_ROUTES.ADMIN)
  ) {
    return `${path}${uri.search}`;
  }

  return NOTIFICATION_ROUTES.HOME;
}
