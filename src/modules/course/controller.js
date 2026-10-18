import { createCourseSchema, listSchema, updateCourseSchema } from "./schema.js";
import { idParamsSchema } from "../department/schema.js";
import { courseService } from "./service.js";

export const courseController = {
    create: async (req, res) => {
        const input = createCourseSchema.parse(req.body);
        const result = await courseService.create(input);
        return res.status(201).json({ success: true, result });
    },
    list: async (req, res) => {
        const input = listSchema.parse(req.query);
        const result = await courseService.list(input);
        return res.status(200).json({ success: true, result });
    },
    listDetails: async (req, res) => {
        const { id } = idParamsSchema.parse(req.params);
        const course = await courseService.listDetails(id);
        return res.status(200).json({ success: true, result: course });
    },
    update: async (req, res) => {
        const { id } = idParamsSchema.parse(req.params);
        const updateData = updateCourseSchema.parse(req.body);
        const result = await courseService.update(id, updateData);
        return res.status(200).json({ success: true, result });
    },
    delete: async (req, res) => {
        const { id } = idParamsSchema.parse(req.params);
        await courseService.delete(id);
        return res.status(200).json({ success: true, result: "Successfully deleted." });
    }
};