// src/modules/admin/users/user.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserController from "./user.controller";
import UserService from "./user.service";
import type { IAdminUserFormValues } from "./types";
import type { IAdminRole } from "../role";

vi.mock("./user.service", () => ({
  default: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    getDiscardedUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    discardUser: vi.fn(),
    undiscardUser: vi.fn(),
    getRoles: vi.fn(),
  },
}));

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUsers", () => {
    it("returns parsed users and pagination when API succeeds", async () => {
      const mockUsers = [
        {
          id: "u1",
          type: "user",
          attributes: {
            id: "u1",
            email: "user1@example.com",
            username: "user1",
            name: "User One",
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockUsers,
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

      vi.mocked(UserService.getUsers).mockResolvedValue(mockResponse as never);

      const result = await UserController.getUsers({ page: 1 });

      expect(UserService.getUsers).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.users).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "u1" })]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });

    it("returns error when API fails", async () => {
      const mockResponse = {
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      };

      vi.mocked(UserService.getUsers).mockResolvedValue(mockResponse as never);

      const result = await UserController.getUsers();

      expect(result.success).toBe(false);
      expect(result.users).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getUser", () => {
    it("returns single user when API succeeds", async () => {
      const mockUser = {
        id: "u1",
        email: "user1@example.com",
        username: "user1",
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user: mockUser },
        },
      };

      vi.mocked(UserService.getUser).mockResolvedValue(mockResponse as never);

      const result = await UserController.getUser("u1");

      expect(UserService.getUser).toHaveBeenCalledWith("u1");
      expect(result.success).toBe(true);
      expect(result.user).toEqual(
        expect.objectContaining({ id: "u1", email: "user1@example.com" }),
      );
    });

    it("returns error when user is not found", async () => {
      const mockResponse = {
        data: {
          status: { code: 404, success: false, message: "Not Found" },
          data: null,
        },
      };

      vi.mocked(UserService.getUser).mockResolvedValue(mockResponse as never);

      const result = await UserController.getUser("u999");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getDiscardedUsers", () => {
    it("returns discarded users list", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "u2", type: "user", attributes: { id: "u2", email: "discarded@example.com" } }],
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(UserService.getDiscardedUsers).mockResolvedValue(
        mockResponse as never,
      );

      const result = await UserController.getDiscardedUsers({ page: 1 });

      expect(UserService.getDiscardedUsers).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.users).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "u2" })]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });
  });

  describe("createUser", () => {
    it("creates user and returns created user and message", async () => {
      const formValues: IAdminUserFormValues = {
        email: "new@example.com",
        username: "newuser",
        name: "New User",
        role_ids: ["r1"],
      };

      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "User created" },
          data: { user: { id: "u3", email: "new@example.com" } },
        },
      };

      vi.mocked(UserService.createUser).mockResolvedValue(mockResponse as never);

      const result = await UserController.createUser(formValues);

      expect(UserService.createUser).toHaveBeenCalledWith(formValues);
      expect(result.success).toBe(true);
      expect(result.user).toEqual(expect.objectContaining({ id: "u3" }));
      expect(result.message).toBe("User created");
    });
  });

  describe("updateUser", () => {
    it("updates user and returns updated user", async () => {
      const formValues: IAdminUserFormValues = {
        email: "updated@example.com",
        username: "updateduser",
        name: "Updated User",
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "User updated" },
          data: { user: { id: "u1", email: "updated@example.com" } },
        },
      };

      vi.mocked(UserService.updateUser).mockResolvedValue(mockResponse as never);

      const result = await UserController.updateUser("u1", formValues);

      expect(UserService.updateUser).toHaveBeenCalledWith("u1", formValues);
      expect(result.success).toBe(true);
      expect(result.user).toEqual(expect.objectContaining({ id: "u1" }));
      expect(result.message).toBe("User updated");
    });
  });

  describe("discardUser", () => {
    it("discards user and returns status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "User moved to recycle bin" },
          data: {},
        },
      };

      vi.mocked(UserService.discardUser).mockResolvedValue(mockResponse as never);

      const result = await UserController.discardUser("u1");

      expect(UserService.discardUser).toHaveBeenCalledWith("u1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("User moved to recycle bin");
    });
  });

  describe("undiscardUser", () => {
    it("undiscards user and returns status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "User restored" },
          data: {},
        },
      };

      vi.mocked(UserService.undiscardUser).mockResolvedValue(
        mockResponse as never,
      );

      const result = await UserController.undiscardUser("u1");

      expect(UserService.undiscardUser).toHaveBeenCalledWith("u1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("User restored");
    });
  });

  describe("getRoles", () => {
    it("returns role list", async () => {
      const mockRoles: IAdminRole[] = [
        { id: "r1", name: "admin", description: "Admin", system: true },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { roles: mockRoles },
        },
      };

      vi.mocked(UserService.getRoles).mockResolvedValue(mockResponse as never);

      const result = await UserController.getRoles();

      expect(UserService.getRoles).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.roles).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "r1" })]),
      );
    });
  });
});
