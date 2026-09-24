import Router from 'express'
import { departmentController } from './controller.js'

export const departmentRouter = Router()

deptRouter.get("/",departmentController.list);//all role? or 
deptRouter.get("/:id",departmentController.listDetails);//all role?
deptRouter.post("/",departmentController.create); //permissiom :admin
deptRouter.delete("/:id",departmentController.delete);//admin
deptRouter.patch("/:id",departmentController.update);//admin