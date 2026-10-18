import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { createAccessToken } from "../src/utils/token";

vi.mock("../src/modules/course/service", () => ({
  courseService: {
    create: vi.fn().mockResolvedValue({ id: "c1", name: "DS" }),
    list: vi.fn().mockResolvedValue({ data: [], meta: {} }),
    listDetails: vi.fn().mockResolvedValue({ id: "c1", name: "DS" }),
    update: vi.fn().mockResolvedValue({ id: "c1", name: "DS" }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}));

const admin = createAccessToken({
  id: "a1", role: "ADMIN", passwordChangeRequired: false,
}).token;

const student = createAccessToken({
  id: "s1", role: "STUDENT", passwordChangeRequired: false,
}).token;

const instructor = createAccessToken({
  id: "i1", role: "INSTRUCTOR", passwordChangeRequired: false,
}).token;

const UUID = "11111111-1111-4111-8111-111111111111";

const courseBody = {
  name: "Data Structures",
  totalSeats: 30,
  creditHours: 3,
  departmentId: "22222222-2222-4222-8222-222222222222",
  instructorId:  "33333333-3333-4333-8333-333333333333",
};

describe("Courses — HTTP", () => {
  describe("POST /api/courses", () => {
    it("returns 401 with no token", async () => {
      const res = await request(app)
        .post("/api/courses")
        .send(courseBody);
      expect(res.status).toBe(401);
    });

    it("returns 403 for student", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${student}`)
        .send(courseBody);
      expect(res.status).toBe(403);
    });

    it("returns 201 for admin", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${admin}`)
        .send(courseBody);
      console.log(res.error)
      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/courses", () => {
    it("returns 200 for a student", async () => {
      const res = await request(app)
        .get("/api/courses")
        .set("Authorization", `Bearer ${student}`);
        console.log(res)
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/courses/:id", () => {
    it("returns 200 for a student", async () => {
      const res = await request(app)
        .get(`/api/courses/${UUID}`)
        .set("Authorization", `Bearer ${student}`);
        console.log(res.error)
      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /api/courses/:id", () => {
    it("returns 403 for student", async () => {
      const res = await request(app)
        .patch(`/api/courses/${UUID}`)
        .set("Authorization", `Bearer ${student}`)
        .send({ name: "New" });
      expect(res.status).toBe(403);
    });

    it("returns 200 for admin", async () => {
      const res = await request(app)
        .patch(`/api/courses/${UUID}`)
        .set("Authorization", `Bearer ${admin}`)
        .send({ name: "New" });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/courses/:id", () => {
    it("returns 403 for instructor (instructors cannot delete courses)", async () => {
      const res = await request(app)
        .delete(`/api/courses/${UUID}`)
        .set("Authorization", `Bearer ${instructor}`);
      expect(res.status).toBe(403);
    });

    it("returns 200 for admin", async () => {
      const res = await request(app)
        .delete(`/api/courses/${UUID}`)
        .set("Authorization", `Bearer ${admin}`);
      expect(res.status).toBe(200);
    });
  });
});