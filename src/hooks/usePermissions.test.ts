import { describe, expect, it, vi } from "vitest";

vi.mock("../contexts", () => ({
  useAuth: vi.fn(),
}));
import { getAdminPermissions } from "./usePermissions";
import type { IUserIam } from "../models";

const iam = (overrides: Partial<IUserIam> = {}): IUserIam => ({
  is_admin: true,
  is_super_admin: false,
  roles: [],
  admin_roles: [],
  non_admin_roles: [],
  permissions: [],
  admin_permissions: [],
  non_admin_permissions: [],
  ...overrides,
});

describe("getAdminPermissions", () => {
  it("uses only permissions granted through admin roles", () => {
    const permissions = getAdminPermissions(
      iam({
        admin_permissions: [
          {
            id: "permission-1",
            type: "permission",
            attributes: {
              id: "permission-1",
              name: "read_feedbacks",
              action: "read",
              resource: "feedbacks",
            },
          },
        ],
        non_admin_permissions: [
          {
            id: "permission-2",
            type: "permission",
            attributes: {
              id: "permission-2",
              name: "delete_users",
              action: "delete",
              resource: "users",
            },
          },
        ],
      }),
    );

    expect(permissions).toEqual([
      { action: "read", resource: "feedbacks" },
    ]);
  });

  it("returns no admin permissions for a non-admin or missing IAM", () => {
    expect(getAdminPermissions(iam({ is_admin: false }))).toEqual([]);
    expect(getAdminPermissions(undefined)).toEqual([]);
  });
});
