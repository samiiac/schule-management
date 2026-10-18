import {z} from 'zod'
import { paginationSchema } from '../../utils/pagination';

export const createCourseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters long").max(150),
  
  totalSeats: z.number().int("Total seats must be a whole number").positive("Total seats must be greater than 0"),
  
  creditHours: z.number().int("Credit hours must be a whole number").positive("Credit hours must be greater than 0"),
  
  departmentId: z.uuid(),
  
  instructorId: z.uuid().optional(),
  

});




export const updateCourseSchema = z.object({
  name: z.string().min(1).max(150),
  totalSeats: z.number().int().positive(),
  creditHours: z.number().int().positive(),
  instructorId: z.uuid()
}).partial().strict();

export const listSchema = paginationSchema.extend({
    includeInactive:z.enum(["true","false"]).default("false").transform((v)=>v == "true"),
    search:z.string().trim().min(2).max(100).optional()
})
