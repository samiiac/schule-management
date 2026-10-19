import {z} from 'zod'

export const createDepartmentSchema = z.object({
    name:z.string().min(1)
})

export const idParamsSchema = z.object({
    id:z.uuid()
})

export const updateDepartmentSchema = z.object({
    name:z.string().min(1)
})







