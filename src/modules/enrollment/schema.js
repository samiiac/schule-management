import { paginationSchema } from "../../utils/pagination.js";
import {z} from 'zod';

export const listEnrollmentAdminSchema = paginationSchema.extend({
  courseId: z.uuid().optional(),
  studentId: z.uuid().optional(),
  grade: z.uuid().optional(),
});

export const createEnrollmentSchema = z.object({
  courseId: z.uuid(),
  studentId: z.uuid()
})

export const updateEnrollmentSchema = createEnrollmentSchema.partial().strict()

export const listEnrollmentSchema = paginationSchema.extend({
  grade: z.uuid().optional(),
});
