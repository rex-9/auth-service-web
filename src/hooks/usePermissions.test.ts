import { describe, it, expect, vi } from "vitest";

// Mock the contexts module to avoid importing React context/Jotai dependencies
vi.mock("../contexts", () => ({
  useAuth: () => ({
    currentUser: null,
    isAuthenticated: false,
  }),
}));

// Mock react hooks since we're in node environment
vi.mock("react", () => ({
  useCallback: (fn: unknown) => fn,
  useMemo: (fn: () => unknown) => (fn as () => unknown)(),
}));

import { getAdminRoleResourceScope } from "./usePermissions";
import {
  isAdminRoleName,
  hasAdminRole,
  ADMIN_ROLE_NAMES,
} from "../modules/admin/role/constants";
import { ADMIN_RESOURCES } from "../modules/admin/constants";

// =========================================================================
// Pure authorization logic tests for the admin panel permission system.
//
// These test the core business rules that determine which admin resources
// a user can access based on their role names — the security backbone of
// the admin panel's client-side RBAC enforcement.
// =========================================================================

describe("getAdminRoleResourceScope", () => {
  it("returns an empty set for null or undefined role names", () => {
    expect(getAdminRoleResourceScope(null).size).toBe(0);
    expect(getAdminRoleResourceScope(undefined).size).toBe(0);
  });

  it("returns an empty set for a user with only the 'user' role", () => {
    const scope = getAdminRoleResourceScope(["user"]);
    expect(scope.size).toBe(0);
  });

  it("returns all resources for the 'admin' role", () => {
    const scope = getAdminRoleResourceScope(["admin"]);
    const allResources = Object.values(ADMIN_RESOURCES);
    expect(scope.size).toBe(allResources.length);
    allResources.forEach((resource) => {
      expect(scope.has(resource)).toBe(true);
    });
  });

  it("returns all resources for 'super_admin' role", () => {
    const scope = getAdminRoleResourceScope(["super_admin"]);
    const allResources = Object.values(ADMIN_RESOURCES);
    expect(scope.size).toBe(allResources.length);
    allResources.forEach((resource) => {
      expect(scope.has(resource)).toBe(true);
    });
  });

  it("maps 'notification_admin' to notifications resource", () => {
    const scope = getAdminRoleResourceScope(["notification_admin"]);
    expect(scope.has(ADMIN_RESOURCES.NOTIFICATIONS)).toBe(true);
    expect(scope.size).toBe(1);
  });

  it("maps 'product_admin' to products resource", () => {
    const scope = getAdminRoleResourceScope(["product_admin"]);
    expect(scope.has(ADMIN_RESOURCES.PRODUCTS)).toBe(true);
    expect(scope.size).toBe(1);
  });

  it("maps 'user_admin' to users resource", () => {
    const scope = getAdminRoleResourceScope(["user_admin"]);
    expect(scope.has(ADMIN_RESOURCES.USERS)).toBe(true);
    expect(scope.size).toBe(1);
  });

  it("maps 'role_admin' to roles resource", () => {
    const scope = getAdminRoleResourceScope(["role_admin"]);
    expect(scope.has(ADMIN_RESOURCES.ROLES)).toBe(true);
    expect(scope.size).toBe(1);
  });

  it("maps 'chat_admin' to both rooms and messages resources", () => {
    const scope = getAdminRoleResourceScope(["chat_admin"]);
    expect(scope.has(ADMIN_RESOURCES.ROOMS)).toBe(true);
    expect(scope.has(ADMIN_RESOURCES.MESSAGES)).toBe(true);
    expect(scope.size).toBe(2);
  });

  it("combines multiple partial admin roles into a union of scopes", () => {
    const scope = getAdminRoleResourceScope([
      "user",
      "notification_admin",
      "product_admin",
    ]);
    expect(scope.has(ADMIN_RESOURCES.NOTIFICATIONS)).toBe(true);
    expect(scope.has(ADMIN_RESOURCES.PRODUCTS)).toBe(true);
    expect(scope.size).toBe(2);
  });

  it("ignores roles without the _admin suffix", () => {
    const scope = getAdminRoleResourceScope(["editor", "viewer", "moderator"]);
    expect(scope.size).toBe(0);
  });

  it("ignores unknown _admin prefixes that don't match any resource", () => {
    const scope = getAdminRoleResourceScope(["finance_admin"]);
    expect(scope.size).toBe(0);
  });

  it("maps 'log_admin' to clients (telemetry) resource", () => {
    const scope = getAdminRoleResourceScope(["log_admin"]);
    expect(scope.has(ADMIN_RESOURCES.CLIENTS)).toBe(true);
    expect(scope.size).toBe(1);
  });

  it("strictly scopes 'chat_admin' and ignores permissions under 'user' role", () => {
    const scope = getAdminRoleResourceScope(["chat_admin", "user"]);
    expect(scope.has(ADMIN_RESOURCES.ROOMS)).toBe(true);
    expect(scope.has(ADMIN_RESOURCES.MESSAGES)).toBe(true);
    expect(scope.has(ADMIN_RESOURCES.CLIENTS)).toBe(false);
    expect(scope.has(ADMIN_RESOURCES.USERS)).toBe(false);
    expect(scope.size).toBe(2);
  });

  it("scopes 'log_admin' and 'user' to allow logs but block other resources", () => {
    const scope = getAdminRoleResourceScope(["log_admin", "user"]);
    expect(scope.has(ADMIN_RESOURCES.CLIENTS)).toBe(true);
    expect(scope.has(ADMIN_RESOURCES.ROOMS)).toBe(false);
    expect(scope.has(ADMIN_RESOURCES.PRODUCTS)).toBe(false);
    expect(scope.size).toBe(1);
  });

  it("handles an empty array without errors", () => {
    const scope = getAdminRoleResourceScope([]);
    expect(scope.size).toBe(0);
  });
});

describe("isAdminRoleName", () => {
  it("returns true for 'admin'", () => {
    expect(isAdminRoleName(ADMIN_ROLE_NAMES.ADMIN)).toBe(true);
  });

  it("returns true for roles ending with '_admin'", () => {
    expect(isAdminRoleName("notification_admin")).toBe(true);
    expect(isAdminRoleName("product_admin")).toBe(true);
    expect(isAdminRoleName("super_admin")).toBe(true);
    expect(isAdminRoleName("chat_admin")).toBe(true);
  });

  it("returns false for non-admin roles", () => {
    expect(isAdminRoleName(ADMIN_ROLE_NAMES.USER)).toBe(false);
    expect(isAdminRoleName("editor")).toBe(false);
    expect(isAdminRoleName("administrator")).toBe(false);
  });
});

describe("hasAdminRole", () => {
  it("returns true when at least one role is an admin role", () => {
    expect(hasAdminRole(["user", "notification_admin"])).toBe(true);
    expect(hasAdminRole(["admin"])).toBe(true);
  });

  it("returns false when no roles are admin roles", () => {
    expect(hasAdminRole(["user", "editor"])).toBe(false);
  });

  it("returns false for null or undefined", () => {
    expect(hasAdminRole(null)).toBe(false);
    expect(hasAdminRole(undefined)).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(hasAdminRole([])).toBe(false);
  });
});
