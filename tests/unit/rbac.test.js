import { describe, it, expect, toBe } from "vitest";
import { hasPermissions } from "../../src/modules/rbac/service";

describe("hasPermissions", () => {
  it("returns true for role having specific permission", () => {
    expect(hasPermissions("ADMIN", "course:create:any")).toBe(true);
  });

  it("returns false when the role does not have it", () => {
    expect(hasPermissions("STUDENT", "enrollment:read:any")).toBe(false);
  });

  it("returns false when the role does not have it", () => {
    expect(hasPermissions("ADMIN", "enrollment:read:own")).toBe(false);
  });

  it("returns true when the role  has it", () => {
    expect(hasPermissions("STUDENT", "enrollment:read:own")).toBe(true);
  });
});
