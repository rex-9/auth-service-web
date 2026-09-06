// src/modules/admin/roles/role.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoleController from "./role.controller";
import RoleService from "./role.service";
import type { IAdminRoleFormValues } from "./types";

vi.mock("./role.service", () => ({
  default: {
    getRoles: vi.fn(),
    getRole: vi.fn(),
    getPermissions: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    discardRole: vi.fn(),
    undiscardRole: vi.fn(),
  },
}));

describe("RoleController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRoles", () => {
    it("returns parsed roles when API succeeds", async () => {
      const mockRoles = [
        {
          id: "r1",
          type: "role",
          attributes: {
            id: "r1",
            name: "Manager",
            description: "Branch manager",
            system: false,
            permissions: { users: ["read", "update"] },
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockRoles,
        },
      };

      vi.mocked(RoleService.getRoles).mockResolvedValue(mockResponse as never);

      const result = await RoleController.getRoles();

      expect(RoleService.getRoles).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.roles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "r1", name: "Manager" }),
        ]),
      );
    });

    it("returns error when API fails", async () => {
      vi.mocked(RoleService.getRoles).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null,
        },
      } as never);

      const result = await RoleController.getRoles();

      expect(result.success).toBe(false);
      expect(result.roles).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getRole", () => {
    it("returns single role", async () => {
      const mockRole = { id: "r1", name: "Admin" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { role: mockRole },
        },
      };

      vi.mocked(RoleService.getRole).mockResolvedValue(mockResponse as never);

      const result = await RoleController.getRole("r1");

      expect(RoleService.getRole).toHaveBeenCalledWith("r1");
      expect(result.success).toBe(true);
      expect(result.role).toEqual(
        expect.objectContaining({ id: "r1", name: "Admin" }),
      );
    });
  });

  describe("getPermissions", () => {
    it("returns permission definitions", async () => {
      const mockPermissions = [
        { id: "p1", type: "permission", attributes: { id: "p1", resource: "users", action: "read" } },
        { id: "p2", type: "permission", attributes: { id: "p2", resource: "users", action: "create" } },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockPermissions,
        },
      };

      vi.mocked(RoleService.getPermissions).mockResolvedValue(
        mockResponse as never,
      );

      const result = await RoleController.getPermissions();

      expect(RoleService.getPermissions).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.permissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ resource: "users" }),
        ]),
      );
    });
  });

  describe("createRole", () => {
    it("returns created role", async () => {
      const formValues: IAdminRoleFormValues = {
        name: "Support Specialist",
        description: "Customer support staff",
        permission_ids: ["p1", "p2"],
      };

      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Role created" },
          data: { role: { id: "r2", name: "Support Specialist" } },
        },
      };

      vi.mocked(RoleService.createRole).mockResolvedValue(
        mockResponse as never,
      );

      const result = await RoleController.createRole(formValues);

      expect(RoleService.createRole).toHaveBeenCalledWith(formValues);
      expect(result.success).toBe(true);
      expect(result.role).toEqual(
        expect.objectContaining({ id: "r2", name: "Support Specialist" }),
      );
    });
  });

  describe("updateRole", () => {
    it("returns updated role", async () => {
      const formValues: IAdminRoleFormValues = {
        name: "Support Lead",
        description: "Lead customer support",
        permission_ids: ["p1", "p2", "p3"],
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Role updated" },
          data: { role: { id: "r2", name: "Support Lead" } },
        },
      };

      vi.mocked(RoleService.updateRole).mockResolvedValue(
        mockResponse as never,
      );

      const result = await RoleController.updateRole("r2", formValues);

      expect(RoleService.updateRole).toHaveBeenCalledWith("r2", formValues);
      expect(result.success).toBe(true);
      expect(result.role).toEqual(
        expect.objectContaining({ id: "r2", name: "Support Lead" }),
      );
    });
  });

  describe("discardRole", () => {
    it("returns success when role is discarded", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Role discarded" },
        },
      };

      vi.mocked(RoleService.discardRole).mockResolvedValue(
        mockResponse as never,
      );

      const result = await RoleController.discardRole("r2");

      expect(RoleService.discardRole).toHaveBeenCalledWith("r2");
      expect(result.success).toBe(true);
    });
  });

  describe("undiscardRole", () => {
    it("returns success when role is restored", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Role restored" },
          data: { role: { id: "r2", name: "Support Lead" } },
        },
      };

      vi.mocked(RoleService.undiscardRole).mockResolvedValue(
        mockResponse as never,
      );

      const result = await RoleController.undiscardRole("r2");

      expect(RoleService.undiscardRole).toHaveBeenCalledWith("r2");
      expect(result.success).toBe(true);
    });
  });
});
