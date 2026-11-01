import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { createAccessToken } from "../src/utils/token";

vi.mock("../src/modules/course/service", () => ({
  courseService: {
    list: vi.fn().mockResolvedValue({ data: [], meta: {} }),
  },
}));

vi.mock("../src/modules/auth/service", () => ({
  authService: {
    changePassword: vi.fn().mockResolvedValue(undefined),
    getUser: vi.fn().mockResolvedValue({ id: "u1", role: "STUDENT" }),
  },
}));

const tokenNeedsChange = createAccessToken({
  id: "u1", role: "STUDENT", passwordChangeRequired: true,
}).token;

const tokenOk = createAccessToken({
  id: "u1", role: "STUDENT", passwordChangeRequired: false,
}).token;

describe("password change required", () => {
  it("blocks protected routes with 403 PASSWORD_CHANGE_REQUIRED", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${tokenNeedsChange}`);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe("PASSWORD_CHANGE_REQUIRED");
  });

  it("allows protected routes when the flag is false", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${tokenOk}`);

    expect(res.status).toBe(200);
  });

  it("allows /auth/change-password even when the flag is true", async () => {
    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${tokenNeedsChange}`)
      .send({ currentPassword: "old12345", newPassword: "new12345" });

    expect(res.status).toBe(200);
  });
});