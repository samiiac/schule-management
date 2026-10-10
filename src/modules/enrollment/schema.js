import { paginationSchema } from "../../utils/pagination";

export const listEnrollmentAdminSchema = paginationSchema.extend({
  courseId: z.uuid().optional(),
  studentId: z.uuid.optional(),
  grade: z.uuid().optional(),
});

export const listEnrollmentSchema = paginationSchema.extend({
  grade: z.uuid().optional(),
});
