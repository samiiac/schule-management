import {
  createEnrollmentSchema,
  listEnrollmentSchema,
  updateEnrollmentSchema,
} from "./schema.js";
import { idParamsSchema } from "../department/schema.js";
import { enrollmentService } from "./service.js";
import { badRequest } from "../../utils/appError.js";

export const enrollmentController = {
  create: async (req, res) => {
    const body = createEnrollmentSchema.parse(req.body);
    const actor = req.user;

    const studentId = actor.role === "STUDENT" ? actor.id : body.studentId;

    if (!studentId) throw badRequest("studentId is required");

    const result = await enrollmentService.create(studentId, body.courseId);
    return res.status(201).json({ success: true, result });
  },

  listForAdmin: async (req, res) => {
    const input = listEnrollmentSchema.parse(req.query);
    const result = await enrollmentService.listForAdmin(input);
    return res.status(200).json({ success: true, result });
  },

  listForIns: async (req, res) => {
    const { courseId } = idParamsSchema.parse(req.params);
    const input = listEnrollmentSchema.parse(req.query);
    const result = await enrollmentService.listForIns(
      input,
      courseId,
      req.user,
    );
    return res.status(200).json({ success: true, result });
  },

  listForStudent: async (req, res) => {
    const input = listEnrollmentSchema.parse(req.query);
    const studentId = req.user.id;

    if (!studentId) throw badRequest("studentId is required");

    const result = await enrollmentService.listForStudent(studentId, input);
    return res.status(200).json({ success: true, result });
  },

  update: async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const body = updateEnrollmentSchema.parse(req.body);
    const result = await enrollmentService.update(id, {
      user: req.user,
      grade: body.grade,
    });
    return res.status(200).json({ success: true, result });
  },

  delete: async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    await enrollmentService.delete(id, req.user);
    return res
      .status(200)
      .json({ success: true, result: "Successfully dropped." });
  },
};
