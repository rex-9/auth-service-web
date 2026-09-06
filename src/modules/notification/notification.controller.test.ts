// src/modules/notification/notification.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotificationController from "./notification.controller";
import NotificationService from "./notification.service";

vi.mock("./notification.service", () => ({
  default: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
  },
  NotificationService: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
  },
}));

describe("UserNotificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getNotifications", () => {
    it("returns notifications and pagination on success", async () => {
      const mockNotifications = [
        {
          id: "noti-1",
          title: "Welcome",
          message: "Welcome to Rexone!",
          link: "/dashboard",
          data: {},
          read: false,
          read_at: null,
          notification_id: null,
          created_at: "2026-09-05T10:00:00Z",
        },
      ];
      const mockPagination = {
        current_page: 1,
        per_page: 20,
        total_pages: 1,
        total_count: 1,
        next_page: null,
        prev_page: null,
      };

      vi.mocked(NotificationService.getNotifications).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockNotifications,
          meta: { pagination: mockPagination },
        },
      } as never);

      const result = await NotificationController.getNotifications({
        page: 1,
        filter: "all",
      });

      expect(result.records).toEqual(mockNotifications);
      expect(result.pagination).toEqual(mockPagination);
    });

    it("handles error response gracefully", async () => {
      vi.mocked(NotificationService.getNotifications).mockResolvedValue({
        data: {
          status: {
            code: 500,
            success: false,
            message: "Internal server error",
          },
          data: null,
        },
      } as never);

      const result = await NotificationController.getNotifications();

      expect(result.records).toEqual([]);
      expect(result.pagination).toBeNull();
    });
  });

  describe("getUnreadCount", () => {
    it("returns unread count on success", async () => {
      vi.mocked(NotificationService.getUnreadCount).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { unread_count: 5 },
        },
      } as never);

      const count = await NotificationController.getUnreadCount();
      expect(count).toBe(5);
    });

    it("returns 0 on failure", async () => {
      vi.mocked(NotificationService.getUnreadCount).mockRejectedValue(
        new Error("Network error"),
      );

      const count = await NotificationController.getUnreadCount();
      expect(count).toBe(0);
    });
  });

  describe("markAsRead", () => {
    it("calls service to mark notification as read", async () => {
      vi.mocked(NotificationService.markAsRead).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Marked as read" },
          data: { id: "noti-1", read: true },
        },
      } as never);

      const result = await NotificationController.markAsRead("noti-1");
      expect(result).toEqual({ id: "noti-1", read: true });
      expect(NotificationService.markAsRead).toHaveBeenCalledWith("noti-1");
    });
  });

  describe("markAllAsRead", () => {
    it("calls service to mark all notifications as read", async () => {
      vi.mocked(NotificationService.markAllAsRead).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "All marked as read" },
          data: { updated_count: 3 },
        },
      } as never);

      await expect(
        NotificationController.markAllAsRead(),
      ).resolves.toBeUndefined();
      expect(NotificationService.markAllAsRead).toHaveBeenCalled();
    });
  });

  describe("deleteNotification", () => {
    it("calls service to delete notification", async () => {
      vi.mocked(NotificationService.deleteNotification).mockResolvedValue({
        data: {
          status: {
            code: 200,
            success: true,
            message: "Notification deleted",
          },
          data: null,
        },
      } as never);

      await expect(
        NotificationController.deleteNotification("noti-1"),
      ).resolves.toBeUndefined();
      expect(NotificationService.deleteNotification).toHaveBeenCalledWith(
        "noti-1",
      );
    });
  });
});

