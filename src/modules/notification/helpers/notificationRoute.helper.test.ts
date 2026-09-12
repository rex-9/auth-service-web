import { describe, expect, it } from "vitest";
import {
  isExternalNotificationLink,
  NOTIFICATION_ROUTES,
  resolveNotificationRoute,
} from "./notificationRoute.helper";

describe("resolveNotificationRoute", () => {
  it("recognizes only absolute HTTPS destinations as external", () => {
    expect(isExternalNotificationLink("https://rexone.example/post")).toBe(true);
    expect(isExternalNotificationLink("http://rexone.example/post")).toBe(false);
    expect(isExternalNotificationLink("/profile")).toBe(false);
  });
  it.each([
    ["/home", NOTIFICATION_ROUTES.HOME],
    ["/profile", NOTIFICATION_ROUTES.PROFILE],
    ["/payment", NOTIFICATION_ROUTES.PAYMENT],
    ["/payment/subscriptions", NOTIFICATION_ROUTES.PAYMENT],
    ["/ai?room_id=room-1", "/ai?room_id=room-1"],
    ["/admin/assets/asset-1", "/admin/assets/asset-1"],
  ])("resolves %s inside Web", (link, expected) => {
    expect(resolveNotificationRoute(link)).toBe(expected);
  });

  it.each([
    [null],
    [""],
    ["/settings"],
    ["/unknown"],
    ["mailto:someone@example.com"],
    ["https://example.com/settings"],
    ["https://example.com/admin/assets/asset-1"],
  ])("keeps unsupported link %s inside the app", (link) => {
    expect(resolveNotificationRoute(link)).toBe(NOTIFICATION_ROUTES.HOME);
  });
});
