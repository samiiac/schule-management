import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { createAccessToken } from "../src/utils/token";


vi.mock("../src/modules/department/service", () => ({
  departmentService: {
    create: vi.fn().mockResolvedValue({ id: "d1", name: "CS" }),
    list: vi.fn().mockResolvedValue({ data: [], meta: {} }),
    update: vi.fn().mockResolvedValue({ id: "d1", name: "Updated" }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}));

const admin = createAccessToken({
  id: "a1", role: "ADMIN", passwordChangeRequired: false,
}).token;

const student = createAccessToken({
  id: "s1", role: "STUDENT", passwordChangeRequired: false,
}).token;

// safe id — if schema uses z.string().uuid(), a fake "d1" would 400
const UUID = "11111111-1111-4411-8111-111111111111";

describe("Departments — HTTP", () => {
  describe("POST /api/departments", () => {
    it("returns 401 with no token", async () => {
      const res = await request(app)
        .post("/api/departments")
        .send({ name: "CS" });
     
      expect(res.status).toBe(401);
    });

    it("returns 403 for student", async () => {
      const res = await request(app)
        .post("/api/departments")
        .set("Authorization", `Bearer ${student}`)
        .send({ name: "CS" });
      expect(res.status).toBe(403);
    });

    it("returns 201 for admin", async () => {
      const res = await request(app)
        .post("/api/departments")
        .set("Authorization", `Bearer ${admin}`)
        .send({ name: "CS" });
        console.log(res.error)
      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/departments", () => {
    it("returns 200 for a student", async () => {
      const res = await request(app)
        .get("/api/departments")
        .set("Authorization", `Bearer ${student}`);
      expect(res.status).toBe(200);
       console.log(res.error)
    });
   
  });

  describe("PATCH /api/departments/:id", () => {
    it("returns 403 for student", async () => {
      const res = await request(app)
        .patch(`/api/departments/${UUID}`)
        .set("Authorization", `Bearer ${student}`)
        .send({ name: "Updated" });
      expect(res.status).toBe(403);
    });

    it("returns 200 for admin", async () => {
      const res = await request(app)
        .patch(`/api/departments/${UUID}`)
        .set("Authorization", `Bearer ${admin}`)
        .send({ name: "Updated" });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/departments/:id", () => {
    it("returns 200 for admin", async () => {
      const res = await request(app)
        .delete(`/api/departments/${UUID}`)
        .set("Authorization", `Bearer ${admin}`);
      expect(res.status).toBe(200);
    });
  });
});