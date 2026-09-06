import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminAccessesController from "./access.controller";
import AdminAccessesService from "./access.service";

vi.mock("./access.service", () => ({
  default: {
    getAccesses: vi.fn(),
    grantAccess: vi.fn(),
    extendAccess: vi.fn(),
    revokeAccess: vi.fn(),
  },
}));

describe("AdminAccessesController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAccesses", () => {
    it("returns paginated accesses on success", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "acc_1",
              type: "access",
              attributes: {
                id: "acc_1",
                status: "active",
                product_id: "prod_1",
                product_name: "Course 1",
                user_id: "usr_1",
                active: true,
                granted_at: "2026-09-01T00:00:00Z",
                expires_at: null,
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

      vi.mocked(AdminAccessesService.getAccesses).mockResolvedValue(mockResponse as never);

      const result = await AdminAccessesController.getAccesses();

      expect(result.success).toBe(true);
      expect(result.accesses.length).toBe(1);
      expect(result.accesses[0].product_name).toBe("Course 1");
      expect(result.pagination?.total_count).toBe(1);
    });

    it("returns error on failure", async () => {
      vi.mocked(AdminAccessesService.getAccesses).mockResolvedValue({
        data: {
          status: { code: 403, success: false, message: "Forbidden" },
          data: null,
        },
      } as never);

      const result = await AdminAccessesController.getAccesses();

      expect(result.success).toBe(false);
      expect(result.accesses).toEqual([]);
      expect(result.error).toBeDefined();
    });
  });

  describe("grantAccess", () => {
    it("grants access and returns access attributes on success", async () => {
      vi.mocked(AdminAccessesService.grantAccess).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Created" },
          data: [
            {
              id: "acc_2",
              type: "access",
              attributes: {
                id: "acc_2",
                status: "active",
                product_id: "prod_1",
                user_id: "usr_2",
                active: true,
              },
            },
          ],
        },
      } as never);

      const result = await AdminAccessesController.grantAccess({
        user_id: "usr_2",
        product_id: "prod_1",
        days: 30,
      });

      expect(result.success).toBe(true);
      expect(result.accesses.length).toBe(1);
      expect(result.accesses[0].id).toBe("acc_2");
    });
  });

  describe("revokeAccess", () => {
    it("revokes access on success", async () => {
      vi.mocked(AdminAccessesService.revokeAccess).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Revoked" },
          data: {},
        },
      } as never);

      const result = await AdminAccessesController.revokeAccess("acc_1");

      expect(result.success).toBe(true);
    });
  });
});
