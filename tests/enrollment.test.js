import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { createAccessToken,verifyAccessToken } from "../src/utils/token";

describe("HTTP — unauthenticated", () => {
  it("returns 401 for a protected route with no token", async () => {
    const res = await request(app).get("/api/enrollments/my");
    expect(res.status).toBe(401);
  });
});

vi.mock("../src/modules/enrollment/service", () => ({
  enrollmentService: {
    listForStudent: vi.fn().mockResolvedValue({ data: [], meta: {} }),
  },
}));

const adminToken = createAccessToken({
  id: "a1",
  role: "ADMIN",
  passwordChangeRequired: false,
});
const studentToken = createAccessToken({
  id: "s1",
  role: "STUDENT",
  passwordChangeRequired: false,
});

describe("GET /api/enrollments/my — RBAC", () => {
 
  it("returns 403 for admin (admin has no :own permission)", async () => {
    const res = await request(app)
      .get("/api/enrollments/my")
      .set("Authorization", `Bearer ${adminToken.token}`);
     
    expect(res.status).toBe(403);
  });

  it("returns 200 for student", async () => {
    const res = await request(app)
      .get("/api/enrollments/my")
      .set("Authorization", `Bearer ${studentToken.token}`);
    
    expect(res.status).toBe(200);
  });
});
