import z from 'zod'
import { paginationSchema } from '../../utils/pagination'


export const createDepartmentSchema = z.object({
    name:z.string.min(1)
})

export const deptIdParamsSchema = z.object({
    id:z.uuid()
})

export const updateDepartmentSchema = z.object({
    name:z.string.min(1)
})

export const listDepartmentSchema = paginationSchema.extend({
    search:z.string().min(2).optional()
})





