import { describe, it, expect, vi, beforeEach } from "vitest";
import VersionController from "./version.controller";
import VersionService from "./version.service";
import type { IAdminVersionFormValues } from "./types";
import { VERSION_STATUSES } from "./constants";

vi.mock("./version.service", () => ({
  default: {
    getVersions: vi.fn(),
    getVersion: vi.fn(),
    getDiscardedVersions: vi.fn(),
    createVersion: vi.fn(),
    updateVersion: vi.fn(),
    discardVersion: vi.fn(),
    undiscardVersion: vi.fn(),
    getUserVersions: vi.fn(),
    getUserVersionByVersion: vi.fn(),
  },
}));

describe("VersionController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getVersions", () => {
    it("returns parsed versions and pagination", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "v1",
              type: "version",
              attributes: {
                id: "v1",
                number: "1.2.0",
                title: "Live",
                status: "published",
                is_force_update: false,
                install_count: 2,
              },
            },
          ],
          meta: {
            pagination: {
              current_page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      };

      vi.mocked(VersionService.getVersions).mockResolvedValue(
        mockResponse as never,
      );

      const result = await VersionController.getVersions({ page: 1 });

      expect(VersionService.getVersions).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.versions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "v1", number: "1.2.0" }),
        ]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });

    it("returns error on failure", async () => {
      vi.mocked(VersionService.getVersions).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      } as never);

      const result = await VersionController.getVersions();

      expect(result.success).toBe(false);
      expect(result.versions).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getVersion", () => {
    it("returns a flat version object", async () => {
      vi.mocked(VersionService.getVersion).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: {
            id: "v1",
            number: "1.4.0",
            title: "Force",
            status: "draft",
            is_force_update: false,
          },
        },
      } as never);

      const result = await VersionController.getVersion("v1");

      expect(VersionService.getVersion).toHaveBeenCalledWith("v1");
      expect(result.success).toBe(true);
      expect(result.version).toEqual(
        expect.objectContaining({ id: "v1", number: "1.4.0" }),
      );
    });
  });

  describe("createVersion", () => {
    it("returns created version and message", async () => {
      const formValues: IAdminVersionFormValues = {
        number: "2.0.0",
        title: "Next",
        description: "Release notes",
        status: VERSION_STATUSES.DRAFT,
        is_force_update: false,
        ios_build_number: 90,
        android_build_number: 84,
      };

      vi.mocked(VersionService.createVersion).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Created" },
          data: { id: "v2", number: "2.0.0", title: "Next" },
        },
      } as never);

      const result = await VersionController.createVersion(formValues);

      expect(VersionService.createVersion).toHaveBeenCalledWith(formValues);
      expect(result.success).toBe(true);
      expect(result.version).toEqual(expect.objectContaining({ id: "v2" }));
      expect(result.message).toBe("Created");
    });
  });

  describe("updateVersion", () => {
    it("uses PUT via the service and returns the updated version", async () => {
      vi.mocked(VersionService.updateVersion).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Updated" },
          data: { id: "v1", status: "published" },
        },
      } as never);

      const result = await VersionController.updateVersion("v1", {
        status: VERSION_STATUSES.PUBLISHED,
      });

      expect(VersionService.updateVersion).toHaveBeenCalledWith("v1", {
        status: VERSION_STATUSES.PUBLISHED,
      });
      expect(result.success).toBe(true);
      expect(result.version).toEqual(
        expect.objectContaining({ status: "published" }),
      );
    });
  });

  describe("discardVersion", () => {
    it("returns success without data", async () => {
      vi.mocked(VersionService.discardVersion).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Discarded" },
        },
      } as never);

      const result = await VersionController.discardVersion("v1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Discarded");
    });
  });

  describe("undiscardVersion", () => {
    it("returns the restored flat version", async () => {
      vi.mocked(VersionService.undiscardVersion).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Restored" },
          data: { id: "v1", discarded_at: null },
        },
      } as never);

      const result = await VersionController.undiscardVersion("v1");

      expect(result.success).toBe(true);
      expect(result.version).toEqual(expect.objectContaining({ id: "v1" }));
    });
  });

  describe("getUserVersions", () => {
    it("returns parsed user versions and pagination", async () => {
      vi.mocked(VersionService.getUserVersions).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "i1",
              type: "user_version",
              attributes: {
                id: "i1",
                user_id: "u1",
                user_email: "newer@example.com",
                platform: "android",
                number: "1.4.0",
                build_number: 84,
                version_id: "v1",
              },
            },
          ],
          meta: {
            pagination: {
              current_page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      } as never);

      const result = await VersionController.getUserVersions({
        page: 1,
        platform: "android",
        sort_by: "last_seen_at",
        sort_order: "desc",
      });

      expect(VersionService.getUserVersions).toHaveBeenCalledWith({
        page: 1,
        platform: "android",
        sort_by: "last_seen_at",
        sort_order: "desc",
      });
      expect(result.success).toBe(true);
      expect(result.userVersions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user_email: "newer@example.com",
            platform: "android",
            number: "1.4.0",
          }),
        ]),
      );
    });
  });

  describe("getUserVersionByVersion", () => {
    it("loads user versions nested under one version", async () => {
      vi.mocked(VersionService.getUserVersionByVersion).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "i1",
              type: "user_version",
              attributes: {
                id: "i1",
                user_id: "u1",
                platform: "ios",
                number: "1.4.0",
                version_id: "v1",
              },
            },
          ],
          meta: {
            pagination: {
              current_page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      } as never);

      const result = await VersionController.getUserVersionByVersion("v1", {
        page: 1,
      });

      expect(VersionService.getUserVersionByVersion).toHaveBeenCalledWith("v1", {
        page: 1,
      });
      expect(result.success).toBe(true);
      expect(result.userVersions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ version_id: "v1", platform: "ios" }),
        ]),
      );
    });
  });
});
