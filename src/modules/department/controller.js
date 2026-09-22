import { createDepartmentSchema, deptIdParamsSchema, listDepartmentSchema, updateDepartmentSchema } from "./schema"
import { departmentService } from "./service"

export const departmentController = {
    create:async(req,res)=>{
        const {name} = createDepartmentSchema.parse(req.body)
        const result = await departmentService.create(name)
        return res.status(200).json({success:true,result})
    },
    list:async(req,res)=>{
        const result =  await departmentService.list(listDepartmentSchema.parse(req.query))
        return res.status(200).json({success:true,result})
    },
    listDetails:async(req,res)=>{
        const {id}= deptIdParamsSchema.parse(req.params);
        const department = await departmentService.listDetails(id)
    },
    update:async(req,res)=>{
        const {id} = deptIdParamsSchema.parse(req.params)
        const result = await departmentService.update({id,...updateDepartmentSchema.parse(req.body)})
        return res.status(200).json({success:true,result})
    },
    delete:async(req,res)=>{
        const {id} = deptIdParamsSchema.parse(req.params)
        await departmentService.delete(id)
        return res.status(200).json({success:true,result:"Successfully deleted."})
        
    }
}