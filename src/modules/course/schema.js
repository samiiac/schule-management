import {z} from 'zod'
import { paginationSchema } from '../../utils/pagination';

const courseBaseSchema = z.object({
  name: z.string({
    required_error: "Course name is required",
  }).min(2, "Course name must be at least 2 characters long").max(150),
  
  totalSeats: z.number({
    required_error: "Total seats is required",
  }).int("Total seats must be a whole number").positive("Total seats must be greater than 0"),
  
  creditHours: z.number({
    required_error: "Credit hours is required",
  }).int("Credit hours must be a whole number").positive("Credit hours must be greater than 0"),
  
  departmentId: z.uuid({
    required_error: "Department ID is required",
  }),
  
  instructorId: z.uuid().optional(),
  

});


export const createCourseSchema = courseBaseSchema;

export const updateCourseSchema = z.object({
  name: z.string().min(1).max(150),
  totalSeats: z.number().int().positive(),
  creditHours: z.number().int().positive(),
  instructorId: z.uuid()
}).partial().strict();

export const listSchema = paginationSchema.extend({
    includeInactive:z.enum["true","false"].default("false").transform((v)=>v == "true"),
    search:z.trim().string().min(2).max(100).optional()
})
