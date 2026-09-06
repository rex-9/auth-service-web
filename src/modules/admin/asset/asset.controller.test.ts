// src/modules/admin/asset/asset.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminAssetController from "./asset.controller";
import AdminAssetService from "./asset.service";

vi.mock("./asset.service", () => ({
  default: {
    getAssets: vi.fn(),
    getAsset: vi.fn(),
    getDiscardedAssets: vi.fn(),
    uploadAsset: vi.fn(),
    updateAsset: vi.fn(),
    discardAsset: vi.fn(),
    restoreAsset: vi.fn(),
    destroyAsset: vi.fn(),
    compressAsset: vi.fn(),
    getStorageStats: vi.fn(),
    emptyRecycleBin: vi.fn(),
    discardBatch: vi.fn(),
    undiscardBatch: vi.fn(),
    destroyBatch: vi.fn(),
  },
}));

describe("AdminAssetController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAssets", () => {
    it("returns parsed assets filtered by type and search", async () => {
      const mockAssets = [
        {
          id: "a1",
          type: "asset",
          attributes: {
            id: "a1",
            name: "avatar.png",
            url: "https://example.com/avatar.png",
            type: "avatar",
            format: "image",
            size_bytes: 1024,
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockAssets,
          meta: {
            pagination: {
              current_page: 1,
              limit: 12,
              total_count: 1,
              total_pages: 1,
              next_page: null,
              prev_page: null,
            },
          },
        },
      };

      vi.mocked(AdminAssetService.getAssets).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.getAssets({
        type: "avatar",
        search: "avatar",
      });

      expect(result.success).toBe(true);
      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].name).toBe("avatar.png");
      expect(AdminAssetService.getAssets).toHaveBeenCalledWith({
        type: "avatar",
        search: "avatar",
      });
    });
  });

  describe("uploadAsset", () => {
    it("uploads asset with metadata and folder", async () => {
      const file = new File(["test-content"], "test.png", {
        type: "image/png",
      });
      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Uploaded" },
          data: {
            id: "a2",
            type: "asset",
            attributes: {
              id: "a2",
              name: "test.png",
              url: "https://example.com/test.png",
              type: "cover",
            },
          },
        },
      };

      vi.mocked(AdminAssetService.uploadAsset).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.uploadAsset(file, {
        type: "cover",
        folder: "admin_uploads",
      });

      expect(result.success).toBe(true);
      expect(result.asset?.name).toBe("test.png");
      expect(AdminAssetService.uploadAsset).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          type: "cover",
          folder: "admin_uploads",
        }),
      );
    });
  });

  describe("compressAsset", () => {
    it("calls service and returns parsed asset and message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Compression enqueued" },
          data: {
            id: "a3",
            type: "asset",
            attributes: {
              id: "a3",
              name: "banner.png",
              status: "processing",
              size_bytes: 5000,
            },
          },
        },
      };

      vi.mocked(AdminAssetService.compressAsset).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.compressAsset("a3");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Compression enqueued");
      expect(result.asset?.id).toBe("a3");
      expect(result.asset?.status).toBe("processing");
      expect(AdminAssetService.compressAsset).toHaveBeenCalledWith("a3");
    });

    it("handles failure response", async () => {
      const mockResponse = {
        data: {
          status: {
            code: 422,
            success: false,
            message: "Only images and videos can be compressed",
          },
        },
      };

      vi.mocked(AdminAssetService.compressAsset).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.compressAsset("a4");

      expect(result.success).toBe(false);
      expect(result.isOptimal).toBe(false);
      expect(result.error).toBe("Only images and videos can be compressed");
    });

    it("identifies optimal status when asset is already optimal or reached limit", async () => {
      const mockResponse = {
        data: {
          status: {
            code: 422,
            success: false,
            message: "Asset is already at optimal compression size.",
          },
          data: {
            asset: {
              id: "a5",
              name: "icon.png",
              status: "optimal",
            },
          },
        },
      };

      vi.mocked(AdminAssetService.compressAsset).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.compressAsset("a5");

      expect(result.success).toBe(false);
      expect(result.isOptimal).toBe(true);
      expect(result.asset?.status).toBe("optimal");
    });
  });

  describe("getStorageStats", () => {
    it("returns parsed storage statistics", async () => {
      const mockStats = {
        provider: "garage",
        bucket: "rexone",
        bucket_bytes: 500000,
        bucket_objects: 12,
        disk_available_bytes: 40000000000,
        disk_total_bytes: 50000000000,
        disk_used_percent: 20,
        disk_free_percent: 80,
        node_capacity_bytes: 1000000000,
        db_assets_count: 12,
        db_assets_bytes: 500000,
      };

      const mockResponse = {
        data: {
          status: {
            code: 200,
            success: true,
            message: "Storage statistics retrieved successfully",
          },
          data: { stats: mockStats },
        },
      };

      vi.mocked(AdminAssetService.getStorageStats).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.getStorageStats();

      expect(result.success).toBe(true);
      expect(result.stats).toEqual(mockStats);
      expect(result.stats?.provider).toBe("garage");
      expect(result.stats?.bucket_bytes).toBe(500000);
      expect(AdminAssetService.getStorageStats).toHaveBeenCalled();
    });
  });

  describe("emptyRecycleBin", () => {
    it("calls service and returns success with purged count", async () => {
      const mockResponse = {
        data: {
          status: {
            code: 200,
            success: true,
            message: "Recycle bin emptied successfully",
          },
          data: { count: 5 },
        },
      };

      vi.mocked(AdminAssetService.emptyRecycleBin).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.emptyRecycleBin();

      expect(result.success).toBe(true);
      expect(result.count).toBe(5);
      expect(result.message).toBe("Recycle bin emptied successfully");
      expect(AdminAssetService.emptyRecycleBin).toHaveBeenCalled();
    });

    it("handles failure response", async () => {
      const mockResponse = {
        data: {
          status: {
            code: 500,
            success: false,
            message: "Storage cleanup error",
          },
        },
      };

      vi.mocked(AdminAssetService.emptyRecycleBin).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.emptyRecycleBin();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Storage cleanup error");
    });
  });

  describe("batchDiscard", () => {
    it("calls service with ids and returns affected count", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "2 assets discarded" },
          data: { count: 2 },
        },
      };

      vi.mocked(AdminAssetService.discardBatch).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.discardBatch(["id1", "id2"]);

      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
      expect(AdminAssetService.discardBatch).toHaveBeenCalledWith([
        "id1",
        "id2",
      ]);
    });
  });

  describe("batchUndiscard", () => {
    it("calls service with ids and returns affected count", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "2 assets restored" },
          data: { count: 2 },
        },
      };

      vi.mocked(AdminAssetService.undiscardBatch).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.undiscardBatch(["id1", "id2"]);

      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
      expect(AdminAssetService.undiscardBatch).toHaveBeenCalledWith([
        "id1",
        "id2",
      ]);
    });
  });

  describe("batchDestroy", () => {
    it("calls service with ids and returns permanently deleted count", async () => {
      const mockResponse = {
        data: {
          status: {
            code: 200,
            success: true,
            message: "3 assets permanently deleted",
          },
          data: { count: 3 },
        },
      };

      vi.mocked(AdminAssetService.destroyBatch).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.destroyBatch([
        "id1",
        "id2",
        "id3",
      ]);

      expect(result.success).toBe(true);
      expect(result.count).toBe(3);
      expect(AdminAssetService.destroyBatch).toHaveBeenCalledWith([
        "id1",
        "id2",
        "id3",
      ]);
    });
  });
});
