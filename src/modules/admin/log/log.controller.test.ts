import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminLogController from "./log.controller";
import AdminLogService from "./log.service";

vi.mock("./log.service", () => ({
  default: {
    getLogs: vi.fn(),
    getLog: vi.fn(),
    resolveLog: vi.fn(),
    unresolveLog: vi.fn(),
    discardLog: vi.fn(),
    undiscardLog: vi.fn(),
    deleteLog: vi.fn(),
  },
}));

describe("AdminLogController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLogs", () => {
    it("returns paginated telemetry logs on success", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "log_1",
              type: "client_log",
              attributes: {
                id: "log_1",
                message: "Uncaught TypeError: Cannot read property",
                severity: "error",
                platform: "web",
                occurrence_count: 5,
                created_at: "2026-09-01T00:00:00Z",
                updated_at: "2026-09-01T00:00:00Z",
              },
            },
          ],
          meta: {
            pagination: {
              page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      };

      vi.mocked(AdminLogService.getLogs).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminLogController.getLogs();

      expect(result.success).toBe(true);
      expect(result.logs.length).toBe(1);
      expect(result.logs[0].occurrence_count).toBe(5);
    });
  });

  describe("resolveLog", () => {
    it("marks log as resolved", async () => {
      vi.mocked(AdminLogService.resolveLog).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Resolved" },
          data: {
            id: "log_1",
            type: "client_log",
            attributes: {
              id: "log_1",
              resolved_at: "2026-09-01T01:00:00Z",
            },
          },
        },
      } as never);

      const result = await AdminLogController.resolveLog("log_1");

      expect(result.success).toBe(true);
      expect(result.log?.resolved_at).toBeDefined();
    });
  });

  describe("discardLog", () => {
    it("discards log successfully", async () => {
      vi.mocked(AdminLogService.discardLog).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Discarded" },
          data: {},
        },
      } as never);

      const result = await AdminLogController.discardLog("log_1");

      expect(result.success).toBe(true);
      expect(AdminLogService.discardLog).toHaveBeenCalledWith("log_1");
    });
  });

  describe("undiscardLog", () => {
    it("restores log successfully", async () => {
      vi.mocked(AdminLogService.undiscardLog).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Restored" },
          data: {
            id: "log_1",
            type: "client_log",
            attributes: { id: "log_1" },
          },
        },
      } as never);

      const result = await AdminLogController.undiscardLog("log_1");

      expect(result.success).toBe(true);
      expect(AdminLogService.undiscardLog).toHaveBeenCalledWith("log_1");
    });
  });
});
