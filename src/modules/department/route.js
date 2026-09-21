import Router from 'express'
import { departmentController } from './controller'

export const deptRouter = Router()

deptRouter.get("/",departmentController.list);
deptRouter.post("/",departmentController.create);
