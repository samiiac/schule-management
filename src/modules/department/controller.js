import { createDepartmentSchema, deptIdParamsSchema, listDepartmentSchema } from "./schema"

export const departmentController = {
    create:async(req,res)=>{
        const {name} = createDepartmentSchema.parse(req.body)
        await departmentService.create(name)
        return res.status(200).json({success:true,department})
    },
    list:async(req,res)=>{
        const result =  await departmentService.list(listDepartmentSchema.parse(req.query))
        return res.status(200).json({success:true,result})
    }
}