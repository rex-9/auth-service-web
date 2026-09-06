// src/modules/admin/notifications/notification.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotificationController from "./notification.controller";
import NotificationService from "./notification.service";
import type {
  IAdminNotificationFormValues,
  IAdminNotificationTemplateFormValues,
} from "./types";

vi.mock("./notification.service", () => ({
  default: {
    getTemplates: vi.fn(),
    getTemplate: vi.fn(),
    createTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    discardTemplate: vi.fn(),
    undiscardTemplate: vi.fn(),
    createNotification: vi.fn(),
  },
}));

describe("NotificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTemplates", () => {
    it("returns templates on success", async () => {
      const mockTemplates = [
        {
          id: "welcome_email",
          event: "user.welcome",
          channels: ["email"],
          category: "marketing",
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockTemplates,
        },
      };

      vi.mocked(NotificationService.getTemplates).mockResolvedValue(
        mockResponse as never,
      );

      const result = await NotificationController.getTemplates();

      expect(NotificationService.getTemplates).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.templates).toEqual(mockTemplates);
    });

    it("returns error on failure", async () => {
      vi.mocked(NotificationService.getTemplates).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.getTemplates();

      expect(result.success).toBe(false);
      expect(result.templates).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getTemplate", () => {
    it("returns template on success", async () => {
      const mockTemplate = {
        id: "tpl_1",
        event: "user.welcome",
        channels: ["email"],
        category: "marketing",
      };
      vi.mocked(NotificationService.getTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockTemplate,
        },
      } as never);

      const result = await NotificationController.getTemplate("tpl_1");

      expect(NotificationService.getTemplate).toHaveBeenCalledWith("tpl_1");
      expect(result.success).toBe(true);
      expect(result.template).toEqual(mockTemplate);
    });

    it("returns error on failure", async () => {
      vi.mocked(NotificationService.getTemplate).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await NotificationController.getTemplate("tpl_99");

      expect(result.success).toBe(false);
      expect(result.template).toBeUndefined();
      expect(result.error).toBeTruthy();
    });
  });

  describe("createTemplate", () => {
    it("creates and returns template on success", async () => {
      const formValues: IAdminNotificationTemplateFormValues = {
        event: "account.alert",
        name: "Alert Template",
        category: "security",
        admin: false,
        in_app_title: "Alert",
        in_app_body: "Security issue detected",
      };
      const mockTemplate = { id: "tpl_2", ...formValues };

      vi.mocked(NotificationService.createTemplate).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Created" },
          data: mockTemplate,
        },
      } as never);

      const result = await NotificationController.createTemplate(formValues);

      expect(NotificationService.createTemplate).toHaveBeenCalledWith(formValues);
      expect(result.success).toBe(true);
      expect(result.template).toEqual(mockTemplate);
    });

    it("returns error on creation failure", async () => {
      vi.mocked(NotificationService.createTemplate).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Validation error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.createTemplate({
        event: "",
        name: "",
        category: "",
        admin: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("updateTemplate", () => {
    it("updates and returns template on success", async () => {
      const updates = { in_app_title: "Updated Title" };
      const mockTemplate = { id: "tpl_1", event: "alert", name: "Alert", category: "security", admin: false, ...updates };

      vi.mocked(NotificationService.updateTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Updated" },
          data: mockTemplate,
        },
      } as never);

      const result = await NotificationController.updateTemplate("tpl_1", updates);

      expect(NotificationService.updateTemplate).toHaveBeenCalledWith("tpl_1", updates);
      expect(result.success).toBe(true);
      expect(result.template).toEqual(mockTemplate);
    });

    it("returns error on update failure", async () => {
      vi.mocked(NotificationService.updateTemplate).mockResolvedValue({
        data: {
          status: { code: 400, success: false, message: "Update error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.updateTemplate("tpl_1", {});

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("discardTemplate", () => {
    it("returns success: true when discarded", async () => {
      vi.mocked(NotificationService.discardTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Deleted" },
          data: null,
        },
      } as never);

      const result = await NotificationController.discardTemplate("tpl_1");

      expect(NotificationService.discardTemplate).toHaveBeenCalledWith("tpl_1");
      expect(result.success).toBe(true);
    });

    it("returns error when discard fails", async () => {
      vi.mocked(NotificationService.discardTemplate).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await NotificationController.discardTemplate("tpl_99");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("undiscardTemplate", () => {
    it("returns success: true when restored", async () => {
      vi.mocked(NotificationService.undiscardTemplate).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Restored" },
          data: null,
        },
      } as never);

      const result = await NotificationController.undiscardTemplate("tpl_1");

      expect(NotificationService.undiscardTemplate).toHaveBeenCalledWith("tpl_1");
      expect(result.success).toBe(true);
    });

    it("returns error when restore fails", async () => {
      vi.mocked(NotificationService.undiscardTemplate).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server error" },
          data: null,
        },
      } as never);

      const result = await NotificationController.undiscardTemplate("tpl_1");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("createNotification", () => {
    it("returns delivered info when notification is broadcast or queued", async () => {
      const formValues: IAdminNotificationFormValues = {
        event: "system.maintenance",
        audience_type: "all",
        role_ids: [],
        user_ids: [],
        send_email: true,
        send_socket: true,
        send_push: false,
      };

      const mockDelivery = {
        id: "del_1",
        audience_type: "all" as const,
        recipient_count: 100,
        channels: ["email" as const, "socket" as const],
        delivered_at: "2026-09-01T00:00:00Z",
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Notification sent" },
          data: mockDelivery,
        },
      };

      vi.mocked(NotificationService.createNotification).mockResolvedValue(
        mockResponse as never,
      );

      const result = await NotificationController.createNotification(formValues);

      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        formValues,
      );
      expect(result.success).toBe(true);
      expect(result.delivered).toEqual(mockDelivery);
      expect(result.message).toBe("Notification sent");
    });

    it("handles 202 Accepted queued status", async () => {
      const formValues: IAdminNotificationFormValues = {
        event: "newsletter",
        audience_type: "all",
        role_ids: [],
        user_ids: [],
        send_email: true,
        send_socket: false,
        send_push: false,
      };

      const mockDelivery = {
        id: "del_2",
        audience_type: "all" as const,
        recipient_count: 5000,
        channels: ["email" as const],
        delivered_at: "2026-09-01T00:00:00Z",
      };

      const mockResponse = {
        data: {
          status: { code: 202, success: false, message: "Notification queued" },
          data: mockDelivery,
        },
      };

      vi.mocked(NotificationService.createNotification).mockResolvedValue(
        mockResponse as never,
      );

      const result = await NotificationController.createNotification(formValues);

      expect(result.success).toBe(true);
      expect(result.delivered).toEqual(mockDelivery);
      expect(result.message).toBe("Notification queued");
    });
  });
});
