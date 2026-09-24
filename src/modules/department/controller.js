import {
  createDepartmentSchema,
  idParamsSchema,
  updateDepartmentSchema,
} from "./schema.js";
import { listSchema } from "../course/schema.js";
import { departmentService } from "./service.js";

export const departmentController = {
  create: async (req, res) => {
    const { name } = createDepartmentSchema.parse(req.body);
    const result = await departmentService.create(name);
    return res.status(201).json({ success: true, result });
  },
  list: async (req, res) => {
    const result = await departmentService.list(
      listSchema.parse(req.query),
    );
    return res.status(200).json({ success: true, result });
  },
  listDetails: async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const department = await departmentService.listDetails(id);
    return res.status(200).json({ success: true, result: department });
  },
  update: async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const result = await departmentService.update({
      id,
      ...updateDepartmentSchema.parse(req.body),
    });
    return res.status(200).json({ success: true, result });
  },
  delete: async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    await departmentService.delete(id);
    return res
      .status(200)
      .json({ success: true, result: "Successfully deleted." });
  },
};
