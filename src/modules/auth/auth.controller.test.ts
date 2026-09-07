import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { AUTH_ERRORS } from "./constants";
import { IUser } from "../../models";

vi.mock("./auth.service", () => ({
  default: {
    signInWithToken: vi.fn(),
    signInWithEmailOrUsername: vi.fn(),
    signInWithGoogle: vi.fn(),
    completeGoogleSignIn: vi.fn(),
    signUpWithEmail: vi.fn(),
    sendConfirmationEmail: vi.fn(),
    confirmEmailWithCode: vi.fn(),
    sendForgotPasswordMail: vi.fn(),
    resetPassword: vi.fn(),
    signOut: vi.fn(),
  },
}));

const mockUser: IUser = {
  id: "u-1",
  email: "test@example.com",
  username: "testuser",
  name: "Test User",
} as any;

describe("AuthController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signInWithToken", () => {
    it("returns token and user on success", async () => {
      vi.mocked(AuthService.signInWithToken).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { token: "tok-123", user: mockUser },
        },
      });

      const result = await AuthController.signInWithToken("tok-123");
      expect(result).toEqual({
        success: true,
        token: "tok-123",
        user: mockUser,
      });
    });

    it("returns error on failure", async () => {
      vi.mocked(AuthService.signInWithToken).mockResolvedValue({
        data: {
          status: { code: 401, success: false, message: "Invalid", error: "Invalid token" },
          data: null as any,
        },
      });

      const result = await AuthController.signInWithToken("bad-token");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid token");
    });
  });

  describe("signInWithEmailOrUsername", () => {
    it("returns user and token on successful signin", async () => {
      vi.mocked(AuthService.signInWithEmailOrUsername).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Signed in" },
          data: { token: "jwt-token", user: mockUser },
        },
      });

      const result = await AuthController.signInWithEmailOrUsername("test@example.com", "pass123");
      expect(result).toEqual({
        success: true,
        token: "jwt-token",
        user: mockUser,
        message: "Signed in",
      });
    });

    it("handles OTP sent for unconfirmed user", async () => {
      vi.mocked(AuthService.signInWithEmailOrUsername).mockResolvedValue({
        data: {
          status: { code: 200, success: false, message: "Verification code sent" },
          data: { otp_sent: true },
        },
      });

      const result = await AuthController.signInWithEmailOrUsername("unconfirmed@example.com", "pass123");
      expect(result.success).toBe(false);
      expect(result.otpSent).toBe(true);
    });

    it("returns attempt limiter info on invalid password", async () => {
      vi.mocked(AuthService.signInWithEmailOrUsername).mockResolvedValue({
        data: {
          status: { code: 401, success: false, message: "Invalid credentials", error: "Wrong password" },
          data: { remaining_attempts: 2, cooldown_remaining: 0 },
        },
      });

      const result = await AuthController.signInWithEmailOrUsername("test@example.com", "wrong");
      expect(result.success).toBe(false);
      expect(result.remainingAttempts).toBe(2);
    });
  });

  describe("signInWithGoogle", () => {
    it("handles existing user with immediate token", async () => {
      vi.mocked(AuthService.signInWithGoogle).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user: mockUser, token: "google-jwt", password_required: false },
        },
      });

      const result = await AuthController.signInWithGoogle("g-token");
      expect(result.success).toBe(true);
      expect(result.passwordRequired).toBe(false);
      expect(result.token).toBe("google-jwt");
    });

    it("handles new user requiring password creation with challenge token", async () => {
      vi.mocked(AuthService.signInWithGoogle).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Passcode required" },
          data: { user: mockUser, password_required: true, challenge_token: "chal-123" },
        },
      });

      const result = await AuthController.signInWithGoogle("g-token");
      expect(result.success).toBe(true);
      expect(result.passwordRequired).toBe(true);
      expect(result.challengeToken).toBe("chal-123");
    });
  });

  describe("completeGoogleSignIn", () => {
    it("completes registration with passcode and challenge token", async () => {
      vi.mocked(AuthService.completeGoogleSignIn).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Complete" },
          data: { user: mockUser, token: "complete-jwt" },
        },
      });

      const result = await AuthController.completeGoogleSignIn("123456", "chal-123");
      expect(result.success).toBe(true);
      expect(result.token).toBe("complete-jwt");
    });

    it("handles failure when completing Google sign-in with error response", async () => {
      vi.mocked(AuthService.completeGoogleSignIn).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Challenge expired or invalid", error: "Invalid challenge token" },
          data: null as any,
        },
      });

      const result = await AuthController.completeGoogleSignIn("123456", "expired-chal");
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Invalid challenge token");
      expect(result.statusCode).toBe(422);
    });

    it("handles network rejection gracefully", async () => {
      vi.mocked(AuthService.completeGoogleSignIn).mockRejectedValue(
        new Error("Network connection dropped"),
      );

      await expect(
        AuthController.completeGoogleSignIn("123456", "bad-chal"),
      ).rejects.toThrow("Network connection dropped");
    });
  });

  describe("signUpWithEmail", () => {
    it("calls AuthService.signUpWithEmail with full profile payload", async () => {
      vi.mocked(AuthService.signUpWithEmail).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Account created" },
          data: null as any,
        },
      });

      const result = await AuthController.signUpWithEmail(
        "testuser",
        "Test User",
        "test@example.com",
        "123456",
        "123456",
      );

      expect(AuthService.signUpWithEmail).toHaveBeenCalledWith(
        "testuser",
        "Test User",
        "test@example.com",
        "123456",
        "123456",
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe("Account created");
    });
  });

  describe("sendConfirmationEmail", () => {
    it("calls AuthService.sendConfirmationEmail", async () => {
      vi.mocked(AuthService.sendConfirmationEmail).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Code resent" },
          data: null as any,
        },
      });

      const result = await AuthController.sendConfirmationEmail("test@example.com");
      expect(result.success).toBe(true);
    });
  });

  describe("confirmEmailWithCode", () => {
    it("calls AuthService.confirmEmailWithCode and returns token/user", async () => {
      vi.mocked(AuthService.confirmEmailWithCode).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Confirmed" },
          data: { token: "auth-token", user: mockUser },
        },
      });

      const result = await AuthController.confirmEmailWithCode("test@example.com", "123456");
      expect(result.success).toBe(true);
      expect(result.token).toBe("auth-token");
    });
  });

  describe("sendForgotPasswordMail and resetPassword", () => {
    it("handles forgot password flow", async () => {
      vi.mocked(AuthService.sendForgotPasswordMail).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Reset email sent" },
          data: null as any,
        },
      });

      const result = await AuthController.sendForgotPasswordMail("test@example.com");
      expect(result.success).toBe(true);
    });

    it("handles reset password flow", async () => {
      vi.mocked(AuthService.resetPassword).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Password reset" },
          data: null as any,
        },
      });

      const result = await AuthController.resetPassword("token-123", "newpass", "newpass");
      expect(result.success).toBe(true);
    });
  });

  describe("signOut", () => {
    it("returns true on successful sign out", async () => {
      vi.mocked(AuthService.signOut).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Signed out" },
          data: null as any,
        },
      });

      const result = await AuthController.signOut();
      expect(result).toBe(true);
    });

    it("returns true if session was already expired", async () => {
      vi.mocked(AuthService.signOut).mockResolvedValue({
        data: {
          status: { code: 401, success: false, message: "Unauthorized", error: AUTH_ERRORS.SIGNATURE_EXPIRED },
          data: null as any,
        },
      });

      const result = await AuthController.signOut();
      expect(result).toBe(true);
    });
  });
});
