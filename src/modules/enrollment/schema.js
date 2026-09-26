import { paginationSchema } from "../../utils/pagination";


export const listEnrollmentSchema = paginationSchema.extend({
courseId:z.uuid().optional(),
studentId:z.uuid.optional(),
grade:z.uuid().optional(),
departmentId:z.uuid().optional()
})