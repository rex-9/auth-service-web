import { describe, it, expect, vi, beforeEach } from "vitest";
import UserController from "./user.controller";
import UserService from "./user.service";
import { USER_PEEK_STATUS } from "./constants";
import { IUser, IAssetUploadResponse } from "../../models";
import { AppLocales, translate } from "../../locales";

vi.mock("./user.service", () => ({
  default: {
    peekUser: vi.fn(),
    getCurrentUser: vi.fn(),
    updateCurrentUser: vi.fn(),
    uploadImage: vi.fn(),
  },
}));

const mockUser: IUser = {
  id: "user-1",
  email: "test@example.com",
  username: "testuser",
  name: "Test User",
} as any;

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("peekUser", () => {
    it("returns EXISTS_CONFIRMED for existing confirmed user", async () => {
      vi.mocked(UserService.peekUser).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user_exists: true, confirmed: true },
        },
      });

      const status = await UserController.peekUser("test@example.com");
      expect(status).toBe(USER_PEEK_STATUS.EXISTS_CONFIRMED);
    });

    it("returns EXISTS_UNCONFIRMED for unconfirmed user", async () => {
      vi.mocked(UserService.peekUser).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user_exists: true, confirmed: false },
        },
      });

      const status = await UserController.peekUser("test@example.com");
      expect(status).toBe(USER_PEEK_STATUS.EXISTS_UNCONFIRMED);
    });

    it("returns NOT_EXISTS for non-existent user", async () => {
      vi.mocked(UserService.peekUser).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user_exists: false, confirmed: false },
        },
      });

      const status = await UserController.peekUser("new@example.com");
      expect(status).toBe(USER_PEEK_STATUS.NOT_EXISTS);
    });

    it("returns DISCARDED when account is discarded", async () => {
      vi.mocked(UserService.peekUser).mockResolvedValue({
        data: {
          status: {
            code: 403,
            success: false,
            message: "Forbidden",
            error: translate(AppLocales.Auth.Initial.AccountDiscarded),
          },
          data: null as any,
        },
      });

      const status = await UserController.peekUser("discarded@example.com");
      expect(status).toBe(USER_PEEK_STATUS.DISCARDED);
    });

    it("throws error when peek request fails with server error", async () => {
      vi.mocked(UserService.peekUser).mockResolvedValue({
        data: null,
        error: "Network failure",
      });

      await expect(
        UserController.peekUser("test@example.com"),
      ).rejects.toThrow();
    });
  });

  describe("getCurrentUser", () => {
    it("returns current user object", async () => {
      vi.mocked(UserService.getCurrentUser).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user: mockUser, token: "tok-1" },
        },
      });

      const user = await UserController.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it("returns null when no user returned", async () => {
      vi.mocked(UserService.getCurrentUser).mockResolvedValue({
        data: null,
      });

      const user = await UserController.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe("updateCurrentUser", () => {
    it("returns the updated user from data.user", async () => {
      const updatedUser = {
        ...mockUser,
        name: "Alice Updated",
        username: "alice_new",
      };

      vi.mocked(UserService.updateCurrentUser).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Updated" },
          data: { user: updatedUser },
        },
      } as never);

      const result = await UserController.updateCurrentUser({
        name: "Alice Updated",
        username: "alice_new",
      });

      expect(UserService.updateCurrentUser).toHaveBeenCalledWith({
        name: "Alice Updated",
        username: "alice_new",
      });
      expect(result.success).toBe(true);
      expect(result.user).toEqual(updatedUser);
      expect(result.message).toBe("Updated");
    });

    it("returns error when username is taken", async () => {
      vi.mocked(UserService.updateCurrentUser).mockResolvedValue({
        data: {
          status: {
            code: 422,
            success: false,
            message: "Unprocessable",
            error: "Username has already been taken",
          },
          data: null,
        },
      } as never);

      const result = await UserController.updateCurrentUser({
        name: "Alice Updated",
        username: "taken",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Username has already been taken");
    });
  });

  describe("uploadImage", () => {
    it("uploads image file and returns upload response", async () => {
      const mockUploadResponse: IAssetUploadResponse = {
        url: "https://assets.rexone.test/avatar.png",
      } as any;

      vi.mocked(UserService.uploadImage).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Uploaded" },
          data: mockUploadResponse,
        },
      });

      const file = new File(["dummy"], "avatar.png", { type: "image/png" });
      const result = await UserController.uploadImage(file);
      expect(result).toEqual(mockUploadResponse);
    });
  });
});
