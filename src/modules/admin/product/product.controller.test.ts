// src/modules/admin/products/product.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductController from "./product.controller";
import ProductService from "./product.service";
import type { IAdminProductFormValues } from "./types";

vi.mock("./product.service", () => ({
  default: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    getDiscardedProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    discardProduct: vi.fn(),
    undiscardProduct: vi.fn(),
  },
}));

describe("ProductController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("returns parsed products and pagination", async () => {
      const mockProducts = [
        {
          id: "p1",
          type: "product",
          attributes: {
            id: "p1",
            name: "Pro Plan",
            price_unit_amount: 1999,
            currency: "USD",
            cycle: "month",
            active: true,
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockProducts,
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

      vi.mocked(ProductService.getProducts).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.getProducts({ page: 1 });

      expect(ProductService.getProducts).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "p1" })]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });

    it("returns error on failure", async () => {
      vi.mocked(ProductService.getProducts).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      } as never);

      const result = await ProductController.getProducts();

      expect(result.success).toBe(false);
      expect(result.products).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getProduct", () => {
    it("returns parsed product on success", async () => {
      const mockProduct = { id: "p1", name: "Pro Plan" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { product: mockProduct },
        },
      };

      vi.mocked(ProductService.getProduct).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.getProduct("p1");

      expect(ProductService.getProduct).toHaveBeenCalledWith("p1");
      expect(result.success).toBe(true);
      expect(result.product).toEqual(
        expect.objectContaining({ id: "p1", name: "Pro Plan" }),
      );
    });
  });

  describe("getDiscardedProducts", () => {
    it("returns discarded products list", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "p2", type: "product", attributes: { id: "p2", name: "Old Plan" } }],
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(ProductService.getDiscardedProducts).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.getDiscardedProducts({ page: 1 });

      expect(ProductService.getDiscardedProducts).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "p2" })]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });
  });

  describe("createProduct", () => {
    it("returns created product and message", async () => {
      const formValues: IAdminProductFormValues = {
        name: "Enterprise",
        description: "Enterprise tier",
        price_unit_amount: 9900,
        currency: "USD",
        cycle: "year",
        active: true,
      };

      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Product created" },
          data: { product: { id: "p3", name: "Enterprise" } },
        },
      };

      vi.mocked(ProductService.createProduct).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.createProduct(formValues);

      expect(ProductService.createProduct).toHaveBeenCalledWith(formValues);
      expect(result.success).toBe(true);
      expect(result.product).toEqual(expect.objectContaining({ id: "p3" }));
      expect(result.message).toBe("Product created");
    });
  });

  describe("updateProduct", () => {
    it("returns updated product and message", async () => {
      const formValues: IAdminProductFormValues = {
        name: "Enterprise Updated",
        description: "Updated description",
        price_unit_amount: 9900,
        currency: "USD",
        cycle: "year",
        active: true,
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Product updated" },
          data: { product: { id: "p3", name: "Enterprise Updated" } },
        },
      };

      vi.mocked(ProductService.updateProduct).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.updateProduct("p3", formValues);

      expect(ProductService.updateProduct).toHaveBeenCalledWith("p3", formValues);
      expect(result.success).toBe(true);
      expect(result.product).toEqual(expect.objectContaining({ id: "p3" }));
      expect(result.message).toBe("Product updated");
    });
  });

  describe("discardProduct", () => {
    it("discards product and returns status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Product discarded" },
        },
      };

      vi.mocked(ProductService.discardProduct).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.discardProduct("p1");

      expect(ProductService.discardProduct).toHaveBeenCalledWith("p1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("Product discarded");
    });
  });

  describe("undiscardProduct", () => {
    it("undiscards product and returns status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Product restored" },
          data: { id: "p1" },
        },
      };

      vi.mocked(ProductService.undiscardProduct).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ProductController.undiscardProduct("p1");

      expect(ProductService.undiscardProduct).toHaveBeenCalledWith("p1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("Product restored");
    });
  });
});
